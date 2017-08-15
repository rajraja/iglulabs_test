(function () {
  'use strict';

  describe('UserStatusMessages Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserStatusMessagesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserStatusMessagesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserStatusMessagesService = _UserStatusMessagesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('userStatusMessages');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/userStatusMessages');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('userStatusMessages.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('modules/userStatusMessages/client/views/list-userStatusMessages.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UserStatusMessagesController,
          mockUserStatusMessage;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('userStatusMessages.view');
          $templateCache.put('modules/userStatusMessages/client/views/view-userStatusMessage.client.view.html', '');

          // create mock userStatusMessage
          mockUserStatusMessage = new UserStatusMessagesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An UserStatusMessage about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          UserStatusMessagesController = $controller('UserStatusMessagesController as vm', {
            $scope: $scope,
            userStatusMessageResolve: mockUserStatusMessage
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:userStatusMessageId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.userStatusMessageResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            userStatusMessageId: 1
          })).toEqual('/userStatusMessages/1');
        }));

        it('should attach an userStatusMessage to the controller scope', function () {
          expect($scope.vm.userStatusMessage._id).toBe(mockUserStatusMessage._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/userStatusMessages/client/views/view-userStatusMessage.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('userStatusMessages.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('userStatusMessages/');
          $rootScope.$digest();

          expect($location.path()).toBe('/userStatusMessages');
          expect($state.current.templateUrl).toBe('modules/userStatusMessages/client/views/list-userStatusMessages.client.view.html');
        }));
      });
    });
  });
}());
