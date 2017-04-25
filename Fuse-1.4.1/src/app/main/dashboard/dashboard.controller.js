(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /** @ngInject */
    function DashboardController(Auth, $scope, ClinicService, logger, $location)
    {
        var vm = this;

        // Data
        vm.helloText = Auth.GetLoggedInStatus();

        // Methods

      logger.debug('Current Clinic', ClinicService.GetCurrentClinicID(), ClinicService.GetCurrentClinicID());

      $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if(toState.data) {
          $scope.currentTab = toState.data.selectedTab;
          console.log(toState.data);
        }
        else{
          $location.url('/doctorDashboard/bookWalkin');
        }
      });

        //////////
    }
})();
