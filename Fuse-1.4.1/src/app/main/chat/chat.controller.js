/*
 Monitor all the chats for child add event.
 If active chat and not my message, add to chat window and update last message
 If active chat and my message only update last message
 If not active chat only update last message.

 If
 chat: {{vm.chat}}   // THIS IS THE CURRENT CHAT
 curretn chat id:{{vm.chatContactId}}  //THIS IS THE ID WITH WHOM CURRENT CHAT IS ONGOING
 */

(function ()
{
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    /** @ngInject */
    function ChatController(ChatsService, $mdSidenav, User, $timeout, $document, $mdMedia, $scope, logger)
    {

        var vm = this;

        // Data
        vm.contacts = [];
        GetContacts();
        //vm.contacts = ChatsService.contacts = Contacts.data;
        GetActiveChats();
        //vm.chats = ChatsService.chats;
        GetUserData();
        //vm.user = User.data;
        vm.leftSidenavView = false;
        vm.chat = undefined;

        // Methods
        vm.getChat = getChat;
        vm.toggleSidenav = toggleSidenav;
        vm.toggleLeftSidenavView = toggleLeftSidenavView;
        vm.reply = reply;
        vm.setUserStatus = setUserStatus;
        vm.clearMessages = clearMessages;


        var loggingTitle = "Chat"


        function GetContacts(){

          //set up a callback to get contacts whenever it is updated
          ChatsService.GetContacts(MonitorContacts);


        }

        function MonitorContacts(contacts){

          //update the vm
            $timeout(function() {
                $scope.$apply(function() {
                  vm.contacts = contacts;
                });
            }, 0);
        }

        function GetUserData(){

          ChatsService.GetUserData()
            .then(function(data){
              vm.user = data;
              //console.log(vm.user);
            })
            .catch(function(data){
              logger.error('Failed to get User Data', data, loggingTitle);
            })

        }

        function GetActiveChats(){

          ChatsService.GetActiveChats()
            .then(function(){
              vm.chats = ChatsService.chats;
              //monitor for any future changes
              //console.log('MONITORING CHATS');

              MonitorChats();

            })
            .catch(function(data){
              logger.error('Failed to get Active chats', data, loggingTitle);
            })

        }

        function cb_added(id, dialog)
        {
          //console.log("cb_added");//console.log(id); //console.log(dialog);
          $timeout(function() {
              $scope.$apply(function() {
                if(!vm.chats[id]) {
                  vm.chats[id] = dialog
                }
              });
            }, 0);
        }

        function cb_changed(id, dialog)
        {

          if(vm.chat && dialog.who === 'contact' && id===vm.chatContactId)
          {
            //console.log('received new message');
            vm.chat.push(dialog);
            //// Scroll to the new message
            scrollToBottomOfChat();
          }

          vm.contacts.getById(id).lastMessage = dialog;

        }

        function MonitorChats(){
          ChatsService.MonitorMessages(cb_added, cb_changed);

        }

        //////////

        vm.CreateTestChatData = function(){
          ChatsService.createTestChatData();
        }

        /**
         * Get Chat by Contact id
         * @param contactId
         */
        function getChat(contactId)
        {
          //console.log('in get chat');
          ChatsService.getContactChat(contactId)
              .then(function (response)
            {
                vm.chatContactId = contactId;
                vm.chat = response;

                // Reset the reply textarea
                resetReplyTextarea();

                // Scroll to the last message
                scrollToBottomOfChat();

                if ( !$mdMedia('gt-md') )
                {
                    $mdSidenav('left-sidenav').close();
                }

                // Reset Left Sidenav View
                vm.toggleLeftSidenavView(false);

            });
        }

        /**
         * Reply
         */
        function reply($event)
        {
            // If "shift + enter" pressed, grow the reply textarea
            if ( $event && $event.keyCode === 13 && $event.shiftKey )
            {
                vm.textareaGrow = true;
                return;
            }

            // Prevent the reply() for key presses rather than the"enter" key.
            if ( $event && $event.keyCode !== 13 )
            {
                return;
            }

            // Check for empty messages
            if ( vm.replyMessage === '' )
            {
                resetReplyTextarea();
                return;
            }

            // Message
            var message = {
                who    : 'user',
                message: vm.replyMessage,
                time   : new Date().toISOString()
            };



            // Add the message to the chat
            vm.chat.push(message);

            //add message to fb
            ChatsService.AddMessage(vm.chatContactId, message);

            // Update Contact's lastMessage
            vm.contacts.getById(vm.chatContactId).lastMessage = message;

            // Reset the reply textarea
            resetReplyTextarea();

            // Scroll to the new message
            scrollToBottomOfChat();

        }

        /**
         * Clear Chat Messages
         */
        function clearMessages()
        {
            vm.chats[vm.chatContactId] = vm.chat = [];
            vm.contacts.getById(vm.chatContactId).lastMessage = null;

            //clear from firebase
            ChatsService.ClearMessages(vm.chatContactId);

        }

        /**
         * Reset reply textarea
         */
        function resetReplyTextarea()
        {
            vm.replyMessage = '';
            vm.textareaGrow = false;
        }

        /**
         * Scroll Chat Content to the bottom
         * @param speed
         */
        function scrollToBottomOfChat()
        {
            $timeout(function ()
            {
                var chatContent = angular.element($document.find('#chat-content'));

                chatContent.animate({
                    scrollTop: chatContent[0].scrollHeight
                }, 400);
            }, 0);

        }

        /**
         * Set User Status
         */
        function setUserStatus(status)
        {
            logger.debug('Update status to:' + status, status, loggingTitle);
            vm.user.status = status;

            //update firebase as well
            ChatsService.SetUserStatus(status);

        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Toggle Left Sidenav View
         *
         * @param view id
         */
        function toggleLeftSidenavView(id)
        {
            vm.leftSidenavView = id;
        }

        /**
         * Array prototype
         *
         * Get by id
         *
         * @param value
         * @returns {T}
         */
        Array.prototype.getById = function (value)
        {
            return this.filter(function (x)
            {
                return x.id === value;
            })[0];
        };
    }
})();
