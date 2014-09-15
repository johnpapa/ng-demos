/* global browser, element, expect, by */
// describe('angularjs homepage todo list', function() {
//     it('should add a todo', function() {
//         browser.get('http://www.angularjs.org');

//         element(by.model('todoText')).sendKeys('write a protractor test');
//         element(by.css('[value="add"]')).click();

//         var todoList = element.all(by.repeater('todo in todos'));
//         expect(todoList.count()).toEqual(3);
//         expect(todoList.get(2).getText()).toEqual('write a protractor test');
//     });
// });

// Mocha setup ... not quite ready, using Jasmine for now
// var chai = require('chai');
// var chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);
// var expect = chai.expect;

/**
 * Setting up protractor and selenium
 * 	npm install -g protractor
 * 	webdriver-manager update
 *
 * Starting webdriver
 * 	webdriver-manager start
 * 
 * Starting the tests
 *  protractor src/client/test/e2e/conf.js
 *
 * Mocha Instructions
 *  npm install -g mocha
 *  npm install chai
 *  npm install chai-as-promised  
 *  set the `framework` property to `mocha` in the conf.js file
 *  
 * You will need to require and set up Chai inside your test files:
 *  var chai = require('chai');
 *  var chaiAsPromised = require('chai-as-promised');
 *  chai.use(chaiAsPromised);
 *  var expect = chai.expect;
 *  
 * You can then use Chai As Promised as such:
 *  expect(myElement.getText()).to.eventually.equal('some text');
 */
describe('modular app', function() {
    it('should find avengers', function() {
        browser.get('http://localhost:7200/#/avengers');
        var list = element.all(by.repeater('c in vm.avengers'));

        expect(list.count()).toEqual(7);

        element(by.model('vm.filter.name')).sendKeys('iron');

// Mocha
//        expect(element(by.model('vm.filter.name')).getText()).to.eventually.equal('Iron Man/Tony Stark');

        expect(element(by.binding('c.name')).getText()).toEqual('Iron Man/Tony Stark');

// Mocha
//        expect(list.count()).to.eventually.equal(1);

        expect(list.count()).toEqual(1);

        expect(list.get(0).getText()).toContain('Iron Man/Tony Stark');
    });
});