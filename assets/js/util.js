(function ($) {

	$.fn.navList = function () {

		var $this = $(this);
		$a = $this.find('a'),
			b = [];

		$a.each(function () {

			var $this = $(this), indent = Math.max(0, $this.parents('li').length - 1), href = $this.attr('href'), target = $this.attr('target');

			b.push('<a ' + 'class="link depth-' + indent + '"' + ((typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
				((typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') + '>' + '<span class="indent-' + indent + '"></span>' +
				$this.text() + '</a>');

		});

		return b.join('');

	};


	$.fn.panel = function (userConfig) {

		if (this.length == 0)
			return $this;

		if (this.length > 1) {

			for (var i = 0; i < this.length; i++)
				$(this[i]).panel(userConfig);

			return $this;

		}

		var $this = $(this), $body = $('body'), $window = $(window), id = $this.attr('id'), config;

		config = $.extend({

			// Delay.
			delay: 0,

			// Hide panel on link click.
			hideOnClick: false,

			// Hide panel on escape keypress.
			hideOnEscape: false,

			// Hide panel on swipe.
			hideOnSwipe: false,

			// Reset scroll position on hide.
			resetScroll: false,

			// Reset forms on hide.
			resetForms: false,

			// Side of viewport the panel will appear.
			side: null,

			// Target element for "class".
			target: $this,

			// Class to toggle.
			visibleClass: 'visible'

		}, userConfig);

		// Expand "target"
		if (typeof config.target != 'jQuery')
			config.target = $(config.target);


		// Methods.
		$this._hide = function (event) {

			// Already hidden? bail.
			if (!config.target.hasClass(config.visibleClass))
				return;

			// If an event was provided, cancel it.
			if (event) {

				event.preventDefault();
				event.stopPropagation();

			}

			// Hide.
			config.target.removeClass(config.visibleClass);

			// Post-hide stuff.
			window.setTimeout(function () {

				// Reset scroll position.
				if (config.resetScroll)
					$this.scrollTop(0);

				// Reset forms.
				if (config.resetForms)
					$this.find('form').each(function () {
						this.reset();
					});

			}, config.delay);

		};

		$this
			.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
			.css('-webkit-overflow-scrolling', 'touch');

		// Hide on click.
		if (config.hideOnClick) {

			$this.find('a').css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

			$this.on('click', 'a', function (event) {

				var $a = $(this), href = $a.attr('href'), target = $a.attr('target');

				if (!href || href == '#' || href == '' || href == '#' + id)
					return;

				// Cancel original event.
				event.preventDefault();
				event.stopPropagation();

				// Hide panel.
				$this._hide();

				// Redirect to href.
				window.setTimeout(function () {

					if (target == '_blank')
						window.open(href);
					else
						window.location.href = href;

				}, config.delay + 10);

			});

		}

		// Event: Touch stuff.
		$this.on('touchstart', function (event) {

			$this.touchPosX = event.originalEvent.touches[0].pageX;
			$this.touchPosY = event.originalEvent.touches[0].pageY;

		})

		$this.on('touchmove', function (event) {

			if ($this.touchPosX === null
				|| $this.touchPosY === null)
				return;

			var diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
				diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
				th = $this.outerHeight(),
				ts = ($this.get(0).scrollHeight - $this.scrollTop());

			if (config.hideOnSwipe) {

				var result = false,
					boundary = 20,
					delta = 50;

				switch (config.side) {

					case 'left':
						result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
						break;

					case 'right':
						result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
						break;

					case 'top':
						result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
						break;

					case 'bottom':
						result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
						break;

					default:
						break;

				}

				if (result) {

					$this.touchPosX = null;
					$this.touchPosY = null;
					$this._hide();

					return false;

				}

			}

			// Prevent vertical scrolling past the top or bottom.
			if (($this.scrollTop() < 0 && diffY < 0)
				|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

				event.preventDefault();
				event.stopPropagation();

			}

		});

		$this.on('click touchend touchstart touchmove', function (event) {
			event.stopPropagation();
		});

		$this.on('click', 'a[href="#' + id + '"]', function (event) {

			event.preventDefault();
			event.stopPropagation();
			config.target.removeClass(config.visibleClass);

		});

		$body.on('click touchend', function (event) {
			$this._hide(event);
		});

		$body.on('click', 'a[href="#' + id + '"]', function (event) {

			event.preventDefault();
			event.stopPropagation();

			config.target.toggleClass(config.visibleClass);

		});

		// Window.

		// Event: Hide on ESC.
		if (config.hideOnEscape)
			$window.on('keydown', function (event) {

				if (event.keyCode == 27)
					$this._hide(event);

			});

		return $this;

	};

	$.fn.placeholder = function () {

		// Browser natively supports placeholders? Bail.
		if (typeof (document.createElement('input')).placeholder != 'undefined')
			return $(this);

		// No elements?
		if (this.length == 0)
			return $this;

		// Multiple elements?
		if (this.length > 1) {

			for (var i = 0; i < this.length; i++)
				$(this[i]).placeholder();

			return $this;

		}

		// Vars.
		var $this = $(this);

		// Events.

		return $this;

	};


	// Heart
	$("#heart").click(function () {
		if ($("#heart").hasClass("liked")) {
			$("#heart").html('<i class="fa fa-heart-o" aria-hidden="true"></i>');
			$("#heart").removeClass("liked");
		} else {
			$("#heart").html('<i class="fa fa-heart" aria-hidden="true"></i>');
			$("#heart").addClass("liked");
		}
	});

	$.prioritize = function ($elements, condition) {

		var key = '__prioritize';

		if (typeof $elements != 'jQuery')
			$elements = $($elements);

		// Step through elements.
		$elements.each(function () {

			var $e = $(this), $p,
				$parent = $e.parent();

			if ($parent.length == 0)
				return;

			// Not moved? Move it.
			if (!$e.data(key)) {

				if (!condition)
					return;
				$p = $e.prev();

				if ($p.length == 0)
					return;

				$e.prependTo($parent);

				$e.data(key, $p);

			}

			// Moved already?
			else {

				if (condition)
					return;

				$p = $e.data(key);

				$e.insertAfter($p);

				$e.removeData(key);

			}

		});

	};

})(jQuery);