// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('inca', ['ionic','ui.router','inca.interventions','inca.vitals','cb.x2js','ngSanitize'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }


  });
})

// ----------------------------
// config for the app (routing)
// ----------------------------

.config(function($stateProvider, $urlRouterProvider) {
  /*
    $stateProvider
        .state('main', {
            url: '/interventions',
            templateUrl: 'scripts/interventions/interventions.html',
            controller: controllers.interventionsController
        });*/
  $urlRouterProvider.otherwise('/interventions');

});


