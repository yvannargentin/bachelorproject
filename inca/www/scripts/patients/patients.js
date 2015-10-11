var incaPatients = angular.module('inca.patients', ['ionic','ui.router', 'cb.x2js','ngSanitize'])


// ----------------------------
// config for the app (routing)
// ----------------------------

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('patients',{
            url: '/patients',
            templateUrl: 'scripts/patients/patients.html',
            controller : patientsController
        });
});

/////////////////
// CONTROLLERS //
/////////////////


// patients
incaPatients.controller('getters', patientsController);



//////////////////////////
// SERVICES / FACTORIES //
//////////////////////////

incaPatients.factory('getters',function(){
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

function getRoom(jsonresult,unit_id,room_id){
  var infoPatient = jsonresult.UNIT_LIST[unit_id].ROOM[room_id];
  return infoPatient;
}


/////////////////
// CONTROLLERS //
/////////////////

function patientsController($scope,$state, $rootScope, $ionicHistory, $ionicPopup, $ionicScrollDelegate,$ionicLoading){

  ////////////////////
  // LOADER SPINNER //
  ////////////////////


  var jsonData  = $rootScope.medicalData.jsonData;
  var indexRoom = $rootScope.medicalData.indexRoom;
  var indexUnit = $rootScope.medicalData.indexUnit;

  var indexPatientDefault = 0;
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

  var room = getRoom(jsonData,indexUnit,indexRoom);
  $scope.patients = room.BED;
  console.log($scope.patients);
  $scope.nbRoom = room._LABEL;


  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.selectPatient = function(index){
    $rootScope.medicalData.indexPatient = index;
    $state.go('interventions.home');
  }

  ////////////////////
  // INITIALIZATION //
  ////////////////////


  $ionicScrollDelegate.resize(); // to be called every content content is changed


}
