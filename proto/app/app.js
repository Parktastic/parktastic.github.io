//App running

define([
    'firebase',
    'angularFire',
    'ionic',
    'moment',
    'resource',
    'twilio',
    'af'
], function () {
    'use strict';

    // the app with its used plugins
    var app = angular.module('app', ['ionic', 'firebase', 'ngResource', 'facebook']);

    // return the app so you can require it in other components
    return app;
});