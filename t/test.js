/**
	Test script.
	The date-picker elements is cleared when each test has finished.
**/

$(function() {
	/* Basic test
		Picker is inline and standalone mode (That not append with an input-field). */
	test('Basic', function(){
		var $picker = $('#inline_date_picker');
		$picker.dtpicker();

		equal($picker.css('display'), "block");

		/* Calendar - Wdays */
		var $table = $('.datepicker_table');
		var $tr_wdays = $($table.children('tbody').children('tr')[0]);
		var $wday_cells = $tr_wdays.children('th');
		var wdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		for (var i = 0; i < 7; i++) {
			equal($($wday_cells[i]).text(), wdays[i]);
		}
	});

	/* Switching a month - Previous
		2014-10-31 00:00 -> 2014-09-30 00:00
		Picker is inline mode, and append into an input-field. */
	asyncTest('Switching a month - Previous', function(){
		expect(1);
		var $date_input = $('#date_input');
		$date_input.val('2014-10-31 00:00'); // Initial date
		$date_input.appendDtpicker({
			'inline': true
		});

		var $picker_header = $('.datepicker_header');
		var $prev_button = $($picker_header.children('a')[1]);
		
		// Switching a month to previous
		$prev_button.click();
		setTimeout(function(){
			equal($date_input.val(), '2014-09-30 00:00');
			start(); // Done.
		}, 100);
	});

	/* Switching a month - Next
		2014-10-31 00:00 -> 2014-11-30 00:00
		Picker is inline mode, and append into an input-field. */
	asyncTest('Switching a month - Next', function(){
		expect(1);
		var $date_input = $('#date_input');
		$date_input.val('2014-10-31 00:00'); // Initial date
		$date_input.appendDtpicker({
			'inline': true
		});

		var $picker_header = $('.datepicker_header');
		var $next_button = $($picker_header.children('a')[2]);
		
		// Switching a month to previous
		$next_button.click();
		setTimeout(function(){
			equal($date_input.val(), '2014-11-30 00:00');
			start(); // Done.
		}, 100);
	});
	
	/* Option - Inline : true (Inline mode)
		Picker is inline mode, and append into an input-field. */
	test('Option - inline : true (Inline mode)', function(){
		var $date_input = $('#date_input');
		$('#date_input').appendDtpicker({
			'inline' : true
		});
		
		var $picker = $('.datepicker');
		equal($picker.css('display'), "block");
	});

	/* Option - Inline : FALSE (Float mode)
		Picker is float mode, and append into an input-field.
		In this test, Picker has shown when click and focus a field. */
	test('Option - inline : false (Float mode)', function(){
		var $date_input = $('#date_input');
		$date_input.appendDtpicker({
			'inline': false
		});

		var $picker = $('.datepicker');
		equal($picker.css('display'), "none");

		var $date_input = $('#date_input');
		$date_input.text('2014/04/24 00:00');
		$date_input.bind('focus', function(){
			var $picker = $('.datepicker');
			equal($picker.css('display'), "block");
			$date_input.unbind('focus');
		});
		$date_input.triggerHandler('click');
		$date_input.triggerHandler('focus');
	});

	/* Option : minuteInterval */
	test('Option - minuteInterval', function(){
		var $date_input = $('#date_input');
		$date_input.appendDtpicker({
			'inline': true,
			'minuteInterval': 15
		});

		var $timelist = $('.datepicker_timelist');
		var $time_cells = $timelist.children('div');
		equal($($time_cells[0]).text(), '00:00');
		equal($($time_cells[1]).text(), '00:15');
		equal($($time_cells[$time_cells.length  - 1]).text(), '23:45');
	});

	/* Option : firstDayOfWeek (Change the first day of the week) */
	test('Option - firstDayOfWeek', function(){
		var $date_input = $('#date_input');
		$date_input.appendDtpicker({
			'inline': true,
			'firstDayOfWeek': 1
		});

		var $table = $('.datepicker_table');
		var $tr_wdays = $($table.children('tbody').children('tr')[0]);
		var $wday_cells = $tr_wdays.children('th');
		equal($($wday_cells[0]).text(), 'Mo'); // Monday
		equal($($wday_cells[6]).text(), 'Su'); // Sunday
	});
});
