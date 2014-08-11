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
  this.opened = false;

  this.triggerElement = options.trigger;
  this.messageElement = options.message;

  this.messageElement.style.height = '0';
  this.messageElement.style.marginTop = '0';
  this.messageElement.classList.remove('is-collapsed');

  this.tip = new Tip();

  //bind to events
  this.triggerElement.addEventListener('click', this.onTrigger.bind(this));
  this.messageElement.addEventListener('transitionend', this.onTransitionEnd.bind(this));

  //hide the message when the page is hidden
  this.page = options.page;
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

  //show the tip and message elements
  this.tip.show();

  this.tip.prependTo(this.messageElement);
  this.tip.positionAt(this.triggerElement, 'bottom');

  this.messageElement.style.marginTop = '';
  transition(this.messageElement, 'height', 'auto', function() {
    self.opened = true;
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

  //hide the tip and message elements
  this.tip.hide();
  this.messageElement.style.marginTop = '0';
  transition(this.messageElement, 'height', '0', function() {
    self.opened = false;
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

/**
 * Transition end
 * @private
 */
HelpMessage.prototype.onTransitionEnd = function() {
  this.transitioning = null;
};

module.exports = HelpMessage;
