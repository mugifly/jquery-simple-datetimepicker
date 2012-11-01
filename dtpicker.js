/**
 * dtpicker (jquery-simple-datatimepicker)
 * (c) Masanori Ohgita - 2012.
 * https://github.com/mugifly/jquery-simple-datetimepicker
 */

(function($){
    $.fn.dtpicker=function(config){
        var defaults={
        	
        }
        var options=$.extend(defaults, config);
        return this.each(function(i){
			$(this).dtpickerInit();
        });
    };
	
	$.fn.dtpickerDraw = function(year, month, day){
		var obj = $(this);
		var date = new Date();
		if(year != null){
			date = new Date(year, month, day);
		}else{
			date = new Date();
		}
		
		var header = obj.children('.datepicker_header');
		header.text("<< " + (date.getYear() + 1900) + " / " + (date.getMonth() + 1) + " >>");
		
		
		
	};
	
	$.fn.dtpickerInit = function(){
		var obj = $(this);
		/* Header */
		var header = $('<div>');
		header.addClass('datepicker_header');
		obj.append(header);
		/* InnerContainer*/
		var container = $('<div>');
		container.addClass('datepicker_inner_container');
		obj.append(container);
		/* Calendar */
		var calendar = $('<div>');
		calendar.addClass('datepicker_calendar');
		var table = $('<table>');
		table.addClass('datepicker_table');
		calendar.append(table);
		container.append(calendar);
		/* Timelist */
		var timelist = $('<div>');
		timelist.addClass('datepicker_timelist');
		container.append(timelist);
		
		obj.dtpickerDraw();
	};
})(jQuery);