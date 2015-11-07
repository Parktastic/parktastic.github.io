define([
    'app',
    'controllers'
], function (app) {
    'use strict';

    app.directive('twilioDialer', [
        function(){
            return {
                restrict    : "E",
                scope       : true,
                templateUrl : "templates/call.html",
                controller  : function($scope, $stateParams, TwilioService){

                    //call the phone specified
                    TwilioService.call($scope.phone);

                    //extend the $scope
                    angular.extend($scope, {
                        hangup : function(){
                            TwilioService.hangup();
                            $scope.closePopup();
                        }
                    });


                }
            }
    }]);

});

