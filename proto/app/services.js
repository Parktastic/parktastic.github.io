define([
    'app'
], function (app) {
    'use strict';

    //factory to resolve userId key from users object
    app.factory('UserId', function(){
        return function(email){
            return email.replace("." , ",").replace("." , ",").replace("." , ",");
        };
    });

    //factory to hold our configs
    app.factory('configs', [
        function(){
            return {
                firebaseUrl : "https://connect-health-proto.firebaseio.com"
            };
        }
    ]);

    //factory to resolve user data in the app
    app.factory('Users', [
        "configs", "$rootScope", "UserId", "UserRecord",
        function(configs, $rootScope, UserId, UserRecord){

            //local firebase reference and data holder
            var ref = new Firebase(configs.firebaseUrl).child("users"),
                data = null;

            return {
                ref     :   ref,
                data    :   data,
                setCurrentUser : function(email, userId, callback){

                    //get user record from Users
                    ref.orderByChild('info/email')
                       .equalTo(email)
                        .once('value', function(snap){

                            var value = snap.val();

                            //set $rootScope id
                            $rootScope.user = value[Object.keys(value)[0]].info;

                            callback(true);

                        }, function(err){

                        });
                }
            };
        }
    ]);

    app.factory('Auth', [
        "Users", "configs", "UserId",
        function(Users, configs, UserId){

            var auth = {
                signUp  : function(registrationDetails, callback){

                    console.log(UserId(registrationDetails.email));

                    //first create user in database
                    Users.ref.child(UserId(registrationDetails.email)).set({
                        "info"  :   registrationDetails,
                        "date"  :   Date.now(),
                        "active":   true
                    });

                    //add user to the database
                    var ref = new Firebase(configs.firebaseUrl);

                    ref.createUser({
                        email    : registrationDetails.email,
                        password : registrationDetails.password
                    }, function(error, userData) {
                        if (error) {
                            callback(false);
                        } else {
                            callback(userData);
                        }
                    });
                },
                login   : function(credentials, callback){

                    var ref = new Firebase(configs.firebaseUrl);
                    ref.authWithPassword(
                        {
                            email    : credentials.email,
                            password : credentials.password
                        }, function(error, authData) {
                            if (error) {
                                callback(false);
                            } else {
                                Users.setCurrentUser(credentials.email, authData , callback);
                            }
                         }, {
                            remember: "sessionOnly"
                        }
                    );
                }
            };

            return auth;
        }
    ]);

    //factory to hold our requests
    app.factory('UserRecord', [
        'configs', '$firebaseObject', 'UserId',
        function(configs, $firebaseObject, UserId){

            var baseRef = new Firebase(configs.firebaseUrl).child('users');
            return function(email) {
                return $firebaseObject(baseRef.child(UserId(email)));
            }
        }
    ]);

    //factory to process our payments
    app.factory('Payments', [
        'configs', 'Users',
        function(configs){

            var ref = new Firebase(configs.firebaseUrl).child("payments");

            return ref;

        }
    ]);

    //factory to save service request
    app.factory('ServiceRequest', [
        'configs',
        function(configs){

            var ref = new Firebase(configs.firebaseUrl).child("service-requests");

            return ref;

        }
    ]);

    //factory to save service request
    app.factory('DataRecord', [
        'configs',
        function(configs){
            return function(collection, recordId) {
                return new Firebase(configs.firebaseUrl).child(collection).child(recordId);
            }
        }
    ]);

    //factory to save appointment data
    app.factory('Appointments', [
        'configs',
        function(configs){

            var ref = new Firebase(configs.firebaseUrl).child("appointments");
            return ref;

        }
    ]);

    //factory to save appointment data
    app.factory('Messages', [
        'configs',
        function(configs){

            var ref = new Firebase(configs.firebaseUrl).child("messages");
            return ref;
        }
    ]);

    //filter for showing request type
    app.filter('types', [
        function() {
            return function(input, uppercase) {
                input = input || '';

                return (input == "call" ? "Phone Consultation" : "In-Person Appointment");
            };
        }
    ]);

    //Twilio interface
    app.factory('TwilioService', [
        "$http",
        function($http){

            var log = null;

            //initialise the twilio service here
            function init(token){
                Twilio.Device.setup(token);

                Twilio.Device.ready(function (device) {
                    log = "Ready";
                    console.log("ready");
                });

                Twilio.Device.error(function (error) {
                    log = "Error: " + error.message;
                });

                Twilio.Device.connect(function (conn) {
                    log = "Successfully established call";
                });

                Twilio.Device.disconnect(function (conn) {
                    log = "Call ended";
                });
            }

            return {
                log : log,
                start : function(){

                    //initialise connection to call server
                    $http({
                        method: 'GET',
                        url: 'http://demo.talicraft.com/connect_health/connect_voice_call.php'
                    }).then(function successCallback(response){
                        console.log(response);
                        init(response.data);
                    }, function errorCallback(error){});

                },
                call : function(number) {
                    Twilio.Device.connect( { "PhoneNumber": number } );
                },
                hangup : function hangup() {
                    Twilio.Device.disconnectAll();
                }
            }
        }
    ]);
});
