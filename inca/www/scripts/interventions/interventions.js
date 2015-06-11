// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// TO CHECK COMPLETETION OF THE SCRIPT LOOK FOR "TODO" OR "TO VERIFY"

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
            controller: interventionsController
        })
        .state('interventions.group',{
            url: '/group/{idElem}',
            templateUrl: 'scripts/interventions/details.html',
            controller: detailsController
        })
        .state('interventions.vitals', {
            url: '/vitals',
            templateUrl: 'scripts/interventions/vitals.html',
            controller: vitalsController
        })
        .state('interventions.fullHistoric', {
          url : '/historic/{category}',
          templateUrl : 'scripts/interventions/fullHistoric.html',
          controller : fullHistoricController
        })
        .state('interventions.reserveValidations', {
          url : '/reserve/{validations}',
          templateUrl : 'scripts/interventions/reserveValidations.html',
          controller : reserveValidations
        });
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

  $scope.editMode = false;

  $scope.labels = [];
  $scope.labels.editMode = "Modifier";

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

  //delete an element of the list
  $scope.deleteElement = function(idElem,index,type){
    console.log(idElem + ' - ' + index + ' - ' + type);
    if (type == "list"){
      // goes thourgh all interventions

      for(var i = 0; i < $scope.interventions.list.length;i++){

        // if there's more than one act
        if(typeof($scope.interventions.list[i].ACT.length) !== 'undefined'){
          // goes through all the inner acts
          for(var y = 0; y < $scope.interventions.list[i].ACT.length; y++){
            if($scope.interventions.list[i].ACT[y]._ID == idElem){ // if there's a match we splice it
              $scope.interventions.list[i].ACT.splice(y, 1);
              if(typeof($scope.interventions.detailedList) !== 'undefined')
                console.log($scope.interventions.detailedList);//.splice(y, 1); // TO VERIFY
            }
          }
          // if there's no more act in the category at this time we splice the categorie for that time
          if($scope.interventions.list[i].ACT.length == 0){
            $scope.interventions.list.splice(i, 1);
            // we get out of the edit mode
            $scope.closeEditMode();
            // and come back to the intervention page
            $ionicHistory.goBack();
          }

        }else{ // if there's only one act and we find a match we splice the category for the time

          if($scope.interventions.list[i].ACT._ID == idElem && index == -1)
            $scope.interventions.list.splice(i, 1);
        }

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

              return {'d_idElem' : idElem, 'd_index' : index, 'd_pos' : myInterventionPos};
            }
          }
        }
      ]
    });

    notesPopup.then(function(data) {
      if(typeof(data) !== 'undefined'){
        // we first retrieve all important data from the element
        if(type == 'list'){
          $scope.interventions.list[data.d_pos]._TIME = getCurrentTime();
          if(data.d_index == -1){
            $scope.toSend.push($scope.interventions.list[data.d_pos]);
            //then we need to delete the element
            $scope.deleteElement(data.d_idElem,data.d_index,type);

          }else{

            var tmp = $scope.interventions.list.slice(0,$scope.interventions.list.length);

            // TO VERIFY erase the actual data have to be fixed
            //var data = tmp[1];
            //data = tmp[1].ACT[0];

            //$scope.toSend.push(data);
            console.log($scope.toSend);
            //then we need to delete the element
            $scope.deleteElement(data.d_idElem,data.d_index,type);
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



}

///////////////////////////////////////////////////////
// SPECIFIC FUNCTIONS FOR THE INTERVENTION HOME VIEW //
///////////////////////////////////////////////////////

function interventionsController($scope, $ionicScrollDelegate, $sanitize,$state,$ionicPopup){

  var reserveList  = [];



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
    }

    reserveList = innerTab.slice(0,innerTab.length);
    innerTab = [];

    // other patient
    for(var i = 0; i < secondPatient.length; i++){
      // detects reserve interventions
      if(secondPatient[i]._PLANNED_DATETIME_DISPLAY == "R"){
        innerTab.push(secondPatient[i]);
        secondPatient.splice(i,1);
      }
    }

    var tmp = innerTab.slice(0,innerTab.length);
    reserveList.push(tmp[0]);
  }




  initializeTabs();
  $scope.interventions.list = interventions;
  $scope.interventions.reserve = reserveList[+$scope.patient.Index];

  $ionicScrollDelegate.resize(); // to be called every content content is changed


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
  };

  $scope.getDetails = function(idElem){
    $state.go('interventions.group',{'idElem' : idElem});
  }

  $scope.getVitals = function(idElem){
    $state.go('interventions.vitals',{'idElem' : idElem});
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
    console.log($scope.interventions.detailedList);

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

function vitalsController($scope,$http, $ionicScrollDelegate, $sanitize,$state, $ionicPopup, $ionicTabsDelegate){


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

  var Historical = [
    {Category : 'Puls', data : [{Date : '20.05.2015',Time : '07:00',Measure : '120'}]},
    {Category : 'T', data : [{Date : '20.05.2015',Time : '07:00',Measure : '34.6'}]},
    {Category : 'TAH', data : [{Date : '20.05.2015',Time : '07:00',Measure : '189-224'}]},
    {Category : 'Glyc', data : [{Date : '20.05.2015',Time : '07:00',Measure : '14.3'}]},
    {Category : 'Resp', data : [{Date : '20.05.2015',Time : '07:00',Measure : '14.7'}]}
  ];


  ///////////////////////////////////////////////////////
  // VALUES IN THE SELECT FIELDS IN THE DIFFERENT TABS //
  ///////////////////////////////////////////////////////

  var Rythme = [ 'Non précisé','Irrégulier','Régulier','Autre' ];

  var RythmeR = ['Non précisé','Irrégulier','Régulier','Apnée','Cheynes-Stroke','Kusmmaul','Autre'];

  var Lieu = [
    'Non précisé',
    'Radial gauche',
    'Radial droit',
    'Rétro-malléolaire gauche',
    'Rétro-malléolaire droit',
    'Pédieux gauche',
    'Pédieux droit',
    'Fémoral gauche',
    'Fémoral droit',
    'Poplité gauche',
    'Poplité droit',
    'Cardiaque',
    'Autre'
  ];

  var LieuT = [
    'Non précisé',
    'Rectal',
    'Buccal',
    'Axillaire',
    'Inguinale',
    'Tympanique',
    'Cutanée',
    'Autre'
  ];

  var LieuTAH = [
    'Non précisé',
    'Bras gauche',
    'Bras droit',
    'Jambe gauche',
    'Jambe droite',
    'Autre'
  ];

  var Prise = [
    'Non précisé',
    'Debout',
    'Couché',
    'Assi',
    'Après effort',
    'Autre'
  ];

  var Observation = [
    'Non précisé',
    'Dyspnée',
    'Tachypnée',
    'Sibilance',
    'Tirage',
    'Balancement thoraco-abdominal',
    'Paradoxal',
    'Stridor',
    'Autre'
  ];

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


  $scope.optionsPuls = {
    scaleOverride: true,
    scaleSteps: 7,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: 20,
    // Number - The scale starting value
    scaleStartValue: 20,
    responsive : true,
    maintainAspectRatio : false
  };

  $scope.optionsT = {
    scaleOverride: true,
    scaleSteps: 4,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: 5,
    // Number - The scale starting value
    scaleStartValue: 26,
    responsive : true,
    maintainAspectRatio : false
  };

  $scope.optionsTAH = {
    scaleOverride: true,
    scaleSteps: 14,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: 20,
    // Number - The scale starting value
    scaleStartValue: 0,
    responsive : true,
    maintainAspectRatio : false
  };

  $scope.optionsGlyc = {
    scaleOverride: true,
    scaleSteps: 11,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: 2,
    // Number - The scale starting value
    scaleStartValue: 0,
    responsive : true,
    maintainAspectRatio : false
  };

  $scope.optionsResp = {
    scaleOverride: true,
    scaleSteps: 11,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: 2,
    // Number - The scale starting value
    scaleStartValue: 0,
    responsive : true,
    maintainAspectRatio : false
  };

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

    $scope.labelsResp = ['May 20 17:05'];
    $scope.dataResp = [ [17.2] ];
    dataCharts.labelsResp = ['May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05','May 20 17:05',];
    dataCharts.dataResp = [ [17.2,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,1.2,1.3,1.9,5.3,8.4,3.7,5.78,5.3,5.89] ];

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


function fullHistoricController($scope,$http, $ionicScrollDelegate, $sanitize, $state, $ionicLoading, $ionicPopup, $ionicTabsDelegate){

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


  $scope.optionsPuls = {
    scaleOverride: true,
    scaleSteps: 7,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: 20,
    // Number - The scale starting value
    scaleStartValue: 20,
    responsive : false,
    maintainAspectRatio : true,
    animation : false
  };

  $scope.optionsT = {
    scaleOverride: true,
    scaleSteps: 4,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: 5,
    // Number - The scale starting value
    scaleStartValue: 26,
    responsive : false,
    maintainAspectRatio : true,
    animation : false
  };

  $scope.optionsTAH = {
    scaleOverride: true,
    scaleSteps: 14,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: 20,
    // Number - The scale starting value
    scaleStartValue: 0,
    responsive : false,
    maintainAspectRatio : true,
    animation : false
  };

  $scope.optionsGlyc = {
    scaleOverride: true,
    scaleSteps: 11,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: 2,
    // Number - The scale starting value
    scaleStartValue: 0,
    responsive : false,
    maintainAspectRatio : true,
    animation : false
  };

  $scope.optionsResp = {
    scaleOverride: true,
    scaleSteps: 11,
    // Number - The value jump in the hard coded scale
    scaleStepWidth: 2,
    // Number - The scale starting value
    scaleStartValue: 0,
    responsive : false,
    maintainAspectRatio : true,
    animation : false
  };


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


function reserveValidations($scope,$http, $ionicScrollDelegate, $sanitize, $state, $ionicLoading, $ionicPopup, $ionicTabsDelegate){

    // hack to apss an object as parameter from a state to another
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
    console.log($scope.interventions.reserveDetails);

    function toFullDate(date){
      return date.getFullYear() + (date.getMonth() + 1) +  date.getDate();
    }



}



