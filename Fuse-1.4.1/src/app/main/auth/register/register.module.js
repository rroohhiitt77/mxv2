(function ()
{
    'use strict';

    angular
        .module('app.auth.register', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.auth_register', {
            url      : '/register',
            access: {restricted: false},
            views    : {
                'main@'                          : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm',
                },
                'content@app.auth_register': {
                    templateUrl: 'app/main/auth/register/register.html',
                    controller : 'RegisterController as vm',

                }
            },
            bodyClass: 'register'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/auth/register');

        // Navigation
        //msNavigationServiceProvider.saveItem('app.auth_register', {
        //    title : 'Register',
        //    state : 'app.auth_register',
        //    weight: 3
        //});
    }

})();
