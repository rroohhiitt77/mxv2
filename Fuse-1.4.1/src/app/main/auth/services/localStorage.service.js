(function ()
{
  'use strict';

  angular
    .module('app.auth')
    .factory('LocalStorage', LocalStorage);

  /** @ngInject */
  function LocalStorage($localStorage) {
    var service = {
      SetToken: SetToken,
      GetToken: GetToken,
      DeleteToken : DeleteToken
    };

    return service;

    function SetToken(token){
      $localStorage.token = token;
    }

    function GetToken(){
      return $localStorage.token;
    }

    function DeleteToken(){
      delete $localStorage.token;
    }

  }

})();
