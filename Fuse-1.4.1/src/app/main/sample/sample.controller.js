(function ()
{
    'use strict';

    angular
        .module('app.sample')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController(SampleData, Auth)
    {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText + ' ' + Auth.GetLoggedInStatus();

        // Methods

        //////////
    }
})();
