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


function interventionsController($scope,$http,getters, $ionicScrollDelegate,$ionicSideMenuDelegate){

  $scope.interventions = {};
  var jsonData = null;
  var reserveList  = [];

  // AJAX
  $http.get("http://crayonoir.ch/bachelor/data.xml")
    .then(function (data) { // promise

      var x2js = new X2JS();
      jsonData = x2js.xml_str2json(data.data);

      var interventions = getInterventions(jsonData,"UNIT",0,0);
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

  $scope.editMode = false;

  $scope.labels = [];
  $scope.labels.editMode = "Modifier";

  // retrieves current time (hour)
  $scope.getCurrentTime = function(){
    return new Date().getHours();
  };

  // adds buttons delete
  $scope.toggleEditMode = function(){
    $scope.editMode = !$scope.editMode;
    if($scope.labels.editMode == "Modifier")
      $scope.labels.editMode = "Annuler";
    else
      $scope.labels.editMode = "Modifier";
  };

  //set up a watch over the current hour, once it changes, the scroll will be set to the accurate acts
  $scope.$watch(function(scope) { return $scope.getCurrentTime(); },
    function() {
      // scroll to accurate acts
    }
  );

  //delete the element of the list
  $scope.deleteElement = function(counter,index,type){

    if (type=="list"){
      if(counter == -1){
        $scope.interventions.list.splice(index, 1);
      }else{console.log($scope.interventions.list);
        $scope.interventions.list[counter+1].ACT.splice(index, 1);
        if($scope.interventions.list[counter+1].ACT.length == 0)
          $scope.interventions.list.splice(counter+1, 1);
      }

    }else if(type=="reserve"){
      $scope.interventions.reserve[0].splice(index, 1);

      // if there's no reserve act anymore
      if($scope.interventions.reserve[0].ACT.length == 0)
        $scope.interventions.reserve.splice(index, 1);
    }

    $ionicScrollDelegate.resize(); // to be called every content content is changed
  };

}

