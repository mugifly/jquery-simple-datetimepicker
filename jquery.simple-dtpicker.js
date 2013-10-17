/**
 * jquery-simple-datetimepicker (jquery.simple-dtpicker.js)
 * (c) Masanori Ohgita - 2013.
 * https://github.com/mugifly/jquery-simple-datetimepicker
 */

 (function($) {
	var DAYS_OF_WEEK_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	var DAYS_OF_WEEK_JA = ['日', '月', '火', '水', '木', '金', '土'];
	var DAYS_OF_WEEK_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
	var DAYS_OF_WEEK_BR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
	var DAYS_OF_WEEK_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
	var DAYS_OF_WEEK_CN = ['日', '一', '二', '三', '四', '五', '六'];
	var DAYS_OF_WEEK_DE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
	var DAYS_OF_WEEK_SV = ['Sö', 'Må', 'Ti', 'On', 'To', 'Fr', 'Lö'];
	var DAYS_OF_WEEK_ID = ['Min','Sen','Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
	var DAYS_OF_WEEK_IT = ['Dom','Lun','Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
	var DAYS_OF_WEEK_TR = ['Pz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cu', 'Cts'];
	var DAYS_OF_WEEK_ES = ['dom', 'lun', 'mar', 'miér', 'jue', 'vié', 'sáb'];
	var DAYS_OF_WEEK_KO = ['일', '월', '화', '수', '목', '금', '토'];
	var DAYS_OF_WEEK_NL = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
	var DAYS_OF_WEEK_CZ = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
	var DAYS_OF_WEEK_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
	
	var MONTHS_EN = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var MONTHS_RU = [ "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек" ];
	var MONTHS_BR = [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ];
	var MONTHS_PT = [ "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro" ];
	var MONTHS_CN = [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
	var MONTHS_DE = [ "Jan", "Feb", "März", "Apr", "Mai", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dez" ];
	var MONTHS_SV = [ "Jan", "Feb", "Mar", "Apr", "Maj", "Juni", "Juli", "Aug", "Sept", "Okt", "Nov", "Dec" ];
	var MONTHS_ID = [ "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des" ];
	var MONTHS_IT = [ "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic" ];
	var MONTHS_TR = [ "Ock", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Agu", "Eyl", "Ekm", "Kas", "Arlk" ];
	var MONTHS_ES = [ "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic" ];
	var MONTHS_KO = [ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ];
	var MONTHS_NL = [ "jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec" ];
	var MONTHS_CZ = [ "Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro" ];
	var MONTHS_FR = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ];

	var PickerObjects = [];
	var InputObjects = [];
	var ActivePickerId = -1;

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
		}
		return $picker;
	};

	var getPickersInputObject = function($obj) {
		var $picker = getParentPickerObject($obj);
		if ($picker.data("inputObjectId") != null) {
			return $(InputObjects[$picker.data("inputObjectId")]);
		}
		return null;
	}

	var setToNow = function($obj) {
		var $picker = getParentPickerObject($obj);
		var date = new Date();
		draw($picker, {
			"isAnim": true,
			"isOutputToInputObject": true
		}, date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
	};

	var beforeMonth = function($obj) {
		var $picker = getParentPickerObject($obj);
		var date = getPickedDate($picker);
		var targetMonth_lastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
		if (targetMonth_lastDay < date.getDate()) {
			date.setDate(targetMonth_lastDay);
		}
		draw($picker, {
			"isAnim": true,
			"isOutputToInputObject": true
		}, date.getFullYear(), date.getMonth() - 1, date.getDate(), date.getHours(), date.getMinutes());

		var todayDate = new Date();
		var isCurrentYear = todayDate.getFullYear() == date.getFullYear();
		var isCurrentMonth = isCurrentYear && todayDate.getMonth() == date.getMonth();
		
		if (!isCurrentMonth || !$picker.data("futureOnly")) {
			if (targetMonth_lastDay < date.getDate()) {
				date.setDate(targetMonth_lastDay);
			}
			draw($picker, {
				"isAnim": true,
				"isOutputToInputObject": true
			}, date.getFullYear(), date.getMonth() - 1, date.getDate(), date.getHours(), date.getMinutes());
		}
	};

	var nextMonth = function($obj) {
		var $picker = getParentPickerObject($obj);
		var date = getPickedDate($picker);
		var targetMonth_lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
		if (targetMonth_lastDay < date.getDate()) {
			date.setDate(targetMonth_lastDay);
		}
		draw($picker, {
			"isAnim": true,
			"isOutputToInputObject": true
		}, date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes());
	};

	var getDateFormat = function(format, locale, is_date_only) {
		if (format == "default"){
			// Default format
			if(locale == "ja"){
				format = "YYYY/MM/DD hh:mm";
			}else if(locale == "ru"){
				format = "DD.MM.YYYY hh:mm";
			}else if(locale == "it"){
				format = "DD/MM/YYYY hh:mm";
			}else if (locale == "br"){
				format = "DD/MM/YYYY hh:mm";
			}else if (locale == "de"){
				format = "DD.MM.YYYY hh:mm";
			}else if (locale === "es"){
				format = "DD/MM/YYYY hh:mm";
			}else if (locale === "nl"){
				format = "DD-MM-YYYY hh:mm";
			}else if (locale === "cz"){
				format = "DD.MM.YYYY hh:mm";
			}else if (locale === "fr"){
				format = "DD-MM-YYYY hh:mm";
			}else{
				format = "YYYY-MM-DD hh:mm";
			}

			if (is_date_only) {
				// Convert the format to date-only (ex: YYYY/MM/DD)
				format = format.substring(0, format.search(' '));
			}
		}
		
		return format; // Return date-format
	};

	var parseDate = function (str, opt_date_format) {
		if(opt_date_format != null){
			// Parse date & time with date-format

			// Match a string with date format
			var df = opt_date_format.replace(/(-|\/)/g, '[-\/]')
				.replace(/YYYY/gi, '(\\d{2,4})')
				.replace(/(YY|MM|DD|hh|mm)/g, '(\\d{1,2})')
				.replace(/(M|D|h|m)/g, '(\\d{1,2})');
			var re = new RegExp(df);
			var m = re.exec(str);
			if( m != null){

				// Generate the formats array (convert-table)
				var formats = new Array();
				var format_buf = '';
				var format_before_c = '';
				var df = opt_date_format;
				while (df != null && 0 < df.length) {
					var format_c = df.substring(0, 1); df = df.substring(1, df.length);
					if (format_before_c != format_c) {
						if(/(YYYY|YY|MM|DD|mm|dd|M|D|h|m)/.test(format_buf)){
							formats.push( format_buf );
							format_buf = '';
						} else {
							format_buf = '';
						}
					}
					format_buf += format_c;
					format_before_c = format_c;
				}
				if (format_buf != '' && /(YYYY|YY|MM|DD|mm|dd|M|D|h|m)/.test(format_buf)){
					formats.push( format_buf );
				}

				// Convert a string (with convert-table) to a date object
				var date = new Date();
				var is_successful = false;
				for(var i = 0; i < formats.length; i++){
					if(m.length < i){
						break;
					}

					var f = formats[i];
					var d = m[i+1]; // Matched part of date

					if(f == 'YYYY'){
						if (d < 99) { // change year for 4 digits
							var date = new Date();
							d = parseInt(d) + parseInt(date.getFullYear().toString().substr(0, 2) + "00");
						}
						date.setFullYear(d);
						is_successful = true;
					} else if(f == 'YY'){
						date.setYear(d);
						is_successful = true;
					} else if(f == 'MM' || f == 'M'){
						date.setMonth(parseInt(d) - 1);
						is_successful = true;
					} else if(f == 'DD' || f == 'D'){
						date.setDate(d);
						is_successful = true;
					} else if(f == 'hh' || f == 'h'){
						date.setHours(d);
						is_successful = true;
					} else if(f == 'mm' || f == 'm'){
						date.setMinutes(d);
						is_successful = true;
					} 
				}

				if(is_successful == true && isNaN(date) == false && isNaN(date.getDate()) == false){ // Parse successful
					return date;
				}
			}
		}

		// Parse date & time with common format
		var re = /^(\d{2,4})[-/](\d{1,2})[-/](\d{1,2}) (\d{1,2}):(\d{1,2})$/;
		var m = re.exec(str);
		if (m === null) {
			// Parse for date-only
			re = /^(\d{2,4})[-/](\d{1,2})[-/](\d{1,2})$/;
			m = re.exec(str);
			if(m === null) {
				return NaN;
			}
		}

		if( m ){
			if (m[1] < 99) {
				var date = new Date();
				m[1] = parseInt(m[1]) + parseInt(date.getFullYear().toString().substr(0, 2) + "00");
			}
			// return
			if ( m[4] === undefined ){ // Date-only
				return new Date(m[1], m[2] - 1, m[3]);
			} else { // Date and time
				return new Date(m[1], m[2] - 1, m[3], m[4], m[5]);
			}
		}else{
			return new Date(str);
		}
	};

	var getFormattedDate = function(date, date_format) {
		if(date == null){
			date = new Date();
		}

		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var hou = date.getHours();
		var min = date.getMinutes();

		var date_format = date_format.replace(/YYYY/gi, y)
		.replace(/YY/g, y - 2000)/* century */
		.replace(/MM/g, zpadding(m))
		.replace(/M/g, m)
		.replace(/DD/g, zpadding(d))
		.replace(/D/g, d)
		.replace(/hh/g, zpadding(hou))
		.replace(/h/g, hou)
		.replace(/mm/g, zpadding(min))
		.replace(/m/g, min);
		return date_format;
	};

	var outputToInputObject = function($picker) {
		var date = getPickedDate($picker);
		var $inp = getPickersInputObject($picker);
		var locale = $picker.data("locale");
		var format = getDateFormat($picker.data("dateFormat"), locale, $picker.data('dateOnly'));
		var str = "";
		if ($inp == null) {
			return;
		}
		
		$inp.val( getFormattedDate(date, format) );
	};

	var getPickedDate = function($obj) {
		var $picker = getParentPickerObject($obj);
		return $picker.data("pickedDate");
	};

	var zpadding = function(num) {
		num = ("0" + num).slice(-2);
		return num
	};

	var draw_date = function($picker, option, date) {
		draw($picker, option, date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
	};

	var draw = function($picker, option, year, month, day, hour, min) {
		var date = new Date();

		if (hour != null) {
			date = new Date(year, month, day, hour, min, 0);
		} else if (year != null) {
			date = new Date(year, month, day);
		} else {
			date = new Date();
		}
		//console.log("dtpicker - draw()..." + year + "," + month + "," + day + " " + hour + ":" + min + " -> " + date);

		/* Read options */
		var isTodayButton = $picker.data("todayButton");
		var isScroll = option.isAnim; /* It same with isAnim */
		if($picker.data("timelistScroll") == false) {// If disabled by user option.
			isScroll = false;
		}

		var isAnim = option.isAnim;
		if($picker.data("animation") == false){ // If disabled by user option.
			isAnim = false;
		}

		var isFutureOnly = $picker.data("futureOnly");

		var isOutputToInputObject = option.isOutputToInputObject;

		var minuteInterval = $picker.data("minuteInterval");
		var firstDayOfWeek = $picker.data("firstDayOfWeek");

		/* Read locale option */
		var locale = $picker.data("locale");
		var daysOfWeek = DAYS_OF_WEEK_EN;
		if(locale == "ja"){
			daysOfWeek = DAYS_OF_WEEK_JA;
		} else if(locale == "ru"){
			daysOfWeek = DAYS_OF_WEEK_RU;
		} else if(locale == "br"){
			daysOfWeek = DAYS_OF_WEEK_BR;
		} else if(locale == "pt"){
			daysOfWeek = DAYS_OF_WEEK_PT;
		} else if(locale == "cn"){
			daysOfWeek = DAYS_OF_WEEK_CN;
		} else if (locale == "de"){
			daysOfWeek = DAYS_OF_WEEK_DE;
		} else if (locale == "sv"){
			daysOfWeek = DAYS_OF_WEEK_SV;
		} else if (locale == "id"){
			daysOfWeek = DAYS_OF_WEEK_ID;
		} else if (locale == "it"){
			daysOfWeek = DAYS_OF_WEEK_IT;
		} else if (locale == "tr"){
			daysOfWeek = DAYS_OF_WEEK_TR;
		} else if (locale === "es"){
			daysOfWeek = DAYS_OF_WEEK_ES;
		} else if (locale === "ko"){
			daysOfWeek = DAYS_OF_WEEK_KO;
		} else if (locale === "nl"){
			daysOfWeek = DAYS_OF_WEEK_NL;
		} else if (locale === "fr"){
			daysOfWeek = DAYS_OF_WEEK_FR;
		}

		/* Calculate dates */
		var todayDate = new Date();
		var firstWday = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - firstDayOfWeek;
		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
		var beforeMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
		var dateBeforeMonth = new Date(date.getFullYear(), date.getMonth(), 0);
		var dateNextMonth = new Date(date.getFullYear(), date.getMonth() + 2, 0);
		var isCurrentYear = todayDate.getFullYear() == date.getFullYear();
		var isCurrentMonth = isCurrentYear && todayDate.getMonth() == date.getMonth();
		var isCurrentDay = isCurrentMonth && todayDate.getDate() == date.getDate();

		/* Collect each part */
		var $header = $picker.children('.datepicker_header');
		var $inner = $picker.children('.datepicker_inner_container');
		var $calendar = $picker.children('.datepicker_inner_container').children('.datepicker_calendar');
		var $table = $calendar.children('.datepicker_table');
		var $timelist = $picker.children('.datepicker_inner_container').children('.datepicker_timelist');

		/* Grasp a point that will be changed */
		var changePoint = "";
		var oldDate = getPickedDate($picker);
		if(oldDate != null){
			if(oldDate.getMonth() != date.getMonth() || oldDate.getDate() != date.getDate()){
				changePoint = "calendar";
			} else if (oldDate.getHours() != date.getHours() || oldDate.getMinutes() != date.getMinutes()){
				if(date.getMinutes() == 0 || date.getMinutes() % minuteInterval == 0){
					changePoint = "timelist";
				}
			}
		}

		/* Save newly date to Picker data */
		$($picker).data("pickedDate", date);

		/* Fade-out animation */
		if (isAnim == true) {
			if(changePoint == "calendar"){
				$calendar.stop().queue([]);
				$calendar.fadeTo("fast", 0.8);
			}else if(changePoint == "timelist"){
				$timelist.stop().queue([]);
				$timelist.fadeTo("fast", 0.8);
			}
		}
		/* Remind timelist scroll state */
		var drawBefore_timeList_scrollTop = $timelist.scrollTop();

		/* New timelist  */
		var timelist_activeTimeCell_offsetTop = -1;

		/* Header ----- */
		$header.children().remove();

		if (!isFutureOnly || !isCurrentMonth) {
			var $link_before_month = $('<a>');
			$link_before_month.text('<');
			$link_before_month.prop('alt', 'Previous month');
			$link_before_month.prop('title', 'Previous month');
			$link_before_month.click(function() {
				beforeMonth($picker);
			});
		}

		var $now_month = $('<span>');
		if(locale == "ja"){
			$now_month.text(date.getFullYear() + " / " + zpadding(date.getMonth() + 1));
		} else if(locale == "ru"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_RU[date.getMonth()]);
		} else if(locale == "br"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_BR[date.getMonth()]);
		} else if(locale == "pt"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_PT[date.getMonth()]);
		} else if(locale == "cn"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_CN[date.getMonth()]);
		} else if(locale == "de"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_DE[date.getMonth()]);
		} else if(locale == "sv"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_SV[date.getMonth()]);
		} else if(locale == "id"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_ID[date.getMonth()]);
		} else if(locale == "it"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_IT[date.getMonth()]);
		} else if(locale == "tr"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_TR[date.getMonth()]);
		} else if(locale == "es"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_ES[date.getMonth()]);
		} else if(locale == "ko"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_KO[date.getMonth()]);
		} else if(locale == "nl"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_NL[date.getMonth()]);
		} else if(locale == "fr"){
			$now_month.text(date.getFullYear() + " - " + MONTHS_FR[date.getMonth()]);
		} else {
			$now_month.text(date.getFullYear() + " - " + MONTHS_EN[date.getMonth()]);
		}

		var $link_next_month = $('<a>');
		$link_next_month.text('>');
		$link_next_month.prop('alt', 'Next month');
		$link_next_month.prop('title', 'Next month');
		$link_next_month.click(function() {
			nextMonth($picker);
		});

		if (isTodayButton) {
			var $link_today = $('<a/>');
			/*
				This icon resource from a part of "FontAwesome" by Dave Gandy - http://fontawesome.io".
				http://fortawesome.github.io/Font-Awesome/license/
				Thankyou.
			*/
			$link_today.html( decodeURIComponent('%3c%3fxml%20version%3d%221%2e0%22%20encoding%3d%22UTF%2d8%22%20standalone%3d%22no%22%3f%3e%3csvg%20%20xmlns%3adc%3d%22http%3a%2f%2fpurl%2eorg%2fdc%2felements%2f1%2e1%2f%22%20%20xmlns%3acc%3d%22http%3a%2f%2fcreativecommons%2eorg%2fns%23%22%20xmlns%3ardf%3d%22http%3a%2f%2fwww%2ew3%2eorg%2f1999%2f02%2f22%2drdf%2dsyntax%2dns%23%22%20%20xmlns%3asvg%3d%22http%3a%2f%2fwww%2ew3%2eorg%2f2000%2fsvg%22%20xmlns%3d%22http%3a%2f%2fwww%2ew3%2eorg%2f2000%2fsvg%22%20%20version%3d%221%2e1%22%20%20width%3d%22100%25%22%20%20height%3d%22100%25%22%20viewBox%3d%220%200%2010%2010%22%3e%3cg%20transform%3d%22translate%28%2d5%2e5772299%2c%2d26%2e54581%29%22%3e%3cpath%20d%3d%22m%2014%2e149807%2c31%2e130932%20c%200%2c%2d0%2e01241%200%2c%2d0%2e02481%20%2d0%2e0062%2c%2d0%2e03721%20L%2010%2e57723%2c28%2e153784%207%2e0108528%2c31%2e093719%20c%200%2c0%2e01241%20%2d0%2e0062%2c0%2e02481%20%2d0%2e0062%2c0%2e03721%20l%200%2c2%2e97715%20c%200%2c0%2e217084%200%2e1798696%2c0%2e396953%200%2e3969534%2c0%2e396953%20l%202%2e3817196%2c0%200%2c%2d2%2e38172%201%2e5878132%2c0%200%2c2%2e38172%202%2e381719%2c0%20c%200%2e217084%2c0%200%2e396953%2c%2d0%2e179869%200%2e396953%2c%2d0%2e396953%20l%200%2c%2d2%2e97715%20m%201%2e383134%2c%2d0%2e427964%20c%200%2e06823%2c%2d0%2e08063%200%2e05582%2c%2d0%2e210882%20%2d0%2e02481%2c%2d0%2e279108%20l%20%2d1%2e358324%2c%2d1%2e128837%200%2c%2d2%2e530576%20c%200%2c%2d0%2e111643%20%2d0%2e08683%2c%2d0%2e198477%20%2d0%2e198477%2c%2d0%2e198477%20l%20%2d1%2e190859%2c0%20c%20%2d0%2e111643%2c0%20%2d0%2e198477%2c0%2e08683%20%2d0%2e198477%2c0%2e198477%20l%200%2c1%2e209467%20%2d1%2e513384%2c%2d1%2e265289%20c%20%2d0%2e2605%2c%2d0%2e217083%20%2d0%2e682264%2c%2d0%2e217083%20%2d0%2e942764%2c0%20L%205%2e6463253%2c30%2e42386%20c%20%2d0%2e080631%2c0%2e06823%20%2d0%2e093036%2c0%2e198476%20%2d0%2e024809%2c0%2e279108%20l%200%2e3845485%2c0%2e458976%20c%200%2e031012%2c0%2e03721%200%2e080631%2c0%2e06203%200%2e1302503%2c0%2e06823%200%2e055821%2c0%2e0062%200%2e1054407%2c%2d0%2e01241%200%2e1488574%2c%2d0%2e04342%20l%204%2e2920565%2c%2d3%2e578782%204%2e292058%2c3%2e578782%20c%200%2e03721%2c0%2e03101%200%2e08063%2c0%2e04342%200%2e13025%2c0%2e04342%200%2e0062%2c0%200%2e01241%2c0%200%2e01861%2c0%200%2e04962%2c%2d0%2e0062%200%2e09924%2c%2d0%2e03101%200%2e130251%2c%2d0%2e06823%20l%200%2e384549%2c%2d0%2e458976%22%20%2f%3e%3c%2fg%3e%3c%2fsvg%3e') );
			$link_today.addClass('icon-home');
			$link_today.prop('alt', 'Today');
			$link_today.prop('title', 'Today');
			$link_today.click(function() {
				setToNow($picker);
			});
			$header.append($link_today);
		}

		$header.append($link_before_month);
		$header.append($now_month);
		$header.append($link_next_month);

		/* Calendar > Table ----- */
		$table.children().remove();
		var $tr = $('<tr>');
		$table.append($tr);

		/* Output wday cells */
		var firstDayDiff = 7 + firstDayOfWeek;
		for (var i = 0; i < 7; i++) {
			var $td = $('<th>');
			$td.text(daysOfWeek[((i + firstDayDiff) % 7)]);
			$tr.append($td);
		}

		/* Output day cells */
		var cellNum = Math.ceil((firstWday + lastDay) / 7) * 7;
		var i = 0;
		if(firstWday < 0){
			i = -7;
		}
		for (var zz = 0; i < cellNum; i++) {
			var realDay = i + 1 - firstWday;
			var isPast = isCurrentMonth && realDay < todayDate.getDate();

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
				$td.data("dateStr", dateBeforeMonth.getFullYear() + "/" + (dateBeforeMonth.getMonth() + 1) + "/" + (beforeMonthLastDay + realDay));
			} else if (i < firstWday + lastDay) {/* Now months day */
				$td.text(realDay);
				$td.data("dateStr", (date.getFullYear()) + "/" + (date.getMonth() + 1) + "/" + realDay);
			} else {/* Next months day */
				$td.text(realDay - lastDay);
				$td.addClass('day_another_month');
				$td.data("dateStr", dateNextMonth.getFullYear() + "/" + (dateNextMonth.getMonth() + 1) + "/" + (realDay - lastDay));
			}

			if (((i + firstDayDiff) % 7) == 0) {/* Sunday */
				$td.addClass('wday_sun');
			} else if (((i + firstDayDiff) % 7) == 6) {/* Saturday */
				$td.addClass('wday_sat');
			}

			if (realDay == date.getDate()) {/* selected day */
				$td.addClass('active');
			}

			if (isCurrentMonth && realDay == todayDate.getDate()) {/* today */
				$td.addClass('today');
			}

			/* Set event-handler to day cell */

			if (isFutureOnly && isPast) {
				$td.addClass('day_in_past');
			} else {
				$td.click(function() {
					if ($(this).hasClass('hover')) {
						$(this).removeClass('hover');
					}
					$(this).addClass('active');

					var $picker = getParentPickerObject($(this));
					var targetDate = new Date($(this).data("dateStr"));
					var selectedDate = getPickedDate($picker);
					draw($picker, {
						"isAnim": false,
						"isOutputToInputObject": true
					}, targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), selectedDate.getHours(), selectedDate.getMinutes());
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
		}
		
		if ($picker.data("dateOnly") == true) {
			/* dateOnly mode */
			$timelist.css("display", "none");
		} else {
			/* Timelist ----- */
			$timelist.children().remove();

			/* Set height to Timelist (Calendar innerHeight - Calendar padding) */
			$timelist.css("height", $calendar.innerHeight() - 10 + 'px');

			/* Output time cells */
			for (var hour = 0; hour < 24; hour++) {
				for (var min = 0; min < 60; min += minuteInterval) {
					var $o = $('<div>');
					var isPastTime = hour < todayDate.getHours() || (hour == todayDate.getHours() && min < todayDate.getMinutes());
					var isPast = isCurrentDay && isPastTime;
					
					$o.addClass('timelist_item');
					$o.text(zpadding(hour) + ":" + zpadding(min));

					$o.data("hour", hour);
					$o.data("min", min);

					$timelist.append($o);

					if (hour == date.getHours() && min == date.getMinutes()) {/* selected time */
						$o.addClass('active');
						timelist_activeTimeCell_offsetTop = $o.offset().top;
					}

					/* Set event handler to time cell */

					if (isFutureOnly && isPast) {
						$o.addClass('time_in_past');
					} else {
						$o.click(function() {
							if ($(this).hasClass('hover')) {
								$(this).removeClass('hover');
							}
							$(this).addClass('active');

							var $picker = getParentPickerObject($(this));
							var date = getPickedDate($picker);
							var hour = $(this).data("hour");
							var min = $(this).data("min");
							draw($picker, {
								"isAnim": false,
								"isOutputToInputObject": true
							}, date.getFullYear(), date.getMonth(), date.getDate(), hour, min);

							if ($picker.data("isInline") == false && $picker.data("closeOnSelected")){
								// Close a picker
								ActivePickerId = -1;
								$picker.hide();
							}
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
			}

			/* Scroll the timelist */
			if(isScroll == true){
				/* Scroll to new active time-cell position */
				$timelist.scrollTop(timelist_activeTimeCell_offsetTop - $timelist.offset().top);
			}else{
				/* Scroll to position that before redraw. */
				$timelist.scrollTop(drawBefore_timeList_scrollTop);
			}
		}
		
		/* Fade-in animation */
		if (isAnim == true) {
			if(changePoint == "calendar"){
				$calendar.fadeTo("fast", 1.0);
			}else if(changePoint == "timelist"){
				$timelist.fadeTo("fast", 1.0);
			}
		}

		/* Output to InputForm */
		if (isOutputToInputObject == true) {
			outputToInputObject($picker);
		}
	};

	var init = function($obj, opt) {
		/* Container */
		var $picker = $('<div>');
		$picker.addClass('datepicker')
		$obj.append($picker);

		/* Set current date */
		if(opt.current == null) {
			opt.current = new Date();
		} else {
			var format = getDateFormat(opt.dateFormat, opt.locale, opt.dateOnly);
			opt.current = parseDate(opt.current, format);
		}

		/* Set options data to container object  */
		if (opt.inputObjectId != null) {
			$picker.data("inputObjectId", opt.inputObjectId);
		}
		$picker.data("dateOnly", opt.dateOnly);
		$picker.data("pickerId", PickerObjects.length);
		$picker.data("dateFormat", opt.dateFormat);
		$picker.data("locale", opt.locale);
		$picker.data("firstDayOfWeek", opt.firstDayOfWeek);
		$picker.data("animation", opt.animation);
		$picker.data("closeOnSelected", opt.closeOnSelected);
		$picker.data("timelistScroll", opt.timelistScroll);
		$picker.data("calendarMouseScroll", opt.calendarMouseScroll);
		$picker.data("todayButton", opt.todayButton);
		$picker.data('futureOnly', opt.futureOnly);

		$picker.data("state", 0);

		if( 5 <= opt.minuteInterval && opt.minuteInterval <= 30 ){
			$picker.data("minuteInterval", opt.minuteInterval);
		} else {
			$picker.data("minuteInterval", 30);
		}

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

		/* Set event handler to picker */
		$picker.hover(
			function(){
				ActivePickerId = $(this).data("pickerId");
			},
			function(){
				ActivePickerId = -1;
			}
		);

		/* Set event-handler to calendar */
		if (opt.calendarMouseScroll) {
			if (window.sidebar) { // Mozilla Firefox
				$calendar.bind('DOMMouseScroll', function(e){ // Change a month with mouse wheel scroll for Fx
					var $picker = getParentPickerObject($(this));
					
					var delta = e.originalEvent.detail;
					if(e.originalEvent.axis !== undefined && e.originalEvent.asix == e.originalEvent.HORIZONTAL_AXIS){
						e.deltaX = delta;
						e.deltaY = 0;
					} else {
						e.deltaX = 0;
						e.deltaY = delta;
					}
					e.deltaX /= 3;
					e.deltaY /= 3;

					if(e.deltaY > 0) {
						nextMonth($picker);
					} else {
						beforeMonth($picker);
					}

					return false;
				});
			} else { // Other browsers
				$calendar.bind('mousewheel', function(e){ // Change a month with mouse wheel scroll
					var $picker = getParentPickerObject($(this));
					if(e.originalEvent.wheelDelta /120 > 0) {
						beforeMonth($picker);
					} else {
						nextMonth($picker);
					}
					return false;
				});
			}
		}

		PickerObjects.push($picker);

		draw_date($picker, {
			"isAnim": true,
			"isOutputToInputObject": true
		}, opt.current);
	};

	/**
	 * Initialize dtpicker
	 */
	 $.fn.dtpicker = function(config) {
		var date = new Date();
		var defaults = {
			"inputObjectId": 	undefined,
			"current": 		null,
			"dateFormat": 	"default",
			"locale": 			"en",
			"animation":           true,
			"minuteInterval":  	30,
			"firstDayOfWeek":		0,
			"closeOnSelected": false,
			"timelistScroll": true,
			"calendarMouseScroll": true,
			"todayButton": true,
			"dateOnly": false,
			"futureOnly": false
		};

		var options = $.extend(defaults, config);

		return this.each(function(i) {
			init($(this), options);
		});
	 };

	/**
	 * Initialize dtpicker, append to Text input field
	 * */
	 $.fn.appendDtpicker = function(config) {
		var date = new Date();
		var defaults = {
			"inline": false,
			"current": null,
			"dateFormat": "default",
			"locale": 			"en",
			"animation": true,
			"minuteInterval":  	30,
			"firstDayOfWeek":		0,
			"closeOnSelected": false,
			"timelistScroll": true,
			"calendarMouseScroll": true,
			"todayButton": true,
			"dateOnly" : false,
			"futureOnly": false
		}
		var options = $.extend(defaults, config);

		return this.each(function(i) {

			/* Add input-field with inputsObjects array */
			var input = this;
			var inputObjectId = InputObjects.length;
			InputObjects.push(input);

			options.inputObjectId = inputObjectId;

			/* Current date */
			var date, strDate, strTime;
			if($(input).val() != null && $(input).val() != ""){
				options.current = $(input).val();
			}

			/* Make parent-div for picker */
			var $d = $('<div>');
			if(options.inline == false){
				/* float mode */
				$d.css("position","absolute");
			}
			$d.insertAfter(input);

			/* Initialize picker */

			var pickerId = PickerObjects.length;

			var $picker_parent = $($d).dtpicker(options); // call dtpicker() method

			var $picker = $picker_parent.children('.datepicker');

			/* Link input-field with picker*/
			$(input).data('pickerId', pickerId);

			/* Set event handler to input-field */

			$(input).keyup(function() {
				var $input = $(this);
				var $picker = $(PickerObjects[$input.data('pickerId')]);
				if ($input.val() != null && (
					$input.data('beforeVal') == null ||
					( $input.data('beforeVal') != null && $input.data('beforeVal') != $input.val())	)
					) { /* beforeValue == null || beforeValue != nowValue  */
					var format = getDateFormat($picker.data('dateFormat'), $picker.data('locale'), $picker.data('dateOnly'));
					var date = parseDate($input.val(), format);
				if (isNaN(date) == false && isNaN(date.getDate()) == false) {/* Valid format... */
					draw_date($picker, {
						"isAnim":true,
						"isOutputToInputObject":false
					}, date);
				}
			}
			$input.data('beforeVal',$input.val())
		});

		$(input).change(function(){
			$(this).trigger('keyup');
		});

		if(options.inline == true){
			/* inline mode */
			$picker.data('isInline',true);
		}else{
			/* float mode */
			$picker.data('isInline',false);
			$picker_parent.css({
				"zIndex": 100
			});
			$picker.css("width","auto");

			/* Hide this picker */
			$picker.hide();

			/* Set onClick event handler for input-field */
			$(input).click(function(){
				var $input = $(this);
				var $picker = $(PickerObjects[$input.data('pickerId')]);
				ActivePickerId = $input.data('pickerId');
				$picker.show();
				var _position = $(input).parent().css('position');
				if(_position === 'relative' || _position === 'absolute'){
					$picker.parent().css("top", $input.outerHeight() + 2 + "px");
				}
				else{
					$picker.parent().css("top", $input.position().top + $input.outerHeight() + 2 + "px");
					$picker.parent().css("left", $input.position().left + "px");
				}
			});
		}
	});
};

	/* Set event handler to Body element, for hide a floated-picker */
	$(function(){
		$('body').click(function(){
			for(var i=0;i<PickerObjects.length;i++){
				var $picker = $(PickerObjects[i]);
				if(ActivePickerId != i){	/* if not-active picker */
					if($picker.data("inputObjectId") != null && $picker.data("isInline") == false){
						/* if append input-field && float picker */
						$picker.hide();
					}
				}
			}
		});
	});

})(jQuery);
