(function ()
{
    'use strict';

    /**
     * Auth Module
     */
    angular
        .module('app.auth', [
        'app.auth.register',
        'app.auth.login' ,
        'app.auth.logout'
      ]);
})();
