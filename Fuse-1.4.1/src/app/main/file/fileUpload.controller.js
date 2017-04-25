(function ()
{
    'use strict';

    angular
        .module('app.file')
        .controller('FileUploadController', FileUploadController);

    /** @ngInject */
    function FileUploadController(Auth)
    {
        var vm = this;

        // Data
        vm.helloText = Auth.GetLoggedInStatus();

        // Methods

        //////////
    }
})();
