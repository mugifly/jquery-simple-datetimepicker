/**
 * dtpicker (jquery-simple-datetimepicker)
 * (c) Masanori Ohgita - 2012.
 * https://github.com/mugifly/jquery-simple-datetimepicker
 */

(function($){
	var DAYS_OF_WEEK_EN= ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	var DAYS_OF_WEEK_JA= ['日', '月', '火', '水', '木', '金', '土'];
	
	var inputObjects = [];
	
	var draw = function($container, year, month, day){
		var date = new Date();
		if(year != null){
			date = new Date(year, month, day);
		}else{
			date = new Date();
		}
		
		var firstWday = new Date(date.getYear() + 1900, date.getMonth(),  1).getDay();
		var lastDay = new Date(date.getYear() + 1900, date.getMonth() + 1,  0).getDate();
		
		/* Header */
		var $header = $container.children('.datepicker_header');
		$header.text("<< " + (date.getYear() + 1900) + " / " + (date.getMonth() + 1) + " >>");
		
		/* Calendar > Table */
		var $table = $container.children('.datepicker_inner_container').children('.datepicker_calendar').children('.datepicker_table');
		var $tr = $('<tr>');
		$table.append($tr);
		
		for (var i=0;i<7;i++){
			var $td = $('<th>');
			$td.text(DAYS_OF_WEEK_EN[i]);
			$tr.append($td);
		}
		
		for (var i=0;i<firstWday+lastDay;i++){
			if(i%7==0){
				$tr = $('<tr>');
				$table.append($tr);
			}
			
			var $td = $('<td>');
			if(firstWday > i){
				$td.text(" ");
			}else{
				$td.text(i+1-firstWday);
			}
			
			if (i%7==0){ /* Sunday */
				$td.addClass('wday_sun');
			}else if (i%7==6){ /* Saturday */
				$td.addClass('wday_sat');
			}
			
			$td.click(function(){
				if($(this).hasClass('hover')){
					$(this).removeClass('hover');
				}
				$(this).addClass('active');
			});
			
			$td.hover(
				function(){
					if(! $(this).hasClass('active')){
						$(this).addClass('hover');
					}
				},
				function(){
					if($(this).hasClass('hover')){
						$(this).removeClass('hover');
					}
				});
			
			$tr.append($td);
		}
		
		/* Timelist */
		var $timelist = $container.children('.datepicker_inner_container').children('.datepicker_timelist');
		$timelist.children().remove();
		for(var hour=0;hour<24;hour++){
			for(var min=0;min<=30;min+=30){
				var $o = $('<div>');
				$o.addClass('timelist_item');
				$o.text(("0"+hour).slice(-2) +":"+ ("0"+min).slice(-2));
				$timelist.append($o);
				
				$o.click(function(){
					if($(this).hasClass('hover')){
						$(this).removeClass('hover');
					}
					$(this).addClass('active');
				});
				$o.hover(
					function(){
						if(! $(this).hasClass('active')){
							$(this).addClass('hover');
						}
					},
					function(){
						if($(this).hasClass('hover')){
							$(this).removeClass('hover');
						}
					}
				);
			}
		}
	};
	
	var init = function($obj){
		console.log("dtpicker init... ");
		
		/* Container */
		var $container = $('<div>');
		$container.addClass('datepicker')
		$obj.append($container);
		/* Header */
		var $header = $('<div>');
		$header.addClass('datepicker_header');
		$container.append($header);
		/* InnerContainer*/
		var $inner = $('<div>');
		$inner.addClass('datepicker_inner_container');
		$container.append($inner);
		/* Calendar */
		var $calendar = $('<div>');
		$calendar.addClass('datepicker_calendar');
		var $table = $('<table>');
		$table.addClass('datepicker_table');
		$calendar.append($table);
		$inner.append($calendar);
		/* Timelist */
		var $timelist = $('<div>');
		$timelist.addClass('datepicker_timelist');
		$inner.append($timelist);
		
		draw($container);
	};
	
	/* Initialize dtpicker */
    $.fn.dtpicker=function(config){
        var defaults={
        	
        }
        var options=$.extend(defaults, config);
        return this.each(function(i){
			init($(this));
        });
    };
	
	/* Initialize dtpicker, append to Text input field */
	$.fn.appendDtpicker = function(config){
        var defaults={
        	
        }
        var options=$.extend(defaults, config);
        return this.each(function(i){
        	inputObjects.push(this);
        	var $d = $('<div>');
        	$d.insertAfter(this);
        	console.log(inputObjects);
			$($d).dtpicker();
        });
	};
})(jQuery);