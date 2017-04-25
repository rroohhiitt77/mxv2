(function ()
{
    'use strict';

    angular
        .module('app.clinic')
        .controller('ClinicController', ClinicController);

    /** @ngInject */
    function ClinicController(Auth, ClinicService, logger)
    {
        var vm = this;
        var loggingTitle = 'Clinic';

        // Data
        vm.helloText = Auth.GetLoggedInStatus();
        vm.states = {
        "AP":"Andhra Pradesh",
        "AR":"Arunachal Pradesh",
        "AS":"Assam",
        "BR":"Bihar",
        "CG":"Chhattisgarh",
        "Chandigarh":"Chandigarh",
        "DN":"Dadra and Nagar Haveli",
        "DD":"Daman and Diu",
        "DL":"Delhi",
        "GA":"Goa",
        "GJ":"Gujarat",
        "HR":"Haryana",
        "HP":"Himachal Pradesh",
        "JK":"Jammu and Kashmir",
        "JH":"Jharkhand",
        "KA":"Karnataka",
        "KL":"Kerala",
        "MP":"Madhya Pradesh",
        "MH":"Maharashtra",
        "MN":"Manipur",
        "ML":"Meghalaya",
        "MZ":"Mizoram",
        "NL":"Nagaland",
        "OR":"Orissa",
        "PB":"Punjab",
        "PY":"Pondicherry",
        "RJ":"Rajasthan",
        "SK":"Sikkim",
        "TN":"Tamil Nadu",
        "TR":"Tripura",
        "UP":"Uttar Pradesh",
        "UK":"Uttarakhand",
        "WB":"West Bengal"
      }

        Init();

        vm.SubmitClinicForm = function(){
          ClinicService.Save(vm.clinicForm)
            .then(function (data) {
              logger.success('Clinic successfully saved', data, loggingTitle);
            })
            .catch(function (data) {
              logger.error('Error saving clinic: ' + data.error, data, loggingTitle);
            });
        }

        function Init()
        {
          vm.clinicForm  = {};
          vm.clinicForm.phone1 = vm.clinicForm.phone1 || [];
          vm.clinicForm.services = vm.clinicForm.services || [];
          vm.clinicForm.specializations = vm.clinicForm.specializations || [];
          vm.clinicForm.registrations = vm.clinicForm.registrations || [];
          vm.clinicForm.workingHours = vm.clinicForm.workingHours || [];

        }

        // Data
      ClinicService.Get(null)
        .then(function (data) {
          vm.clinics = data;
        })
        .catch(function (data) {
          logger.error('Error getting clinics: ' + data.error, data, loggingTitle);
        });


        vm.dtOptions = {
          dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth : false,
          responsive: true
        };
    }

})();
