
(function ()
{
  'use strict';

  angular
    .module('app.appointment')
    .factory('appointmentService', appointmentService);

  /** @ngInject */
  function appointmentService($q, logger, $http, cfg, $location, Auth, $firebase, $firebaseObject) {
    var service = {
         CreateSchedule : CreateSchedule,
         AddToFirebase : AddToFirebase,
         AddToDB : AddToDB,
         GetAppointments : GetAppointments,
         UpdateAppointmentStatus : UpdateAppointmentStatus,
         SyncAppointments : SyncAppointments
    };

    //data
    var loggingTitle = 'appointmentService';
    var firebaseBaseUrl = cfg.firebaseBaseUrl;
    var firebaseQUrl = cfg.firebaseQUrl;

    //Methods
    function CreateSchedule(data) {

      // create a new instance of deferred
      var deferred = $q.defer();
      logger.debug('', data, loggingTitle);
      // send a post request to the server
      $http.post(cfg.NODE_SERVER + '/api/doctorSchedule', data)
        // handle success
        .success(function (data, status) {
          if (status === 200) {
            deferred.resolve('Sucessfully saved schedule');
          } else {
            logger.error(data);
            deferred.reject(data);
          }
        })
        // handle error
        .error(function (data) {
          logger.error('Error saving schedule', data, loggingTitle);
          deferred.reject(data);
        });
      // return promise object
      return deferred.promise;

    }

    function AddToFirebase(slot, path, bookerID){
        //Update firebase
        var deferred = $q.defer();
        var obj = $firebaseObject(new Firebase(firebaseBaseUrl + "/" + path + "/" + slot.startTime.toString()));
logger.debug(firebaseBaseUrl + "/" + path + "/" + slot.startTime.toString(), '', loggingTitle);
        obj.$loaded().then(function() {

          //save the data for existing object
          obj.patientIds += "," + bookerID;
          obj.remaining = parseInt(obj.remaining, 10) - 1;
          obj.total = parseInt(obj.total, 10) + 1;
          obj.booked = obj.remaining <= 0 ? true : false;
          obj.startTime = obj.startTime;
          obj.disabled = obj.disabled;
          obj.disabledReason = obj.disabledReason;

          obj.$save().then(function(ref) {
            ref.key() === obj.$id; // true
            deferred.resolve('Sucessfully booked appointment');
          }, function(error) {
            console.log("Error:", error);
            deferred.reject(error);
          });

        });

      // return promise object
      return deferred.promise;
    }

    function AddToDB(appointmentData){
      var deferred = $q.defer();
      $http.post(cfg.NODE_SERVER + '/api/appointment', appointmentData)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(data) {
          deferred.reject(data);
        });

      // return promise object
      return deferred.promise;
    }

    function GetAppointments(doctorID, clinicID, fromDate, toDate, status) {

      // create a new instance of deferred
      var deferred = $q.defer();

      //create the query
      var query = '';
      if(doctorID)
        query = query + "doctorID=" + doctorID;
      if(clinicID)
      {
        if(query.length > 0)
          query = query + "&clinicID=" + clinicID;
        else
          query = query + "clinicID=" + clinicID;
      }
      if(fromDate) {
        if (query.length > 0)
          query = query + "&fromDate=" + fromDate;
        else
          query = query + "fromDate=" + fromDate;
      }
      if(toDate) {
        if (query.length > 0)
          query = query + "&toDate=" + toDate;
        else
          query = query + "toDate=" + toDate;
      }
      if(status) {
        if (query.length > 0)
          query = query + "&status=" + status;
        else
          query = query + "status=" + status;
      }

      // send a post request to the server
      var url;
      if(query)
        url = cfg.NODE_SERVER + '/api/appointment?' + query;
      else
        url = cfg.NODE_SERVER + '/api/appointment';

      $http.get(url)
        // handle success
        .success(function (data, status) {
          if (status === 200) {
            deferred.resolve(data);
          } else {
            logger.error(data);
            deferred.reject(data);
          }
        })
        // handle error
        .error(function (data) {
          logger.error('Error getting appointments', data, loggingTitle);
          deferred.reject(data);
        });
      // return promise object
      return deferred.promise;

    }

    function UpdateAppointmentStatus(id, data) {

      // create a new instance of deferred
      var deferred = $q.defer();
      logger.debug('', data, loggingTitle);
      // send a post request to the server
      $http.put(cfg.NODE_SERVER + '/api/appointment/' + id, data)
        // handle success
        .success(function (data, status) {
          if(status === 200){
            deferred.resolve('Sucessfully updated appointment');
          } else {
            logger.error(data);
            deferred.reject('Error updating appointment');
          }
        })
        // handle error
        .error(function (data) {
          logger.error(data);
          deferred.reject('Error updating appointment');
        });
      // return promise object
      return deferred.promise;

    }

    function SyncAppointments(object, docID, clinicID) {

      var deferred = $q.defer();
      var ref = new Firebase(firebaseQUrl + "/11Oct2016/" + docID + "_" + clinicID);

      var obj = $firebaseObject(ref);

      // to take an action after the data loads, use the $loaded() promise
      obj.$loaded().then(function() {
        console.log("loaded record:", obj.$id, obj.someOtherKeyInData);
        deferred.resolve('Sucessfully loaded appointment q');
        // To iterate the key/value pairs of the object, use angular.forEach()
        angular.forEach(obj, function(value, key) {
          console.log(key, value);
        });
      });
      // To make the data available in the DOM, assign it to $scope
      object = obj;
      return deferred.promise;

    }

    return service;
  }
})();
