(function ()
{
    'use strict';

    angular
        .module('app.case')
        .controller('CaseController', CaseController);

    /** @ngInject */
    function CaseController(Auth, CaseService, logger, patientService, msUtils) {
      // Data
      var vm = this;
      var loggingTitle = 'Case';
      vm.helloText = Auth.GetLoggedInStatus();

      Init();

      //Methods
      function Init(){
        InitPatientAutoComplete();
        vm.showNewCase = false;
        vm.showCaseHistory = false;
        vm.showCase = false;
      }

      vm.GetLatestCasesForpatient = function(){

        vm.showNewCase = false;
        vm.showCaseHistory = true;
        vm.showCase = false;
        vm.case = {};

        CaseService.GetLatestCases(vm.selectedPatient.value, Auth.GetUserID())
          .then(function(data){
            vm.caseHistory = data;
            vm.caseDropDown = CaseService.FormatForDropdown(data);
            logger.debug('case history', data, loggingTitle)
          })
          .catch(function(data){
            logger.error('Error getting case history', data, loggingTitle)
          })
      }

      vm.GetCaseDetails= function()
      {
        //set the case detail fom case history array
        for(var i=0; i<vm.caseHistory.length; i++){
          if(vm.caseHistory[i]._id == vm.caseForm.caseDropDown){
            vm.case = vm.caseHistory[i];
            logger.debug('Case details',vm.case, loggingTitle );
            vm.showCase = true;
            if(vm.case.prescription.length === 0) vm.AddPrescription();
            if(vm.case.labTests.length === 0) vm.AddLabTest();
            return;
          }
        }
        vm.case = {};
        logger.debug('Case details',vm.case, loggingTitle );
      }

      vm.ShowNewCase = function(){
        vm.showNewCase = true;
        vm.showCaseHistory = false;
        vm.showCase = false;
        vm.case = {};

      }

      vm.CreateNewCase = function(){

        vm.case = {
          title : vm.caseForm.title + '_' + msUtils.GetDateFormatted(new Date()),
          description : vm.caseForm.description,
          patientID : vm.selectedPatient.value,
          doctorID : Auth.GetUserID(),
          prescription : [],
          labTests : []
        }

        CaseService.Save(vm.case)
          .then(function(data){
            logger.debug('Success created new case', data, loggingTitle);
          })
          .catch(function(){
            logger.error('Success created new case', data, loggingTitle);
          })

          vm.AddPrescription();
          vm.AddLabTest();
          vm.showCase = true;
      }

      vm.SaveCase = function(){

        CaseService.Save(vm.case)
          .then(function(data){
            logger.success('Successfully saved case', data, loggingTitle);
          })
          .catch(function(){
            logger.error('Failed to save case', data, loggingTitle);
          })
      }


      vm.AddPrescription = function (event) {
        vm.case.prescription.push({id: vm.case.prescription.length + 1});
      }

      vm.RemovePrescription = function (index) {
        vm.case.prescription.splice(index, 1);
      }

      vm.AddLabTest = function (event) {
        vm.case.labTests.push({id: vm.case.labTests.length + 1});
      }

      vm.RemoveLabTest = function (index) {
        vm.case.labTests.splice(index, 1);
      }

      // ******************************
      // Patient auto complete start
      // ******************************
      function InitPatientAutoComplete() {

        vm.selectedItemPatient = null;
        vm.searchTextPatient = null;
        vm.querySearchPatient = querySearchPatient;

        patientService.GetForAutoComplete(null)
          .then(function (data) {
            vm.patientAutoComplete = data;
          })
          .catch(function (data) {
            logger.error('Error loading clinics', data, loggingTitle);
          });


      }

      function querySearchPatient(query) {
        var results = query ? vm.patientAutoComplete.filter(createFilterFor(query)) : vm.patientAutoComplete;
        return results;

      }

      /**
       * Create filter function for a query string
       */
      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
          return (state.searchField.indexOf(lowercaseQuery) > -1);
        };
      }

      // ******************************
      // Patient auto complete End
      // ******************************

    }
})();
