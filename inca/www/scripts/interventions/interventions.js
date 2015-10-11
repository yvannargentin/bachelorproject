//////////////////////////////////////////////////////////////////////////////
// file : interventions.js                                                  //
// views : interventions , details, vitals, fullHistoric, reserveValidation //
// Auteur : Argentin Yvann                                                  //
//////////////////////////////////////////////////////////////////////////////

var incaInterventions = angular.module('inca.interventions', ['ionic','ui.router', 'cb.x2js','ngSanitize', 'chart.js'])


// ----------------------------
// config for the app (routing)
// ----------------------------

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('interventions',{
            url: '/interventions',
            abstract : true,
            template: '<ion-nav-view></ion-nav-view>',
            controller : interventionsMain
        })
        .state('interventions.home', {
            url: '/home',
            templateUrl: 'scripts/interventions/interventions.html',
            controller: interventionsController,
            resolve : {
                // data loading
                configData : function($http) {
                  return $http.get("http://crayonoir.ch/bachelor/config/interventions.timeframe.config.json")
                  .then(function (data) { // promise
                    return data.data;
                  });
                }
            }
        })
        .state('interventions.pdf', {
            url: '/pdf/{dataToPrint}',
            templateUrl: 'scripts/interventions/pdf.html',
            controller: pdfController
        })
        .state('interventions.group',{
            url: '/group/{idElem}',
            templateUrl: 'scripts/interventions/details.html',
            controller: detailsController
        })
        .state('interventions.vitals', {
            url: '/vitals',
            templateUrl: 'scripts/interventions/vitals.html',
            controller: vitalsController,
            resolve : {
                // data loading
                configData : function($http) {
                  return $http.get("http://crayonoir.ch/bachelor/config/interventions.vitals.config.json")
                  .then(function (data) { // promise
                    return data.data;
                  });
                },
                historicData : function($http) {
                  return $http.get("http://crayonoir.ch/bachelor/config/interventions.vitals.historic.json")
                  .then(function (data) { // promise
                    return data.data;
                  });
                },
                sampleData : function($http) {
                  return $http.get("http://crayonoir.ch/bachelor/config/interventions.vitals.sample.json")
                  .then(function (data) { // promise
                    return data.data;
                  });
                }
            }
        })
        .state('interventions.fullHistoric', {
          url : '/historic/{category}',
          templateUrl : 'scripts/interventions/fullHistoric.html',
          controller : fullHistoricController,
          resolve : {
            sampleData : function($http) {
              return $http.get("http://crayonoir.ch/bachelor/config/interventions.vitals.fullhistoric.config.json")
              .then(function (data) { // promise
                return data.data;
              });
            }
          }
        })
        .state('interventions.reserveValidations', {
          url : '/reserve/{validations}',
          templateUrl : 'scripts/interventions/reserveValidations.html',
          controller : reserveValidations
        });
})


.directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit(attr.onFinishRender);
        });
      }
    }
  }
})

.directive('autoFocus', function($timeout) {
    return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(function(){
                _element[0].focus();
            }, 100);
        }
    };
});



/////////////////
// CONTROLLERS //
/////////////////


// intervention.home
incaInterventions.controller('getters', interventionsController);
// intervention.details
incaInterventions.controller('getters', detailsController);
// intervention.vitals
incaInterventions.controller('getters', vitalsController);
// intervention.fullHistoric
incaInterventions.controller('getters', fullHistoricController);
// intervention.reserveValidations
incaInterventions.controller('getters', reserveValidations);



//////////////////////////
// SERVICES / FACTORIES //
//////////////////////////

incaInterventions.factory('getters',function(){
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

function getPatient(jsonresult,unit_id,room_id,bed_id){
  var infoPatient = jsonresult.UNIT_LIST[unit_id].ROOM[room_id].BED[bed_id].PATIENT;
  return infoPatient;
}

function getCurrentTime (){
  return new Date().getHours() + ":" + new Date().getMinutes();
};

function getCurrentDate() {
    var now     = new Date();
    var year    = now.getFullYear();
    var month   = now.getMonth() + 1;
    var day     = now.getDate();

    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }
    var date = day+'.'+month+'.'+year;
    return date;
}


function addIcons(interventions){
      switch(interventions._TYPE){
        case "Alimentation" : interventions.iconeLink = "alimentation.png"; break;
        case "Après-Midi" : interventions.iconeLink = "apres-midi.png"; break;
        case "Bilans" : interventions.iconeLink = "bilans.png"; break;
        case "Cognition Perception" : interventions.iconeLink = "cognition_perception.png"; break;
        case "Communication" : interventions.iconeLink = "communication.png"; break;
        case "Diurne" : interventions.iconeLink = "diurne.png"; break;
        case "Elimination" : interventions.iconeLink = "elimination.png"; break;
        case "Enseignement" : interventions.iconeLink = "enseignement.png"; break;
        case "Environnement SocioFamilial" : interventions.iconeLink = "environnementSocioFamilial.png"; break;
        case "Equipements" : interventions.iconeLink = "equipements.png"; break;
        case "Examens" : interventions.iconeLink = "examens.png"; break;
        case "Gestion De La Santé" : interventions.iconeLink = "gestion_de_la_sante.png"; break;
        case "Hygiène" : interventions.iconeLink = "hygiene.png"; break;
        case "Matinée" : interventions.iconeLink = "matinee.png"; break;
        case "Mobilisation" : interventions.iconeLink = "mobilisation.png"; break;
        case "Nocturne" : interventions.iconeLink = "nocturne.png"; break;
        case "Nuit" : interventions.iconeLink = "nuit.png"; break;
        case "Rendez-vous" : interventions.iconeLink = "rendez_vous.png"; break;
        case "Reserve" : interventions.iconeLink = "reserve.png"; break;
        case "Respiration" : interventions.iconeLink = "respiration.png"; break;
        case "Sommeil - Repos" : interventions.iconeLink = "sommeil_repos.png"; break;
        case "Spiritualites" : interventions.iconeLink = "spiritualites.png"; break;
        case "Sur - 24h" : interventions.iconeLink = "sur_24h_.png"; break;
        case "Surveillances" : interventions.iconeLink = "surveillances.png"; break;
        case "Traitements" : interventions.iconeLink = "traitements.png"; break;
      }

  return interventions;
}


/////////////////
// CONTROLLERS //
/////////////////

function interventionsMain($scope,$state,$ionicHistory, $rootScope, $ionicPopup,$sanitize, $ionicScrollDelegate,$ionicLoading){

  ////////////////////
  // LOADER SPINNER //
  ////////////////////


  var indexPatientDefault = $rootScope.medicalData.indexPatient;
  var indexRoom = $rootScope.medicalData.indexRoom;
  var indexUnit = $rootScope.medicalData.indexUnit;
  jsonData = $rootScope.medicalData.jsonData;


  Username = "Infirmière";

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


  $scope.hide = function(){
    $ionicLoading.hide();
  };

  ////////////////////
  // INITIALIZATION //
  ////////////////////

  $scope.interventions = {};
  $scope.toSend = [];


  patients = [];

  patients.push(getPatient(jsonData,indexUnit,indexRoom,0));
  patients.push(getPatient(jsonData,indexUnit,indexRoom,1));

  interventions = patients[indexPatientDefault].ACT_GROUP;

  currentPatient = patients[indexPatientDefault];

  $scope.patient = {};
  $scope.patient.Index = indexPatientDefault;

  $scope.patient.Name = currentPatient._FIRST_NAME + ' ' + currentPatient._LAST_NAME;

  // EDIT MODE
/*
  $scope.editMode = false;

  $scope.labels = [];
  $scope.labels.editMode = "Modifier";
*/

  // patient 0
  interventions.sort("_PLANNED_DATETIME_DISPLAY");

  for (i = 0; i < interventions.length;i++)
    interventions[i] = addIcons(interventions[i]);

  // patient 1
  secondPatient = patients[1].ACT_GROUP;
  secondPatient.sort("_PLANNED_DATETIME_DISPLAY");

  for (i = 0; i < secondPatient.length;i++)
    secondPatient[i] = addIcons(secondPatient[i]);


  //////////////////////////////
  // GENERAL FUNCTIONNALITIES //
  //////////////////////////////

/*
  // adds buttons delete
  $scope.toggleEditMode = function(){
    $scope.editMode = !$scope.editMode;
    if($scope.labels.editMode == "Modifier")
      $scope.labels.editMode = "Confirmer";
    else
      $scope.labels.editMode = "Modifier";
  };

  $scope.closeEditMode = function(){
    if($scope.editMode)
      $scope.editMode = !$scope.editMode;
    $scope.labels.editMode = "Modifier";
  };
*/
  //delete an element of the list
  $scope.deleteElement = function(idElem,index,type,isDone){
    if (type == "list"){
      // goes through all interventions

      for(var i = 0; i < $scope.interventions.list.length;i++){
        var countDone = 0;
        var idElemMatched = false;
        // if there's more than one act
        if(typeof($scope.interventions.list[i].ACT.length) !== 'undefined'){
          // goes through all the inner acts
          for(var y = 0; y < $scope.interventions.list[i].ACT.length; y++){
            if($scope.interventions.list[i].ACT[y]._ID == idElem){ // if there's a match we mark it done
              $scope.interventions.list[i].ACT[y].isDone = isDone;
              idElemMatched = true;
            }

            if ($scope.interventions.list[i].ACT[y].isDone || $scope.interventions.list[i].ACT[y].isDone === false)
              countDone++;
          }

          // if there's no more act in the category at this time we mark the categorie done for that time
          if(countDone == $scope.interventions.list[i].ACT.length && countDone > 1 && idElemMatched){
            $scope.interventions.list[i].isDone = isDone;
            $scope.interventions.list[i].TIME_TO_DO_IT = '25:00';
            // we get out of the edit mode
            //$scope.closeEditMode();
            // and come back to the intervention page
            $ionicHistory.goBack();
          }


        }else{ // if there's only one act and we find a match we mark the category done for the time

          if($scope.interventions.list[i].ACT._ID == idElem && index == -1)
            $scope.interventions.list[i].isDone = isDone;
            $scope.interventions.list[i].TIME_TO_DO_IT = '25:00';
        }

        countDone = 0;
        idElemMatched = false;

      }


    }else if(type == "reserve"){
      console.log("a reserve shouldn't be deleted, code is commented...");
      // TO VERIFY
      /*
      $scope.interventions.detailedList.splice(index, 1);

      // if there's no reserve act anymore
      if($scope.interventions.detailedList.length == 0){

        // we get out of the edit mode
        $scope.closeEditMode();
        // and come back to the intervention page
        $ionicHistory.goBack();
      }
      */
    }

    $ionicScrollDelegate.resize(); // to be called every content content is changed
  };


  // show a popup with a textarea (used for the validation of an act)
  $scope.showPopup = function(idElem,index,type) {
    $scope.data = {};
    var myInterventionPos = null;

    for (var i = 0; i < $scope.interventions.list.length; i++)
      if(typeof($scope.interventions.list[i].ACT.length) === 'undefined'){
        if($scope.interventions.list[i].ACT._ID == idElem){
          var myInterventionPos = i;
          break;
        }
      }else{ // if we're explopring a group of act
        if(typeof($scope.interventions.list[i].ACT[index]) !== 'undefined'){
          if($scope.interventions.list[i].ACT[index]._ID == idElem){
            var myInterventionPos = i;
            break;
          }
        }
      }

    // An elaborate, custom popup
    var notesPopup = $ionicPopup.show({
      template: '<textarea ng-model="data.notes" auto-focus rows="5"></textarea> ', // <br/>heure d\'éxecution <br/><input type="time" ng-model="data._PLANNED_DATETIME_DISPLAY"/>
      title: 'Notes',
      scope: $scope,
      buttons: [
        { text: 'Annuler' },
        {
          text: '<b>pas fait</b>',
          type: 'button-assertivebis',
          onTap: function(e) {
            if (!$scope.data.notes) {
              //don't allow the user to close unless he enters notes
              notesPopup.close();
            } else {

              if (type == 'list'){
                // saving the notes
                if(index == -1)
                  $scope.interventions.list[myInterventionPos]._NOTES = $scope.data.notes;
                else
                  $scope.interventions.list[myInterventionPos].ACT[index]._NOTES = $scope.data.notes;

              }else if(type == 'reserve'){
                // saving the notes
                $scope.interventions.detailedList[index]._NOTES = $scope.data.notes;
              }

              return {'d_idElem' : idElem, 'd_index' : index, 'd_pos' : myInterventionPos,'d_answer' : false};
            }
          }
        },

        {
          text: '<b>fait</b>',
          type: 'button-balancedbis',
          onTap: function(e) {
            if (!$scope.data.notes) {
              //don't allow the user to close unless he enters notes
              notesPopup.close();
            } else {

              if (type == 'list'){
                // saving the notes
                if(index == -1)
                  $scope.interventions.list[myInterventionPos]._NOTES = $scope.data.notes;
                else
                  $scope.interventions.list[myInterventionPos].ACT[index]._NOTES = $scope.data.notes;

              }else if(type == 'reserve'){
                // saving the notes
                $scope.interventions.detailedList[index]._NOTES = $scope.data.notes;
              }

              return {'d_idElem' : idElem, 'd_index' : index, 'd_pos' : myInterventionPos, 'd_answer' : true};
            }
          }
        }
      ]
    });

    notesPopup.then(function(data) {
      if(typeof(data) !== 'undefined'){
        var state = data.d_answer;
        // we first retrieve all important data from the element
        if(type == 'list'){
          $scope.interventions.list[data.d_pos]._TIME = getCurrentTime();
          if(data.d_index == -1){
            $scope.toSend.push($scope.interventions.list[data.d_pos]);
            //then we need to delete the element
            $scope.deleteElement(data.d_idElem,data.d_index,type,state);

          }else{

            var tmp = $scope.interventions.list.slice(0,$scope.interventions.list.length);

            // TO VERIFY erase the actual data have to be fixed
            //var data = tmp[1];
            //data = tmp[1].ACT[0];

            //$scope.toSend.push(data);
            //then we need to delete the element
            $scope.deleteElement(data.d_idElem,data.d_index,type,state);
          }

        }else{
          $scope.interventions.detailedList[data.d_index]._TIME = getCurrentTime();
          var tmp = $scope.interventions.reserve;
          tmp.ACT = $scope.interventions.detailedList[data.d_index];

          // TODO
          // we need to add it to the scope data
          // if something's been done today already
          /*
          if(typeof($scope.interventions.detailedList[data.d_index].RESERVE_LAST_COMPLETION_DATE_LIST.TODAY) !== 'undefined')
            $scope.interventions.detailedList[data.d_index].RESERVE_LAST_COMPLETION_DATE_LIST.TODAY.RESERVE_VALIDATION.push({'_USR' : tmp.ACT._TIME , '_DATE' : Username});
          else
            $scope.interventions.detailedList[data.d_index].RESERVE_LAST_COMPLETION_DATE_LIST.TODAY = {'_LABEL' : 'aujourd\'hui', 'RESERVE_VALIDATION' : [{'_USR' : tmp.ACT._TIME , '_DATE' : Username}]};
          console.log($scope.interventions.detailedList);
          */

        }
      }



    });

  };

  $scope.showDetailsIntervention = function(acts) {
    var data = {};
    data.title = "détails";

    if(typeof(acts.ACT) === "undefined"){
      data.template = acts.INFORMATION;
    }else{
      data.template = acts.ACT.INFORMATION;
    }
    $ionicPopup.alert(data);
  };

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   code from : http://codepen.io/ionic/pen/uJkCz
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.addNewItem = function () {
    $scope.$broadcast('newItemAdded');
  };


}

///////////////////////////////////////////////////////
// SPECIFIC FUNCTIONS FOR THE INTERVENTION HOME VIEW //
///////////////////////////////////////////////////////

function interventionsController($scope, $ionicScrollDelegate, $sanitize,$state,$ionicPopup,$ionicListDelegate, $location, $interval, configData){

  var reserveList  = [];
  var oneHourInMiliSeconds = 1000 * 60 * 60;
  var formatHour = ':00';

  // loads useful data in variables
  function initializeTabs(){

    var innerTab = [];

    // default patient
    for(var i = 0; i < interventions.length; i++){
      // detects reserve interventions

      if(interventions[i]._PLANNED_DATETIME_DISPLAY == "R"){
        innerTab.push(interventions[i]);
        interventions.splice(i,1);
      }

      if(interventions[i].isDone != true){
        for (var y = 0; y < configData.length; y++)
          if(interventions[i]._PLANNED_DATETIME_DISPLAY == configData[y].Nom)
            interventions[i].TIME_TO_DO_IT = configData[y].Time;

        interventions[i].TIME_TO_DO_IT = interventions[i]._PLANNED_DATETIME_DISPLAY;
      }
    }

    reserveList = innerTab.slice(0,innerTab.length);
    innerTab = [];

    // second patient
    for(var i = 0; i < secondPatient.length; i++){
      // detects reserve interventions
      if(secondPatient[i]._PLANNED_DATETIME_DISPLAY == "R"){
        innerTab.push(secondPatient[i]);
        secondPatient.splice(i,1);
      }

      if(interventions[i].isDone != true)
        interventions[i].TIME_TO_DO_IT = interventions[i]._PLANNED_DATETIME_DISPLAY;
    }

    var tmp = innerTab.slice(0,innerTab.length);
    reserveList.push(tmp[0]);
  }



  initializeTabs();
  $scope.interventions.list = interventions;
  $scope.interventions.reserve = reserveList[+$scope.patient.Index];

  $ionicScrollDelegate.resize(); // to be called everytime content is changed

  ///////////////
  // FUNCTIONS //
  ///////////////


  $scope.changePatient = function(patientId){
    // switch patient
    $scope.patient.Index = !$scope.patient.Index;

    // + casts true to 1 and false to 0
    currentPatient = patients[+$scope.patient.Index];
    $scope.interventions.reserve = reserveList[+$scope.patient.Index];


    $scope.patient.Name = currentPatient._FIRST_NAME + ' ' + currentPatient._LAST_NAME;
    $scope.interventions.list = currentPatient.ACT_GROUP;

  };

  // retrieves current time (hour)
  $scope.getCurrentHour= function(){
    return new Date().getHours();
    //return '06';
  };

  $scope.print = function () {
    $scope.toSend.push(currentPatient._LAST_NAME + ' ' + currentPatient._FIRST_NAME);
    console.log($scope.toSend);
    $state.go('interventions.pdf',{'dataToPrint' : JSON.stringify($scope.toSend)});
  };

  // automatic scroll to current hour interventions
  $scope.$on('scrollToCurrent', function(ngRepeatFinishedEvent) {scrollToCurrent();});

  function scrollToCurrent(){
    var hour = $scope.getCurrentHour() + formatHour;
    $location.hash(hour);
    $ionicScrollDelegate.anchorScroll();
  }

  $interval(updateData,oneHourInMiliSeconds);

  function updateData(){
    console.log("retrieving new data");
    console.log("data retrieved");
    console.log("updating local data...");
    for (var i = 0 ; i < $scope.interventions.list.length; i++){
      if($scope.interventions.list[i].isDone != true)
        $scope.interventions.list[i].TIME_TO_DO_IT = $scope.getCurrentHour() + formatHour;
    }
    console.log("local data updated !");
  }

  $scope.$on('$ionicView.enter', function () {
    updateData();
  });

  $scope.getDetails = function(idElem){
    $state.go('interventions.group',{'idElem' : idElem});
  }

  $scope.getDetailsOrVitals = function(acts){
    var idElem = acts.ACT[0]._ID;
    if(acts._TYPE == 'Surveillances'){
      $state.go('interventions.vitals',{'idElem' : idElem});
    }else{
      $state.go('interventions.group',{'idElem' : idElem});
    }
  }

  $scope.getVitals = function(idElem){
    $state.go('interventions.vitals',{'idElem' : idElem});
  }

  $scope.moveIt = function(acts){
    console.log("trigger reorder");
    //$ionicListDelegate.$getByHandle('').showReorder(true);
  }

  $scope.moveItem = function(acts,from,to){

    //item moved
    console.log(acts);
    console.log(from);
    console.log(to);


    var adapt;
    if(to != 0){
      adapt = -1;
    }else
      adapt = 1;

    acts._PLANNED_DATETIME = $scope.interventions.list[to + adapt]._PLANNED_DATETIME;
    acts._PLANNED_DATETIME_DISPLAY = $scope.interventions.list[to + adapt]._PLANNED_DATETIME_DISPLAY; ;
    acts.TIME_TO_DO_IT = $scope.interventions.list[to + adapt].TIME_TO_DO_IT;;


    $scope.interventions.list.splice(from, 1);
    $scope.interventions.list.splice(to, 0, acts);
  }

}

//////////////////////////////////////////////////////////
// SPECIFIC FUNCTIONS FOR THE INTERVENTION DETAILS VIEW //
//////////////////////////////////////////////////////////

function detailsController($scope, $http, $ionicScrollDelegate, $sanitize, $state, $ionicPopup){

  var idElem = $state.params.idElem;
  var nbGroupAct = 0;

  if(idElem == 'Reserves'){
    var interventions = $scope.interventions.reserve;

    for (var  i = 0; i < interventions.ACT.length; i++)
      interventions.ACT[i] = addIcons(interventions.ACT[i]);

    $scope.interventions.Icone = null;
    $scope.type="reserve";
    $scope.interventions.detailedList =  interventions.ACT;

  }else{

    var interventions = $scope.interventions.list;
    $scope.type="list";
    interventions.sort("_PLANNED_DATETIME_DISPLAY");

    for(var i = 0; i < interventions.length; i++)
      // detects reserve interventions
      if(interventions[i].ACT.length != undefined)
      // goes through all the inner acts
        for(var y = 0; y < interventions[i].ACT.length; y++)
          if(interventions[i].ACT[y]._ID == idElem) // if there's a match we save the index of the group of act
            nbGroupAct = i;

    interventions[nbGroupAct] = addIcons(interventions[nbGroupAct]);
    $scope.interventions.Icone = interventions[nbGroupAct].iconeLink;
    $scope.interventions.detailedList =  interventions[nbGroupAct].ACT;

  }



  $scope.lastValidations = function(index){
    var reserveValidations = $scope.interventions.detailedList[index].RESERVE_LAST_COMPLETION_DATE_LIST;
    if(typeof($scope.interventions.detailedList[index].RESERVE_LAST_COMPLETION_DATE_LIST) !== 'undefined'){
      $state.go('interventions.reserveValidations',{'validations' : JSON.stringify(reserveValidations)});
    }else{
      // An alert dialog
      $ionicPopup.alert({
        title: 'Aucune validation enregistrée.'
      });
    }


  };

    $ionicScrollDelegate.resize(); // to be called every content content is changed

}

//////////////////////////////////////////////////////////////////
// SPECIFIC FUNCTIONS FOR THE INTERVENTION VITALS MEASURES VIEW //
//////////////////////////////////////////////////////////////////

function vitalsController($scope,$http, $ionicScrollDelegate, $sanitize,$state, $ionicPopup, $ionicTabsDelegate, configData,historicData,sampleData){


  $scope.interventions = interventions;

  ////////////////////
  // INITIALIZATION //
  ////////////////////


  $scope.$on('$ionicView.enter',function(){
    if(typeof(category) !== 'undefined')
      $ionicTabsDelegate.select(categoryNameToIdCategory(category));
  });

  dataCharts = [];
  nbBarPreviewChart = 3;


  var Historical = historicData;

  ///////////////////////////////////////////////////////
  // VALUES IN THE SELECT FIELDS IN THE DIFFERENT TABS //
  ///////////////////////////////////////////////////////

  var Rythme = configData[0].Rythme;
  var RythmeR = configData[1].RythmeR;
  var Lieu = configData[2].Lieu;
  var LieuT = configData[3].LieuT;
  var LieuTAH = configData[4].LieuTAH;
  var Prise = configData[5].Prise;
  var Observation = configData[6].Observation;

  $scope.List = [
    {Name : 'Rythme',Options : Rythme,Tab : 'Puls'},
    {Name : 'Lieu',Options : Lieu, Tab : 'Puls'},
    {Name : 'Lieu',Options : LieuT, Tab : 'T'},
    {Name : 'Prise',Options : Prise, Tab : 'TAH'},
    {Name : 'Lieu',Options : LieuTAH, Tab : 'TAH'},
    {Name : 'Rythme',Options : RythmeR, Tab : 'Resp'},
    {Name : 'Observation',Options : Observation, Tab : 'Resp'}
  ];

  /////////////////////////////////////////////
  // CHARTS DATA INITIALIZATION AND SETTINGS //
  /////////////////////////////////////////////



  $scope.optionsPuls = configData[7].optionsPuls;
  $scope.optionsT = configData[8].optionsT;
  $scope.optionsTAH  = configData[9].optionsTAH;
  $scope.optionsGlyc = configData[10].optionsGlyc;
  $scope.optionsResp = configData[11].optionsResp;

  dummyInitialValues();

  ////////////////
  // DUMMY DATA //
  ////////////////

  function dummyInitialValues(){

    $scope.labelsPuls = ['May 20 17:05'];
    $scope.dataPuls = [ [110] ];
    dataCharts.labelsPuls = ['May 20 17:05'];
    dataCharts.dataPuls = [ [110] ];

    $scope.labelsT = ['May 20 17:05'];
    $scope.dataT = [ [36.4] ];
    dataCharts.labelsT = ['May 20 17:05'];
    dataCharts.dataT = [ [36.4] ];


    $scope.labelsTAH = ['May 20 17:05'];
    $scope.dataTAH = [ [32] ];
    dataCharts.labelsTAH = ['May 20 17:05'];
    dataCharts.dataTAH = [ [32] ];

    $scope.labelsGlyc = ['May 20 17:05'];
    $scope.dataGlyc = [ [12.5] ];
    dataCharts.labelsGlyc = ['May 20 17:05'];
    dataCharts.dataGlyc = [ [12.5] ];

    dataCharts.labelsResp = ['May 20 17:05','May 20 17:05','May 20 17:05'];
    dataCharts.dataResp = [ [17.2,12,15] ];
    $scope.labelsResp = ['May 20 17:05','May 20 17:05','May 20 17:05'];
    $scope.dataResp = [ [17.2,12,15] ];

    defaultValues();
  }


  function defaultValues(){
    $scope.elems = [];
    $scope.elems.PulsPouls = 0;
    $scope.elems.TTemperature = 0;
    $scope.elems.TAHSystol = 0;
    $scope.elems.TAHDiastol = 0;
    $scope.elems.GlycGlycemie = 0;
    $scope.elems.RespRespiration = 0;
  }

  $scope.switchTab = function(nbTab){
    $ionicTabsDelegate.select(nbTab);
  };

  $scope.fullHistoric = function(category){
    $state.go('interventions.fullHistoric',{'category' : category});
  }

  ////////////////////////////////////////////////////////
  // VALIDATES AND STORE A NEW VITAL SIGN MEASURE ENTRY //
  ////////////////////////////////////////////////////////

  $scope.validate = function(category){

    var currentDate = getCurrentDate();
    var currentTime = getCurrentTime();
    var measureVal = null;

    switch(category){
      case 'Puls' : measureVal = $scope.elems.PulsPouls; break;
      case 'T'    : measureVal = $scope.elems.TTemperature; break;
      case 'TAH'  : measureVal = $scope.elems.TAHSystol + '-' + $scope.TAGDiastol; break;
      case 'Glyc' : measureVal = $scope.elems.GlycGlycemie; break;
      case 'Resp' : measureVal = $scope.elems.RespRespiration; break;
    }

    var newMeasure = {Date : currentDate,Time : currentTime,Measure : measureVal};

    for(var i = 0; i < Historical.length;i++)
        if(Historical[i].Category == category){
            // updates the data to be sent
            Historical[i].data.push(newMeasure);
            updateChartsScope(category,newMeasure);
        }

    // An alert dialog
    $ionicPopup.alert({
      title: 'Mesure enregistrée',
      template: 'Votre mesure a bien été enregistrée.'
    })
    .then(function(res){
      // reinitialize the default values
      defaultValues();
    });

  };


  ///////////////////////////////////////////////////////////////////////////
  // UPDATES THE SCOPE DATA FOR THE CHARTS EVERYTIME A NEW MEASURE IS DONE //
  ///////////////////////////////////////////////////////////////////////////

  function updateChartsScope(category,newMeasure){
    switch(category){

      case 'Puls':

        if($scope.dataPuls[0].length >= nbBarPreviewChart){
          $scope.dataPuls[0].splice(0,1);
          $scope.labelsPuls.splice(0,1);
        }
        $scope.dataPuls[0].push(newMeasure.Measure); $scope.labelsPuls.push(newMeasure.Date + ' ' + newMeasure.Time);
        dataCharts.dataPuls[0].push(newMeasure.Measure);dataCharts.labelsPuls.push(newMeasure.Date + ' ' + newMeasure.Time);
        break;

      case 'T':

        if($scope.dataT[0].length >= nbBarPreviewChart){
          $scope.dataT[0].splice(0,1);
          $scope.labelsT.splice(0,1);
        }
        $scope.dataT[0].push(newMeasure.Measure);    $scope.labelsT.push(newMeasure.Date + ' ' + newMeasure.Time);
        dataCharts.dataT[0].push(newMeasure.Measure);dataCharts.labelsT.push(newMeasure.Date + ' ' + newMeasure.Time);
        break;

      case 'TAH':

        if($scope.dataTAH[0].length >= nbBarPreviewChart){
          $scope.dataTAH[0].splice(0,1);
          $scope.labelsTAH.splice(0,1);
        }
        $scope.dataTAH[0].push(newMeasure.Measure);$scope.labelsTAH.push(newMeasure.Date + ' ' + newMeasure.Time);
        dataCharts.dataTAH[0].push(newMeasure.Measure);dataCharts.labelsTAH.push(newMeasure.Date + ' ' + newMeasure.Time);
        break;

      case 'Glyc' :

        if($scope.dataGlyc[0].length >= nbBarPreviewChart){
          $scope.dataGlyc[0].splice(0,1);
          $scope.labelsGlyc.splice(0,1);
        }
        $scope.dataGlyc[0].push(newMeasure.Measure); $scope.labelsGlyc.push(newMeasure.Date + ' ' + newMeasure.Time);
        dataCharts.dataGlyc[0].push(newMeasure.Measure);dataCharts.labelsGlyc.push(newMeasure.Date + ' ' + newMeasure.Time);
        break;
      case 'Resp' :

        if($scope.dataResp[0].length >= nbBarPreviewChart){
          $scope.dataResp[0].splice(0,1);
          $scope.labelsResp.splice(0,1);
        }
        $scope.dataResp[0].push(newMeasure.Measure); $scope.labelsResp.push(newMeasure.Date + ' ' + newMeasure.Time);
        dataCharts.dataResp[0].push(newMeasure.Measure);dataCharts.labelsResp.push(newMeasure.Date + ' ' + newMeasure.Time);
        break;
    }
  }

  function categoryNameToIdCategory(category){
    switch (category){
      case 'Puls' : return 0; break;
      case 'T'    : return 1; break;
      case 'TAH'  : return 2; break;
      case 'Glyc' : return 3; break;
      case 'Resp' : return 4; break;
    }
  }

  function idCategorytoCategoryName(idCategory){
    var tab = ['Puls','T','TAH','Glyc','Resp'];
    return tab[idCategory];
  }

}


function fullHistoricController($scope,$http, $ionicScrollDelegate, $sanitize, $state, $ionicLoading, $ionicPopup, $ionicTabsDelegate, sampleData){

  /////////////////////////////////////////////
  // CHARTS DATA INITIALIZATION AND SETTINGS //
  /////////////////////////////////////////////


  category = $state.params.category;


  // when de DOM is ready we switch the current tab
  ionic.DomUtil.ready(function(){
    $ionicTabsDelegate.select(categoryNameToIdCategory(category));
  });

  //synchronize data between views
  $scope.labelsPuls = dataCharts['labelsPuls'];
  $scope.dataPuls = dataCharts['dataPuls'];
  $scope.labelsT = dataCharts['labelsT'];
  $scope.dataT = dataCharts['dataT'];
  $scope.labelsTAH = dataCharts['labelsTAH'];
  $scope.dataTAH = dataCharts['dataTAH'];
  $scope.labelsGlyc = dataCharts['labelsGlyc'];
  $scope.dataGlyc = dataCharts['dataGlyc'];
  $scope.labelsResp = dataCharts['labelsResp'];
  $scope.dataResp = dataCharts['dataResp'];


  $scope.optionsPuls = sampleData[0].optionsPuls[0];
  $scope.optionsT = sampleData[1].optionsT[0];
  $scope.optionsTAH  = sampleData[2].optionsTAH[0];
  $scope.optionsGlyc = sampleData[3].optionsGlyc[0];
  $scope.optionsResp = sampleData[4].optionsResp[0];


  $scope.switchTab = function(nbTab){
    category = idCategorytoCategoryName(nbTab);
    $ionicTabsDelegate.select(nbTab);
  };

  $scope.resetZoom = function(){
    $ionicScrollDelegate.zoomTo(1, true);
  }


  function categoryNameToIdCategory(category){
    switch (category){
      case 'Puls' : return 0; break;
      case 'T'    : return 1; break;
      case 'TAH'  : return 2; break;
      case 'Glyc' : return 3; break;
      case 'Resp' : return 4; break;
    }
  }

  function idCategorytoCategoryName(idCategory){
    var tab = ['Puls','T','TAH','Glyc','Resp'];
    return tab[idCategory];
  }


}


function reserveValidations($scope, $http, $ionicScrollDelegate, $sanitize, $state, $ionicLoading, $ionicPopup, $ionicTabsDelegate){

    // hack to pass an object as parameter from a state to another
    var validations = JSON.parse($state.params.validations);

    if(typeof(validations.OLDER_THAN_THIS_WEEK) === 'undefined'){
      var date;
      var today = new Date();
      var yesterday =  new Date();
      var lastWeek = new Date();

      yesterday.setDate(today.getDate() - 1);
      lastWeek.setDate(today.getDate() - 7);

      today = toFullDate(today);
      yesterday = toFullDate(yesterday);
      lastWeek = toFullDate(lastWeek);


      var dates = [];
      validationsTmp = [];


      validationsTmp.push(validations.RESERVE_VALIDATION.TODAY);
      validationsTmp.push(validations.RESERVE_VALIDATION.YESTERDAY);
      validationsTmp.push(validations.RESERVE_VALIDATION.LAST_WEEK);
      validationsTmp.push(validations.RESERVE_VALIDATION.OLDER_THAN_THIS_WEEK);



      for(var i = 0; i < validations.RESERVE_VALIDATION.length; i++){
        date = new Date(validations.RESERVE_VALIDATION[i]._DATE);

        // is it from today ?
        if(toFullDate(date) == today)
          validationsTmp[0].RESERVE_VALIDATION.push(validations.RESERVE_VALIDATION[i]);
        else if (toFullDate(date) == yesterday)
          validationsTmp[1].RESERVE_VALIDATION.push(validations.RESERVE_VALIDATION[i]);
        else if(toFullDate(date) < today && toFullDate(date) >= lastWeek)
          validationsTmp[2].RESERVE_VALIDATION.push(validations.RESERVE_VALIDATION[i]);
        else{
          if(typeof(validationsTmp[3]) == 'undefined')
            validationsTmp[3] = {'RESERVE_VALIDATION' : [],'_LABEL' : 'semaine précédante'};
          validationsTmp[3].RESERVE_VALIDATION.push(validations.RESERVE_VALIDATION[i]);
        }
      }

      validations = validationsTmp;
    }

    $scope.interventions.reserveDetails = validations;

    function toFullDate(date){
      return date.getFullYear() + (date.getMonth() + 1) +  date.getDate();
    }



}

function pdfController($scope,$http,$sanitize,$state,$sce){
  var dataToPrint = JSON.parse($state.params.dataToPrint);
  console.log(dataToPrint);
  $scope.dataToPrint = dataToPrint;
  $scope.nomPatient = dataToPrint[dataToPrint.length-1];
  var dataFormatted = "<table>";
  dataFormatted += "<tr>";
  dataFormatted += "<th colspan='5' style='border : none; border-bottom: 1px solid black; padding: 1em;'>";
  dataFormatted += $scope.nomPatient;
  dataFormatted += "</th>";
  dataFormatted += "</tr>";

  dataFormatted += "<tr>";
  dataFormatted += "<th style='border : none; border-bottom: 1px solid black; padding: 1em;'>";
  dataFormatted += "informations";
  dataFormatted += "</th>";
  dataFormatted += "<th style='border : none; border-bottom: 1px solid black; padding: 1em;'>";
  dataFormatted += "heure d'éxecution";
  dataFormatted += "</th>";
  dataFormatted += "<th style='border : none; border-bottom: 1px solid black; padding: 1em;'>";
  dataFormatted += "heure prévue";
  dataFormatted += "</th>";
  dataFormatted += "<th style='border : none; border-bottom: 1px solid black; padding: 1em;'>";
  dataFormatted += "tâche effectuée ?";
  dataFormatted += "</th>";
  dataFormatted += "<th style='border : none; border-bottom: 1px solid black; padding: 1em;'>";
  dataFormatted += "notes";
  dataFormatted += "</th>";
  dataFormatted += "</tr>";

  for (var i = 0; i < dataToPrint.length - 1; i++){
    dataFormatted += "<tr>";
    dataFormatted += "<td style='border : none; border-bottom: 1px solid black; padding: 1em;'>";
    var fixed = dataToPrint[i].ACT.INFORMATION.replace("d&#39;", "'");
    dataFormatted += ("d&#39;", "'",fixed);
    dataFormatted += "</td>";
    dataFormatted += "<td style='border : none; border-bottom: 1px solid black; padding: 1em;'>";
    dataFormatted += dataToPrint[i]._TIME;
    dataFormatted += "</td>";
    dataFormatted += "<td style='border : none; border-bottom: 1px solid black; padding: 1em;'>";
    dataFormatted += dataToPrint[i]._PLANNED_DATETIME_DISPLAY;
    dataFormatted += "</td>";
    dataFormatted += "<td style='border : none; border-bottom: 1px solid black; padding: 1em;'>";
    if(dataToPrint[i].isDone)
      dataFormatted += "oui";
    else
      dataFormatted += "non";
    dataFormatted += "</td>";
    dataFormatted += "<td style='border : none; border-bottom: 1px solid black; padding: 1em;'>";
    dataFormatted += dataToPrint[i]._NOTES;
    dataFormatted += "</td>";
    dataFormatted += "</tr>";
  }
  dataFormatted += "</table>";

  $scope.$on('$ionicView.afterEnter',function(){
   // var tableString = JSON.stringify(table);
    var req = {
      method: 'GET',
      url: 'http://crayonoir.ch/bachelor/sendMail.php?msg='+dataFormatted,
      headers: {
       'Content-Type': 'text/html'
      }
    };

    $http(req).
      then(function(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log("mail envoyé");
    }, function(response) {
      console.log("problème avec email");
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  });

}


