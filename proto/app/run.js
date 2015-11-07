define([
  'app'
], function (app) {
  'use strict';

  // the run blocks
  app.run([
    '$ionicPlatform', '$rootScope', '$location', '$state', 'TwilioService',
    function ($ionicPlatform, $rootScope, $location, $state, TwilioService) {

        $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
              // org.apache.cordova.statusbar required
              StatusBar.styleDefault();
            }
          });

        $rootScope.$on('$stateChangeStart', function(event,toState) {

            if($rootScope.user != null && toState.name == "login")
            {
                event.preventDefault();
            }

            if($rootScope.user == null && toState.name != "login")
            {
                event.preventDefault();
                $state.go("login");
            }
        });

        //initialise Twilio Service
        TwilioService.start();
    }
  ]);
});
