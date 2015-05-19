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

function getCurrentTime (){
  return new Date().getHours() + " : " + new Date().getMinutes();
};

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

function addIcons(interventions){
      switch(interventions._TYPE){
        case "Alimentation" : interventions.IconeLink = "alimentation.png"; break;
        case "Après-Midi" : interventions.IconeLink = "apres-midi.png"; break;
        case "Bilans" : interventions.IconeLink = "bilans.png"; break;
        case "Cognition Perception" : interventions.IconeLink = "cognition_perception.png"; break;
        case "Communication" : interventions.IconeLink = "communication.png"; break;
        case "Diurne" : interventions.IconeLink = "diurne.png"; break;
        case "Elimination" : interventions.IconeLink = "elimination.png"; break;
        case "Enseignement" : interventions.IconeLink = "enseignement.png"; break;
        case "Environnement SocioFamilial" : interventions.IconeLink = "environnementSocioFamilial.png"; break;
        case "Equipements" : interventions.IconeLink = "equipements.png"; break;
        case "Examens" : interventions.IconeLink = "examens.png"; break;
        case "Gestion De La Santé" : interventions.IconeLink = "gestion_de_la_sante.png"; break;
        case "Hygiène" : interventions.IconeLink = "hygiene.png"; break;
        case "Matinée" : interventions.IconeLink = "matinee.png"; break;
        case "Mobilisation" : interventions.IconeLink = "mobilisation.png"; break;
        case "Nocturne" : interventions.IconeLink = "nocturne.png"; break;
        case "Nuit" : interventions.IconeLink = "nuit.png"; break;
        case "Rendez-vous" : interventions.IconeLink = "rendez_vous.png"; break;
        case "Reserve" : interventions.IconeLink = "reserve.png"; break;
        case "Respiration" : interventions.IconeLink = "respiration.png"; break;
        case "Sommeil - Repos" : interventions.IconeLink = "sommeil_repos.png"; break;
        case "Spiritualites" : interventions.IconeLink = "spiritualites.png"; break;
        case "Sur - 24h" : interventions.IconeLink = "sur_24h_.png"; break;
        case "Surveillances" : interventions.IconeLink = "surveillances.png"; break;
        case "Traitements" : interventions.IconeLink = "traitements.png"; break;
      }

  return interventions;
}



function interventionsController($scope,$http, $ionicScrollDelegate,$ionicSideMenuDelegate, $sanitize,$state,$ionicPopup, interventions){


  $scope.interventions = {};
  $scope.toSend = [];
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

  for (i = 0; i < interventions.length;i++)
    interventions[i] = addIcons(interventions[i]);


  $scope.interventions.list = interventions;
  $scope.interventions.reserve = reserveList;

  $ionicScrollDelegate.resize(); // to be called every content content is changed


  ///////////////
  // FUNCTIONS //
  ///////////////

  // retrieves current time (hour)
  $scope.getCurrentHour= function(){
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

  // Triggered on a button click, or some other target
  $scope.showPopup = function(idElem,index) {
    $scope.data = {};
    var myInterventionPos = null;

    for (var i = 0; i < $scope.interventions.list.length; i++)
      if(typeof($scope.interventions.list[i].ACT.length) === 'undefined'){
        if($scope.interventions.list[i].ACT._ID == idElem){console.log($scope.interventions.list[i].ACT.length);
          var myInterventionPos = i;
          break;
        }
      }else{ // if we're explopring a group of act
        if(typeof($scope.interventions.list[i].ACT[index]) !== 'undefined'){
          console.log($scope.interventions.list[i].ACT[index]._ID + ' = ' + idElem);
          if($scope.interventions.list[i].ACT[index]._ID == idElem){
            var myInterventionPos = i;
            break;
          }
        }
      }
    // An elaborate, custom popup
    var notesPopup = $ionicPopup.show({
      template: '<textarea ng-model="data.notes" rows="5"></textarea>',
      title: 'Notes',
      scope: $scope,
      buttons: [
        { text: 'Annuler' },
        {
          text: '<b>Confirmer</b>',
          type: 'button-light',
          onTap: function(e) {
            if (!$scope.data.notes) {
              //don't allow the user to close unless he enters notes
              notesPopup.close();
            } else {

              // saving the notes
              if(index == -1)
                $scope.interventions.list[myInterventionPos]._NOTES = $scope.data.notes;
              else
                $scope.interventions.list[myInterventionPos].ACT[index]._NOTES = $scope.data.notes;

              return {'d_idElem' : idElem, 'd_index' : index, 'd_pos' : myInterventionPos};
            }
          }
        }
      ]
    });

    notesPopup.then(function(data) {
      if(typeof(data) !== 'undefined'){
        // we first retrieve all important data from the element
        $scope.interventions.list[data.d_pos]._TIME = getCurrentTime();
        if(data.d_index == -1)
          $scope.toSend.push($scope.interventions.list[data.d_pos]);
        else{
          var tmp = $scope.interventions.list[data.d_pos];
          tmp.ACT = $scope.interventions.list[data.d_pos].ACT[data.d_index];
          $scope.toSend.push(tmp);
        }
        console.log($scope.toSend);
        //then we need to delete the element
        $scope.deleteElement(data.d_idElem,data.d_index,'list');
      }

    });

  };

}



function detailsController($scope,$http, $ionicScrollDelegate,$ionicSideMenuDelegate, $sanitize,$state, $ionicPopup, interventions){
  var idElem = $state.params.idElem;
  var interventions = $scope.interventions.list;
  var nbGroupAct = 0;
  console.log($scope.toSend);

  interventions.sort("_PLANNED_DATETIME_DISPLAY");

  for(var i = 0; i < interventions.length; i++)
    // detects reserve interventions
    if(interventions[i].ACT.length != undefined)
    // goes through all the inner acts
      for(var y = 0; y < interventions[i].ACT.length; y++)
        if(interventions[i].ACT[y]._ID == idElem) // if there's a match we save the index of the group of act
          nbGroupAct = i;

    interventions[nbGroupAct] = addIcons(interventions[nbGroupAct]);
    $scope.interventions.Icone = interventions[nbGroupAct].IconeLink;
    $scope.interventions.detailedList =  interventions[nbGroupAct].ACT;


    $ionicScrollDelegate.resize(); // to be called every content content is changed

}

