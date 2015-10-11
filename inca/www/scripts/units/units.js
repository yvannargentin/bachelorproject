// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// TO CHECK COMPLETETION OF THE SCRIPT LOOK FOR "TODO" OR "TO VERIFY"

var incaUnits = angular.module('inca.units', ['ionic','ui.router', 'cb.x2js','ngSanitize'])


// ----------------------------
// config for the app (routing)
// ----------------------------

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('units',{
            url: '/units',
            templateUrl: 'scripts/units/units.html',
            controller : controllers.unitsController,
            resolve : {
                // data loading
                jsonData : function($http) {
                  return $http.get("http://www.crayonoir.ch/bachelor/data.xml")
                  .then(function (data) { // promise

                    var x2js = new X2JS();
                    jsonData = x2js.xml_str2json(data.data);

                    return jsonData;
                  });
                }
            }
        });
});

/////////////////
// CONTROLLERS //
/////////////////

var controllers = {};

// intervention.home
controllers.unitsController = unitsController;
incaUnits.controller('getters', controllers.unitsController);



//////////////////////////
// SERVICES / FACTORIES //
//////////////////////////

incaUnits.factory('getters',function(){
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

function unitsController($scope,$state, $ionicHistory,$rootScope, $ionicPopup, $ionicScrollDelegate,$ionicLoading, jsonData){

  ////////////////////
  // LOADER SPINNER //
  ////////////////////

  Username = "Yvann";
  $scope.Username = Username;

  $scope.show = function(){
    $ionicLoading.show({
      template: '<ion-spinner class="spinner-positive"></ion-spinner>'
    });
  };

  //starts by displaying the loader
  $scope.show();

  // when de DOM is ready we hide the loader
  ionic.DomUtil.ready(function(){
    $scope.hide();
  });


  var unitList = jsonData.UNIT_LIST
  $scope.units = unitList;


  $rootScope.medicalData = [];
  $rootScope.medicalData.jsonData = jsonData;


  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.selectUnit = function(index){
    // forged to put up with sample data TO VERIFY
    $rootScope.medicalData.indexUnit = "UNIT";
    $state.go('rooms');
  }



}
