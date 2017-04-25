(function ()
{
  'use strict';

  angular
    .module('app.clinic')
    .factory('ClinicService', ClinicService);

  /** @ngInject */
  function ClinicService($q, logger, $http, cfg, $location, Auth, $localStorage) {
    var service = {
      Save: Save,
      Get: Get,
      GetForAutoComplete: GetForAutoComplete,
      GetForDropDown: GetForDropDown,
      GetForAutoCompleteForDoctor: GetForAutoCompleteForDoctor,
      GetForDropDownForDoctor: GetForDropDownForDoctor,
      SaveCurrentClinicID : SaveCurrentClinicID,
      GetCurrentClinicID : GetCurrentClinicID,
      ClearCurrentClinicID : ClearCurrentClinicID
    };

    return service;

    var loggingTitle = 'Clinic Service';

    function Save(data) {

      // create a new instance of deferred
      var deferred = $q.defer();
      logger.debug('', data, loggingTitle);
      // send a post request to the server
      $http.post(cfg.NODE_SERVER + '/api/clinicDetail', data)
        // handle success
        .success(function (data, status) {
          if (status === 200) {
            deferred.resolve('Sucessfully saved clinic');
          } else {
            logger.error(data);
            deferred.reject(data);
          }
        })
        // handle error
        .error(function (data) {
          logger.error('Error saving Clinic', data, loggingTitle);
          deferred.reject(data);
        });
      // return promise object
      return deferred.promise;

    }

    function Get(clinicID) {

      // create a new instance of deferred
      var deferred = $q.defer();
      //logger.debug(cfg.NODE_SERVER + '/api/clinic/' + Auth.GetUserID());
      // send a post request to the server
      var url;
      if (clinicID === null)
        url = cfg.NODE_SERVER + '/api/clinicDetail';
      else
        url = cfg.NODE_SERVER + '/api/clinicDetail/' + clinicID;

      $http.get(url)
        // handle success
        .success(function (data, status) {
          //logger.debug('clinic profile data', data, 'clinic Profile Data');
          //logger.debug('clinic profile status', status, 'clinic Profile Status');
          if (status === 200) {
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

    function GetForAutoComplete() {

      // create a new instance of deferred
      var deferred = $q.defer();
      //logger.debug(cfg.NODE_SERVER + '/api/clinic/' + Auth.GetUserID());
      // send a post request to the server
      var url;
      url = cfg.NODE_SERVER + '/api/clinicDetail/seqId';

      $http.get(url)
        // handle success
        .success(function (data, status) {
          //logger.debug('clinic profile data', data, 'clinic Profile Data');
          //logger.debug('clinic profile status', status, 'clinic Profile Status');
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

    function GetForAutoCompleteForDoctor(doctorID) {

      // create a new instance of deferred
      var deferred = $q.defer();
      //logger.debug(cfg.NODE_SERVER + '/api/clinic/' + Auth.GetUserID());
      // send a post request to the server
      console.log(doctorID);
      var url;
      url = cfg.NODE_SERVER + '/api/clinicDetail/seqId?doctorID='+doctorID;
      console.log(url);

      $http.get(url)
        // handle success
        .success(function (data, status) {
          //logger.debug('clinic profile data', data, 'clinic Profile Data');
          //logger.debug('clinic profile status', status, 'clinic Profile Status');
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
          display: d1.value + ' - ' + d1.nameToUpper + ' - ' + d1.city,
          searchField : (d1.value + ' - ' + d1.nameToUpper + ' - ' + d1.city).toLowerCase()
        };
      })
    }

    function FormatForDropdown(data) {
      return data.map(function (d1) {
        return {
          value: d1.value,
          display: d1.display,
        };
      })
    }

    function GetForDropDown(){
      var deferred = $q.defer();

      GetForAutoComplete()
        .then(function(data){
          var clinicData = FormatForDropdown(data);
          deferred.resolve(clinicData);
        })
        .catch(function(data){
          deferred.reject(data);
        })

      return deferred.promise;

    }

    function GetForDropDownForDoctor(doctorID){
      var deferred = $q.defer();

      GetForAutoCompleteForDoctor(doctorID)
        .then(function(data){
          var clinicData = FormatForDropdown(data);
          deferred.resolve(clinicData);
        })
        .catch(function(data){
          deferred.reject(data);
        })

      return deferred.promise;

    }

    function SaveCurrentClinicID(clinicID){
      $localStorage.currentClinicID = clinicID;
    }

    function GetCurrentClinicID(){
      if($localStorage.currentClinicID)
        return $localStorage.currentClinicID;
      else
        return null;
    }

    function ClearCurrentClinicID(){
      delete $localStorage.currentClinicID;
    }




  }


})();


//value: d1.id,
//display: d1.value + ' - ' + d1.nameToUpper + ' - ' + d1.city
