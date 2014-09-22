var assert = require('assert');
var HelpMessage = require('help-message');
var Emitter = require('emitter');

describe('help-message', function() {

  var msg;
  var trigger;
  var message;

  beforeEach(function() {

    //create the message element
    trigger = document.createElement('div');
    trigger.innerHTML = 'ba ba ba';
    document.body.appendChild(trigger);

    //create the trigger element
    message = document.createElement('div');
    message.className = 'control-help-message is-closed';
    //document.body.className = 'csstransitions'; //test with transitions?
    message.innerHTML = 'La la la la';
    document.body.appendChild(message);

    //create the help message
    msg = new HelpMessage({
      trigger:  trigger,
      message:  message,
      page:     new Emitter()
    });

  });

  afterEach(function() {
    document.body.removeChild(trigger);
    document.body.removeChild(message);
  });

  it('should be closed on creation', function() {
    assert.equal('0px', message.style.height);
    assert(message.classList.contains('is-closed'));
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

  it('should close when the page is hidden', function(done) {

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

  it('should default target from trigger', function() {
    assert.equal(msg.trigger,msg.target);
  });

});