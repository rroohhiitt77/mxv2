(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick panel
            'app.quick-panel',


            //Feature Modules
            //'app.sample',
            'app.auth',
            'app.doctor',
            'app.clinic',
            'app.appointment',
            'app.patient',
            'app.case',
            'app.chat',
            'app.dashboard',
            'app.contacts',

             //utility modules
            'app.file'

        ]);
})();
