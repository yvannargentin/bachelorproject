// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var incaInterventions = angular.module('inca.interventions', ['ionic','ui.router', 'cb.x2js','ngSanitize'])


// ----------------------------
// config for the app (routing)
// ----------------------------

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('interventions', {
            url: '/interventions',
            templateUrl: 'scripts/interventions/interventions.html',
            controller: controllers.interventionsController,
            resolve : {
                // data loading
                interventions : function($http) {
                  return $http.get("http://crayonoir.ch/bachelor/data.xml")
                  .then(function (data) { // promise

                    var x2js = new X2JS();
                    jsonData = x2js.xml_str2json(data.data);

                    return getInterventions(jsonData,"UNIT",0,0);
                  });
                }
            }
        })
        .state('interventions.group',{
            url: '/group/{idElem}',
            templateUrl: 'scripts/interventions/details.html',
            controller: controllers.detailsController
        });
});

var controllers = {};

controllers.interventionsController = interventionsController;
incaInterventions.controller('getters', controllers.interventionsController);
controllers.detailsController = detailsController;
incaInterventions.controller('getters', controllers.detailsController);


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


function interventionsController($scope,$http, $ionicScrollDelegate,$ionicSideMenuDelegate, $sanitize,$state, interventions){

  $scope.interventions = {};
  var jsonData = null;
  var reserveList  = [];

  $scope.editMode = false;

  $scope.labels = [];
  $scope.labels.editMode = "Modifier";

  for(var i = 0; i < interventions.length; i++){
    // detects reserve interventions
    if(interventions[i]._PLANNED_DATETIME_DISPLAY == "R"){
      reserveList.push(interventions[i]);
      interventions.splice(i,1);
    }
  }

  interventions.sort("_PLANNED_DATETIME_DISPLAY");

  $scope.interventions.list = interventions;
  $scope.interventions.reserve = reserveList;
  console.log(interventions);

  $ionicScrollDelegate.resize(); // to be called every content content is changed


  ///////////////
  // FUNCTIONS //
  ///////////////

  // retrieves current time (hour)
  $scope.getCurrentTime = function(){
    return new Date().getHours();
  };

  // adds buttons delete
  $scope.toggleEditMode = function(){
    $scope.editMode = !$scope.editMode;
    if($scope.labels.editMode == "Modifier")
      $scope.labels.editMode = "Confirmer";
    else
      $scope.labels.editMode = "Modifier";
  };

  $scope.getDetails = function(idElem){
   // window.location = "#/interventions/group/?idElem=" + idElem;
    $state.go('interventions.group',{'idElem' : idElem});
  }

  //delete the element of the list
  $scope.deleteElement = function(idElem,index,type){

    if (type == "list"){
      console.log(idElem + ' ' + index);
      // goes thourgh all interventions
      for(var i = 0; i < $scope.interventions.list.length;i++){

        // if there's more than one act
        if($scope.interventions.list[i].ACT.length != undefined){

          // goes through all the inner acts
          for(var y = 0; y < $scope.interventions.list[i].ACT.length; y++)
            if($scope.interventions.list[i].ACT[y]._ID == idElem) // if there's a match we splice it
              $scope.interventions.list[i].ACT.splice(y, 1);
          // if there's no more act in the category at this time we splice the categorie for that time
          if($scope.interventions.list[i].ACT.length == 0)
            $scope.interventions.list.splice(i, 1);

        }else{ // if there's only one act and we find a match we splice the category for the time
          if($scope.interventions.list[i].ACT._ID == idElem)
              $scope.interventions.list.splice(i, 1);
        }

      }


    }else if(type == "reserve"){
      $scope.interventions.reserve[0].ACT.splice(index, 1);

      // if there's no reserve act anymore
      if($scope.interventions.reserve[0].ACT.length == 0)
        $scope.interventions.reserve.splice(index, 1);
    }

    $ionicScrollDelegate.resize(); // to be called every content content is changed
  };

}



function detailsController($scope,$http, $ionicScrollDelegate,$ionicSideMenuDelegate, $sanitize,$state,interventions){
  var idElem = $state.params.idElem;
  var interventions = $scope.interventions.list;
  var nbGroupAct = 0;

  interventions.sort("_PLANNED_DATETIME_DISPLAY");

  for(var i = 0; i < interventions.length; i++)
    // detects reserve interventions
    if(interventions[i].ACT.length != undefined)
    // goes through all the inner acts
      for(var y = 0; y < interventions[i].ACT.length; y++)
        if(interventions[i].ACT[y]._ID == idElem) // if there's a match we save the index of the group of act
          nbGroupAct = i;

    $scope.interventions.detailedList =  interventions[nbGroupAct].ACT;


    $ionicScrollDelegate.resize(); // to be called every content content is changed

}

