'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserStatusMessage = mongoose.model('UserStatusMessage'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an userStatusMessage
 */
exports.create = function (req, res) {
  var userStatusMessage = new UserStatusMessage(req.body);
  userStatusMessage.user = req.user._id;

  userStatusMessage.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userStatusMessage);
    }
  });
};

/**
 * Show the current userStatusMessage
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var userStatusMessage = req.userStatusMessage ? req.userStatusMessage.toJSON() : {};

  // Add a custom field to the UserStatusMessage, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the UserStatusMessage model.
  userStatusMessage.isCurrentUserOwner = !!(req.user && userStatusMessage.user && userStatusMessage.user._id.toString() === req.user._id.toString());

  res.json(userStatusMessage);
};

/**
 * Update an userStatusMessage
 */
exports.update = function (req, res) {
  var userStatusMessage = req.userStatusMessage;
  userStatusMessage.message =req.body.message;
  userStatusMessage.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userStatusMessage);
    }
  });
};

/**
 * Delete an userStatusMessage
 */
exports.delete = function (req, res) {
  var userStatusMessage = req.userStatusMessage;

  userStatusMessage.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userStatusMessage);
    }
  });
};

/**
 * List of UserStatusMessages
 */
exports.list = function (req, res) {
  var status = req.query.status;
  var limit = 0;
  if(status === 'current'){
    limit = 1;
  }
  if(status === 'last_10'){
    limit = 10;
  }
  UserStatusMessage.find({'user':req.user._id})
  .sort('-created')
  .populate('user', 'displayName')
  .limit(limit)
  .exec(function (err, userStatusMessages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(userStatusMessages);
    }
  });
};

/**
 * UserStatusMessage middleware
 */
exports.userStatusMessageByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'UserStatusMessage is invalid'
    });
  }

  UserStatusMessage.findById(id).populate('user', 'displayName').exec(function (err, userStatusMessage) {
    if (err) {
      return next(err);
    } else if (!userStatusMessage) {
      return res.status(404).send({
        message: 'No userStatusMessage with that identifier has been found'
      });
    }
    req.userStatusMessage = userStatusMessage;
    next();
  });
};
