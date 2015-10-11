
var incaRooms = angular.module('inca.rooms', ['ionic','ui.router', 'cb.x2js','ngSanitize'])


// ----------------------------
// config for the app (routing)
// ----------------------------

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('rooms',{
            url: '/rooms',
            templateUrl: 'scripts/rooms/rooms.html',
            controller : roomsController
        });
});

/////////////////
// CONTROLLERS //
/////////////////


// rooms
incaRooms.controller('getters', roomsController);



//////////////////////////
// SERVICES / FACTORIES //
//////////////////////////

incaRooms.factory('getters',function(){
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

function getUnit(jsonresult,unit_id){
  var infoUnit = jsonresult.UNIT_LIST[unit_id];
  return infoUnit;
}


/////////////////
// CONTROLLERS //
/////////////////

function roomsController($scope,$state, $ionicHistory, $rootScope, $ionicPopup, $ionicScrollDelegate,$ionicLoading){

  ////////////////////
  // LOADER SPINNER //
  ////////////////////

  var jsonData = $rootScope.medicalData.jsonData;
  var indexUnit = $rootScope.medicalData.indexUnit;

  Username = "Yvann";

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

  var unit = getUnit(jsonData,indexUnit);
  $scope.unit = unit;
  $scope.nomUnit = unit._ABBR;


  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.selectRoom = function(index){
    $rootScope.medicalData.indexRoom = index;
    $state.go('patients');
  }



}
