define([
    'app',
    'controllers'
], function (app) {
    'use strict';

    app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        if (ionic.Platform.isAndroid())
            $ionicConfigProvider.scrolling.jsScrolling(false);

        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl',
                data : {
                    requiresLogin : false
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/signup.html',
                controller: 'signupCtrl',
                data : {
                    requiresLogin : false
                }
            })

            .state('providerRegistration', {
                url: '/doctor-registration',
                templateUrl: 'templates/providerRegistration.html',
                controller: 'providerRegistrationCtrl'
            })


            .state('consumerRegistration', {
                url: '/customer-registration',
                templateUrl: 'templates/consumerRegistration.html',
                controller: 'consumerRegistrationCtrl'
            })

            .state('services', {
                url: '/doctor/services',
                templateUrl: 'templates/providerServices.html',
                controller: 'providerViewCtrl',
                params  :   {
                    doctor : null
                }
            })

            .state('payment', {
                url: '/doctor/services/payment',
                templateUrl: 'templates/paymentMethod.html',
                controller: 'paymentMethodCtrl',
                params : {
                    doctor : null,
                    request : null
                }
            })

            .state('scheduleAppointment', {
                url: '/schedule-appointment',
                templateUrl: 'templates/scheduleAppointment.html',
                controller: 'scheduleAppointmentCtrl'
            })

            .state('consumerDashboard', {
                url: '/dashboard/consumer',
                templateUrl: 'templates/consumerDashboard.html',
                controller: 'consumerDashboardCtrl'
            })

            .state('providerDashboard', {
                url: '/dashboard/provider',
                templateUrl: 'templates/providerDashboard.html',
                controller: 'providerDashboardCtrl'
            })
            .state('search', {
                url: '/search',
                templateUrl: 'templates/search.html',
                controller : 'SearchController',
                controllerAs : "SC"
            })
            .state('pendingRequests', {
                url: '/requests',
                templateUrl: 'templates/pendingRequests.html',
                controller : 'PendingRequestsController',
                params  : {
                    doctor : null
                }
            })
            .state('requests', {
                url: '/provider/requests',
                templateUrl: 'templates/providerRequests.html',
                controller : 'ProviderPendingRequestsController'
            })
            .state('callResponse', {
                url: '/provider/requests/call',
                templateUrl: 'templates/callResponse.html',
                controller : 'CallResponseController',
                params : {
                    request : null
                }
            })
            .state('appointmentResponse', {
                url: '/provider/appointment',
                templateUrl: 'templates/appointmentResponse.html',
                controller : 'AppointmentResponseController'
            })
            .state('messages', {
                url: '/messages',
                templateUrl: 'templates/messages.html',
                controller : 'MessagesController'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'templates/user-profile.html'
            })
            .state('secure', {
                url: '/secure',
                templateUrl: 'templates/secure.html'
            })
            .state('chats', {
                url: '/chats',
                templateUrl: 'templates/chat-screen.html',
                controller : 'ChatController',
                params  :   {
                    user : null,
                    names: null,
                    recipient : null,
                    number : null
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });
});
