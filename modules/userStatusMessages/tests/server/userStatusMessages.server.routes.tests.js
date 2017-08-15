'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserStatusMessage = mongoose.model('UserStatusMessage'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  userStatusMessage;

/**
 * UserStatusMessage routes tests
 */
describe('UserStatusMessage CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new userStatusMessage
    user.save(function () {
      userStatusMessage = {
        title: 'UserStatusMessage Title',
        content: 'UserStatusMessage Content'
      };

      done();
    });
  });

  it('should not be able to save an userStatusMessage if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/userStatusMessages')
          .send(userStatusMessage)
          .expect(403)
          .end(function (userStatusMessageSaveErr, userStatusMessageSaveRes) {
            // Call the assertion callback
            done(userStatusMessageSaveErr);
          });

      });
  });

  it('should not be able to save an userStatusMessage if not logged in', function (done) {
    agent.post('/api/userStatusMessages')
      .send(userStatusMessage)
      .expect(403)
      .end(function (userStatusMessageSaveErr, userStatusMessageSaveRes) {
        // Call the assertion callback
        done(userStatusMessageSaveErr);
      });
  });

  it('should not be able to update an userStatusMessage if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/userStatusMessages')
          .send(userStatusMessage)
          .expect(403)
          .end(function (userStatusMessageSaveErr, userStatusMessageSaveRes) {
            // Call the assertion callback
            done(userStatusMessageSaveErr);
          });
      });
  });

  it('should be able to get a list of userStatusMessages if not signed in', function (done) {
    // Create new userStatusMessage model instance
    var userStatusMessageObj = new UserStatusMessage(userStatusMessage);

    // Save the userStatusMessage
    userStatusMessageObj.save(function () {
      // Request userStatusMessages
      request(app).get('/api/userStatusMessages')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single userStatusMessage if not signed in', function (done) {
    // Create new userStatusMessage model instance
    var userStatusMessageObj = new UserStatusMessage(userStatusMessage);

    // Save the userStatusMessage
    userStatusMessageObj.save(function () {
      request(app).get('/api/userStatusMessages/' + userStatusMessageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', userStatusMessage.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single userStatusMessage with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userStatusMessages/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'UserStatusMessage is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single userStatusMessage which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent userStatusMessage
    request(app).get('/api/userStatusMessages/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No userStatusMessage with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an userStatusMessage if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/userStatusMessages')
          .send(userStatusMessage)
          .expect(403)
          .end(function (userStatusMessageSaveErr, userStatusMessageSaveRes) {
            // Call the assertion callback
            done(userStatusMessageSaveErr);
          });
      });
  });

  it('should not be able to delete an userStatusMessage if not signed in', function (done) {
    // Set userStatusMessage user
    userStatusMessage.user = user;

    // Create new userStatusMessage model instance
    var userStatusMessageObj = new UserStatusMessage(userStatusMessage);

    // Save the userStatusMessage
    userStatusMessageObj.save(function () {
      // Try deleting userStatusMessage
      request(app).delete('/api/userStatusMessages/' + userStatusMessageObj._id)
        .expect(403)
        .end(function (userStatusMessageDeleteErr, userStatusMessageDeleteRes) {
          // Set message assertion
          (userStatusMessageDeleteRes.body.message).should.match('User is not authorized');

          // Handle userStatusMessage error error
          done(userStatusMessageDeleteErr);
        });

    });
  });

  it('should be able to get a single userStatusMessage that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new userStatusMessage
          agent.post('/api/userStatusMessages')
            .send(userStatusMessage)
            .expect(200)
            .end(function (userStatusMessageSaveErr, userStatusMessageSaveRes) {
              // Handle userStatusMessage save error
              if (userStatusMessageSaveErr) {
                return done(userStatusMessageSaveErr);
              }

              // Set assertions on new userStatusMessage
              (userStatusMessageSaveRes.body.title).should.equal(userStatusMessage.title);
              should.exist(userStatusMessageSaveRes.body.user);
              should.equal(userStatusMessageSaveRes.body.user._id, orphanId);

              // force the userStatusMessage to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the userStatusMessage
                    agent.get('/api/userStatusMessages/' + userStatusMessageSaveRes.body._id)
                      .expect(200)
                      .end(function (userStatusMessageInfoErr, userStatusMessageInfoRes) {
                        // Handle userStatusMessage error
                        if (userStatusMessageInfoErr) {
                          return done(userStatusMessageInfoErr);
                        }

                        // Set assertions
                        (userStatusMessageInfoRes.body._id).should.equal(userStatusMessageSaveRes.body._id);
                        (userStatusMessageInfoRes.body.title).should.equal(userStatusMessage.title);
                        should.equal(userStatusMessageInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single userStatusMessage if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new userStatusMessage model instance
    var userStatusMessageObj = new UserStatusMessage(userStatusMessage);

    // Save the userStatusMessage
    userStatusMessageObj.save(function () {
      request(app).get('/api/userStatusMessages/' + userStatusMessageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', userStatusMessage.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single userStatusMessage, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'userStatusMessageowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the UserStatusMessage
    var _userStatusMessageOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _userStatusMessageOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the UserStatusMessage
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new userStatusMessage
          agent.post('/api/userStatusMessages')
            .send(userStatusMessage)
            .expect(200)
            .end(function (userStatusMessageSaveErr, userStatusMessageSaveRes) {
              // Handle userStatusMessage save error
              if (userStatusMessageSaveErr) {
                return done(userStatusMessageSaveErr);
              }

              // Set assertions on new userStatusMessage
              (userStatusMessageSaveRes.body.title).should.equal(userStatusMessage.title);
              should.exist(userStatusMessageSaveRes.body.user);
              should.equal(userStatusMessageSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the userStatusMessage
                  agent.get('/api/userStatusMessages/' + userStatusMessageSaveRes.body._id)
                    .expect(200)
                    .end(function (userStatusMessageInfoErr, userStatusMessageInfoRes) {
                      // Handle userStatusMessage error
                      if (userStatusMessageInfoErr) {
                        return done(userStatusMessageInfoErr);
                      }

                      // Set assertions
                      (userStatusMessageInfoRes.body._id).should.equal(userStatusMessageSaveRes.body._id);
                      (userStatusMessageInfoRes.body.title).should.equal(userStatusMessage.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (userStatusMessageInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      UserStatusMessage.remove().exec(done);
    });
  });
});
