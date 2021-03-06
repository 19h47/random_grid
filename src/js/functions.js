var $ = require('jquery');

var functions = {
    /**
     * Get right transitionend event name regarding browser support.
     * From Modernizr.
     */
    whichTransitionEvent: function() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }
};

module.exports = functions;