(function ()
{
    'use strict';

    angular
        .module('app.appointment')
        .controller('ManageController', ManageController);

    /** @ngInject */
    function ManageController(Auth, logger, ClinicService, patientService, appointmentService, cfg,
                            $scope, msUtils) {

      // ******************************
      // Data
      // ******************************
      var vm = this;
      vm.title = 'Appointment Manageing';
      var loggingTitle = 'Appointment Manageing';


      InitForm();


      function InitForm() {

        //get all the appointments for given doctor, clinic and date.
        appointmentService.GetAppointments(Auth.GetUserID(), ClinicService.GetCurrentClinicID())
          .then(function(data){
            vm.appointments = data;
            console.log(data);
          })
          .catch(function(data){
            logger.error('Error getting appointments', data, loggingTitle);
          })
      }

      vm.UpdateAppointmentStatus = function(appointment, status)
      {
        //get all the appointments for given doctor, clinic and date.
        appointment.status = status;
        appointmentService.UpdateAppointmentStatus(appointment._id, appointment)
          .then(function(data){
            console.log(data);
          })
          .catch(function(data){
            logger.error('Error updating status', data, loggingTitle);
          })
      }

      vm.dtOptions = {
        dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth : false,
        responsive: true
      };


    }
})();
