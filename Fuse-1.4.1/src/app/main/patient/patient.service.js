(function ()
{
  'use strict';

  angular
    .module('app.patient')
    .factory('patientService', patientService);

  /** @ngInject */
  function patientService($q, logger, $http, cfg, $location, Auth) {
    var service = {
      Create : Create,
      Update : Update,
      Get : Get,
      GetForAutoComplete: GetForAutoComplete
    };

    return service;

    var loggingTitle = 'Patient Service';

    function Update(id, data) {

      // create a new instance of deferred
      var deferred = $q.defer();
      logger.debug('', data,loggingTitle);
      // send a post request to the server
      $http.put(cfg.NODE_SERVER + '/api/patient/' + id, data)
        // handle success
        .success(function (data, status) {
          if(status === 200){
            deferred.resolve('Sucessfully saved profile');
          } else {
            logger.error(data);
            deferred.reject('Error saving profile');
          }
        })
        // handle error
        .error(function (data) {
          logger.error('Error saving profile', data, loggingTitle);
          deferred.reject('Error saving profile');
        });
      // return promise object
      return deferred.promise;

    }

    function Create(data) {

      // create a new instance of deferred
      var deferred = $q.defer();
      logger.debug('', data,loggingTitle);
      // send a post request to the server
      $http.post(cfg.NODE_SERVER + '/api/patient', data)
        // handle success
        .success(function (data, status) {
          if(status === 200){
            deferred.resolve('Sucessfully saved profile');
          } else {
            logger.error(data);
            deferred.reject('Error saving profile');
          }
        })
        // handle error
        .error(function (data) {
          logger.error('Error saving profile', data, loggingTitle);
          deferred.reject('Error saving profile');
        });
      // return promise object
      return deferred.promise;

    }

    function Get(id) {

      // create a new instance of deferred
      var deferred = $q.defer();
      //logger.debug(cfg.NODE_SERVER + '/api/doctor/' + Auth.GetUserID());
      // send a post request to the server
      var url;

      if(id===null)
        url = cfg.NODE_SERVER + '/api/patient';
      else
        url = cfg.NODE_SERVER + '/api/patient/' + id;

      $http.get(url)
        // handle success
        .success(function (data, status) {
          //logger.debug('doctor profile data', data, 'Doctor Profile Data');
          //logger.debug('doctor profile status', status, 'Doctor Profile Status');
          if(status === 200){
            deferred.resolve(data);
          } else {
            logger.error(data);
            deferred.reject(data);
          }
        })
        // handle error
        .error(function (data) {
          logger.error('Error getting patients', data, loggingTitle);
          deferred.reject(data);
        });
      // return promise object
      return deferred.promise;
    }

    function GetForAutoComplete() {

      // create a new instance of deferred
      var deferred = $q.defer();
      //logger.debug(cfg.NODE_SERVER + '/api/clinic/' + Auth.GetUserID());
      // send a post request to the server
      var url;
      url = cfg.NODE_SERVER + '/api/patient/seqId';

      $http.get(url)
        // handle success
        .success(function (data, status) {
          logger.debug('patient profile data', data, loggingTitle);
          logger.debug('patient profile status', status, loggingTitle);
          if (status === 200) {
            deferred.resolve(FormatForAutoComplete(data));
          } else {
            logger.error(data);
            deferred.reject(data);
          }
        })
        // handle error
        .error(function (data) {
          logger.error(data);
          deferred.reject(data);
        });
      // return promise object
      return deferred.promise;
    }


    function FormatForAutoComplete(data) {
      return data.map(function (d1) {
        return {
          value: d1.id,
          display: d1.seqId + ' - ' + d1.firstName.toUpperCase() + ' ' + d1.middleName.toUpperCase()
                          + ' ' + d1.lastName.toUpperCase(),
          searchField : (d1.seqId + ' - ' + d1.firstName.toUpperCase() + ' ' + d1.middleName.toUpperCase()
          + ' ' + d1.lastName.toUpperCase()).toLowerCase()
        };
      })
    }


  }
})();
