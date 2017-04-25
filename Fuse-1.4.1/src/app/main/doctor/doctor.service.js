(function ()
{
  'use strict';

  angular
    .module('app.doctor')
    .factory('doctorService', doctorService);

  /** @ngInject */
  function doctorService($q, logger, $http, cfg, $location, Auth) {
    var service = {
      SaveProfile: SaveProfile,
      GetProfile : GetProfile,
      SaveSchedule : SaveSchedule,
      GetSchedule : GetSchedule,
      GetName : GetName
    };

    return service;


    function SaveProfile(data) {

      // create a new instance of deferred
      var deferred = $q.defer();
      logger.debug('', data, 'savedocProfile');
      // send a post request to the server
      $http.put(cfg.NODE_SERVER + '/api/doctor/' + Auth.GetUserID(), data)
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
          logger.error(data);
          deferred.reject('Error saving profile');
        });
      // return promise object
      return deferred.promise;

    }

    function GetName()
    {
      var deferred = $q.defer();
      GetProfile()
        .then(function(data){
          var name =
          {
            firstName : data.firstName,
            lastName : data.lastName
          }
          deferred.resolve(name);
        })
        .catch(function(data){
          deferred.reject(data);
        })

      // return promise object
      return deferred.promise;
    }

    function GetProfile() {

      // create a new instance of deferred
      var deferred = $q.defer();
      //logger.debug(cfg.NODE_SERVER + '/api/doctor/' + Auth.GetUserID());
      // send a post request to the server
      $http.get(cfg.NODE_SERVER + '/api/doctor/' + Auth.GetUserID())
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
          logger.error(data);
          deferred.reject(data);
        });
      // return promise object
      return deferred.promise;
    }

    function SaveSchedule(data) {

      // create a new instance of deferred
      var loggingTitle = 'doctorSchedule Save';
      var deferred = $q.defer();
      logger.debug('', data, loggingTitle);
      // send a post request to the server
      $http.post(cfg.NODE_SERVER + '/api/doctorSchedule', data)
        // handle success
        .success(function (data, status) {
          if(status === 200){
            deferred.resolve('Sucessfully saved Schedule');
          } else {
            logger.error(data);
            deferred.reject('Error saving Schedule');
          }
        })
        // handle error
        .error(function (data) {
          logger.error('', data, loggingTitle);
          deferred.reject('Error saving Schedule');
        });
      // return promise object
      return deferred.promise;

    }

    function GetSchedule() {

      // create a new instance of deferred
      var loggingTitle = 'DoctorSchedule Get';
      var deferred = $q.defer();
      // send a post request to the server
      $http.get(cfg.NODE_SERVER + '/api/doctor/' + Auth.GetUserID())
        // handle success
        .success(function (data, status) {
          //logger.debug('doctor profile data', data, 'Doctor Profile Data');
          logger.debug('', status, loggingTitle);
          if(status === 200){
            deferred.resolve(data);
          } else {
            logger.error(data);
            deferred.reject(data);
          }
        })
        // handle error
        .error(function (data) {
          logger.error('', data, loggingTitle);
          deferred.reject(data);
        });
      // return promise object
      return deferred.promise;
    }
  }
})();
