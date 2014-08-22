help-message
============

Display useful information alongside your controls (with a tooltip)

         <i/>
    ------/\------
    | La la la   |
    --------------
    
Usage
=====

HTML

    <i>?</i>
    <p>OMG OMG OMG help message</p>
    
JavaScript

    var helpMessage = HelpMessage({
        trigger: document.querySelector('i'),
        message: document.querySelector('p')
    });
    
    helpMessage.open();
    helpMessage.close();