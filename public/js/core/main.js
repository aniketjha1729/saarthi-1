(function($){"use strict";$(window).on("load",function(){$("#status").fadeOut();$("#preloader").delay(350).fadeOut("slow");});$(window).scroll(function(){if($(".navbar").offset().top>50){$(".navbar-fixed-top").addClass("top-nav-collapse");}else{$(".navbar-fixed-top").removeClass("top-nav-collapse");}});$(function(){$(document).on('click','a.page-scroll',function(event){var $anchor=$(this);$('html, body').stop().animate({scrollTop:$($anchor.attr('href')).offset().top},1500,'easeInOutExpo');event.preventDefault();});});function onScrollInit(items,trigger){items.each(function(){var osElement=$(this),osAnimationClass=osElement.attr('data-os-animation'),osAnimationDelay=osElement.attr('data-os-animation-delay');osElement.css({'-webkit-animation-delay':osAnimationDelay,'-moz-animation-delay':osAnimationDelay,'animation-delay':osAnimationDelay});var osTrigger=(trigger)?trigger:osElement;osTrigger.waypoint(function(){osElement.addClass('animated').addClass(osAnimationClass);},{triggerOnce:true,offset:'90%'});});}
onScrollInit($('.os-animation'));onScrollInit($('.staggered-animation'),$('.staggered-animation-container'));$(function(){$(".dropdown").hover(function(){$('.dropdown-menu',this).stop(true,true).delay(200).fadeIn(500);$(this).toggleClass('open');$('b',this).toggleClass("caret caret-up");},function(){$('.dropdown-menu',this).stop(true,true).delay(200).fadeOut(500);$(this).toggleClass('open');$('b',this).toggleClass("caret caret-up");});});$(function(){$(window).scroll(function(){if($(this).scrollTop()>300){$('.go-top').fadeIn(500);}else{$('.go-top').fadeOut(500);}});$('.go-top').click(function(event){event.preventDefault();$('html, body').animate({scrollTop:0},1000);})});})(jQuery);