(function (app) {
  'use strict';

  app.registerModule('userStatusMessages', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('userStatusMessages.admin', ['core.admin']);
  app.registerModule('userStatusMessages.admin.routes', ['core.admin.routes']);
  app.registerModule('userStatusMessages.services');
  app.registerModule('userStatusMessages.routes', ['ui.router', 'core.routes', 'userStatusMessages.services']);
}(ApplicationConfiguration));
