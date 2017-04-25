(function ()
{
    'use strict';

    angular
        .module('app.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(Auth, msUtils, $scope, $location, logger, LocalStorage)
    {
        // Data
        var vm = this;

        // Methods
        vm.Login = function(){
        Auth.Login(vm.form)
          // handle success
          .then(function (data) {
            logger.success('Login Successfull:' + data, data, 'Login');
            vm.form = {};
            msUtils.setPristineForm($scope.loginForm);
            //logger.debug(LocalStorage.GetToken());
            //logger.debug('Token user', Auth.GetUserFromToken(), 'token user');
            logger.debug('user', Auth.GetUser(), 'user');
            //ask for the clinic where the doctor is, if the doctor has clinics and then send to default url.


            $location.url('/');
          })
          // handle error
          .catch(function (data) {
            logger.error('Login Failed:' + data, data, 'Login');
          });
        }

        vm.CheckLogin = function()
        {
          logger.debug('user log in status: ' + Auth.GetLoggedInStatus(), Auth.GetLoggedInStatus(), 'log in status');
          logger.debug('Token user', Auth.GetUserFromToken(), 'token user');
          logger.debug('user', Auth.GetUser(), 'user');
        }
      vm.Logout = function()
      {
        Auth.Logout();
        logger.debug(LocalStorage.GetToken());
        logger.debug('Token user', Auth.GetUserFromToken(), 'token user');
      }

      vm.Me = function()
      {
        Auth.Me(vm.form)
          // handle success
          .then(function (data) {
            logger.success('Me Successfull:' + data, data, 'Me');
            //$location.url('/sample');
          })
          // handle error
          .catch(function (data) {
            logger.error('Me Failed:' + data, data, 'Me');
          });
      }

      function GetClinic(){



      }

      //////////
    }
})();
