(function ()
{
    'use strict';

    angular
        .module('app.appointment')
        .controller('QController', QController);

    /** @ngInject */
    function QController(Auth, logger, ClinicService, patientService, appointmentService, cfg,
                            $scope, msUtils, $firebaseObject, doctorService) {

      // ******************************
      // Data
      // ******************************
      var vm = this;
      vm.title = 'Appointment Qing';
      vm.appointments = {};
      vm.doctorName = {};
      var loggingTitle = 'Appointment Qing';


      InitForm();


      function InitForm() {

        var firebaseQUrl = cfg.firebaseQUrl;
        //var ref = new Firebase(firebaseQUrl + "/11Oct2016/" + Auth.GetUserID() + "_" + ClinicService.GetCurrentClinicID()).orderByKey();
        var todayDate = msUtils.GetDateFormatted(new Date());
        var url = firebaseQUrl + "/" + todayDate + "/" + Auth.GetUserID() + "_" + ClinicService.GetCurrentClinicID();
        //var ref = new Firebase(url).orderByKey();
        console.log(url);
        var ref = new Firebase(url);

        var obj = $firebaseObject(ref);

        obj.$watch(function(event) {
          console.log(event);
        });

        var temp = [];
        // to take an action after the data loads, use the $loaded() promise
        obj.$loaded().then(function() {
          $scope.q = GetAppointments(obj);
          obj.$watch(function(event) {
            console.log(event);
            $scope.q = GetAppointments(obj);
          });
        });


        doctorService.GetName()
          .then(function(data){
            vm.doctorName = data;
            console.log(data);
          })
          .catch(function(data){
            logger.error('Error getting Doctor name', data, loggingTitle);
          })

      }

      function GetAppointments(obj){
        console.log(obj);
        var temp = [];
        angular.forEach(obj, function(value, key) {
         console.log(key, value);
          angular.forEach(value, function(value, key){
            console.log(key, value);
            temp.push(value);
          });

        });

        return temp;

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
