(function ()
{
    'use strict';

    angular
        .module('app.patient')
        .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    // State
    $stateProvider
      .state('app.patient', {
        url    : '/patient',
        access: {restricted: true},
        views  : {
          'content@app': {
            templateUrl: 'app/main/patient/patient.html',
            controller : 'PatientController as vm'
          }
        },
      });

    // Translation
    //$translatePartialLoaderProvider.addPart('app/main/doctor/doctorProfile');

    // Navigation
    msNavigationServiceProvider.saveItem('Patient.patient', {
      title : 'Patient',
      state : 'app.patient',
      weight: 1
    });
  }
})();
