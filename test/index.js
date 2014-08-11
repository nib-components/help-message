var assert = require('assert');
var HelpMessage = require('help-message');
var Emitter = require('emitter');

describe('help-message', function() {

  var msg;
  var trigger;
  var message;

  beforeEach(function() {
    msg = new HelpMessage({
      trigger: trigger = document.createElement('div'),
      message: message = document.createElement('div'),
      page: new Emitter()
    });
    trigger.innerHTML = 'ba ba ba';
    message.innerHTML = 'La la la la';
    document.body.appendChild(trigger);
    document.body.appendChild(message);
  });

  afterEach(function() {
    document.body.removeChild(trigger);
    document.body.removeChild(message);
  });

  it('should be collapsed on creation', function() {
    assert.equal('0px', message.style.height);
    assert(!message.classList.contains('is-collapsed'));
    assert(!msg.isOpen());
  });

  it('should open when triggered', function(done) {
    msg.on('opened', function() {
      assert.notEqual('0px', message.style.height);
      assert(msg.isOpen());
      assert.equal('tip tip--direction-up tip--position-bottom', message.firstChild.className);
      done();
    });

    msg.open();
    
  });

  it('should close when triggered', function(done) {
    msg.on('opened', function() {
      msg.close();
    });
    msg.on('closed', function() {
      assert(!msg.isOpen());
      assert.equal(message.style.height, '0px');
      assert.equal(message.firstChild.className, 'tip tip--direction-up tip--position-bottom tip--hidden');
      done();
    });

    msg.open();

  });

  it('should collapse when the page is hidden', function(done) {

    msg.on('opened', function() {

      msg.on('closed', function() {
        assert(!msg.isOpen());
        assert.equal(message.style.height, '0px');
        assert.equal(message.firstChild.className, 'tip tip--direction-up tip--position-bottom tip--hidden');
        done();
      });

      msg.page.emit('hidden');

    });

    msg.open();

  });
});