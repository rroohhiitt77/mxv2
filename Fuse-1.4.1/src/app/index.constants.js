(function ()
{
    'use strict';
//todo: USe angular environemnet plugin
  //http://stackoverflow.com/questions/16339595/how-do-i-configure-different-environments-in-angular-js
  //https://www.npmjs.com/package/angular-environment
    angular
        .module('fuse')
        .constant('cfg', {
        // ==========================   DEV    =============================================================
        NODE_SERVER: 'http://192.168.0.22:8085',
        firebaseBaseUrl: 'https://blistering-torch-8744.firebaseio.com/slotsDev',
        firebaseQUrl: 'https://blistering-torch-8744.firebaseio.com/QDev',
        firebaseChatUrl : 'https://mxchat-d5b5c.firebaseio.com/chatDev',
        env : 'Dev'
        // ==================================================================================================


        // ==========================   PROD    =============================================================
        //NODE_SERVER: 'https://mxdoc.herokuapp.com',
        ////NODE_SERVER: 'http://192.168.0.22:8085',
        //firebaseBaseUrl: 'https://blistering-torch-8744.firebaseio.com/slotsProd',
        //firebaseQUrl: 'https://blistering-torch-8744.firebaseio.com/QProd',
        //firebaseChatUrl : 'https://mxchat-d5b5c.firebaseio.com/chatProd',
        //env : 'Prod'
        // ==================================================================================================

      });
    ;
})();
