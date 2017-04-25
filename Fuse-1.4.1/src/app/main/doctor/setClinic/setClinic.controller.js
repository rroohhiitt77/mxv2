(function ()
{
    'use strict';

    angular
        .module('app.doctor.setClinic')
        .controller('SetClinicController', SetClinicController);

    /** @ngInject */
    function SetClinicController(Auth, doctorService, logger, ClinicService, $location) {
      var vm = this;
      var loggingTitle = 'SetClinicController';
      vm.setClinicForm = {};

      // Data
      //get the clinics for this doctor in a dropdown
      ClinicService.GetForDropDownForDoctor(Auth.GetUserID())
        .then(function(data){
          console.log(data);
          vm.clinicsDropDown = data;


          if(vm.clinicsDropDown.length === 0) {
            ClinicService.ClearCurrentClinicID();
            $location.url('/doctorDashboard');
          }

          if(vm.clinicsDropDown.length === 1) {
            vm.setClinicForm.clinic = vm.clinicsDropDown[0].value;
          }



        })
        .catch(function(data){
          logger.error('Failed to get clinics for doctor', data, loggingTitle);
        });

      vm.SaveCurrentClinic = function(){
        ClinicService.SaveCurrentClinicID(vm.setClinicForm.clinic);
        $location.url('/doctorDashboard');

      }



    }

})();
