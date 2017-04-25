(function ()
{
    'use strict';

    angular
        .module('app.patient')
        .controller('PatientController', PatientController);

    /** @ngInject */
    function PatientController(Auth, patientService, logger) {
      var vm = this;
      var loggingTitle = 'Patient Profile';

      // Data


      vm.helloText = Auth.GetLoggedInStatus();
      vm.states = {
        "AP": "Andhra Pradesh",
        "AR": "Arunachal Pradesh",
        "AS": "Assam",
        "BR": "Bihar",
        "CG": "Chhattisgarh",
        "Chandigarh": "Chandigarh",
        "DN": "Dadra and Nagar Haveli",
        "DD": "Daman and Diu",
        "DL": "Delhi",
        "GA": "Goa",
        "GJ": "Gujarat",
        "HR": "Haryana",
        "HP": "Himachal Pradesh",
        "JK": "Jammu and Kashmir",
        "JH": "Jharkhand",
        "KA": "Karnataka",
        "KL": "Kerala",
        "MP": "Madhya Pradesh",
        "MH": "Maharashtra",
        "MN": "Manipur",
        "ML": "Meghalaya",
        "MZ": "Mizoram",
        "NL": "Nagaland",
        "OR": "Orissa",
        "PB": "Punjab",
        "PY": "Pondicherry",
        "RJ": "Rajasthan",
        "SK": "Sikkim",
        "TN": "Tamil Nadu",
        "TR": "Tripura",
        "UP": "Uttar Pradesh",
        "UK": "Uttarakhand",
        "WB": "West Bengal"
      }
      vm.dtOptions = {
        dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth : false,
        responsive: true
      };

      vm.GetAllPatients = function()
      {
        patientService.Get(null)
          .then(function (data) {
            vm.patients = data;
            logger.debug('Patient Profile success', vm.patients, 'PatientProfile');

          })
          .catch(function (data) {
            logger.error(data.status);
          });
      }

      vm.CreatePatient = function () {
        patientService.Create(vm.patientForm)
          .then(function (data) {
            logger.success('Profile successfully saved', data, loggingTitle);
          })
          .catch(function (data) {
            logger.error('Error saving profile', data, loggingTitle);
          });
      }


    }
})();
