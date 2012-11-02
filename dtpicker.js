/**
 * dtpicker (jquery-simple-datetimepicker)
 * (c) Masanori Ohgita - 2012.
 * https://github.com/mugifly/jquery-simple-datetimepicker
 */

(function($) {
	var DAYS_OF_WEEK_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	var DAYS_OF_WEEK_JA = ['日', '月', '火', '水', '木', '金', '土'];

	var pickerObjects = [];
	var inputObjects = [];

	var getParentPickerObject = function(obj) {
		var $obj = $(obj);
		var $picker;
		if ($obj.hasClass('datepicker')) {
			$picker = $obj;
		} else {
			var parents = $obj.parents();
			for (var i = 0; i < parents.length; i++) {
				if ($(parents[i]).hasClass('datepicker')) {
					$picker = $(parents[i]);
				}
			}
			console.log($picker);
		}
		return $picker;
	};

	var getPickersInputObject = function($obj) {
		var $picker = getParentPickerObject($obj);
		console.log($picker.data());
		if ($picker.data("inputObjectId") != null) {
			return $(inputObjects[$picker.data("inputObjectId")]);
		}
		return null;
	}
	var beforeMonth = function($obj) {
		var $picker = getParentPickerObject($obj);
		var date = getPickedDate($picker);
		var targetMonth_lastDay = new Date(date.getYear() + 1900, date.getMonth(), 0).getDate();
		console.log(targetMonth_lastDay);
		if (targetMonth_lastDay < date.getDate()) {
			date.setDate(targetMonth_lastDay);
		}
		draw($picker, true, true, date.getYear() + 1900, date.getMonth() - 1, date.getDate(), date.getHours(), date.getMinutes());
	};

	var nextMonth = function($obj) {
		var $picker = getParentPickerObject($obj);
		var date = getPickedDate($picker);
		var targetMonth_lastDay = new Date(date.getYear() + 1900, date.getMonth() + 1, 0).getDate();
		if (targetMonth_lastDay < date.getDate()) {
			date.setDate(targetMonth_lastDay);
		}
		draw($picker, true, true, date.getYear() + 1900, date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes());
	};

	var outputToInputObject = function($obj) {
		var date = getPickedDate($obj);
		var $inp = getPickersInputObject($obj);
		if ($inp != null) {
			$inp.val(date.getYear() + 1900 + "/" + zpadding(date.getMonth() + 1) + "/" + zpadding(date.getDate()) + "  " + zpadding(date.getHours()) + ":" + zpadding(date.getMinutes()));
		}
	};

	var getPickedDate = function($obj) {
		var $picker = getParentPickerObject($obj);
		return $picker.data("pickedDate");
	};

	var zpadding = function(num) {
		num = ("0" + num).slice(-2);
		return num
	};

	var draw_date = function($picker, isAnim, isOutputToInputObject, date) {
		draw($picker, isAnim, isOutputToInputObject, date.getYear() + 1900, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
	};

	var draw = function($picker, isAnim, isOutputToInputObject, year, month, day, hour, min) {
		var date = new Date();
		
		if (hour != null) {
			date = new Date(year, month, day, hour, min, 0);
		} else if (year != null) {
			date = new Date(year, month, day);
		} else {
			date = new Date();
		}
		console.log("dtpicker - draw()..." + year + "," + month + "," + day + " " + hour + ":" + min + " -> " + date);

		$($picker).data("pickedDate", date);

		var todayDate = new Date(); 
		var firstWday = new Date(date.getYear() + 1900, date.getMonth(), 1).getDay();
		var lastDay = new Date(date.getYear() + 1900, date.getMonth() + 1, 0).getDate();
		var beforeMonthLastDay = new Date(date.getYear() + 1900, date.getMonth(), 0).getDate();
		var dateBeforeMonth = new Date(date.getYear() + 1900, date.getMonth(), 0);
		var dateNextMonth = new Date(date.getYear() + 1900, date.getMonth() + 2, 0);

		var $inner = $picker.children('.datepicker_inner_container');

		if (isAnim == true) {
			$inner.stop().queue([]);
			$inner.fadeTo("fast", 0.5);
		}
		
		/* Remind scroll state */
		var $timelist = $picker.children('.datepicker_inner_container').children('.datepicker_timelist');
		var drawBefore_timeList_scrollTop = $timelist.scrollTop();
		console.log(drawBefore_timeList_scrollTop);
		
		/* Header ----- */
		var $header = $picker.children('.datepicker_header');
		$header.children().remove();
		var $link_before_month = $('<a>');
		$link_before_month.text('<');
		$link_before_month.click(function() {
			beforeMonth($picker);
		});

		var $now_month = $('<span>');
		$now_month.text((date.getYear() + 1900) + " / " + zpadding(date.getMonth() + 1));

		var $link_next_month = $('<a>');
		$link_next_month.text('>');
		$link_next_month.click(function() {
			nextMonth($picker);
		});

		$header.append($link_before_month);
		$header.append($now_month);
		$header.append($link_next_month);

		/* Calendar > Table ----- */
		var $calendar = $picker.children('.datepicker_inner_container').children('.datepicker_calendar');
		var $table = $calendar.children('.datepicker_table');
		$table.children().remove();
		var $tr = $('<tr>');
		$table.append($tr);

		/* Output wday cells */
		for (var i = 0; i < 7; i++) {
			var $td = $('<th>');
			$td.text(DAYS_OF_WEEK_EN[i]);
			$tr.append($td);
		}

		/* Output day cells */
		var cellNum = Math.ceil((firstWday + lastDay) / 7) * 7;
		for (var i = 0; i < cellNum; i++) {
			var realDay = i + 1 - firstWday;
			if (i % 7 == 0) {
				$tr = $('<tr>');
				$table.append($tr);
			}

			var $td = $('<td>');
			$td.data("day", realDay);
			
			$tr.append($td);
			
			if (firstWday > i) {/* Before months day */
				$td.text(beforeMonthLastDay + realDay);
				$td.addClass('day_another_month');
				$td.data("dateStr", dateBeforeMonth.getYear() + 1900 + "/" + (dateBeforeMonth.getMonth() + 1) + "/" + (beforeMonthLastDay + realDay));
			} else if (i < firstWday + lastDay) {/* Now months day */
				$td.text(realDay);
				$td.data("dateStr", (date.getYear() + 1900) + "/" + (date.getMonth() + 1) + "/" + realDay);
			} else {/* Next months day */
				$td.text(realDay - lastDay);
				$td.addClass('day_another_month');
				$td.data("dateStr", dateNextMonth.getYear() + 1900 + "/" + (dateNextMonth.getMonth() + 1) + "/" + (realDay - lastDay));
			}

			if (i % 7 == 0) {/* Sunday */
				$td.addClass('wday_sun');
			} else if (i % 7 == 6) {/* Saturday */
				$td.addClass('wday_sat');
			}

			if (realDay == date.getDate()) {/* selected day */
				$td.addClass('active');
			}
			
			if (date.getMonth() == todayDate.getMonth() && realDay == todayDate.getDate()) {/* today */
				$td.addClass('today');
			}

			/* Set event-handler to day cell */

			$td.click(function() {
				if ($(this).hasClass('hover')) {
					$(this).removeClass('hover');
				}
				$(this).addClass('active');

				var $picker = getParentPickerObject($(this));
				console.log($(this).data("dateStr"));
				var targetDate = new Date($(this).data("dateStr"));
				var selectedDate = getPickedDate($picker);
				draw($picker, false, true, targetDate.getYear() + 1900, targetDate.getMonth(), targetDate.getDate(), selectedDate.getHours(), selectedDate.getMinutes());
			});

			$td.hover(function() {
				if (! $(this).hasClass('active')) {
					$(this).addClass('hover');
				}
			}, function() {
				if ($(this).hasClass('hover')) {
					$(this).removeClass('hover');
				}
			});
		}

		/* Timelist ----- */
		$timelist.children().remove();
		
		/* Set height to Timelist (Calendar innerHeight - Calendar padding) */
		$timelist.css("height", $calendar.innerHeight() - 10 + 'px');

		/* Output time cells */
		for (var hour = 0; hour < 24; hour++) {
			for (var min = 0; min <= 30; min += 30) {
				var $o = $('<div>');
				$o.addClass('timelist_item');
				$o.text(zpadding(hour) + ":" + zpadding(min));

				$o.data("hour", hour);
				$o.data("min", min);

				$timelist.append($o);

				if (hour == date.getHours() && min == date.getMinutes()) {/* selected time */
					$o.addClass('active');
				}

				/* Set event handler to time cell */
				
				$o.click(function() {
					if ($(this).hasClass('hover')) {
						$(this).removeClass('hover');
					}
					$(this).addClass('active');

					var $picker = getParentPickerObject($(this));
					var date = getPickedDate($picker);
					var hour = $(this).data("hour");
					var min = $(this).data("min");
					draw($picker, false, true, date.getYear() + 1900, date.getMonth(), date.getDate(), hour, min);
				});
				
				$o.hover(function() {
					if (! $(this).hasClass('active')) {
						$(this).addClass('hover');
					}
				}, function() {
					if ($(this).hasClass('hover')) {
						$(this).removeClass('hover');
					}
				});
			}
		}
		
		$timelist.scrollTop(drawBefore_timeList_scrollTop);

		if (isAnim == true) {
			$inner.fadeTo("fast", 1.0);
		}

		/* Output to InputForm */
		if (isOutputToInputObject == true) {
			outputToInputObject($picker);
		}
	};

	var init = function($obj, opt_inputObjectId) {
		console.log("dtpicker init... ");

		/* Container */
		var $picker = $('<div>');
		$picker.addClass('datepicker')
		$obj.append($picker);

		if (opt_inputObjectId != null) {
			$picker.data("inputObjectId", opt_inputObjectId);
		}
		$picker.data("pickerId", pickerObjects.length);

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

		pickerObjects.push($picker);

		draw($picker, true, true);
	};

	/* Initialize dtpicker */
	$.fn.dtpicker = function(config) {
		var defaults = {

		}
		var options = $.extend(defaults, config);
		return this.each(function(i) {
			if(config == null || config.inputObjectId == undefined){
				init($(this));
			}else{
				init($(this), config.inputObjectId);
			}
		});
	};

	/* Initialize dtpicker, append to Text input field */
	$.fn.appendDtpicker = function(config) {
		var defaults = {
			"inline": false
		}
		var options = $.extend(defaults, config);
		return this.each(function(i) {
			/* Add input-field with inputsObjects array */
			var input = this;
			var inputObjectId = inputObjects.length;
			inputObjects.push(input);

			/* Make parent-div for picker */
			console.log(this);
			var $d = $('<div>');
			$d.insertAfter(input);

			var pickerId = pickerObjects.length;

			/* Initialize picker */
			var $picker_parent = $($d).dtpicker({
				"inputObjectId" : inputObjectId
			});

			/* Link input-field with picker*/
			$(input).data('pickerId', pickerId);
			
			/* Set event handler to input-field */
			
			$(input).keyup(function() {
				var $input = $(this);
				var $picker = $(pickerObjects[$input.data('pickerId')]);
				if ($input.val() != null) {
					var date = new Date($input.val());
					if (isNaN(date.getDate()) == false) {/* Valid format... */
						console.log(date.getDate())
						draw_date($picker, true, false, date);
					}
				}
			});
			
			$(input).change(function(){
				$(this).trigger('keyup');
			});
			
			/* for NOT inline mode */
			if(options.inline == false){
				$picker_parent.css("position","absolute");
				$picker_parent.hide();
				$(input).click(function(){
					var $input = $(this);
					var $picker = $(pickerObjects[$input.data('pickerId')]);
					$($picker.parent()).show();
				});
			}

		});
	};
})(jQuery); 