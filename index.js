var transition =  require('transition-auto');
var transitions = require('has-transitions')();
var Tip =         require('tip');
var emitter     = require('emitter');

/**
 * Help message view
 * @param   {Object}        options
 * @param   {HTMLElement}   options.trigger     The trigger element
 * @param   {HTMLElement}   options.message     The message element
 * @constructor
 */
function HelpMessage(options) {
  this.opening  = false;
  this.opened   = false;

  this.trigger  = options.trigger;
  this.message  = options.message;
  this.page     = options.page;

  this.message.style.height = '0';

  this.tip = new Tip();
  this.tip
    .prependTo(this.message)
    .positionAt(this.trigger, 'bottom')
  ;

  //bind to events
  this.trigger.addEventListener('click', this.onTrigger.bind(this));

  //TODO: adds a dependency on the page - maybe remove?
  //hide the message when the page is hidden
  if (this.page) {
    var self = this;
    this.page.on('hidden', function() {
      self.close();
    });
  }

}
emitter(HelpMessage.prototype);

/**
 * Get whether the message is open
 * @returns   {Boolean}
 */
HelpMessage.prototype.isOpen = function() {
  return this.opened;
};

/**
 * Open the help message
 * @returns   {HelpMessage}
 */
HelpMessage.prototype.open = function() {
  var self = this;

  if (this.opening || this.opened) {
    return this;
  }

  //show the tip and message elements
  self.opening = true;
  this.tip
    .reposition()
    .show()
  ;
  self.message.classList.remove('is-closed');
  transition(this.message, 'height', 'auto', function() {
    self.opened = true;
    self.opening = false;
    self.transitioning = null;
    self.message.classList.add('is-opened');
    self.emit('opened');
  });

  return this;
};

/**
 * Close the help message
 * @returns   {HelpMessage}
 */
HelpMessage.prototype.close = function() {
  var self = this;

  if (!this.opened && !this.opening) {
    return this;
  }

  //hide the tip and message elements
  this.tip.hide();
  self.message.classList.remove('is-opened');
  transition(this.message, 'height', '0', function() {
    self.opened = false;
    self.transitioning = null;
    self.message.classList.add('is-closed');
    self.emit('closed');
  });

  return this;
};

/**
 * Toggles the help message when the help trigger is clicked
 * @private
 */
HelpMessage.prototype.onTrigger = function(event) {
  event.preventDefault();

  //don't toggle the message if we support transitions and we're in the middle of one now
  if (this.transitioning) {
    return;
  }
  this.transitioning = transitions;

  //show/hide the tip and message elements
  if (this.isOpen()) {
    this.close();
  } else {
    this.open();
  }

};

module.exports = HelpMessage;
