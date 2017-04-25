(function ()
{
  'use strict';

  angular
    .module('app.case')
    .factory('CaseService', CaseService);

  /** @ngInject */
  function CaseService($q, logger, $http, cfg, $location, Auth) {
    var service = {
      Save: Save,
      Get: Get,
      GetLatestCases : GetLatestCases,
      FormatForDropdown: FormatForDropdown
    };

    return service;

    var loggingTitle = 'Case Service';

    function Save(data) {

      // create a new instance of deferred
      var deferred = $q.defer();
      logger.debug('', data, loggingTitle);
      // send a post request to the server
      $http.post(cfg.NODE_SERVER + '/api/patientCase', data)
        // handle success
        .success(function (data, status) {
          if (status === 200) {
            deferred.resolve('Sucessfully saved case');
          } else {
            logger.error(data);
            deferred.reject(data);
          }
        })
        // handle error
        .error(function (data) {
          logger.error('Error saving Case', data, loggingTitle);
          deferred.reject(data);
        });
      // return promise object
      return deferred.promise;

    }

    function Get(caseID) {

      //get all cases
      // create a new instance of deferred
      var deferred = $q.defer();
      //logger.debug(cfg.NODE_SERVER + '/api/clinic/' + Auth.GetUserID());
      // send a post request to the server
      var url;
      if(caseID===null){
        url = cfg.NODE_SERVER + '/api/patientCase';
      }
      else{
        url = cfg.NODE_SERVER + '/api/patientCase/' + caseID;
      }


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

    function GetLatestCases(patientID, doctorID) {

      //get the latest record for case for this doctor and patient. This is based on the title of the case.

      var deferred = $q.defer();
      //logger.debug(cfg.NODE_SERVER + '/api/clinic/' + Auth.GetUserID());
      // send a post request to the server
      var  url = cfg.NODE_SERVER + '/api/patientCase/getLatestCases?patientID=' + patientID + '&doctorID=' + doctorID;

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


    function FormatForDropdown(data) {
      return data.map(function (d1) {
        return {
          value: d1._id,
          display: d1.title
        };
      })
    }

    }

})();

