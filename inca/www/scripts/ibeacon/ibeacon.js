// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// TO CHECK COMPLETETION OF THE SCRIPT LOOK FOR "TODO" OR "TO VERIFY"

var incaIbeacons = angular.module('inca.ibeacon', ['ionic','ui.router', 'cb.x2js','ngSanitize','inca.monitoring', 'inca.eventlog', 'inca.ranging'])


// ----------------------------
// config for the app (routing)
// ----------------------------

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('ibeacon',{
            url: '/ibeacon',
            templateUrl: 'scripts/ibeacon/ibeacon.html',
            controller : ibeaconController
        });
});

/////////////////
// CONTROLLERS //
/////////////////

var controllers = {};

// ibeacon
incaIbeacons.controller('getters', ibeaconController);



//////////////////////////
// SERVICES / FACTORIES //
//////////////////////////

incaIbeacons.factory('getters',function(){
  var factory = {};

  factory.example = function(val){
    var result = null
    return result;
  };

  return factory;
});


///////////////////////
// GENERAL FUNCTIONS //
///////////////////////



/////////////////
// CONTROLLERS //
/////////////////

function ibeaconController($scope,$state, $ionicHistory,$rootScope, $ionicScrollDelegate){



}
