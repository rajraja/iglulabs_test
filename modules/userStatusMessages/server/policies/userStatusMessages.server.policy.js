'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke UserStatusMessages Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/userStatusMessages',
      permissions: '*'
    }, {
      resources: '/api/userStatusMessages/:userStatusMessageId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/userStatusMessages',
      permissions: ['*']
    }, {
      resources: '/api/userStatusMessages/:userStatusMessageId',
      permissions: ['*']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/userStatusMessages',
      permissions: ['get']
    }, {
      resources: '/api/userStatusMessages/:userStatusMessageId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If UserStatusMessages Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  if(!req.user) {
    return res.status(403).json({
      message: 'You are not logged in'
    });
  }
  else{
    var roles = (req.user) ? req.user.roles : ['guest'];
    // If an userStatusMessage is being processed and the current user created it then allow any manipulation
    if (req.userStatusMessage && req.user && req.userStatusMessage.user && req.userStatusMessage.user.id === req.user.id) {
      return next();
    }

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
      if (err) {
        // An authorization error occurred
        return res.status(500).send('Unexpected authorization error');
      } else {
        if (isAllowed) {
          // Access granted! Invoke next middleware
          return next();
        } else {
          return res.status(403).json({
            message: 'User is not authorized'
          });
        }
      }
    });
  }

};
