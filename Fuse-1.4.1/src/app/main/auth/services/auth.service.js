(function ()
{
    'use strict';

    angular
        .module('app.auth')
        .factory('Auth', Auth);

    /** @ngInject */
    function Auth($q, logger, $http, cfg, $location, LocalStorage) {
      var service = {
        Register: Register,
        Login: Login,
        GetLoggedInStatus: GetLoggedInStatus,
        Logout: Logout,
        GetUser : GetUser,
        GetUserID : GetUserID,
        GetMXID : GetMXID,
        GetUserFromToken : GetUserFromToken,
        Me : Me
      };

      return service;

      var loggedInUser = {};
      var isUserLoggedIn = false;
      var currentUser = getUserFromToken();


      function Register(data) {
        //logger.error('apiResolver.resolve requires correct action parameter (ResourceName@methodName)');
        //return false;
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post(cfg.NODE_SERVER + '/api/registerDoctor', data)
          // handle success
          .success(function (data, status) {
            if(status === 200){
              deferred.resolve(data.message);
            } else {
              logger.debug('Error in registration service:0', data, 'Register Service Error:0');
              deferred.reject(data.message);
            }
          })
          // handle error
          .error(function (data) {
            logger.debug('Error in registration service:1', data, 'Register Service Error:1');
            deferred.reject(data.message);
          });
        // return promise object
        return deferred.promise;

      }

      function Login(data) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post(cfg.NODE_SERVER + '/api/loginDoctor ', data)
          // handle success
          .success(function (data, status) {
            if(status === 200){
              LocalStorage.SetToken(data.token);
              deferred.resolve(data.message);
            } else {
              logger.debug('Error in login service:0', data, 'Login Service Error:0');
              deferred.reject(data.message);
            }
          })
          // handle error
          .error(function (data) {
            logger.debug('Error in login service:1', data, 'Login Service Error:1');
            deferred.reject(data.message);
          });
        // return promise object
        return deferred.promise;

      }

      function Me(data) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.get(cfg.NODE_SERVER + '/me ')
          // handle success
          .success(function (data, status) {
            if(status === 200){
              deferred.resolve(data.message);
            } else {
              logger.debug('Error in me service:0', data, 'Me Service Error:0');
              deferred.reject(data.message);
            }
          })
          // handle error
          .error(function (data) {
            logger.debug('Error in me service:1', data, 'me Service Error:1');
            deferred.reject(data.message);
          });
        // return promise object
        return deferred.promise;

      }

      function GetLoggedInStatus(){

        var user = GetUserFromToken();

        return user == null ? false : true;
      }

      function GetUser(){
        var user = GetUserFromToken();

        if(user){
          return user._doc.userType;
        }

        return null;
      }

      function GetUserID(){
        var user = GetUserFromToken();

        if(user){
          return user._doc.userType.id;
        }

        return null;
      }

      function GetMXID(){
        var user = GetUserFromToken();

        if(user){
          return user._doc.userType.mxID;
        }

        return null;
      }

      function Logout() {
        ChangeUser({});
        LocalStorage.DeleteToken();
      }

      function ChangeUser(user) {
         currentUser = {};
      }

      function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
          case 0:
            break;
          case 2:
            output += '==';
            break;
          case 3:
            output += '=';
            break;
          default:
            throw 'Illegal base64url string!';
        }
        return window.atob(output);
      }

      function GetUserFromToken() {
        var token = LocalStorage.GetToken();
        var user = null;
        if (typeof token !== 'undefined') {
          var encoded = token.split('.')[1];
          user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
      }

    }

})();
