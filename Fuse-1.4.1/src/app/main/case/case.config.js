(function ()
{
    'use strict';

    angular
        .module('app.case')
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
      // State
      $stateProvider
        .state('app.case', {
          url    : '/case',
          access: {restricted: true},
          views  : {
            'content@app': {
              templateUrl: 'app/main/case/case.html',
              controller : 'CaseController as vm'
            }
          },
        });

      // Translation
      //$translatePartialLoaderProvider.addPart('app/main/doctor/doctorProfile');

      // Navigation
      msNavigationServiceProvider.saveItem('Case.Case', {
        title : 'Case',
        state : 'app.case',
        weight: 1
      });
    }
})();
