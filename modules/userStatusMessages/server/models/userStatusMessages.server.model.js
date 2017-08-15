'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * UserStatusMessage Schema
 */
var UserStatusMessageSchema = new Schema({
  message: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('UserStatusMessage', UserStatusMessageSchema);
