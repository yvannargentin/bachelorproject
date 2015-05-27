// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
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
            controller : interventionsMain,
            resolve : {
                // data loading
                jsonData : function($http) {
                  return $http.get("http://crayonoir.ch/bachelor/data.xml")
                  .then(function (data) { // promise

                    var x2js = new X2JS();
                    jsonData = x2js.xml_str2json(data.data);

                    return jsonData;
                  });
                }
            }
        })
        .state('interventions.home', {
            url: '/home',
            templateUrl: 'scripts/interventions/interventions.html',
            controller: controllers.interventionsController
        })
        .state('interventions.group',{
            url: '/group/{idElem}',
            templateUrl: 'scripts/interventions/details.html',
            controller: controllers.detailsController
        })
        .state('interventions.vitals', {
            url: '/vitals',
            templateUrl: 'scripts/interventions/vitals.html',
            controller: controllers.vitalsController
        })
        .state('interventions.fullHistoric', {
          url : '/historic/{category}',
          templateUrl : 'scripts/interventions/fullHistoric.html',
          controller : controllers.fullHistoricController
        });
});

/////////////////
// CONTROLLERS //
/////////////////

var controllers = {};

// intervention.home
controllers.interventionsController = interventionsController;
incaInterventions.controller('getters', controllers.interventionsController);
// intervention.details
controllers.detailsController = detailsController;
incaInterventions.controller('getters', controllers.detailsController);
// intervention.vitals
controllers.vitalsController = vitalsController;
incaInterventions.controller('getters', controllers.vitalsController);
// intervention.fullHistoric
controllers.fullHistoricController = fullHistoricController;
incaInterventions.controller('getters', controllers.fullHistoricController);


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


/////////////////
// CONTROLLERS //
/////////////////

function interventionsMain($scope,$ionicHistory, $ionicPopup, $ionicScrollDelegate,$ionicLoading, jsonData){

  ////////////////////
  // LOADER SPINNER //
  ////////////////////

  var indexPatientDefault = 0;

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

  patients.push(getPatient(jsonData,"UNIT",0,0));
  patients.push(getPatient(jsonData,"UNIT",0,1));

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

  //delete an element of the list
  $scope.deleteElement = function(idElem,index,type){
   // console.log(idElem + " - " + index + ' - ' + type);

    if (type == "list"){

      // goes thourgh all interventions
      for(var i = 0; i < $scope.interventions.list.length;i++){

        // if there's more than one act
        if(typeof($scope.interventions.list[i].ACT.length) !== 'undefined'){

          // goes through all the inner acts
          for(var y = 0; y < $scope.interventions.list[i].ACT.length; y++){
            if($scope.interventions.list[i].ACT[y]._ID == idElem){ // if there's a match we splice it
              $scope.interventions.list[i].ACT.splice(y, 1);
            }
          }
          // if there's no more act in the category at this time we splice the categorie for that time
          if($scope.interventions.list[i].ACT.length == 0){
            $scope.interventions.list.splice(i, 1);
            // we get out of the edit mode
            $scope.toggleEditMode();
            // and come back to the intervention page
            $ionicHistory.goBack();
          }

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


  // show a popup with a textarea (used for the validation of an act)
  $scope.showPopup = function(idElem,index) {
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

///////////////////////////////////////////////////////
// SPECIFIC FUNCTIONS FOR THE INTERVENTION HOME VIEW //
///////////////////////////////////////////////////////

function interventionsController($scope,$http, $ionicScrollDelegate, $sanitize,$state,$ionicPopup, jsonData){
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

function detailsController($scope, $http, $ionicScrollDelegate, $sanitize, $state, $ionicPopup, jsonData){

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

    interventions[nbGroupAct] = addIcons(interventions[nbGroupAct]);
    $scope.interventions.Icone = interventions[nbGroupAct].IconeLink;
    $scope.interventions.detailedList =  interventions[nbGroupAct].ACT;


    $ionicScrollDelegate.resize(); // to be called every content content is changed

}

//////////////////////////////////////////////////////////////////
// SPECIFIC FUNCTIONS FOR THE INTERVENTION VITALS MEASURES VIEW //
//////////////////////////////////////////////////////////////////

function vitalsController($scope,$http, $ionicScrollDelegate, $sanitize,$state, $ionicPopup, $ionicTabsDelegate, jsonData){


  $scope.interventions = interventions;

  ////////////////////
  // INITIALIZATION //
  ////////////////////


  $scope.$on('$ionicView.enter',function(){
    //console.log(category);
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
    dataCharts.labelsResp = ['May 20 17:05'];
    dataCharts.dataResp = [ [17.2] ];

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
   /*dataCharts = {
      'labelsPuls' : $scope.labelsPuls,
      'dataPuls' :   $scope.dataPuls,
      'labelsT' :    $scope.labelsT,
      'dataT' :      $scope.dataT,
      'labelsTAH' :  $scope.labelsTAH,
      'dataTAH' :    $scope.dataTAH,
      'labelsGlyc' : $scope.labelsGlyc,
      'dataGlyc' :   $scope.dataGlyc,
      'labelsResp' : $scope.labelsResp,
      'dataResp' :   $scope.dataResp
    };*/

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


function fullHistoricController($scope,$http, $ionicScrollDelegate, $sanitize, $state, $ionicLoading, $ionicPopup, $ionicTabsDelegate, jsonData){

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


  $scope.switchTab = function(nbTab){
    category = idCategorytoCategoryName(nbTab);
    $ionicTabsDelegate.select(nbTab);
  };


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
  $scope.test = function(){
    console.log("ok");
  }

}




