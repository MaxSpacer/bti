/* Файл скрипта для сайтов (основной и мобильной версий) */

/* функция для использования в FCK. Показывает картинку во всплывающем окне с крестиком для закрытия */
function showImageWithCloseButton( imgUrl, width, height )
{
	showPopupCentered(
		imgUrl, width, height, '',
		{onLoad:
			function( frame ){
				$( "<img src='img/close.png'/>" )
					.css( "position", "absolute" )
					.css( "top", "10px" )
					.css( "right", "10px" )
					.css( "cursor", "pointer" )
					.click( function() { $( 'body' ).click(); $( 'body' ).click(); $('.popupIframeBg').click(); } )
					.insertBefore( $( "img", frame[0].contentDocument )
				);
			}
		}
	);
}


/* переопределение функции showCalendarPopup из common.js для выставления уменьшенной высоты попапа */
var _showCalendarPopup = window.showCalendarPopup;
showCalendarPopup = function(e, url, width, height) {
	return _showCalendarPopup(e, url, 210, 249);
};


function inherit(Child, Parent) {
	var f = function() { }
	f.prototype = Parent.prototype;
	Child.prototype = new f();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}

/* ============================================================================
Функции для работы с попапами в шапке
============================================================================ */

function closeFeedbackForm() {
	HeaderPopups.closePopup("feedback");
}

var HeaderPopups = {

	popups: {
		feedback: "#header-feedbackForm",
		login: "#header-loginForm",
		registration: "#header-registrationForm",
		registration2: "#header-registrationForm2",
		mobile: "#mobile-version-popup"
	},

	closePopup: function(key) {
		var selector = this.popups[key];
		if (!selector) return;
		$(selector).hide();
	},

	togglePopup: function(key) {
		var selector = this.popups[key];
		if (!selector) return;
		var $popup = $(selector);

		// если данные попап отображён, скрываем его
		if ($popup.is(":visible")) {
			$popup.hide();
			return;
		}

		// иначе скрываем остальные и показываем этот
		for (var otherKey in this.popups)
			if (otherKey != key && this.popups.hasOwnProperty(otherKey))
				$(this.popups[otherKey]).hide();
		$popup.show();

		// устанавливаем фокус на первый input
		var $input = $popup.find(":input:not(type=hidden):first");
		if ($input.length)
			$input.focus();
		else {
			// для страницы обратной связи - пробуем найти фрейм
			$input = $(":input:not([type=hidden]):first", $popup.find("iframe").contents());
			$input.focus();
		}
	}
};

/* ============================================================================
Шапка (попапы) и подвал (список партнёров)
============================================================================ */

$( function() {

	/* загрузка блока с информацией о пользователе AJAX'ом, чтобы не кешировался даже если кешируется сама страница */
	$("#header-userBlock").load("current-user-block.aspx", null, function() {

		$("#header-loginLink").click( function() {
			HeaderPopups.togglePopup("login");
			return false;
		});
		$("#header-loginForm .btiPopupClose").click( function() {
			HeaderPopups.closePopup("login");
			return false;
		});
		$("a#header-registrationLink").click( function() {
			HeaderPopups.togglePopup("registration");
			return false;
		});
		$("#header-registrationForm .btiPopupClose").click( function() {
			HeaderPopups.closePopup("registration");
			return false;
		});

		/* В Chrome нажатие Enter при редактировании поля в форме регистрации в шапке интерпретируется как нажатие
		   кнопки обновления капчи (input type="image") вместо нажатия кнопки "Зарегистрироваться".
		   Вешаем собственный обработчик Enter
		   <http://stackoverflow.com/questions/4192702/how-to-make-an-input-type-image-not-submit-on-enter-in-webkit>
		*/
		$("#header-registrationForm").keypress( function( e ) {
			if( e.which === 13 ) {
				$("#registration-form-submit").click();
				return false;
			}
		});
	});

	/* обработка блока обратной связи */
	$("#header-feedback").click( function() {
		HeaderPopups.togglePopup("feedback");
		return false;
	});

	/* Регистрация на страницце login.aspx*/
	$("a#registrationForm2Link").click( function() {
		HeaderPopups.togglePopup("registration2");
		return false;
	});
	$("#header-registrationForm2 .btiPopupClose").click( function() {
		HeaderPopups.closePopup("registration2");
		return false;
	});

	/* баннеры */
	var visibleBanners = 6;
	if( $(".banners li").length <= visibleBanners ) {
		/* вместо слайдшоу показываем центрированные картинки */
		$(".footerBanners").addClass("slideshowDisabled");
	}
	else {
		/* инициализация слайдшоу */
		new ScrollableSlideshow({
			container: $(".banners"),
			forwardButton: $(".footerBanners .right"),
			backwardButton: $(".footerBanners .left"),
			visibleSlidesCount: visibleBanners,
			buttonEnabledClass: "enabled",
			animation: {
				prop: 'marginLeft',
				// значение, которое должно добавлять/прибавляться к текущему значению
				// свойства при нажатии кнопки, обычно ширина/высота превью + паддинг
				offset: 130,
				// длительность анимации, мс
				speed: 500
			}
		});
	}
});

/* ============================================================================
Вспомогательные функции для работы с cookie
============================================================================ */

// http://learn.javascript.ru/cookie

// Установить куку
// Аргументы:
//   name - название cookie
//   value - значение cookie (строка)
//   options - Объект с дополнительными свойствами для установки cookie:
//	 - expires - Время истечения cookie. Интерпретируется по-разному, в зависимости от типа:
//					 - Число — количество секунд до истечения. Например, expires: 3600 — кука на час.
//					 - Объект типа Date — дата истечения.
//				   - Если expires в прошлом, то cookie будет удалено.
//				   - Если expires отсутствует или 0, то cookie будет установлено как сессионное и исчезнет при закрытии браузера.
//	 - path - Путь для cookie.
//	 - domain - Домен для cookie.
//	 - secure - Если true, то пересылать cookie только по защищенному соединению.
function setCookie(name, value, options) {
	options = options || {};

	var expires = options.expires;

	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}

	value = encodeURIComponent(value);

	var updatedCookie = name + "=" + value;

	for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}

	document.cookie = updatedCookie;
}

// возвращает cookie с именем name, если есть, если нет, то null
function getCookie(name) {
	var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : null;
}

function deleteCookie(name) {
	setCookie(name, "", { expires: -1 })
}

/* ============================================================================
Обработка полей ввода телефона
============================================================================ */

var PHONE_PATTERN = "+7(...)...-..-..";
var PHONE_DEFAULT = "+7(";

$( function() {

	$("input.phone")
		.focus( function() {
			// если контрол был пуст, автоматически добавляем +7 из шаблона
			if ( !this.value ) {
				this.value = PHONE_DEFAULT;
				// для IE, чтобы курсор ставился в конец текста в контроле, а не в начало
				if( $.browser.msie && this.createTextRange ) {
					var range = this.createTextRange();
					range.collapse(true);
					range.moveStart( 'character', PHONE_DEFAULT.length );
					range.moveEnd( 'character', PHONE_DEFAULT.length );
					range.select();
				}
			}
		})
		.blur( function() {
			// если в контроле осталось то, что мы добавили автоматически при фокусе, очищаем его
			if ($(this).val() == PHONE_DEFAULT)
				$(this).val("");
		})
		.bind( "keydown keypress keyup", function(e) {
			var $input = $(this);
			var handleBackspace = e.which == 8 && e.type == "keydown";
			window.setTimeout( function() { formatPhone($input, handleBackspace); }, 50 );
			if (e.which == 8) {
				// backspace обрабатываем вручную
				return false;
			}
		});
});

/* форматирование содержимого поля "Телефон" */
function formatPhone($input, handleBackspace) {
	var text = $input.val();

	// выбираем все цифры из значения контрола
	var digits = "";
	var digitsRe = /\d/g;
	while (true) {
		var match = digitsRe.exec(text);
		if (!match)
			break;
		digits += match;
	}

	// при нажатии backspace удаляем последнюю цифру
	if( handleBackspace && digits.length > 0 )
		digits = digits.substring( 0, digits.length - 1 );

	// удаляем первую '7', потому что она фиксированная
	if (digits.substring(0, 1) == "7")
		digits = digits.substring(1);

	var result = "";
	var prevPos = 0;
	var nextPos;
	for (var i = 0; i < digits.length; i++) {
		nextPos = PHONE_PATTERN.indexOf(".", prevPos);
		if (nextPos == -1)
			break;
		result += PHONE_PATTERN.substring(prevPos, nextPos);
		result += digits[i];
		prevPos = nextPos + 1;
	}
	nextPos = PHONE_PATTERN.indexOf(".", prevPos);
	if (nextPos == -1)
		nextPos = PHONE_PATTERN.length;
	result += PHONE_PATTERN.substring(prevPos, nextPos);

	$input.val(result);
}

/* ============================================================================
Отправка сообщения об орфографической ошибке
============================================================================ */

function btiGetSelection() {
	if( window.getSelection )
		return getSelection().toString();
	if( document.getSelection )
		return document.getSelection().toString();
	if( document.selection )
		return document.selection.createRange().text;
}

function btiSendMessage( text, type ) {
	if( confirm('Вы нашли ошибку в тексте:\n\n' + text + '\n\nДействительно отправить запрос редакторам?' ) ) {
		$.ajax({
			type: "POST",
			url: "send-message.aspx",
			data: {
				type: type,
				url: document.URL,
				text: text
			},
			error: function() {
				alert("Ошибка обработки данных. Попробуйте ещё раз");
			},
			success: function(result) {
				alert(result);
			}
		});
	}
}

$( function() {

	$(document).keydown( function(e) {
		// Ctrl-Enter
		if( e.ctrlKey && e.which == 13 ) {
			var sel = btiGetSelection();
			if( sel ) {
				if( sel.length < 10 )
					alert('Вы выделили слишком мало символов. Необходимо хотя бы 10');
				else if( sel.length > 350 )
					alert('Вы выделили слишком много символов. Необходимый максимум 350');
				else
					btiSendMessage( sel, "orthographic-error" );
			}
		}
	});
});

/* ============================================================================
Облако тэгов
============================================================================ */

if( window.Clouder )
	$( function() {
		var CLOUD_PARAMS = {
			colorMin: "#000000",
			colorMax: "#FFFFFF",
			colorBgr: "#FFFFFF",
			interval: 50,
			fontSize: 18,
			fontShift: 4,
			opaque: 0.3
		};

		function cloudCallback( id ) {
			window.open( id );
		}

		function initClouds() {
			$('ul.clouder').each( function() {
				var tags = $(this).children('li').children('a').map( function() {
					return { text: $(this).text(), id: $(this).attr('href'), weight: 0 };
				}).get();

				var container = $("<div class='clouder'/>").insertAfter(this);
				container.attr('style', $(this).attr('style'));
				$(this).remove();

				new Clouder( $.extend( {}, CLOUD_PARAMS, {
					container: container[0],
					tags: tags,
					callback: cloudCallback
				}));
			});
		}

		initClouds();
	});

/* ============================================================================
Переход к мобильной версии (для сайта)
============================================================================ */

$( function() {

	$("#mobile-version-link").click( function() {
		HeaderPopups.togglePopup("mobile");
		return false;
	});

	$("#mobile-version-popup .btiPopupClose").click( function() {
		HeaderPopups.closePopup("mobile");
		return false;
	});

	$("#mobile-version-go").click( function() {
		var $data = $("#mobile-version-link");

		// запоминаем в Cookie, что пользователь хочет использовать мобильную версию по умолчанию
		if( $("#remember-mobile-version").is(":checked") )
			setCookie( "PreferredSiteVersion", "mobile", {
				expires: 60 * 24 * 3600 /* 60 дней */,
				path: $data.attr("data-cookie-path")
			});

		// перенаправляем на мобильный сайт
		window.location.href = $data.attr("href");

		return false;
	});
});

/* ============================================================================
Сворачиваемые списки
============================================================================ */

$(function() {

	$(".collapsible_switcher").mousedown(function() {
		var $header = $(this).parents(".collapsible_header:first");
		var $content = $header.next(".collapsible_content");
		var collapsed = $header.hasClass("collapsed");

		$header.ST_toggleClass("collapsed", !collapsed);
		if( collapsed )
			$content.queue(function() {
				$(this)
					.hide().removeClass("collapsed")
					.slideDown(400)
					.dequeue();
			});
		else
			$content
				.slideUp(400)
				.queue( function() {
					$(this).addClass("collapsed").dequeue();
				});

		return false;
	});

});

/* ============================================================================
Сворачиваемый футер
============================================================================ */

$(function() {

	var $page = $(".pageCenter"),
		$pageContent = $(".pageContent"),
		$pageFooter = $(".footer");

	// высота сворачиваемого содержимого
	var contentHeight = 74;

	function footerSticked() {
		return $pageContent.offset().top + $pageContent.outerHeight() < windowGeometry.getViewportHeight();
	}

	function footerStickedAfterExpansion() {
		return $pageContent.offset().top + $pageContent.outerHeight() + contentHeight < windowGeometry.getViewportHeight();
	}

	// Выполнить анимацию раскрытия блока
	// Параметры:
	//   prepare - опциональный callback для вызова перед началом анимации
	//   finish - опциональный callback для вызова в момент завершения анимации
	function doExpanding($content, prepare, finish) {
		if (prepare) prepare();
		$content.hide().removeClass("collapsed").slideDown(400, finish);
	}

	// Выполнить анимацию сокрытия блока
	// Параметры:
	//   prepare - опциональный callback для вызова перед началом анимации
	//   finish - опциональный callback для вызова в момент завершения анимации
	function doCollapsing($content, prepare, finish) {
		if (prepare) prepare();
		$content.slideUp(400, finish).addClass("collapsed");
	}

	// выполнить плавную подкрутку к низу страницы
	function scrollToBottom() {
		var scroll = document.documentElement.scrollTop || document.body.scrollTop;
		var d = windowGeometry.getDocumentHeight() - windowGeometry.getViewportHeight() - scroll;
		if (d > 0) {
			$([document.documentElement, document.body]).animate({ scrollTop: scroll + d }, d * 3 );
			return true;
		}
		return false;
	}

	// плавная анимация свойства bottom футера (с текущего положения до нуля)
	function smoothBottom() {
		var bottom = $page.height() - ($pageFooter.offset().top + $pageFooter.height());
		$pageFooter.css({ top: "auto", bottom: bottom }).animate({ bottom: 0 });
	}

	// переключить позиционирование футера на "статическое" (flow)
	function staticPositionOn() {
		$pageContent.css({ paddingBottom: parseInt($pageContent.css("paddingBottom"), 10) - $pageFooter.height() });
		$pageFooter.css({ position: "static" });
	}

	// сбросить "статическое" позиционирование футера, вернуть абсолютное
	function staticPositionOff() {
		$pageFooter.css({ position: "absolute" });
		$pageContent[0].style.removeProperty("padding-bottom");
	}


	$(".footerBannersSwitcher span").click(function() {
		var $header = $(this).parent();
		var $content = $header.next(".footerBanners");
		var expanding = $header.hasClass("collapsed");
		var prepare = null, finish = null;

		$header.ST_toggleClass("collapsed", !expanding);
		$(this).text((expanding ? "Свернуть" : "Развернуть") + " список партнёров");

		if (expanding) {
			if (footerSticked()) {
				if (footerStickedAfterExpansion())
					prepare = function() {
						$page.removeClass("pageCenter__footerCollapsed");
					};
				else {
					prepare = function() {
						// fix top
						$pageFooter.css({ top: $pageFooter.offset().top, bottom: "auto" });
						$page.removeClass("pageCenter__footerCollapsed");
					};
					finish = function() {
						if (scrollToBottom())
							smoothBottom();
						else
							$pageFooter.css({ top: "auto", bottom: 0 });
					};
				}
			}
			else {
				prepare = staticPositionOn;
				finish = function() {
					staticPositionOff();
					$page.removeClass("pageCenter__footerCollapsed");
					scrollToBottom();
				};
			}
			doExpanding($content, prepare, finish);
		}
		else {
			if (footerSticked()) {
				prepare = function() {
					$page.addClass("pageCenter__footerCollapsed");
				};
			}
			else {
				prepare = staticPositionOn;
				finish = function() {
					smoothBottom();
					staticPositionOff();
					$page.addClass("pageCenter__footerCollapsed");
				};
			}
			doCollapsing($content, prepare, finish);
		}
	});
});

/* ============================================================================
Обновление картинки (для камер)
============================================================================ */

function vchImageUpdate(img, id) {
	var a = img;
	if (document.getElementById(id).parentNode.style.display != "none") {
		tmp = new Date();
		tmp = "&" + tmp.getTime()
		document.getElementById(id).src = img + tmp
		var delay = function () { vchImageUpdate(img, id); };
		setTimeout(delay, 1000)
	}

	else {
	document.getElementById(id).src = a;
	}
};

function selectTBTIAddress(id, e)
{
	if (!e) e = window.event;
	window.open('granted-document-list.aspx?id=' + id);
	e.cancelBubble = true;
	if (e.stopPropagation)
		e.stopPropagation();
}

function selectTBTIAddressPopUp(id, e)
{
	if (!e) e = window.event;
	window.open('granted-document-list.aspx?id=' + id,'', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=no,width=950,left=150,height=600,top=150');
	e.cancelBubble = true;
	if (e.stopPropagation)
		e.stopPropagation();
}

// Ентер почему-то срабатывает на кнопку регистрации юрлиц. Это какая-то мистическая вещь - формы разные а эффект такой есть
// Поэтому принудительно скриптом заставляется сабмититься правильная форма
function enterSuppress( formId, e)
{
	if (!e) e = window.event;
	var cont = e.which != 13 && e.which != 10;
	if ( !cont )
		$('#login-form #enter').click() ;
	return cont;
}

// Более простой AJAX
function AJAX( url, syncFlag, onSuccess )
{
	var result = '';
	$.ajax(
	{
		async: syncFlag,
		type: "GET",
		url: url + "&ts=" + (new Date().valueOf()),
		error: function( jqXhr, textStatus, errorThrown ) {
			var errorHtml = jqXhr.responseText;
			errorHtml = errorHtml.substring( errorHtml.indexOf('<body>')+7, errorHtml.indexOf('</body>') );
			if ( errorHtml != '' )
				trace( errorHtml );
		},
		success: onSuccess ? onSuccess : function( data ){ result = data; }
	} );
	return result;
}

/* ============================================================================
Логирование
============================================================================ */

/* функция логирования */
function trace( message )
{
	if( window.console )
		console.log( new Date().toLocaleTimeString() + ": " + message );
}

function initTrace() {
	if( $("#GisMapTrace").length > 0 ) {

		// если присутствует окно для логов, выводим сообщения в него
		trace = function( message ) {
			$("<div>").text( new Date().toLocaleTimeString() + ": " + message ).prependTo("#GisMapTrace");
		};

		// туда же выводим информацию об ошибках на странице
		window.onerror = function( msg, url, line ) {
			trace( "ERROR: " + msg + " (" + url + ":" + line + ")" );

		};
	}
}
