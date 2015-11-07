/**
 * @author      kevinwahome
 * @date        10/31/15.
 * @definition  Main config for requirejs
 */

require.config({
    baseUrl: 'app',
    paths: {
        'ionic'     : '../lib/ionic/js/ionic.bundle.min',
        'firebase'  : '../lib/firebase',
        'angularFire' : '../lib/angularfire.min',
        'moment' : '../lib/moment.min',
        'resource' : '../lib/angular-resource.min',
        'twilio' : '//static.twilio.com/libs/twiliojs/1.2/twilio.min'
    },
    shim: {
        'firebase': ['ionic'],
        'angularFire' : [ 'ionic' ],
        'resource' : [ 'ionic' ]
    }
});
