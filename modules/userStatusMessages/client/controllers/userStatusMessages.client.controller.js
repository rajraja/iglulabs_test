
  'use strict';

  angular.module('userStatusMessages').controller('UserStatusMessagesController',
    ['$scope','UserStatusMessagesService', 'Authentication','$location', '$stateParams', function($scope, UserStatusMessagesService, Authentication, $location, $stateParams) {
      // load messages.
      $scope.loadUserStatusMessages = function(status){
        UserStatusMessagesService.query({'status':status}, function(response){
          $scope.userStatusMessages = response;
        },function(errorMessage){
          $scope.errorMessage = errorMessage.data.message;
        });
      };
      $scope.findOne = function(){
        UserStatusMessagesService.get({
          userStatusMessageId:$stateParams.userStatusMessageId,
        }, function(response){
          $scope.userStatusMessage = response;
        },function(errorMessage){
          $scope.errorMessage = errorMessage.data.message;
        });
      };
      $scope.postMessage = function(){
        var statusMessage = new UserStatusMessagesService({
          'message': $scope.message
        });
        statusMessage.$save({}, function(response){
          $location.path('/userStatusMessages');
        },function(errorMessage){
          $scope.errorMessage = errorMessage.data.message;
        });
      }

      $scope.updateMessage = function(){
        var statusMessage = $scope.userStatusMessage;
        statusMessage.$update({}, function(response){
          $location.path('/userStatusMessages');
        },function(errorMessage){
          $scope.errorMessage = errorMessage.data.message;
        });
      }


  }
]);
