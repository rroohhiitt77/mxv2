(function ()
{
    'use strict';

    angular
        .module('app.doctor.doctorProfile')
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.doctor_doctorProfile_edit', {
                url    : '/doctorProfileEdit',
                access: {restricted: true},
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/doctor/doctorProfile/doctorProfileEdit.html',
                        controller : 'DoctorProfileEditController as vm'
                    }
                },
            });
        $stateProvider
          .state('app.doctor_doctorProfile_view', {
            url    : '/doctorProfileView',
            access: {restricted: true},
            views  : {
              'content@app': {
                templateUrl: 'app/main/doctor/doctorProfile/doctorProfileView.html',
                controller : 'DoctorProfileViewController as vm'
              }
            },
          });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/doctor/doctorProfile');

        // Navigation
        msNavigationServiceProvider.saveItem('Doctor.doctor_doctorProfile_edit', {
          title : 'Edit Profile',
          state : 'app.doctor_doctorProfile_edit',
          weight: 1
        });

        msNavigationServiceProvider.saveItem('Doctor.doctor_doctorProfile_view', {
          title : 'View Profile',
          state : 'app.doctor_doctorProfile_view',
          weight: 1
        });
    }
})();
