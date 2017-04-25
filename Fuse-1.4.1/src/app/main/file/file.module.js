(function ()
{
    'use strict';

    angular
        .module('app.file', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.file', {
                url    : '/file',
                access: {restricted: true},
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/file/fileUpload.html',
                        controller : 'FileUploadController as vm'
                    }
                },
            });

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main/file');

        // Api

        //msNavigationServiceProvider.saveItem('File.fileUpload', {
        //    title    : 'File Upload',
        //    state    : 'app.file',
        //    weight   : 1
        //});
    }
})();
