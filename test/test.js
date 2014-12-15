var assert = require("assert")
  , consistent = require("../index.js")
  , crypto = require('crypto');

describe('consistent', function () {
  it('should create a member', function () {
    var c = consistent({
      members: ['test1', 'test2']
    });

    assert.ok(c);
    assert.ok(c.members['test1']);
    assert.ok(c.members['test2']);
  });

  it('should add new member', function() {
    var c = consistent();
    c.add('test');
    assert.ok(c.members['test']);
  });

  it('should remove member', function() {
    var c = consistent();
    c.add('test');
    c.remove('test');
    assert.ok(!c.members['test']);
  });

  it('should get hash keys', function() {
    var c = consistent({ members: ['test1', 'test2'] });
    assert.ok(c.get('testkey'));
  });

  it('should switch member', function() {
    var c = consistent({ members: ['test1', 'test2'] });
    var key = c.get('testkey');
    c.replace(key, 'test3')
    assert.equal(c.get('testkey'), 'test3');
  });

  it('should distribute keys if member removed', function (done) {
    var members = ['test1', 'test2', 'test3'];
    var c = consistent({ members: members });
    var keys = [];

    for(var i = 0; i < 10; i++) {
      var x = crypto.randomBytes(10000000).toString('hex');
      assert.ok(members.indexOf(c.get(x)) > -1);
      keys.push(x);
    }

    c.remove('test3');
    members.pop();

    keys.forEach(function (i) {
      assert.ok(members.indexOf(c.get(i)) > -1);
    });

    c.remove('test2');
    members.pop();

    keys.forEach(function (i) {
      assert.ok(members.indexOf(c.get(i)) > -1);
    });

    done();

  });

  it('should distribute keys if member added', function (done) {
    var members = ['test1', 'test2', 'test3'];
    var c = consistent({ members: members });
    var keys = [];

    for(var i = 0; i < 10; i++) {
      var x = crypto.randomBytes(4).toString('hex');
      assert.ok(members.indexOf(c.get(x)) > -1);
      keys.push(x);
    }

    c.add('test4');
    members.push('test4');

    keys.forEach(function (i) {
      assert.ok(members.indexOf(c.get(i)) > -1);
    });

    c.add('test5');
    members.push('test5');

    keys.forEach(function (i) {
      assert.ok(members.indexOf(c.get(i)) > -1);
    });

    done();

  })
});
