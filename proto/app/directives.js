define([
    'app',
    'controllers'
], function (app) {
    'use strict';

    app.directive('twilioDialer', [
        function(){
            return {
                restrict    : "E",
                scope       : false,
                templateUrl : "templates/call.html",
                link : function(scope, elem, attr){
                    scope.phone = attr["phone"];
                },
                controller  : function($scope, $stateParams, TwilioService){

                    console.log($scope);

                    //initialise the twilio service here
                    function init(token){
                        Twilio.Device.setup(token);

                        Twilio.Device.ready(function (device) {
                            $scope.log = "Ready";
                            setTimeout(function(){
                                $scope.$apply();
                            }, 100);
                            call();
                        });

                        Twilio.Device.error(function (error) {
                            $scope.log = "Error: " + error.message;
                        });

                        Twilio.Device.connect(function (conn) {
                            $scope.log = "Successfully established call";
                            $scope.connected = true;
                            setTimeout(function(){
                                $scope.$apply();
                            }, 100);
                        });

                        Twilio.Device.disconnect(function (conn) {
                            $scope.log = "Call ended";
                            setTimeout(function(){
                                $scope.$apply();
                            }, 100);
                        });
                    }

                    function call() {
                        Twilio.Device.connect( { "PhoneNumber": $scope.phone } );
                    }

                    function hangup() {
                        Twilio.Device.disconnectAll();
                        $scope.$parent.closePopup();
                    }

                    //extend the $scope
                    angular.extend($scope, {
                        connected : false,
                        hangup : hangup
                    });

                    TwilioService.then(function successCallback(response){
                        init(response.data);
                    }, function errorCallback(error){});
                }
            }
    }]);

});

