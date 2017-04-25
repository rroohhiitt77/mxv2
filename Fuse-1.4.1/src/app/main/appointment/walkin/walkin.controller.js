(function ()
{
    'use strict';

    angular
        .module('app.appointment')
        .controller('WalkinController', WalkinController);

    /** @ngInject */
    function WalkinController(Auth, logger, ClinicService, patientService, appointmentService, cfg,
                            $firebaseObject, $scope, msUtils) {

      // ******************************
      // Data
      // ******************************
      var vm = this;
      var loggingTitle = 'Appointment Booking';
      var syncObjectToday = [];


      InitForm();


      function InitForm()
      {
        vm.bookingForm = {};

        vm.bookingDate = new Date();
        vm.minDate = new Date();
        vm.maxDate = new Date(
          vm.minDate.getFullYear(),
          vm.minDate.getMonth() + 6,
          vm.minDate.getDate());

        InitPatientAutoComplete();

        ClinicService.GetForDropDownForDoctor(Auth.GetUserID())
          .then(function(data){
            vm.clinicsDropDown = data;
            if(vm.clinicsDropDown.length > 0) {
              vm.bookingForm.clinic = ClinicService.GetCurrentClinicID();
            }
            console.log(data);
          })
          .catch(function(data){
            logger.error('Error getting clinics dropdown', data, loggingTitle);
          })
      }


      //todo:refactor the function ito subfunctions
      //todo:refresh walkin every 5 mins to show slot as per current time
      vm.SubmitBookingForm = function()
      {
        vm.todayStr = [];
        vm.pathToday = [];
        $scope.timeToday = [];

        if (syncObjectToday[0] != null)syncObjectToday[0].$destroy();
        if (syncObjectToday[1] != null)syncObjectToday[1].$destroy();
        if (syncObjectToday[2] != null)syncObjectToday[2].$destroy();

        if(vm.bookingForm.bookingType.toUpperCase() === 'WALKIN'){
          SetUpSlots(0);
        }
        else{
          SetUpSlots(0);
          SetUpSlots(1);
          SetUpSlots(2);
        }
      }

      function SetUpSlots(dayNumber){

        var firebaseBaseUrl = cfg.firebaseBaseUrl;
        var appointmentType = vm.bookingForm.bookingType;
        var appointmentFor = 'Patient';

        var dt = new Date();
        var today = new Date(dt);
        today.setDate(today.getDate() + dayNumber);

        var todayStr = msUtils.GetDateFormatted(today);
        vm.todayStr[dayNumber] = todayStr;
        var pathToday = appointmentFor + '/' + appointmentType + "/" + todayStr + "/" + GetSlotId();
        vm.pathToday[dayNumber] = pathToday;
        $scope.timeToday[dayNumber] = {}; //for data on teh html page

        var firebaseT0Ref = new Firebase(firebaseBaseUrl + "/" + pathToday).orderByKey();

        //Remove existing bindings
        if (syncObjectToday[dayNumber] != null)syncObjectToday[dayNumber].$destroy();

        if(appointmentType == 'Walkin')
        {
          // download the data into a local object
          syncObjectToday[dayNumber] = $firebaseObject(firebaseT0Ref);
          syncObjectToday[dayNumber].$loaded().then(function () {

            //remove all entries with starttime > current time and then pick the last entry in the array
            //todo: ensure data is sorted else it will not work
            var maxKey = GetCurrentTimeForWalkin(syncObjectToday[dayNumber]);

            //reload to bind only one start time
            //todo:avoid double reloading
            //Remove existing bindings
            if (syncObjectToday[dayNumber] != null)syncObjectToday[dayNumber].$destroy();
            if(maxKey != null) {
              var timeToday = {};
              firebaseT0Ref = new Firebase(firebaseBaseUrl + "/" + pathToday + "/").orderByKey().startAt(maxKey.toString()).endAt(maxKey.toString());
              // download the data into a local object
              syncObjectToday[dayNumber] = $firebaseObject(firebaseT0Ref);
              // to take an action after the data loads, use the $loaded() promise
              syncObjectToday[dayNumber].$loaded().then(function () {
                // For three-way data bindings, bind it to the scope instead
                syncObjectToday[dayNumber].$bindTo($scope, "timeToday[" +dayNumber +"]");
              });
            }
          });

        }
        else {
          // connect to firebase for T0 //todo:add numeric start time and sort by that..also add index on that

          firebaseT0Ref = new Firebase(firebaseBaseUrl + "/" + pathToday)
          // download the data into a local object
          syncObjectToday[dayNumber] = $firebaseObject(firebaseT0Ref);
          // to take an action after the data loads, use the $loaded() promise
          syncObjectToday[dayNumber].$loaded().then(function () {
            syncObjectToday[dayNumber].$bindTo($scope, "timeToday[" +dayNumber +"]");
          });
        }

      }

      vm.AppointmentClickedToday = function(slot, dayNumber){

        appointmentService.AddToFirebase(slot, vm.pathToday[dayNumber], vm.selectedPatient.value)
          .then(function(data){
            logger.success('Succesfully saved appointment FB', data, loggingTitle);
          })
          .catch(function(data){
            logger.error('Error saving appointment FB', data, loggingTitle);
          })

        var appointmentData = {};
        appointmentData.doctorID = Auth.GetUserID().trim();;
        appointmentData.clinicID = vm.bookingForm.clinic.trim();
        appointmentData.patientID = vm.selectedPatient.value;
        appointmentData.mrID = null;
        appointmentData.userType = "Patient";
        appointmentData.date = vm.todayStr[dayNumber];
        appointmentData.time = slot.startTime;
        appointmentData.type = vm.bookingForm.bookingType;
        appointmentData.status = vm.bookingForm.bookingType.toUpperCase() == 'WALKIN' ? "Approve" : "Pending";

        appointmentService.AddToDB(appointmentData)
          .then(function(data){
            logger.success('Succesfully saved appointment DB', data, loggingTitle);
          })
          .catch(function(data){
            logger.error('Error saving appointment DB', data, loggingTitle);
          })

      }

      function GetCurrentTimeForWalkin(syncObject){
        var today = new Date();
        var currentTime = today.getHours()*100 + today.getMinutes();
        var maxKey = null;

        angular.forEach(syncObject, function(value, key) {
          if(parseInt(key ,10) > currentTime ){
            delete syncObject[key];
          }
          else{
            if(maxKey == null || parseInt(maxKey,10) <= parseInt(key ,10))
              maxKey = key;
          }

        });
        //delete all except max key

        angular.forEach(syncObject, function(value, key) {
          if(parseInt(key ,10) != maxKey ){
            delete syncObject[key];
          }
          else{
            maxKey = key;
          }
        });

        return maxKey;


      }

      function GetSlotId()
      {
        var slotId = null;

        var clinicId = vm.bookingForm.clinic.trim();
        var clinicMXID = GetClinicDisplay().split('-')[0].toUpperCase().trim();
        var doctorId = Auth.GetUserID().trim();
        var doctorMXID = Auth.GetMXID().trim();
        slotId = doctorMXID + "_" + doctorId + '_' + clinicMXID + "_" +  clinicId;  //unique identifier for doctor+clinic

        return slotId;

      }

      function GetClinicDisplay()
      {
        for(var i=0; i<vm.clinicsDropDown.length;i++){
          if(vm.bookingForm.clinic == vm.clinicsDropDown[i].value){
            return vm.clinicsDropDown[i].display;
          }

        }

        return null;
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
