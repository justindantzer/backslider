/*!
 * jQuery Plugin: Backslider
 * Author: @justindantzer
 * Licensed under the MIT license
 * 
 * action       string    choose nav control trigger action, defaults to 'click'
 * allowpause   bool      specify display of pause button, defaults to 1
 * controls     bool      show navigation controls
 * equalheight  bool      choose to set parent to height of tallest slide, defaults to 0
 * interval     int       set auto-advance interval in milliseconds, defaults to 10000
 * navtext      string    set the attribute containing text for the nav link
 * pauseimage   string    set url for image to be used as pause button
 * separator    string    used as separator in nav controls
 */

(function($){
	
	$.Backslider = function(el, opts){
		
		var me = this;
		
		// defaults
		me.opts = {
			action:			'click', 
			allowpause:		false, 
			controls:		true, 
			equalheight:	false, 
			interval:		10000, 
			navtext:		'', 
			pauseimage:		'', 
			separator:		''
		};
		
		// init
		me.init = function(opts){
			// extend
			me.opts = $.extend(me.opts, opts || {});
			
			// elements
			me.el = $(el);
			me.slides = me.el.find('> :not(nav)');
			
			// starting
			me.index = 0;
			
			// set beginning state
			me.slides.eq(0).addClass('current');
			controls();
			
			if(1 == me.opts.equalheight) me.equalheight();
			
			$(window).resize(me.windowresize);
			
			me.el.addClass('backslider-enabled');
			
			if(me.opts.interval > 0) me.start(); //active = setInterval(this.advance, opts.interval);
		}; //EF
		
		// set parent to slides max height
		me.equalheight = function(height){
			var maxHeight = height || Math.max.apply(null, me.slides.map(function(){
				return $(this).innerHeight();
			}).get());
			me.el.height(maxHeight);
		}; //EF
		
		// set the next slide
		me.advance = function(index){
			if(typeof index == undefined) return;
			
			me.index = (index > me.slides.length + 1) ? 0 : index;
			var switchto = me.slides.eq(me.index);
			
			me.el.find('nav ol > li:not(.separator)').eq(index).addClass('sel').siblings().removeClass('sel');
			switchto.addClass('current').siblings().removeClass('current');
		}; //EF
		
		// start advancing slides
		me.start = function(){
			me.timer = setInterval(function(){
				me.advance(me.index + 1);
			}, me.opts.interval);
			me.el.find('.play').removeClass('play');
		};
		
		// stop advancing slides
		me.stop = function(){
			me.timer = clearInterval(me.timer);
			me.el.find('.pause').addClass('play');
			return me;
		}; //EF
		
		// resize the slider container
		me.windowresize = function(){
			if(1 == me.opts.equalheight){
				me.resizetimer = clearTimeout(me.resizetimer);
				me.resizetimer = setTimeout(me.equalheight, 50);
			}
		}; //EF
		
		// Let's do this!
		me.init(opts);
		
		// setup controls
		function controls(){
			var output = $('<nav></nav>').appendTo(me.el);
			if(me.opts.allowpause){
				if('' != me.opts.pauseimage){
					$('<img />').attr({'class': 'pause', 'src': me.opts.pauseimage, 'alt' : 'Pause'}).appendTo(output);
				} else {
					$('<span></span>').attr({'class': 'pause'}).text('Pause').appendTo(output);
				}
			}
			var dots = $('<ol></ol>').appendTo(output);
			$.each(me.slides, function(s){
				if('' != me.opts.separator && 0 != s){
					$('<li></li>').attr({'class': 'separator'}).text(me.opts.separator).appendTo(dots);
				}
				var ctrltext = (s+1);
				if('' != me.opts.navtext && undefined != me.slides.eq(s).attr(me.opts.navtext)) ctrltext = me.slides.eq(s).attr(me.opts.navtext);
				$('<li></li>').addClass(0 == s ? 'sel' : '').text(ctrltext).appendTo(dots);
			});
			
			if(me.opts.allowpause) me.el.find('.pause').on('click', me.stop);
			me.el.find('nav > ol > li:not(.separator)').on(me.opts.action, function(){
				var li = $(this);
				me.stop().advance(li.parent().children(':not(.separator)').index(li)); // check for separator?
			});
			
		}; //EF
		
	}; //EF
	
	$.fn.backslider = function(opts){
		
		return this.each(function(){
			(new $.Backslider(this, opts));
		});
		
	}; //EF
	
})(jQuery); //EP