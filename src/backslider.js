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
 * nextprev     bool      include next/previous controls
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
			nextprev:		false, 
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
			
			// start at 0
			me.index = 0;
			
			// set beginning state
			me.slides.eq(me.index).addClass('current');
			if(me.opts.controls) controls();
			
			if(me.opts.equalheight){
				me.equalheight();
				$(window).resize(me.windowresize);
			}
			
			me.el.addClass('backslider-enabled');
			
			if(me.opts.interval > 0) me.start();
		}; //EF
		
		// set parent to slides max height
		me.equalheight = function(height){
			var maxHeight = height || Math.max.apply(null, me.slides.map(function(){
				return $(this).innerHeight();
			}).get());
			me.el.height(maxHeight);
		}; //EF
		
		// set slide
		me.set = function(i){
			if(typeof i == undefined) return;
			
			me.index = i;
			
			me.el.find('nav ol > li:not(.separator)').eq(i).addClass('sel').siblings().removeClass('sel');
			me.slides.eq(i).addClass('current').siblings().removeClass('current');
			return me;
		}; //EF
		
		// start advancing slides
		me.start = function(){
			me.timer = setInterval(function(){
				var i = (me.index + 1 >= me.slides.length) ? 0 : me.index + 1;
				me.set(i);
			}, me.opts.interval);
			if(me.opts.allowpause) me.el.find('.play').removeClass('play');
			return me;
		};
		
		// stop advancing slides
		me.stop = function(){
			me.timer = clearInterval(me.timer);
			if(me.opts.allowpause) me.el.find('.pause').addClass('play');
			return me;
		}; //EF
		
		// resize the slider container
		me.windowresize = function(){
			if(me.opts.equalheight){
				me.resizetimer = clearTimeout(me.resizetimer);
				me.resizetimer = setTimeout(me.equalheight, 50);
			}
		}; //EF
		
		// Let's do this!
		me.init(opts);
		
		// setup controls
		function controls(){
			
			// create controls
			var output = $('<nav/>').appendTo(me.el);
			
			// include pause
			if(me.opts.allowpause){
				if('' != me.opts.pauseimage){
					$('<img />').attr({'class': 'pause', 'src': me.opts.pauseimage, 'alt' : 'Pause'}).appendTo(output);
				} else {
					$('<span/>').attr({'class': 'pause'}).text('Pause').appendTo(output);
				}
			}
			
			// include previous
			if(me.opts.nextprev){
				$('<a/>').attr('class', 'previous').html('Previous').appendTo(output)
			}
			
			// include dots
			var dots = $('<ol/>').appendTo(output);
			$.each(me.slides, function(s){
				if('' != me.opts.separator && s > 0){
					$('<li/>').attr({'class': 'separator'}).text(me.opts.separator).appendTo(dots);
				}
				var ctrltext = (s+1);
				if('' != me.opts.navtext && undefined != me.slides.eq(s).attr(me.opts.navtext)) ctrltext = me.slides.eq(s).attr(me.opts.navtext);
				$('<li/>').addClass(me.index == s ? 'sel' : '').text(ctrltext).appendTo(dots);
			});
			
			// include next
			if(me.opts.nextprev){
				$('<a/>').attr('class', 'next').html('Next').appendTo(output)
			}
			
			// add pause action
			if(me.opts.allowpause) me.el.find('.pause').on('click', me.stop);
			
			// add indicator action
			me.el.find('nav > ol > li:not(.separator)').on(me.opts.action, function(){
				var li = $(this);
				me.stop().set(li.parent().children(':not(.separator)').index(li)).start();
			});
			
			// add next/previous action
			me.el.find('.next, .previous').on('click', function(){
				if($(this).is('.next')){
					var i = (me.index + 1 >= me.slides.length) ? 0 : me.index + 1;
				} else {
					var i = (me.index - 1 < 0) ? me.slides.length - 1 : me.index - 1;
				}
				me.stop().set(i).start();
			});
			
		}; //EF
		
	}; //EF
	
	$.fn.backslider = function(opts){
		
		return this.each(function(){
			(new $.Backslider(this, opts));
		});
		
	}; //EF
	
})(jQuery); //EP