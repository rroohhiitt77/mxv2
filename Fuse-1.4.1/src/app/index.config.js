(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($httpProvider)
    {
      // Put your custom configurations here
      //$httpProvider.defaults.withCredentials = true;

    }

})();
