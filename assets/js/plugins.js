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

/*
*
* Custom Carousel taken from Bootstrap standard Carousel
*
*/
+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var CarouselCustom = function (element, options) {
    this.$element      = $(element)
    this.$elementWidth = this.$element.width()
    this.$scroll       = this.$element.find('.carousel-inner')
    this.$panels       = this.$scroll.find('ul')
    this.currentPosition = 0
    this.options       = options
    this.sliding       =
    this.$items        = null
  }

  CarouselCustom.DEFAULTS = {
    wrap: true
  }

  CarouselCustom.prototype.to = function (pos) {
    
  }

  CarouselCustom.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  CarouselCustom.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  CarouselCustom.prototype.slide = function (type, next) {
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this
    var offset       = this.$elementWidth - 200
    var targetOffset = 0
    var target = 0
    var maxScroll = this.$scroll[0].scrollWidth-this.$elementWidth;

    target = direction == 'right' ? this.currentPosition-offset : this.currentPosition+offset;
    
    if (direction == 'left') {
        targetOffset = target > maxScroll ? this.currentPosition == maxScroll ? 0 : maxScroll : target;
    } else {
        targetOffset = target < 0 ? this.currentPosition == 0 ? this.$scroll[0].scrollWidth-this.$elementWidth : 0 : target;
    }

    this.sliding = true;

    this.$scroll.animate({scrollLeft: targetOffset}, 630, function() {
        that.sliding = false;
    });

    this.currentPosition = targetOffset;

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  $.fn.carouselcustom = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carouselcustom')
      var options = $.extend({}, CarouselCustom.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carouselcustom', (data = new CarouselCustom(this, options)))
      if (action) data[action]()
    })
  }

  $.fn.carouselcustom.Constructor = CarouselCustom

  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carouselcustom.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')

    $target.carouselcustom(options)

    e.preventDefault()
  })

}(window.jQuery);