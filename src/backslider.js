/*!
 * jQuery Plugin: Backslider
 * Author: @justindantzer
 * Licensed under the MIT license
 * 
 * id           string    specify parent element id attribute
 * showpause    int       specify display of pause button, defaults to 1
 * pauseimage   string    set url for image to be used as pause button
 * separator    string    used as separator in nav controls
 * navtext      string    set the attribute containing text for the nav link
 * interval     int       set auto-advance interval in milliseconds, defaults to 10000
 * action       string    choose nav control trigger action, defaults to 'click'
 * equalheight  int       choose to set parent to height of tallest slide, defaults to 0
 */

(function($){
	
	$.Backslider = function(element, options){
		var me			=	this, 
			el			=	$(element), 
			slides		=	el.find('> :not(nav)'), 
			ctrl		=	{}, 
			paused		=	0,
			active		=	undefined, 
			screensize	=	$('body').outerWidth(), 
			resizetimer	=	null, 
			opts		=	$.extend({
				id: 			'', 
				showpause:		1, 
				pauseimage:		'', 
				separator:		'', 
				navtext:		'', 
				interval:		10000, 
				action:			'click', 
				equalheight:	0
			}, options || {});
		
		this.init = function(){
			if('' != opts.id) el.attr('id', opts.id);
			
			slides.eq(0).addClass('current');
			this.controls();
			ctrl = el.find('> nav');
			ctrl.find('> ol > li:not(.separator):first').addClass('sel');
			
			if(1 == opts.equalheight) this.equalheight();
			
			ctrl.find('.pause').on('click', this.pause);
			ctrl.find('> ol > li:not(.separator)').on(opts.action, this.set);
			
			$(window).resize(this.windowresize);
			
			el.addClass('backslider-enabled');
			
			active = setInterval(this.advance, opts.interval);
		}; //EF
		
		this.equalheight = function(height){
			var maxHeight = height || Math.max.apply(null, slides.map(function(){
				return $(this).innerHeight();
			}).get());
			el.height(maxHeight);
		}; //EF
		
		this.controls = function(){
			var output = $('<nav></nav>').appendTo(el);
			if(1 == opts.showpause){
				if('' != opts.pauseimage){
					$('<img />').attr({'class': 'pause', 'src': opts.pauseimage, 'alt' : 'Pause'}).appendTo(output);
				} else {
					$('<span></span>').attr({'class': 'pause'}).text('Pause').appendTo(output);
				}
			}
			var dots = $('<ol></ol>').appendTo(output);
			$.each(slides, function(s){
				if('' != opts.separator && 0 != s){
					$('<li></li>').attr({'class': 'separator'}).text(opts.separator).appendTo(dots);
				}
				var ctrltext = (s+1);
				if('' != opts.navtext && undefined != slides.eq(s).attr(opts.navtext)) ctrltext = slides.eq(s).attr(opts.navtext);
				$('<li></li>').text(ctrltext).appendTo(dots);
			});
		}; //EF
		
		this.advance = function(index){
			var curr = el.find('.current'), 
				i = (typeof index != 'undefined') ? index : (curr.index() == (slides.length - 1) ? 0 : slides.index(curr) + 1);
			
			curr.removeClass('current');
			slides.eq(i).addClass('current');
			
			ctrl.find('.sel').removeClass('sel');
			ctrl.find('ol > li:not(.separator)').eq(i).addClass('sel');
		}; //EF
		
		this.set = function(e){
			e.preventDefault();
			clearInterval(active);
			
			var i = ctrl.find('ol > li:not(.separator)').index(e.target);
			me.advance(i);
			
			if(1 == paused){
				me.pause();
			} else {
				active = setInterval(me.advance, opts.interval);
			}
		}; //EF
		
		this.pause = function(){
			if(0 == paused){
				clearInterval(active);
				paused = 1;
				ctrl.find('.pause').addClass('play');
			} else {
				active = setInterval(me.advance, opts.interval);
				paused = 0;
				ctrl.find('.pause').removeClass('play');
			}
		}; //EF
		
		this.windowresize = function(){
			screensize = $('body').outerWidth();
			if(1 == opts.equalheight){
				clearTimeout(resizetimer);
				resizetimer = setTimeout(me.equalheight, 150);
			}
		}; //EF
		
		this.init(el, options);
		
	}; //EF
	
	$.fn.backslider = function(options){
		if(this.length){
			return this.each(function(){
				(new $.Backslider(this, options));
			});
		}
	}; //EF
	
})(jQuery); //EP