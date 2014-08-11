var transition =  require('transition-auto');
var transitions = require('has-transitions')();
var Tip =         require('tip');

/**
 * Help message view
 * @param   {Object}        options
 * @param   {HTMLElement}   options.trigger     The trigger element
 * @param   {HTMLElement}   options.message     The message element
 * @constructor
 */
function HelpMessage(options) {
  this.triggerElement = options.trigger;
  this.messageElement = options.message;

  //bind to events
  this.triggerElement.addEventListener('click', this.onTrigger.bind(this));
  this.messageElement.addEventListener('transitionend', this.onTransitionEnd.bind(this));

  this.messageElement.style.height = '0';
  this.messageElement.style.marginTop = '0';
  this.messageElement.classList.remove('is-collapsed');

  this.tip = new Tip();
}

/**
 * Get whether the message is open
 * @returns   {Boolean}
 */
HelpMessage.prototype.isOpen = function() {
  return this.messageElement.style.marginTop === '';
};

/**
 * Open the help message
 * @returns   {HelpMessage}
 */
HelpMessage.prototype.open = function() {
  //show the tip and message elements
  this.messageElement.style.marginTop = '';
  transition(this.messageElement, 'height', 'auto');

  this.tip.show();
  this.tip.prependTo(this.messageElement);
  this.tip.positionAt(this.triggerElement, 'bottom');

  return this;
};

/**
 * Close the help message
 * @returns   {HelpMessage}
 */
HelpMessage.prototype.close = function() {

  //hide the tip and message elements
  transition(this.messageElement, 'height', '0');
  this.messageElement.style.marginTop = '0';

  this.tip.hide();

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
