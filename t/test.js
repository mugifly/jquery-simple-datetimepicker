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
			// Destroy a picker
			$date_input.handleDtpicker('destroy');
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
			// Destroy a picker on the root element
			$date_input.handleDtpicker('destroy');
			start(); // Done.
		}, 100);
	});
	
	/* handleDtpicker method
		Picker is inline mode, and append into an input-field. */
	test('handleDtpicker method', function(){
		var $date_input = $('#date_input');
		$date_input.val('2014-10-31 00:00'); // Initial date
		$date_input.appendDtpicker({
			'inline': true
		});
		var $picker = $('.datepicker');
		
		$date_input.handleDtpicker('show');
		equal($picker.css('display'), "block");

		$date_input.handleDtpicker('hide');
		equal($picker.css('display'), "none");
		
		$date_input.handleDtpicker('setDate', new Date(2014, 11, 01, 12, 10, 0));

		// Check a date
		var date = $date_input.handleDtpicker('getDate');
		equal(date.getFullYear(), 2014);
		equal(date.getMonth(), 11);
		equal(date.getDate(), 1);
		equal(date.getHours(), 12);
		equal(date.getMinutes(), 10);
	});

	/* Automatically destroy
		Picker is float mode, and append into an input-field. */
	asyncTest('Automatically destroy', function(){
		expect(1);
		var $date_input = $('#date_input');
		$date_input.val('2014-10-31 00:00'); // Initial date
		$date_input.appendDtpicker({
			'inline': false
		});
		
		// Delete an input-field
		$date_input.remove();
		setTimeout(function(){
			var $picker = $('.datepicker');
			equal($picker.length, 0); // There is not a single picker in it.
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
			
			// Destroy a picker on the root element
			$date_input.handleDtpicker('destroy');
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
