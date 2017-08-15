(function () {
  'use strict';

  angular
    .module('userStatusMessages.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('userStatusMessages', {
        abstract: true,
        url: '/userStatusMessages',
        template: '<ui-view/>'
      })
      .state('userStatusMessages.list', {
        url: '',
        templateUrl: 'modules/userStatusMessages/client/views/list-userStatusMessages.client.view.html',
        controller: 'UserStatusMessagesController',
      })
      .state('userStatusMessages.create', {
        url: '/create',
        templateUrl: 'modules/userStatusMessages/client/views/create-userStatusMessages.client.view.html',
        controller: 'UserStatusMessagesController',
      })
      .state('userStatusMessages.view', {
        url: '/:userStatusMessageId',
        templateUrl: 'modules/userStatusMessages/client/views/view-userStatusMessage.client.view.html',
        controller: 'UserStatusMessagesController',
      });

  }

  getUserStatusMessage.$inject = ['$stateParams', 'UserStatusMessagesService'];

  function getUserStatusMessage($stateParams, UserStatusMessagesService) {
    return UserStatusMessagesService.get({
      userStatusMessageId: $stateParams.userStatusMessageId
    }).$promise;
  }
}());
