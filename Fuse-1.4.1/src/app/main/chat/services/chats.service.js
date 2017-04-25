(function ()
{
    'use strict';

    angular
        .module('app.chat')
        .factory('ChatsService', ChatsService);

    /** @ngInject */
    function ChatsService($q, msApi, $firebaseObject, cfg, Auth, logger)
    {

        var service = {
            chats         : {},
            contacts      : [],
            GetContacts : GetContacts,
            GetActiveChats : GetActiveChats,
            GetUserData : GetUserData, //gets the data for the logged in user
            AddMessage : AddMessage, //adds the reply to both chats, in mine as user , in other as contact
            ClearMessages : ClearMessages, //clear your messages, will ot clear contacts messages
            SetUserStatus : SetUserStatus, //updates the status for the user
            MonitorMessages : MonitorMessages, //listen to child events and update vm.chat via callback
            getContactChat : getContactChat,
            createTestChatData : createTestChatData,
            callbackChildAdded : {}  //required to remove the callbacks in case of clear messages
        };

        var loggingTitle = 'Chat Service';
        var firebaseBaseChatUrl = cfg.firebaseChatUrl;
      //console.log(service.chats);

        function GetContacts(cb)
        {

          var firebaseDoctorsContacts = firebaseBaseChatUrl + "/" + "DoctorsContacts";
          var firebaseT0Ref = new Firebase(firebaseDoctorsContacts);
          //console.log(firebaseBaseChatUrl);
          firebaseT0Ref.on("value", function(snapshot) {
            //console.log(snapshot.val());
            var contacts = [];
            snapshot.forEach(function(childSnapshot) {
              // key will be "fred" the first time and "barney" the second time
              var key = childSnapshot.key();
              // childData will be the actual contents of the child
              var childData = childSnapshot.val();
              //take out the looged in user
              if(childData.id != Auth.GetUserID()) {
                contacts.push(childData);
              }
            });


            //also save last message if exists for each contact, this is used to display on active chats
            SetLastMessage(contacts)
              .then(function(data){
                service.contacts = contacts;
                //All done, send the contacts back to the caller.
                cb(contacts);
              })
              .catch(function(data){
                logger.error("Failed to set last message", data, loggingTitle)
              })

          }, function (errorObject) {
            logger.error("Failed to get contacts for chat", errorObject, loggingTitle);
          });

        }

        function GetUserData()
        {
          var deferred = $q.defer();

          var firebaseDoctorsContacts = firebaseBaseChatUrl + "/" + "DoctorsContacts";
          var firebaseUserContact = firebaseDoctorsContacts + "/" + Auth.GetUserID() + "_" + Auth.GetMXID();
          var firebaseT0Ref = new Firebase(firebaseUserContact);

          firebaseT0Ref.once("value", function(snapshot) {

            deferred.resolve(snapshot.val());

          }, function (errorObject) {
            deferred.reject(errorObject);
          });

          return deferred.promise;

        }

        function AddMessage(contactID, message){

          var firebaseUserChat = firebaseBaseChatUrl + "/" + "Chats" + "/" + Auth.GetUserID() + "_" + Auth.GetMXID()
              + "/" + contactID + "_" + service.contacts.getById(contactID).mxID;
          var firebaseContactChat = firebaseBaseChatUrl + "/" + "Chats" + "/" + contactID + "_" + service.contacts.getById(contactID).mxID
              + "/" +  Auth.GetUserID() + "_" + Auth.GetMXID();

          var chatUserRef = new Firebase(firebaseUserChat);
          var chatContactRef = new Firebase(firebaseContactChat);

          var userMessgae = message;
          var contactMessage = {
            who    : 'contact',
            message: message.message,
            time   : message.time
          };

          chatUserRef.push(userMessgae);
          chatContactRef.push(contactMessage);

          //console.log(service.chats);

        }

        function ClearMessages(contactID){

          var firebaseUserChat = firebaseBaseChatUrl + "/" + "Chats" + "/" + Auth.GetUserID() + "_" + Auth.GetMXID()
            + "/" + contactID + "_" + service.contacts.getById(contactID).mxID;
          var chatUserRef = new Firebase(firebaseUserChat);
          chatUserRef.remove();

          //clear from service.chats
          service.chats[contactID] = null;

          //stop monitoring for message chages.  Ths will again happen when the new message comes and again child is creted in fb

          chatUserRef.off('child_added', service.callbackChildAdded[contactID + "_" + service.contacts.getById(contactID).mxID]);


        }

        function MonitorNewMessages(contactID, cb_changed)
        {
          var firebaseUserChat = firebaseBaseChatUrl + "/" + "Chats" + "/" + Auth.GetUserID() + "_" + Auth.GetMXID()
            + "/" + contactID;
          var chatUserRef = new Firebase(firebaseUserChat);

          var cb_childAdded = chatUserRef.on('child_added', function(childSnapshot, prevChildKey) {
            var id = childSnapshot.ref().parent().key().split("_")[0];
            //console.log(id);
            if(childSnapshot.val().user === 'contact') {
              service.chats[id].push(childSnapshot.val());
            }
            // code to handle child data changes.
            cb_changed(id, childSnapshot.val());

          }, function (errorObject) {
            logger.error("Failed on child changed in monitor message", errorObject, loggingTitle);
          });

          service.callbackChildAdded[contactID] = cb_childAdded;
          //chatUserRef.off('child_added', cb_childAdded);
        }

        function MonitorMessages(cb_added, cb_changed)
        {

          //2 use cases - new chat started or message added to existing chats


          //Use cae - messages being added to existing chat.
          //get contact id for each existing chat and set monitoring on that
          Object.keys(service.chats).forEach(function(key) {
            var contactID = service.contacts.getById(key).id + "_" + service.contacts.getById(key).mxID;
            //console.log(contactID);

            MonitorNewMessages(contactID, cb_changed);

          });

          //set up monitoring on current user.  if a new child added add thta to monitopring like above
          //send back cb_added event so vm.chats can be updated in UI
          var firebaseUserNewChat = firebaseBaseChatUrl + "/" + "Chats" + "/" + Auth.GetUserID() + "_" + Auth.GetMXID()
          var chatUserNewRef = new Firebase(firebaseUserNewChat);


          chatUserNewRef.on('child_added', function(childSnapshot, prevChildKey) {
            // code to handle new child.
            //console.log('child added');
            //console.log(service.chats);
            //console.log(childSnapshot.key());
            //console.log(childSnapshot.val());
            var fullIDwithMX = childSnapshot.key();
            var id = childSnapshot.key().split("_")[0];
            var dialog = [];
            childSnapshot.forEach(function(childSnapshot) {
              dialog.push(childSnapshot.val());
            });

            //console.log(service.chats);
            if(!service.chats[id] || service.chats[id].length===0 || (service.chats[id].length===1 && service.chats[id][0].who==='user') ) {
              logger.debug('child added', dialog, loggingTitle);
              service.chats[id] = dialog;
              //set last message
              if(dialog.length > 0)
                service.contacts.getById(id).lastMessage = dialog[dialog.length-1];

              //set up monitoring for future messages
              MonitorNewMessages(fullIDwithMX, cb_changed);

              cb_added(id, dialog);
              //console.log(service.chats[id]);
            }
            else{
              //console.log('child added bu service.chat xists for this contact');
              //console.log(service.chats[id]);
            }
          }, function (errorObject) {
            logger.error("Failed on child added in monitor message", errorObject, loggingTitle);
          });



        }

        function SetUserStatus(status){

          var userURL = firebaseBaseChatUrl + "/" + "DoctorsContacts"+ "/" + Auth.GetUserID() + "_" + Auth.GetMXID();
          var firebaseUserRef = new Firebase(userURL);
          //console.log(userURL);
          //console.log(firebaseUserRef);

          firebaseUserRef.update({
            status: status,
          })

        }


        function SetLastMessage(contacts){
          var deferred = $q.defer();

          GetActiveChatsFromFirebase()
            .then(function(data){
              //mark last message for each contact to be able to display in chats
              Object.keys(data).forEach(function(key) {
                var contactID = key;
                var messages = data[key];

                if ( contacts.getById(contactID) && messages.length > 0)
                {
                  contacts.getById(contactID).lastMessage = messages[messages.length-1];
                }
              });

              deferred.resolve(contacts);
            })
            .catch(function(data){
              deferred.reject(data);
            })

          return deferred.promise;

        }


        function GetActiveChats()
        {

          // Create a new deferred object
          var deferred = $q.defer();

          //if no chat on firebase, create a new chat
          var getChatFromFirebase = GetActiveChatsFromFirebase()
            .then(function(data){
              //console.log(data);
              //now populate service.chats
              service.chats = data;
              deferred.resolve();
              //mark last message for each contact to be able to display in chats
            })
            .catch(function(data){
              deffered.reject(data);
            })

          return deferred.promise;

        }

        function createTestChatData()
        {
          var firebaseChat = firebaseBaseChatUrl + "/" + "Chats" + "/" + Auth.GetUserID() + "_" + Auth.GetMXID()
                    + "/" + "57c2b3d894ba89601c153f70_MX31DOC" ;
          var chatRef = new Firebase(firebaseChat);

          chatRef.push( {
              "who": "contact",
              "message": "bleh b bleh",
              "time": (new Date()).toISOString()
            }
           );
          //chatRef.push( {
          //    "who": "user",
          //    "message": "I’m having breakfast right now, can’t you wait for 10 minutes?",
          //    "time": "2016-08-18T12:30:18.931Z"
          //  }
          //);


        }

        function GetActiveChatsFromFirebase(){

          // Create a new deferred object
          var deferred = $q.defer();
          var chat = {};

          var firebaseChat = firebaseBaseChatUrl + "/" + "Chats" + "/" + Auth.GetUserID() + "_" + Auth.GetMXID();
          var firebaseT0Ref = new Firebase(firebaseChat);

          firebaseT0Ref.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var dialog = [];
              var key = childSnapshot.key();
              childSnapshot.forEach(function(childSnapshot) {
                dialog.push(childSnapshot.val());
              });
              //save key without mxid
              var userID = key.split("_")[0];
              chat[userID] = dialog;
            });
            deferred.resolve(chat);
          }, function (errorObject) {
            logger.error("Failed to get active chats for: " + Auth.GetMXID(), errorObject, loggingTitle);
            deferred.reject(errorObject);
          });

          return deferred.promise;

        }

        /**
         * Get contact chat from the server
         *
         * @param contactId
         * @returns {*}
         */
        function getContactChat(contactId)
        {

          var deferred = $q.defer();

            // If contact doesn't have lastMessage, create a new chat
            if ( !service.contacts.getById(contactId).lastMessage)
            {
                service.chats[contactId] = [];

                deferred.resolve(service.chats[contactId]);
            }


            // If the chat exist in the service data, do not request
            if ( service.chats[contactId] )
            {
                deferred.resolve(service.chats[contactId]);

                return deferred.promise;
            }

            //// Request the chat with the contactId
            //msApi.request('chat.chats@get', {id: contactId},
            //
            //    // SUCCESS
            //    function (response)
            //    {
            //        // Attach the chats
            //        service.chats[contactId] = response.data;
            //
            //        // Resolve the promise
            //        deferred.resolve(service.chats[contactId]);
            //    },
            //
            //    // ERROR
            //    function (response)
            //    {
            //        deferred.reject(response);
            //    }
            //);

            return deferred.promise;
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
        return service;
    }
})();
