// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var incaVitals = angular.module('inca.vitals', ['ionic','cb.x2js'])


// ----------------------------
// config for the app (routing)
// ----------------------------

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('vitals', {
            url: '/vitals',
            templateUrl: 'scripts/vitals/vitals.html',
            controller: controllers.vitalsController
        });
});

var controllers = {};

controllers.vitalsController = vitalsController;
incaVitals.controller('getters', controllers.vitalsController);


function getVitals(jsonresult,unit_id,room_id,bed_id){
  var infoPatient = jsonresult.UNIT_LIST[unit_id].ROOM[room_id].BED[bed_id].PATIENT.ACT_GROUP;
  return infoPatient;
}


function vitalsController($scope,$http, $ionicScrollDelegate,$ionicSideMenuDelegate){

  $scope.interventions = {};
  var jsonData = null;

  // AJAX
  $http.get("http://crayonoir.ch/bachelor/data.xml")
    .then(function (data) { // promise

      var x2js = new X2JS();
      jsonData = x2js.xml_str2json(data.data);

      var interventions = getVitals(jsonData,"UNIT",0,0);
      for(var i = 0; i < interventions.length; i++){
        // detects reserve interventions
        if(interventions[i]._PLANNED_DATETIME_DISPLAY == "R"){
          reserveList.push(interventions[i]);
          interventions.splice(i,1);
        }
      }
      interventions.sort("_PLANNED_DATETIME_DISPLAY");
      console.log(interventions);

      $scope.interventions.list = interventions;
      $scope.interventions.reserve = reserveList;

      $ionicScrollDelegate.resize(); // to be called every content content is changed
  });

}

