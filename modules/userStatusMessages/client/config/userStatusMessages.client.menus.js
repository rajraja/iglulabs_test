(function () {
  'use strict';

  angular
    .module('userStatusMessages')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Status Messages',
      state: 'userStatusMessages',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'userStatusMessages', {
      title: 'List Status Messages',
      state: 'userStatusMessages.list',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'userStatusMessages', {
      title: 'Post Status Messages',
      state: 'userStatusMessages.create',
      roles: ['*']
    });
  }
}());
