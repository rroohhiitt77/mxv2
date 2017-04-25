(function ()
{
    'use strict';

    angular
        .module('app.doctor.setClinic')
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.doctor_setClinic', {
                url    : '/doctorSetClinic',
                access: {restricted: true},
                views  : {
                  'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                  },
                    'content@app.doctor_setClinic': {
                        templateUrl: 'app/main/doctor/setClinic/setClinic.html',
                        controller : 'SetClinicController as vm'
                    }
                },
            });

        // Navigation
        msNavigationServiceProvider.saveItem('Doctor.doctor_setClinic', {
          title : 'SetClinic',
          state : 'app.doctor_setClinic',
          weight: 1
        });
    }
})();
