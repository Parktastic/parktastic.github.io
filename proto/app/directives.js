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
                controller  : function($scope, $stateParams, TwilioService){

                    console.log($scope);

                    //call the phone specified
                    TwilioService.call($scope.phone);

                    //extend the $scope
                    angular.extend($scope, {
                        hangup : function(){
                            TwilioService.hangup();
                            $scope.$parent.closePopup();
                        }
                    });


                }
            }
    }]);

});

