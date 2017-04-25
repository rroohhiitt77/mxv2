(function ()
{
    'use strict';

    angular
        .module('app.auth')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $location, Auth, logger)
    {

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

          if (toState.access.restricted === false) {
            logger.debug('toState.access.restricted === false', '', 'access restriction');
            return;
          }

          logger.debug(Auth.GetLoggedInStatus(), Auth.GetLoggedInStatus(), 'Logged In Status');
          if (toState.access.restricted === true && Auth.GetLoggedInStatus() === false) {
              $location.url('/login');
          }
        });
    }
})();
