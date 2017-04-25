(function ()
{
    'use strict';

    angular
        .module('app.appointment')
        .controller('ScheduleController', ScheduleController);

    /** @ngInject */
    function ScheduleController(Auth, logger, ClinicService, doctorService, appointmentService, $scope)
    {

      // ******************************
      // Data
      // ******************************
        var vm = this;
        var loggingTitle = 'Schedule';


        vm.selectedItem  = null;
        vm.searchText    = null;
        vm.querySearch   = querySearch;

        InitForm();

        ClinicService.GetForAutoCompleteForDoctor(Auth.GetUserID())
          .then(function (data) {
            vm.clinics  = data;
            console.log(vm.clinics);
          })
          .catch(function (data) {
            logger.error('Error loading clinics', data, loggingTitle);
          });

        // ******************************
        // Methods
        // ******************************
        vm.SubmitScheduleForm = function(){

          var doctorName = doctorService.GetName()
            .then(function(name){

              vm.scheduleForm.doctorId = Auth.GetUserID();
              vm.scheduleForm.doctorFirstName = name.firstName;
              vm.scheduleForm.doctorLastName = name.lastName;
              vm.scheduleForm.doctorMXID = Auth.GetMXID();
              vm.scheduleForm.clinicId = vm.selectedItem.value;
              vm.scheduleForm.clinicName = vm.selectedItem.display.split('-')[1].trim();
              vm.scheduleForm.clinicMXID = vm.selectedItem.display.split('-')[0].trim();
              console.log(vm.scheduleForm);
              if(vm.scheduleForm.type === 'Holiday' && vm.fullDay === true)
              {
                vm.scheduleForm.timeFrom = '0000';
                vm.scheduleForm.timeTo = '2400';
              }
              else {
                vm.scheduleForm.timeFrom = FormatTimeToString(vm.timeFrom);
                vm.scheduleForm.timeTo = FormatTimeToString(vm.timeTo);
              }

              appointmentService.CreateSchedule(vm.scheduleForm)
                .then(function(data){
                    InitForm();

                  logger.success('Successfully created schedule', data, loggingTitle );

                })
                .catch(function(data){
                  logger.error('Failed to create schedule', data, loggingTitle );
                })


            })
            .catch(function(data){
              logger.error('Failed to get doctor name', data, loggingTitle);
            })



        }

        function InitForm(){
          vm.scheduleForm = {};
          vm.scheduleForm.slotDuration = 15;
          vm.scheduleForm.type='Patient';
          vm.scheduleForm.monday = true;
          vm.scheduleForm.tuesday = true;
          vm.scheduleForm.wednesday = true;
          vm.scheduleForm.thursday = true;
          vm.scheduleForm.friday = true;
          vm.fullDay = true;

          if($scope.scheduleForm1) {
            $scope.scheduleForm1.$setPristine();
            $scope.scheduleForm1.$setUntouched();
          }


        }

        // ******************************
        // Internal methods
        // ******************************

        function querySearch (query) {
          var results = query ? vm.clinics.filter( createFilterFor(query) ) : vm.clinics;
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

        function FormatTimeToString(dt){
          var hours = dt.getHours();
          var min = dt.getMinutes();
          var str = new String();

          if(hours < 10)
            str = "0" + hours;
          else
            str = hours.toString();

          if(min  < 10)
            str = str + "0" + min;
          else
            str = str + min;

          return str;
        }

        vm.minDate = new Date();

        vm.maxDate = new Date(
          vm.minDate.getFullYear(),
          vm.minDate.getMonth() + 6,
          vm.minDate.getDate());
      }
})();
