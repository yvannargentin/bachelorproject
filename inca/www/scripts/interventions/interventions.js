// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var incaInterventions = angular.module('inca.interventions', ['ionic','cb.x2js'])


// ----------------------------
// config for the app (routing)
// ----------------------------

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('interventions', {
            url: '/interventions',
            templateUrl: 'scripts/interventions/interventions.html',
            controller: controllers.interventionsController
        });
    $urlRouterProvider.otherwise('/interventions');
});


// FACTORY GETTERS FOR INTERVENTION
incaInterventions.factory('getters',function($http){

  var factory = {};

  factory.getTypeInterventionsPatient = function(idPatient){
    var url = '/api/interventions/group?idPatient='+idPatient;

    return $http.get(url); // asynchronus request to server
  }

  factory.getInterventionsPatient = function(idGroup){
    var url = '/api/interventions/patient?idGroup='+idGroup;

    return $http.get(url); // asynchronus request to server
  }

  return factory;
});

var controllers = {};

controllers.interventionsController = interventionsController;
incaInterventions.controller('getters', controllers.interventionsController);


function getInterventions(jsonresult,unit_id,room_id,bed_id){
  var infoPatient = jsonresult.UNIT_LIST[unit_id].ROOM[room_id].BED[bed_id].PATIENT.ACT_GROUP;
  return infoPatient;
}


// used for the interventions digging
function seekIntervention(container, idAct){
  var data = {
    'deeper' : false,
    'info' : {},
    'container' : container
  };

  if(container.hasOwnProperty('INTERVENTION')){
    container = container.INTERVENTION;
    data.deeper = true;
    data.info = {
        'LABEL' : container.LABEL,
        'ID' : container.ID,
        'idAct' : idAct
      };
    data.container = container;

  }

  return data;
}


function interventionsController($scope,$http,getters, $ionicScrollDelegate){

  $scope.interventions = {};
  var jsonData = null;

  $http.get("http://crayonoir.ch/bachelor/data.xml")
    .then(function (data) { // promise
      var x2js = new X2JS();
      jsonData = x2js.xml_str2json(data.data);
      var interventions = getInterventions(jsonData,"UNIT",0,0);
      $scope.interventions.list = interventions;
      $ionicScrollDelegate.resize(); // to be called every content content is changed
  });



}

