'use strict';

describe('UserStatusMessages E2E Tests:', function () {
  describe('Test userStatusMessages page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/userStatusMessages');
      expect(element.all(by.repeater('userStatusMessage in userStatusMessages')).count()).toEqual(0);
    });
  });
});
