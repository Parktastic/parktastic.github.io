define([
    'app',
    'moment',
    'services'
], function (app, moment) {
    'use strict';

    //the login controller
    app.controller('LoginCtrl', [
        "$ionicPopup", "$scope", "$state", "Auth", "$rootScope", "$ionicLoading",
        function($ionicPopup, $scope, $state, Auth, $rootScope, $ionicLoading){

            $rootScope.title = "Login";

            // An alert dialog
            $scope.login = function(credentials) {

                var showConnectionProblems = true;

                setTimeout(function(){

                    if(showConnectionProblems && $rootScope.user == null )
                    {
                        //disable showing of connection problems
                        showConnectionProblems = false;

                        //stop the toast
                        $ionicLoading.hide();

                        //tell user we are experiencing connectivity user
                        $ionicPopup.alert({
                            title: 'Login',
                            template: 'Something went wrong during the login. Please try again.'
                        });
                    }
                }, 10000);

                $ionicLoading.show({
                    template: '<ion-spinner icon="android" class="spinner-assertive"></ion-spinner><p>Authenticating...</p>'
                });

                //signup a user given the details we have
                Auth.login(credentials, function(result){

                    console.log(result);

                    //stop the toast
                    $ionicLoading.hide();

                    //tell user of successful login
                    if(result != false)
                    {
                        $scope.credentials = {};
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login',
                            template: 'Login successful! Welcome ' + $rootScope.user.names
                        });
                        alertPopup.then(function(res) {

                            if($rootScope.user.userType == "doctor")
                                $state.go("providerDashboard");
                            else
                                $state.go("consumerDashboard");
                        });
                    }else
                    {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login',
                            template: 'Invalid username or password. Please try again.'
                        });
                        alertPopup.then(function(res) {

                        });
                    }
                });

            };

            //login with facebook
//            $scope.facebookLogin = function(){
//
//                $ionicLoading.show({
//                    template: '<ion-spinner icon="android" class="spinner-assertive"></ion-spinner><p>Connecting to Facebook...</p>'
//                });
//
//                // From now on you can use the Facebook service just as Facebook api says
//                Facebook.login(function(response) {
//                    FacebookConnect(response.authResponse.userID, response.authResponse.accessToken)
//                        .then(function(response){
//                            //stop the toast
//                            $ionicLoading.hide();
//
//                            var userRecord = DataRecord("users", UserId(response.data.email));
//
//                            setTimeout(function(){
//                                //lookup user. if not found, then means they have to sign up first
//                                if(userRecord.info != undefined)
//                                {
//                                    $rootScope.user = userRecord.info;
//
//                                    var alertPopup = $ionicPopup.alert({
//                                        title: 'Login',
//                                        template: 'Login successful! Welcome ' + userRecord.info.names
//                                    });
//
//                                    alertPopup.then(function(res) {
//                                        if(userRecord.info.name == "doctor")
//                                            $state.go("providerDashboard");
//                                        else
//                                            $state.go("consumerDashboard");
//                                    });
//
//
//                                }else{
//                                    var alertPopup = $ionicPopup.alert({
//                                        title: 'Login',
//                                        template: 'Your facebook account is not connected to Connect Health. Create an account and connect with facebook to allow Facebook Sign In.'
//                                    });
//                                    alertPopup.then(function(res) {
//
//                                    });
//                                }
//                            }, 1000);
//
//                        },function(error){
//
//                        });
//                });
//            };
        }
    ]);

    //the signup controller
    app.controller('signupCtrl', [
        "$ionicPopup", "$scope", "Auth", "$state", "$ionicLoading", "Facebook", "FacebookConnect", "$stateParams","$rootScope",
        function($ionicPopup, $scope, Auth, $state, $ionicLoading, Facebook, FacebookConnect, $stateParams,$rootScope) {
            $scope.facebookMode = false;

            $scope.registration = {
                userType : $stateParams["u"]
            };

            // An alert dialog
            $scope.signUp = function(registration, confirmedPassword) {

                if($scope.registration.password != confirmedPassword)
                {
                    //tell user we are experiencing connectivity user
                    $ionicPopup.alert({
                        title: 'Login',
                        template: 'The passwords you entered do not match!'
                    });

                    return;
                }

                if($scope.registration.password == "")
                {
                    //tell user we are experiencing connectivity user
                    $ionicPopup.alert({
                        title: 'Login',
                        template: 'No password specified!'
                    });

                    return;
                }

                if($scope.registration.email == "")
                {
                    //tell user we are experiencing connectivity user
                    $ionicPopup.alert({
                        title: 'Login',
                        template: 'You must supply an email in-order to sign up to the system'
                    });

                    return;
                }

                var slowInternetFlagged = false;

                setTimeout(function(){

                    if($rootScope.user == null)
                    {
                        slowInternetFlagged = true;

                        //stop the toast
                        $ionicLoading.hide();

                        //tell user we are experiencing connectivity user
                        $ionicPopup.alert({
                            title: 'Login',
                            template: 'Something went wrong during the registration. Please try again.'
                        });
                    }
                }, 10000);

                $ionicLoading.show({
                    template: '<ion-spinner icon="android" class="spinner-assertive"></ion-spinner><p>Please wait while we register you in the system..</p>'
                });

                //signup a user given the details we have
                Auth.signUp(registration, function(result){

                    //stop the toast
                    $ionicLoading.hide();

                    //if slow internet, discard login call
                    if(slowInternetFlagged)
                    {
                        slowInternetFlagged = false;
                        return;
                    }

                    //tell user of successful login
                    if(result != null)
                    {
                        $scope.registration = { userType : 'doctor' };
                        var alertPopup = $ionicPopup.alert({
                            title: 'Registration',
                            template: 'Registration complete!. Proceed to login.'
                        });
                        alertPopup.then(function(res) {
                            $state.go('login');
                        });
                    }else
                    {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Registration',
                            template: 'Something went wrong with your registration. Please try again'
                        });
                        alertPopup.then(function(res) {

                        });
                    }
                });
            };

//            //login with facebook
//            $scope.facebookLogin = function(){
//
//                $ionicLoading.show({
//                    template: '<ion-spinner icon="android" class="spinner-assertive"></ion-spinner><p>Connecting to Facebook..</p>'
//                });
//
//                // From now on you can use the Facebook service just as Facebook api says
//                Facebook.login(function(response) {
//
//                    //hide loading
//                    $ionicLoading.hide();
//
//                    FacebookConnect(response.authResponse.userID, response.authResponse.accessToken)
//                        .then(function(response){
//
//                            console.log(response);
//
//                            //update UI
//                            $scope.registration.names = response.data.name;
//                            $scope.registration.email = response.data.email;
//                            $scope.registration.password = response.data.id;
//                            $scope.facebookMode = true;
//
//                        },function(error){
//
//                        });
//                });
//            };
        }
    ]);

    //provider registration controller
    app.controller('providerRegistrationCtrl', function($scope) {

    });

    //consumer registration controller
    app.controller('consumerRegistrationCtrl', [
        "$scope", "$ionicPopup", "$state",
        function($scope, $ionicPopup, $state) {

            $scope.logout = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Log Out',
                    template: 'Are you sure you want to log out?'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        $state.go('login');
                    } else {
                        console.log('You are not sure');
                    }
                });
            };
        }]);

    //cleint view controller
    app.controller('clientViewCtrl', function($scope) {

    });

    //provider view controller
    app.controller('providerViewCtrl', [
        "$scope", "$ionicPopup", "$state", "$rootScope", "$stateParams",
        function($scope, $ionicPopup, $state, $rootScope, $stateParams) {

            console.log($stateParams);

            //extend the scope
            angular.extend($scope, {
                doctor  :   $stateParams.doctor
            });
        }
    ]);

    //payment method controller
    app.controller('paymentMethodCtrl', [
        "$scope", "$ionicPopup", "$state", "$rootScope", "Payments", "ServiceRequest", "$stateParams",
        function($scope, $ionicPopup, $state, $rootScope, Payments, ServiceRequest, $stateParams) {

            //extend the scope
            angular.extend($scope, {
                fee : $stateParams.doctor.info.fee,
                completeRequest : function(paymentDetails){

                    //local variables
                    var serviceDetails = $stateParams.request,
                        doctor = $stateParams.doctor;

                    //build service request object
                    var serviceData = {
                        patient : $rootScope.user,
                        doctor  : doctor.info,
                        served  : false,
                        symptoms: serviceDetails.symptoms,
                        type    : serviceDetails.type,
                        date    : Date.now()
                    };

                    //build payment recording object
                    var paymentData = {
                        patient : $rootScope.user,
                        doctor  : doctor.info,
                        date    : Date.now(),
                        details : paymentDetails
                    };

                    //save the service request
                    ServiceRequest.push(serviceData);

                    //save the initial payment
                    Payments.push(paymentData);

                    console.log("complete payment");

                    //popup to show save was done
                    var alertPopup = $ionicPopup.alert({
                        title: 'Dr Park',
                        template: "Thanks! I'v received your request and will be calling you shortly."
                    });
                    alertPopup.then(function(res) {
                        $state.go("consumerDashboard");
                    });
                }
            });
        }
    ]);

    //scheduling appointment controller
    app.controller('scheduleAppointmentCtrl', [
        "$scope", "ServiceRequest", "$state", "$rootScope", "$ionicPopup",
        function($scope, ServiceRequest, $state, $rootScope, $ionicPopup) {

            //extend the scope
            angular.extend($scope, {
                schedule : function(appointment){

                    //local vars
                    var serviceDetails = $rootScope.serviceDetails;

                    //build service request object
                    var serviceData = {
                        patient : $rootScope.user.email,
                        doctor  : $rootScope.viewDoctor.info,
                        served  : false,
                        symptoms: serviceDetails.symptoms,
                        type    : serviceDetails.type,
                        date    : Date.now(),
                        details : appointment
                    };

                    //save the service request
                    ServiceRequest.push(serviceData);

                    //popup to show save was done
                    var alertPopup = $ionicPopup.alert({
                        title: 'Dr Park',
                        template: "Thanks! I'v received your appointment and will get back to you via a message."
                    });
                    alertPopup.then(function(res) {
                        $state.go("consumerDashboard");
                    });
                }
            });
        }
    ]);

    //consumer dashboard controller
    app.controller('consumerDashboardCtrl', [
        "$scope", "$ionicPopup", "$state", "ServiceRequest","$rootScope", "Messages",
        function($scope, $ionicPopup, $state, ServiceRequest, $rootScope, Messages) {

            ServiceRequest
                .orderByChild("patient/email")
                .equalTo($rootScope.user.email)
                .on("value", function(snapshot) {
                    console.log("changed");
                    var docs = snapshot.val(),
                        requestCount = 0,
                        requestArray = [];

                    angular.forEach(docs, function(value, key){
                        if(!value.served)
                        {
                            requestCount ++;
                            requestArray.push(value);
                        }
                    });

                    $scope.requestCount = requestCount;

                   setTimeout(function(){
                        $scope.$apply();
                    }, 100);

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

            //load up messages
            Messages
                .orderByChild("to/email")
                .equalTo($rootScope.user.email)
                .on("value", function(snapshot) {

                    var msgs = snapshot.val(),
                        messageCount = 0;

                    angular.forEach(msgs, function(value, key){
                        if(!value.read)
                        {
                            value.key = key;
                            messageCount ++;
                        }
                    });

                    console.log("change noticed");

                    $scope.messageCount = angular.copy(messageCount);
                    setTimeout(function(){
                        $scope.$apply();
                    },100);

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });


            $scope.logout = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Log Out',
                    template: 'Are you sure you want to log out?'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        $rootScope.user = null;
                        $state.go('login');
                    }
                });
            };
        }
    ]);

    //provider dashboard controller
    app.controller('providerDashboardCtrl', [
        "$scope", "$rootScope", "ServiceRequest", "$ionicPopup", "$state", "Messages",
        function($scope, $rootScope, ServiceRequest, $ionicPopup, $state, Messages) {

            //load up service requests
            ServiceRequest
                .orderByChild("doctor/email")
                .equalTo($rootScope.user.email)
                .on("value", function(snapshot) {
                    var docs = snapshot.val(),
                        requestCount = 0;

                    angular.forEach(docs, function(value, key){
                        if(value.doctor.email == $rootScope.user.email && !value.served)
                        {
                            value.key = key;
                            requestCount ++;
                        }
                    });

                    $scope.requestCount = angular.copy(requestCount);

                    setTimeout(function(){
                        $scope.$apply();
                    }, 200);

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

            //load up messages
            Messages
                .orderByChild("to/email")
                .equalTo($rootScope.user.email)
                .on("value", function(snapshot) {

                    var msgs = snapshot.val(),
                        messageCount = 0;

                    angular.forEach(msgs, function(value, key){
                        if(!value.read)
                        {
                            value.key = key;
                            messageCount ++;
                        }
                    });

                    $scope.messageCount = angular.copy(messageCount);
                    setTimeout(function(){
                        $scope.$apply();
                    },100);

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });


            $scope.logout = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Log Out',
                    template: 'Are you sure you want to log out?'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        $rootScope.user = null;
                        $state.go('login');
                    }
                });
            };
        }]);

    //home screen controller
    app.controller('HomeController', ["$rootScope", "$scope",
        function($rootScope, $scope) {

        }
    ]);

    //searching controller
    app.controller('SearchController', [
        "Users", "$scope", "$rootScope", "$state",
        function(Users, $scope, $rootScope, $state) {

            //load doctors
            Users.ref
                .orderByChild("info/userType")
                .equalTo('doctor')
                .on("value", function(snapshot) {
                    var docs = snapshot.val(),
                        docsArray = [];

                    angular.forEach(docs, function(value){
                        docsArray.push(value);
                    });

                    $scope.doctors = docsArray;
                    setTimeout(function(){
                        $scope.$apply();
                    }, 100);

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
        }
    ]);

    //pending requests controller
    app.controller('PendingRequestsController', [
        "Users", "$scope", "$rootScope", "ServiceRequest",
        function(Users, $scope, $rootScope, ServiceRequest) {

            //load up service requests
            ServiceRequest
                .orderByChild("patient/email")
                .equalTo($rootScope.user.email)
                .on("value", function(snapshot) {
                    var docs = snapshot.val(),
                        requestArray = [];

                    angular.forEach(docs, function(value, key){
                        if(!value.served)
                        {
                            requestArray.push(value);
                        }
                    });

                    $rootScope.requests = angular.copy(requestArray);

                    setTimeout(function(){
                        $scope.$apply();
                    }, 100);

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

            $scope.getTimeLapse = function(date){
                return moment(date).fromNow();
            }
        }
    ]);

    //pending requests controller
    app.controller('ProviderPendingRequestsController', [
        "Users", "$scope", "$rootScope", "ServiceRequest", "$state",
        function(Users, $scope, $rootScope, ServiceRequest, $state) {

            //extent the $scope
            $scope.getTimeLapse = function(date){
                return moment(date).fromNow();
            };

            //load up service requests
            ServiceRequest
                .orderByChild("doctor/email")
                .equalTo($rootScope.user.email)
                .on("value", function(snapshot) {
                    var docs = snapshot.val(),
                        requestArray = [];

                    angular.forEach(docs, function(value, key){
                        if(value.doctor.email == $rootScope.user.email && !value.served)
                        {
                            value.key = key;
                            requestArray.push(value);
                        }
                    });

                    $scope.requests = angular.copy(requestArray);

                    setTimeout(function(){
                        $scope.$apply();
                    }, 200);

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });


        }
    ]);

    //appointment response controller
    app.controller('AppointmentResponseController', [
        function(){

        }
    ]);

    //appointment response controller
    app.controller('CallResponseController', [
        "$scope", "$ionicPopup", "$state", "Messages", "$stateParams", "EditableDataRecord",
        function($scope, $ionicPopup, $state, Messages, $stateParams, DataRecord){

            //local vars
            var callBackOptions = [];

            //calculate callback options
            function calculateCallBackOptions(){

                //add 30 min interval
                callBackOptions.push(
                    {
                        display : "30 minutes",
                        date    :  moment().add(30, 'm')
                    }
                );

                //add 1 hour interval
                callBackOptions.push(
                    {
                        display : "1 hour",
                        date    :  moment().add(1, 'h')
                    }
                );

                //add 2 hour interval
                callBackOptions.push(
                    {
                        display : "2 hours",
                        date    :  moment().add(2, 'h')
                    }
                );

                //add 3 hour interval
                callBackOptions.push(
                    {
                        display : "3 hours",
                        date    :  moment().add(3, 'h')
                    }
                );

                //add 6 hour interval
                callBackOptions.push(
                    {
                        display : "6 hours",
                        date    :  moment().add(6, 'h')
                    }
                );

                //add 12 hour interval
                callBackOptions.push(
                    {
                        display : "12 hours",
                        date    :  moment().add(12, 'h')
                    }
                );

                //add 24 hour interval
                callBackOptions.push(
                    {
                        display : "24 hours",
                        date    :  moment().add(24, 'h')
                    }
                );
            }

            //extend the $scope
            angular.extend($scope, {
                call : function(callDetails){

                    var request = $stateParams.request,
                        dbRequest = DataRecord("service-requests", request.key);

                    if(callDetails.callLater)
                    {
                        var message = {
                            from : request.doctor,
                            to   : request.patient,
                            date : Date.now(),
                            message : "Hi! Im currently busy and will call you back " + moment(callDetails.callbackTime).fromNow(),
                            read : false
                        };

                        //remove mapping key
                        delete request.key;

                        //update request as served
                        request.served = true;

                        //update the request
                        dbRequest.update(request);

                        //clear DB object
                        dbRequest = null;

                        //save the message
                        Messages.push(message);

                        //Messages.push(message);
                        var alertPopup = $ionicPopup.alert({
                            title: 'Call',
                            template: 'Patient will be notified of call to come'
                        });
                        alertPopup.then(function(res) {
                            $scope.callDetails = null;
                            $state.transitionTo("providerDashboard");
                        });
                    }else
                    {
                        $scope.phone = request.patient.phone;

                        var popup = $ionicPopup.show({
                            template: '<twilio-dialer phone="' + $stateParams["number"] + '"></twilio-dialer>',
                            title: '<h4>Call</h4>',
                            scope: $scope
                        });

                        $scope.closePopup = function(){
                            popup.close();
                        };
                    }
                },
                callbackIntervals : callBackOptions
            });

            //process callback intervals
            calculateCallBackOptions();

        }
    ]);

    //messages
    app.controller('MessagesController', [
        "$scope", "$rootScope", "Messages",
        function($scope, $rootScope, Messages){

            //keep hold of key person in messages

            //load up messages
            Messages
                .orderByChild("to/email")
                .equalTo($rootScope.user.email)
                .on("value", function(snapshot) {

                    var msgs = snapshot.val(),
                        messageArray = {};

                    angular.forEach(msgs, function(value, key){
                        if(messageArray[value.from.email] == undefined)
                            messageArray[value.from.email] = {
                                from : value.from.names,
                                recipient : value.from,
                                email: value.from.email,
                                number : value.from.phone,
                                speciality : value.from.speciality,
                                count : 0
                            };

                        if(!value.read)
                            messageArray[value.from.email].count++;
                    });

                    $scope.messages = angular.copy(messageArray);
                    setTimeout(function(){
                        $scope.$apply();
                    }, 100);

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
        }
    ]);

    //appointment response controller
    app.controller('ChatController', [
        "$scope", "$ionicPopup", "$state", "Messages", "$stateParams", "$rootScope", "EditableDataRecord",
        function($scope, $ionicPopup, $state, Messages, $stateParams, $rootScope, DataRecord){

            //load up messages
            Messages
                .on("value", function(snapshot) {

                    var msgs = snapshot.val(),
                        messageArray = [];

                    angular.forEach(msgs, function(value, key){

                        //messages included should be from doc to patient and vice versa only
                        var isOutbox = value.from.email == $rootScope.user.email && value.to.email == $stateParams.user;
                        var isInbox = value.from.email == $stateParams.user && value.to.email == $rootScope.user.email;

                        if(isInbox || isOutbox)
                        {
                            //if we are here, it means that the message has been read
                            //only do this for messages sent to me
                            if(value.from.email == $stateParams.user)
                            {
                                var updateMessage = DataRecord("messages", key);
                                value.read = true;
                                updateMessage.update(value);
                            }

                            if(value.from.userType == "doctor")
                                value.img = "img/avatar-1-128.jpg";
                            else
                                value.img = "img/patient.jpeg";

                            messageArray.push(value);
                        }
                    });

                    //load up scope
                    $scope.messages = angular.copy(messageArray);

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

            //get time lapse
            angular.extend($scope, {
                getTimeLapse : function(date){
                    return moment(date).fromNow();
                },
                names    :   $stateParams.names,
                reply    : function(){

                    $scope.data = {};

                    // An elaborate, custom popup
                    var myPopup = $ionicPopup.show({
                        template: '<input type="text" placeholder="Enter reply here.." ng-model="data.message">',
                        title: '<h4>Message</h4>',
                        scope: $scope,
                        buttons: [
                            { text: 'Cancel' },
                            {
                                text: '<b>Send</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    if (!$scope.data.message) {
                                        e.preventDefault();
                                    } else {
                                        return $scope.data.message;
                                    }
                                }
                            }
                        ]
                    });
                    myPopup.then(function(res) {
                        if(res)
                        {
                            //construct message
                            var messageData = {
                                from   : $rootScope.user,
                                to : $stateParams.recipient,
                                date : Date.now(),
                                message : res,
                                read : false
                            };

                            //save the message
                            Messages.push(messageData);
                        }
                    });
                },
                call     : function(){
                    $scope.phone = $stateParams["number"];

                    var popup = $ionicPopup.show({
                        template: '<twilio-dialer phone="' + $stateParams["number"] + '"></twilio-dialer>',
                        title: '<h4>Call</h4>',
                        scope: $scope
                    });

                    $scope.closePopup = function(){
                        popup.close();
                    };

                }
            });

            //keep updating message timers
            setInterval(function(){
                 $scope.messages = angular.copy($scope.messages);
            }, 1000);
        }
    ]);

    //secure controller
    app.controller('FeedbackController', [
        "$scope", "Feedback", "$ionicPopup", "$rootScope", "$state",
        function($scope, Feedback, $ionicPopup, $rootScope, $state){

            //record feedback
            $scope.recordFeedback = function(feedback){
                var feedback = {
                    date : Date.now(),
                    feedback : feedback,
                    user : $rootScope.user
                };

                Feedback.push(feedback);

                var popup = $ionicPopup.alert(
                    {
                        template: "Thank you for your feedback :)"
                    }
                );

                //
                popup.then(function(){
                    if($rootScope.user.userType == "doctor")
                        $state.transitionTo("providerDashboard");
                    else
                        $state.transitionTo("consumerDashboard");

                });
            };
        }
    ]);
});