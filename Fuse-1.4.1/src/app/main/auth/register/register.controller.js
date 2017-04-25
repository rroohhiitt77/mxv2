(function ()
{
    'use strict';

    angular
        .module('app.auth.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController(Auth, msUtils, $scope, logger)
    {
        // Data
        var vm = this;

        // Methods
        vm.Register = function(){
          Auth.Register(vm.form)
            // handle success
            .then(function (data) {
              logger.success('Successfull Registration: ' + data, data, 'Registration');
              vm.form = {};
              vm.data.cb1 = false;
              msUtils.setPristineForm($scope.registerForm);
            })
            // handle error
            .catch(function (data) {
              logger.error('Error in Registration: ' + data, data, 'Registration');
            });
        }
    }
})();
