(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($httpProvider)
    {
      // Put your custom configurations here
      //$httpProvider.defaults.withCredentials = true;

      $httpProvider.interceptors.push(['$q', '$location', 'LocalStorage', function($q, $location, LocalStorage) {
        return {
          'request': function (config) {
            config.headers = config.headers || {};
            if (LocalStorage.GetToken()) {
              config.headers.Authorization = 'Bearer ' + LocalStorage.GetToken();
            }
            return config;
          },
          'responseError': function(response) {
            if(response.status === 401 || response.status === 403) {
              $location.path('/login');
            }
            return $q.reject(response);
          }
        };
      }]);

    }

})();
