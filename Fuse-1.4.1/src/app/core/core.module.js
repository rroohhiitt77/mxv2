(function ()
{
    'use strict';

    angular
        .module('app.core',
            [
                'ngAnimate',
                'ngAria',
                'ngCookies',
                'ngMessages',
                'ngResource',
                'ngSanitize',
                'ngMaterial',
                'pascalprecht.translate',
                'ui.router',
                'datatables',

                //installed later
                'ngPassword',
                'angular-loading-bar',
                'toastr',
                'ngStorage',
                'ngMaterialDatePicker',
                'firebase'

            ]);
})();
