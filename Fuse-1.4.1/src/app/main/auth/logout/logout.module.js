(function ()
{
    'use strict';

    angular
        .module('app.auth.logout', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.auth_logout', {
            url      : '/logout',
            access: {restricted: false},
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.auth_logout': {
                    templateUrl: 'app/main/auth/logout/logout.html',
                    controller : 'LogoutController as vm'
                }
            },
            bodyClass: 'logout'
        });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/auth/logout');

        //msNavigationServiceProvider.saveItem('app.auth_logout', {
        //    title : 'logout',
        //    state : 'app.auth_logout',
        //    weight: 1
        //});
    }

})();
