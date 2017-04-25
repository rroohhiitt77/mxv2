(function ()
{
    'use strict';

    angular
        .module('app.doctor')
        .controller('DoctorProfileViewController', DoctorProfileViewController);

    /** @ngInject */
    function DoctorProfileViewController(Auth, doctorService, logger)
    {
        var vm = this;

        // Data
        vm.helloText = Auth.GetLoggedInStatus();

        // Methods

        doctorService.GetProfile()
        .then(function (data) {
          vm.profile  = data;
          logger.info('doctor Profile success', data, 'DoctorProfile');
        })
        .catch(function (data) {
          logger.error(data.status);
        });

    }
})();
