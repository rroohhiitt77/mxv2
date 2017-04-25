(function ()
{
    'use strict';

    angular
        .module('app.chat', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {

        // State
        $stateProvider.state('app.chat', {
            url    : '/chat',
            access: {restricted: true},
            views  : {
                'content@app': {
                    templateUrl: 'app/main/chat/chat.html',
                    controller : 'ChatController as vm'
                }
            },
            resolve: {
                User    : function (msApi)
                {
                    return msApi.resolve('chat.user@get');
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/chat');

        // Api

        msApiProvider.register('chat.chats', ['app/data/chat/chats/:id.json']);

        msApiProvider.register('chat.user', ['app/data/chat/user.json']);


        // Navigation
        msNavigationServiceProvider.saveItem('fuse.chat', {
            title : 'Chat',
            icon  : 'icon-hangouts',
            state : 'app.chat',
            badge : {
                content: 13,
                color  : '#09d261'
            },
            weight: 5
        });
    }

})();
