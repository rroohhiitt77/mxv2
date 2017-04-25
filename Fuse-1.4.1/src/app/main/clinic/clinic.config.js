(function ()
{
    'use strict';

    angular
        .module('app.clinic')
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
      // State
      $stateProvider
        .state('app.clinic', {
          url    : '/clinic',
          access: {restricted: true},
          views  : {
            'content@app': {
              templateUrl: 'app/main/clinic/clinic.html',
              controller : 'ClinicController as vm'
            }
          },
        });

      // Translation
      //$translatePartialLoaderProvider.addPart('app/main/doctor/doctorProfile');

      // Navigation
      msNavigationServiceProvider.saveItem('Clinic.Clinic', {
        title : 'Add/Update',
        state : 'app.clinic',
        weight: 1
      });
    }
})();
