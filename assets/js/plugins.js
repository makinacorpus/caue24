// TransitionEnd polyfill
var transEndEventNames = {
    'WebkitTransition' : 'webkitTransitionEnd',
    'MozTransition'    : 'transitionend',
    'OTransition'      : 'oTransitionEnd',
    'msTransition'     : 'MSTransitionEnd',
    'transition'       : 'transitionend'
},
transitionEnd = transEndEventNames[ Modernizr.prefixed('transition') ];

// AnimationEnd polyfill
var animEndEventNames = {
    'WebkitAnimation' : 'webkitAnimationEnd',
    'MozAnimation'    : 'animationend',
    'OAnimation'      : 'oAnimationEnd',
    'msAnimation'     : 'MSAnimationEnd',
    'animation'       : 'animationend'
},
animationEnd = animEndEventNames[ Modernizr.prefixed('animation') ];