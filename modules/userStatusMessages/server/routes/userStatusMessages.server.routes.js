'use strict';

/**
 * Module dependencies
 */
var userStatusMessagesPolicy = require('../policies/userStatusMessages.server.policy'),
  userStatusMessages = require('../controllers/userStatusMessages.server.controller');

module.exports = function (app) {
  // UserStatusMessages collection routes
  app.route('/api/userStatusMessages').all(userStatusMessagesPolicy.isAllowed)
    .get(userStatusMessages.list)
    .post(userStatusMessages.create);

  // Single userStatusMessage routes
  app.route('/api/userStatusMessages/:userStatusMessageId').all(userStatusMessagesPolicy.isAllowed)
    .get(userStatusMessages.read)
    .put(userStatusMessages.update)
    .delete(userStatusMessages.delete);

  // Finish by binding the userStatusMessage middleware
  app.param('userStatusMessageId', userStatusMessages.userStatusMessageByID);
};
