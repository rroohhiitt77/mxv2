(function ()
{
    'use strict';

    angular
        .module('app.auth.logout')
        .controller('LogoutController', LogoutController);

    /** @ngInject */
    function LogoutController(Auth, msUtils, $scope, $location, logger) {
      // Data
      var vm = this;
      Auth.Logout()

      logger.success('Logout Successfull', '', 'Logout');
      $location.url('/');

    }
        //////////

})();
