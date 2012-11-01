/**
 * dtpicker (jquery-simple-datetimepicker)
 * (c) Masanori Ohgita - 2012.
 * https://github.com/mugifly/jquery-simple-datetimepicker
 */

(function($){
	var DAYS_OF_WEEK_EN= ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	var DAYS_OF_WEEK_JA= ['日', '月', '火', '水', '木', '金', '土'];
	
	var PickerObjects = [];
	var inputObjects = [];
	
	var getParentPickerObject = function($obj){
		var $picker;
		if($obj.hasClass('datepicker')){
			$picker = $obj;
		}else{
			$picker = $obj.parent('.datepicker');
		}
		return $picker;
	};
	
	var beforeMonth = function($obj){
		var $picker = getParentPickerObject($obj);
		var date = getPickedDate($picker);
		draw($picker, date.getYear() + 1900, date.getMonth() - 1, date.getDate());
	};
	
	var nextMonth = function($obj){
		var $picker = getParentPickerObject($obj);
		var date = getPickedDate($picker);
		draw($picker, date.getYear() + 1900, date.getMonth() + 1, date.getDate());
	};
	
	var getPickedDate = function($obj){
		var $picker = getParentPickerObject($obj);
		return $picker.data("pickedDate");
	};
	
	var zpadding = function(num){
		num = ("0" + num).slice(-2);
		return num
	};
	
	var draw = function($picker, year, month, day){
		console.log("dtpicker - draw()..." + year + "," + month + "," + day);
		var date = new Date();
		if(year != null){
			date = new Date(year, month, day);
		}else{
			date = new Date();
		}
		
		$picker.data("pickedDate", date);
		
		var firstWday = new Date(date.getYear() + 1900, date.getMonth(),  1).getDay();
		var lastDay = new Date(date.getYear() + 1900, date.getMonth() + 1,  0).getDate();
		
		/* Header */
		var $header = $picker.children('.datepicker_header');
		$header.children().remove();
		var $link_before_month = $('<a>');
		$link_before_month.text('<');
		$link_before_month.click(function(){
			beforeMonth($picker);
		});
		
		var $now_month = $('<span>');
		$now_month.text((date.getYear() + 1900) + " / " + zpadding(date.getMonth() + 1));
		
		var $link_next_month = $('<a>');
		$link_next_month.text('>');
		$link_next_month.click(function(){
			nextMonth($picker);
		});
		
		$header.append($link_before_month);
		$header.append($now_month);
		$header.append($link_next_month);
		
		/* Calendar > Table */
		var $table = $picker.children('.datepicker_inner_container').children('.datepicker_calendar').children('.datepicker_table');
		$table.children().remove();
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
		var $timelist = $picker.children('.datepicker_inner_container').children('.datepicker_timelist');
		$timelist.children().remove();
		for(var hour=0;hour<24;hour++){
			for(var min=0;min<=30;min+=30){
				var $o = $('<div>');
				$o.addClass('timelist_item');
				$o.text(zpadding(hour) +":"+ zpadding(min));
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
		
		$obj.data("pickerId",PickerObjects.length);
		PickerObjects.push($obj);
		
		/* Container */
		var $picker = $('<div>');
		$picker.addClass('datepicker')
		$obj.append($picker);
		/* Header */
		var $header = $('<div>');
		$header.addClass('datepicker_header');
		$picker.append($header);
		/* InnerContainer*/
		var $inner = $('<div>');
		$inner.addClass('datepicker_inner_container');
		$picker.append($inner);
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
		
		draw($picker);
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