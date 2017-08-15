(function () {
  'use strict';

  angular
    .module('userStatusMessages.services')
    .factory('UserStatusMessagesService', UserStatusMessagesService);

  UserStatusMessagesService.$inject = ['$resource'];

  function UserStatusMessagesService($resource) {
    var UserStatusMessage = $resource('api/userStatusMessages/:userStatusMessageId', {
      userStatusMessageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(UserStatusMessage.prototype, {
      createOrUpdate: function () {
        var userStatusMessage = this;
        return createOrUpdate(userStatusMessage);
      }
    });

    return UserStatusMessage;

    function createOrUpdate(userStatusMessage) {
      if (userStatusMessage._id) {
        return userStatusMessage.$update(onSuccess, onError);
      } else {
        return userStatusMessage.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(userStatusMessage) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      console.log(error);
    }
  }
}());
