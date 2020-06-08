/*
Файл содержит библиотеку общих функций, поддерживающих работу интерфейсных элементов ядра,
т.е. общей части всех проектов
*/

/*	Переопределение стандартного метода split,
	теперь вместо массива из одного пустого элемента возвращается пустой массив
*/
String.prototype.nativeSplit = String.prototype.split;
String.prototype.split = function( d ) {
	var ar = this.nativeSplit( d );
	return ar.length == 1 && ar[0] == '' ? [] : ar;
};

/* Добавление метода indexOf в массивы */
if( ! ( "indexOf" in Array.prototype ) )
	Array.prototype.indexOf = function( find, i /*opt*/ ) {
		if( i === undefined ) i = 0;
		if( i < 0 ) i += this.length;
		if( i < 0 ) i = 0;
		for( var n = this.length; i < n; i++ )
			if( i in this && this[i] === find )
				return i;
		return -1;
	};

// возвращает true, если на странице все картинки загружены
function imagesLoaded()
{
	var images = $('img');
	for( var i = 0; i < images.length; i++ )
		if( images[i].src != '' && !images[i].complete )
			return false;
	return true;
}

// вызвать переданную функцию после того как на странице загружены все изображения
function afterImagesLoaded( fn )
{
	var maxDots = window.maxLengthLoadingDots || 5;

	( function checker()
	{
		if( ! imagesLoaded() )
		{
			var dots = $('#loading-dots').text();
			if( dots.length >= maxDots ) dots = '';
			$('#loading-dots').text( dots + '.' );
			window.setTimeout( checker, 500 );
		}
		else
		{
			$('#loading-text').remove();
			fn();
		}
	})();
}


/* проставляет переданному изображению размеры таким образом,
чтобы изображение заполняло собой весь контейнер, в который оно входит,
размеры изменяются пропорционально */
function fitImage( img )
{
	var simg = $(img);
	var par = simg.parent();
	var width = par.width();
	var height = par.height();
	if( ( simg.width() / width ) > ( simg.height() / height ) )
	{
		simg.height( height );
		var n = ( simg.width() - width ) / 2;
		simg.css( "margin-left", "-" + n + "px" );
	}
	else
	{
		simg.width( width );
		var n = ( simg.height() - height ) / 2;
		simg.css( "margin-top", "-" + n + "px" );
	}
	simg.css( "vertical-align", "center" );
	simg.css( "text-align", "center" );
	par.css( "overflow", "hidden" );
}


/* Переключение атрибута.
 * В зависимости от значения flag включает или выключает атрибут у всех элементов в объекте jQuery.
 * Под включением атрибута подразумевается простановка значения, совпадающего с названием атрибута (например, disabled="disabled").
 * Под выключением атрибута подразумевается его удаление.
 *
 * @param attr  Название атрибута
 * @param flag  Включить(true)/выключить(false) атрибут
 */
jQuery.fn.ST_toggleAttr = function( attr, flag ) {
	return flag ? $(this).attr( attr, attr ) : $(this).removeAttr( attr);
};

/* Переключение класса.
 * В зависимости от значения flag добавляет или удаляет класс у всех элементов в объекте jQuery.
 * В jQuery аналогичная версия функции toggleClass, принимающая два аргумента, появилась в версии 1.3.
 *
 * @param klass  Название класса
 * @param flag   Добавить(true)/удалить(false) класс.  Вызов функции без этого аргумента
 *               эквивалентен вызову стандартной функции toggleClass (класс переключается:
 *               добавляется там, где не было; удаляется там, где был)
 */
jQuery.fn.ST_toggleClass = function( klass, flag ) {
	if( flag === undefined ) return $(this).toggleClass( klass );
	return flag ? $(this).addClass( klass ) : $(this).removeClass( klass );
};

/* Переключение видимости элементов
 * В зависимости от значения flag показывает или скрывает элементы в объекте jQuery.
 * В jQuery аналогичная версия функции toggle, принимающая один аргумент, появилась в версии 1.3.
 *
 * @param flag  Показать(true)/скрыть(false) элементы.  Вызов функции без этого аргумента
 *              эквивалентен вызову стандартной функции toggle (видимость переключается:
 *              если элемент был скрыт, он показывается, и наоборот).
 */
jQuery.fn.ST_toggle = function( flag ) {
	if( flag === undefined ) return $(this).toggle();
	return flag ? $(this).show() : $(this).hide();
};

/* изменение значение контрола и вызов обработчика onchange после этого */
jQuery.fn.ST_val = function (v) {
	return $(this).val(v).trigger("change");
};

// Проверка наличия обработчика события на элементе
$.fn.hasEventListener = function(eventType) {
	if (!eventType)
		return false;
	var has = false;
	var events = $(this).data('events');
	if (events)
		$.each(events, function(event) {
			if (event == eventType)
				has = true;
		});
	return has;
};

/*	Набор функций для получение линейных параметров окна

	Функции:
		getViewportWidth/Height( ) - возвращает размеры области просмотра броузера
		getDocumentWidth/Height( ) - возвращает размер документа
		getHorizontalScroll( ) - возвращает позицию горизонтального скроллера
		getVerticalScroll( ) - возвращает позицию вертикального скроллера
		getClickX( e ) - возвращает позицию курсора при щелчке относительно левого верхнего угла документа
		getClickY( e ) - возвращает позицию курсора при щелчке относительно левого верхнего угла документа
*/

var windowGeometry = {};

$(function(){

	var ua = navigator.userAgent.toLowerCase();
	var isOpera = (ua.indexOf('opera')  > -1);
	var isIE = (!isOpera && ua.indexOf('msie') > -1);

	windowGeometry.getViewportWidth = function() {
		return ((document.compatMode||isIE)&&!isOpera)?(document.compatMode=='CSS1Compat')?document.documentElement.clientWidth:document.body.clientWidth:(document.parentWindow||document.defaultView).innerWidth;
	};
	windowGeometry.getViewportHeight = function() {
		/* высота текущего окна или фрэйма */
		var hf = ((document.compatMode||isIE)&&!isOpera)?(document.compatMode=='CSS1Compat')?document.documentElement.clientHeight:document.body.clientHeight:(document.parentWindow||document.defaultView).innerHeight;

		/* для фрэйма нужно получить корневого родителя - окно */
		var w = parent;
		while( w != w.parent )
			w = w.parent;
		var hw = ((document.compatMode||isIE)&&!isOpera)?(document.compatMode=='CSS1Compat')?w.document.documentElement.clientHeight:w.document.body.clientHeight:(w.document.parentWindow||w.document.defaultView).innerHeight;

		/* если фрэйм меньше окна, значит высота видимой части = высоте фрэйма, а иначе - высоте окна */
		return hf > hw ? hw : hf;
	};

	// все кроме IE
	if ( window.innerWidth )
	{
		windowGeometry.getHorizontalScroll = function() { return window.pageXOffset; };
		windowGeometry.getVerticalScroll = function() { return window.pageYOffset; };
		windowGeometry.setVerticalScroll = function( val ) { window.scrollTo( 0, val ); };
		windowGeometry.getDocumentWidth = function() { return document.documentElement.scrollWidth; };
		windowGeometry.getDocumentHeight = function() { return document.body.scrollHeight; };
	}
	// IE 6 с DOCTYPE
	else if ( document.documentElement )
	{
		windowGeometry.getHorizontalScroll =
			function() { return document.documentElement.scrollLeft; };
		windowGeometry.getVerticalScroll =
			function() { return document.documentElement.scrollTop; };
		windowGeometry.setHorizontalScroll =
			function( val ) { document.documentElement.scrollLeft = val; };
		windowGeometry.setVerticalScroll =
			function( val ) { document.documentElement.scrollTop = val; };
		windowGeometry.getDocumentWidth =
			function() { return document.documentElement.scrollWidth; };
		windowGeometry.getDocumentHeight =
			function() { return document.documentElement.scrollHeight; };
	}
	// IE6 без DOCTYPE
	else
	{
		windowGeometry.getHorizontalScroll =
			function() { return document.body.scrollLeft; };
		windowGeometry.getVerticalScroll =
			function() { return document.body.scrollTop; };
		windowGeometry.setHorizontalScroll =
			function( val ) { document.body.scrollLeft = val; };
		windowGeometry.setVerticalScroll =
			function( val ) { document.body.scrollTop = val; };
		windowGeometry.getDocumentWidth =
			function() { return document.body.scrollWidth; };
		windowGeometry.getDocumentHeight =
			function() { return document.body.scrollHeight; };
	}
	windowGeometry.getClickX = function ( e ) {
		return windowGeometry.getHorizontalScroll() + e.clientX;
	};
	windowGeometry.getClickY = function ( e ) {
		return windowGeometry.getVerticalScroll() + e.clientY;
	};
});

// обработчики события заверщения загрузки страницы
$( initClientMultiSelectControls );
$( addChangeFormMethod );
$( scrollToBookmark );
$( fixLocalLinks );
$( addImageControlsOnChange );
$( function()
	{
		$( "input:submit,input:image" ).click( fixCheckboxes );
	}
);
//создание DropZone для каждого файлконтрола, имеющегося на странице
$(function() {
	 // Проверка поддержки браузером
	if (typeof(window.FileReader) != 'undefined') {
		$(".fakeFileInput").each( function() {
			if (this.style.display == "none") {
				// Не отображаем DropZone, если контрол доступен только для чтения (fakeFileInput имеет стиль display:none)
				$(this).parents('.fileControlUpload').find('.dropZone').hide();
			}
			else
				CreateDropZoneForFileControl.call(this);
		});
	}
 });

/*
всем локальным ссылкам в начало добавляется адрес текущей страницы,
чтобы в случае наличия тэга base, ссылки не уводили со страницы
*/
function fixLocalLinks()
{

	var $a = $('a');
	for( var i = 0; i < $a.length; i++ )
	{
		var href = $a[i].href;
		if( href && href.substr( 0, 1 ) == "#" )
			$a[i].href = window.location.href + href;
	}
}


/*	Выполняет submit формы с указанным именем,
	проставляя значения контролов с именами fieldNames на fieldValues

	Параметры:
		fieldNames	- строка с именами контролов через ","
		fieldValues	- строка со значениями контролов через ","
		formId		- id формы, если передана пустая строка то пытается найти родительскую форму
*/
function submitForm( fieldNames, fieldValues, formId )
{
	var arFieldNames = fieldNames.split(',');
	var arFieldValues = fieldValues.split(',');
	if( fieldValues == '' )
		arFieldValues = new Array( '' );
	var jParentForm;

	for ( var i=0; i<arFieldNames.length; i++ )
		$( '#' + arFieldNames[i] ).val( arFieldValues[i] );

	// если передано Id формы - пытаемся получить её
	if ( formId )
		jParentForm = $( '#' + formId );
	// если нет Id, или нет такой формы - пытаемся получить форму, в которой содержится элемент
	if ( !jParentForm || jParentForm.length == 0 )
		jParentForm = $( '#' + arFieldNames[0] ).parents( 'form' );

	// если форма найдена - происходит её submit и возвращается false
	if( jParentForm.length > 0 )
	{
		fixCheckboxes();
		changeFormMethod( null, jParentForm );
		jParentForm.submit();
		return false;
	}
	return true;
}


/*	Выполняет submit формы, предварительно поставив target=_blank,
	с последующим восстановлением прежнего значения target.

	Параметры:
		formId	- id формы
		url		- action для формы (с нужными параметрами), если надо
		target	- в каком окне открыть
*/
function submitFormPopup( formId, url, target )
{
	var f = document.getElementById( formId );
	var t = f.target;
	var a = f.action;
	if( typeof( target ) == 'undefined' )
		target = '_blank';
	f.target = target;
	if ( url )
		f.action = url;
	changeFormMethod( null, $( f ) );
	f.submit();
	f.target = t;
	f.action = a;
	return false;
}


/*	Открывает / закрывает группу тулбара. В случае если указанная группа открыта,
	она закрывается, иначе - она открывается, а группа открытая в этот момент закрывается.
	Предполагается, что ссылка имеет id 'cmd_' + sGroupName, а div группы 'group_' + sGroupName.

	Параметры:
		sGroupName		- имя группы
		openedCaption	- заголовок группы в открытом состоянии
		closedCaption	- заголовок группы в закрытом состоянии
		preventCloseActive - признак запрета закрытия пользователем активной вкладки, т.е.
			попытка закрыть единственную открытую вкладку не сработает
*/
function toggleSection( src, openedCaption, closedCaption, preventCloseActive )
{
	var sGroupName = src.id.replace( 'cmd_', '' );

	if ( $( '#tab_' + sGroupName ).hasClass( 'activeTab' ) )
	{
		if( preventCloseActive && $( 'li.activeTab', $( src ).parents( 'ul' ) ).length == 1 )
			return false;

		$( '#tab_' + sGroupName ).removeClass( 'activeTab' );
		$( "input[id='" + sGroupName + "']" ).val( '' );
		$( '#cmd_' + sGroupName ).text( closedCaption );
	}
	else
	{
		var $active = $( 'li.activeTab a', $( src ).parents( 'ul' ) );

		/* класс активности устанавливается до клика, чтобы для старой активной сработало закрытие,
			в случае preventCloseActive = true */
		$( '#tab_' + sGroupName ).addClass( 'activeTab' );

		/* эмуляция click происходит из-за того, что заголовки находятся в onclick соответсвующей группы */
		$active.click();

		/* вместо # используется селектор по атрибуту id т.к. в случае, если на странице несколько форм, в которых присутсвует
		hidden закладки, то селектор по # найдет только первый из них, и закладка возможно не запомнит свое состояние */
		$( "input[id='" + sGroupName + "']" ).val('1');
		$( '#cmd_' + sGroupName ).text( openedCaption );
	}

	$( '#group_' + sGroupName ).toggle();

	return false;
}



/*	Меняет значение checkbox'ов в строках списка в соответствии со значением checkbox'а "выбрать все"

	Параметры:
		listName - имя списка
*/
function toggleListCheckboxes( listName )
{
	// строка со списком id checkbox'ов из hidden, преобразуется в список селекторов
	var s = $( '#' + listName + '_selRows' ).val().replace( /[^,]+/g, ',#' + listName + '_' + '$&' );
	// в зависимости от состояния checkbox'а "выбрать все" меняются все chexbox'ы списка
	if( $( '#' + listName + '_selall' ).attr( 'checked' ) )
		$( s ).attr( 'checked', 'checked' );
	else
		$( s ).removeAttr( 'checked' );
}


/*	Возвращает ссылку на объект Flash Player по id тэга object или имени embed в зависимости от текущего браузера

	Параметры:
		movieName -
*/
function getFlashMovieObject( movieName )
{
	if (window.document[movieName])
	{
		return window.document[movieName];
	}
	if (navigator.appName.indexOf("Microsoft Internet")==-1)
	{
		if (document.embeds && document.embeds[movieName])
			return document.embeds[movieName];
	}
	else
	{
		return document.getElementById(movieName);
	}
}


/*	Возвращает элемент, у которго случилось событие [e] - параметр обработчика события

	Параметры:
		e -
*/
function getEventSrcElement( e ) {
	if (!e) e = window.event;
	if ( e.srcElement )
		return e.srcElement;
	else
		return e.target;
}


/*	Открывает окно с календарем для выбора даты

	Параметры:
		name - id DateTimeControl'а
		url	- страница календаря с параметрами
*/
function openCalendarWindow( e, name, url )
{
	url += '&controlid=' + name + '&controlvalue=' + document.getElementById( name ).value + '&minDate=' + $('#' + name).attr('minDate') + '&maxDate=' + $('#' + name).attr('maxDate');

	e = $.event.fix( e );

	if( ( typeof showCalendarPopup == "function" ) )
	{
		showCalendarPopup( e, url, 180, 250 );
	}
	else
	{
		var calendar = window.open( url, 'calendar', 'height=250, width=200, left=' + e.screenX + ', top=' + e.screenY );
		calendar.focus();
	}
	return calendar;
}


/*	Изменяет значение контролов из массива controlIds на странице,
	с которой открыто окно выбора значения, на значение из массива values.
	если флаг bSubmitParentForm равен true, сабмитит форму, если передан id кнопки - submitButtonId,
	сабмитит форму ее кликом, иначе сабмитит родительскую форму для первого из контролов из controlIds
	после чего закрывает окно выбора значения.

	Параметры:
		controlIds			- id контролов, значения которых нужно изменить
		values				- значения изменяемых контролов
		bSubmitParentForm	- флаг нужно ли сабмитить форму после проставления значений
		submitButtonName	- id кнопки, сабмитящей форму, если он передан, будет вызван метод click кнопки, иначе - form.submit();
*/
function fillOpenerControls( controlIds, values, bSubmitParentForm, submitButtonName, bCloseWindow )
{
	var parentWindow = parent;
	if ( window.opener )
		parentWindow = window.opener;

	var parentDoc = parentWindow.document;

	for ( var i=0; i<controlIds.length; i++ )
		$( '#' + controlIds[i], parentDoc ).val( values[i] );

	if ( typeof(bCloseWindow) == "undefined" || bSubmitParentForm )
		bCloseWindow = true;

	if ( bSubmitParentForm )
	{
		var form = $( '#' + controlIds[0], parentDoc ).parents( 'form' );
		if ( typeof(submitButtonName) != "undefined" )
			form.append( '<input type="hidden" name="' + submitButtonName + '" id="' + submitButtonName + '" value="' + submitButtonName + '">' );
		form.submit();
	}

	if ( bCloseWindow )
		closePopupOrFrame();
}


/*	Изменяет значение контрола с идентификатором controlId на странице,
	с которой открыто окно выбора значения, на значение value,
	после чего закрывает окно выбора значения.

	Параметры:
		controlId			-
		value				-
		bSubmitParentForm	-
		submitButtonId		-
*/
function fillOpenerControl( controlId, value, bSubmitParentForm, submitButtonName ){
	fillOpenerControls( [ controlId ], [ value ], bSubmitParentForm, submitButtonName );
}


/*	Изменяет пару значений (id,наименование) контрола выбора объекта с идентификатором controlId на странице,
	с которой открыто окно выбора значения, на значения valueId, valueName
	после чего закрывает окно выбора значения.

	Параметры:
		controlId	-
		valueId		-
		valueName	-
*/
function fillOpenerLinkObjectControl( controlId, valueId, valueName ){

	var parentWindow = parent;
	if ( window.opener )
		parentWindow = window.opener;

	fillOpenerControls(
		[ controlId + 'Name', controlId ],
		[ valueName, valueId ],
		false,
		null,
		false
	);

	/* если в родительском окне объявлена функция обработчик заполнения контрола, вызывается она */
	if ( typeof( parentWindow.linkObjectControlOnValueSet ) != "undefined" )
		parentWindow.linkObjectControlOnValueSet( controlId, valueId, valueName );

	/* если у контрола проставлен пользовательский onchange (т.е. он есть у хиддена) - он вызывается */
	parentWindow.$('#' + controlId ).change();

	closePopupOrFrame();

	return false;
}


/* Возвращает значение из списка в LinkObjectControl, APE или клиентский APE в родительском окне,
   после чего закрывает текущее окно

   controlId - идентификатор контрола на родительской странице
   valueId - идентификатор выбранного элемента для возвращения на родительскую страницу
   valueName - текстовое значение выбранного элемента для возвращения на родительскую страницу
*/
function returnValueFromList( controlId, valueId, valueName )
{
	var parentWindow = parent;
	if ( window.opener )
		parentWindow = window.opener;

	if( parentWindow.$('#' + controlId + 'Name').parents('.linkObjectControlContainer').length > 0 )
	{
		// возвращение значения в LinkObjectControl
		return fillOpenerLinkObjectControl( controlId, valueId, valueName );
	}
	else if( parentWindow.$('#' + controlId + '_container').hasClass('clientMultiSelectControl') )
	{
		// возвращение значения в клиентский APE
		var encodedValue = valueId + ',,,,' + valueName.replace( /,/g, ',.' );
		return addClientMultiSelectOptions( encodedValue, controlId );
	}
	else if( parentWindow.$( '#' + controlId + '_add' ).length > 0 )
	{
		// возвращение значения в "обычный" APE
		return returnArrayPropValue( valueId, controlId );
	}
	else
	{
		// возвращение значения в hidden поле и submit формы
		parentWindow.submitForm( controlId, valueId );
		window.close();
	}
}


/*	Обработчик нажатия на кнопку Add в ArrayPropertyEditor.

	Параметры:
		sResFieldId	- id hidden поля используемое для обмена данными между окном выбора и вызвавшим окном
		sUrl		- url страницы выбора значений
		sWindowMode	- параметры открываемого окна (строка с параметрами функции window.open)
		submitIds	- идентификаторы кнопок закрытия фрейма через запятую; если используется попап, а не фрейм, значение не используется
*/
function addArrayPropItems( sResFieldId, sUrl, sWindowMode, submitIds ){
	// если контрол пуст, открывается окно для выбора значений
	// если значение контрола заполнено, выполняется нажатие на кнопку,
	//      добавление значений в свойство обрабатывается на сервере
	if( $( '#' + sResFieldId ).val() )
		return saveBookmarkPosition();
	else
	{
		if( submitIds === undefined )
			submitIds = ""; //значение по умолчанию
		return openWindowOrShowPopupCenteredWithMode( sUrl, submitIds, "", sWindowMode );
	}
}


/*	Обработчик нажатия значка удаления элемента в ArrayPropertyEditor

	Параметры:
		arrPropEditorName		- id ArrayPropertyEditor-a
		arrPropEditorGroupName	- id удаляемой группы
*/
function removeArrayPropItem( arrPropEditorName, arrPropEditorGroupName )
{
	// добавление отмеченного чекбокса itemPosition-го по опорядку элемента если такого нет
	$( '#' + arrPropEditorGroupName + 'remove' ).attr( 'checked', 'checked' );
	// нажатие кнопки Remove ArrayPropertyEditor-а
	$( '#' + arrPropEditorName + '_remove' ).click();
}


/*	Синхронизирует значения контролов всплывающего окна и контролов arrayPropEditor'a родительского окна.
	Использует контролы со следующими идентификаторами:
		first-display	- показывает, первое ли это появление формы
		editor-name		- имя редактора - добавляется к имени контрола,
							для привязки к конкретному контролу в ArrayPropertyEditor'е
		success			- означает, что форма валидно вызвала сабмит и можно копировать
							в ArrayPropertyEditor свойства из нее
	Параметры:
		keepWindowOpen		- нужно ли оставлять окно открытым
*/
function arrayPropEditorSyncronizeControls( keepWindowOpen )
{
	var editorName = $( '#editor-name' ).val();
	var elements = document.forms[ 0 ].elements;

	/* для каждого элемента формы ищется элемент в родительском окне
	с аналогичным именем (=имя редактора + имя контрола),
	и если элемент найден его значение копируется в значение */
	if ( $( '#first-display' )[0] )
	{
		for( var i = 0; i < elements.length; i++ )
		{
			var elem = elements[i];

			var parentWindow = parent;
			if ( window.opener )
				parentWindow = window.opener;
			var parentDoc = parentWindow.document;

			var parentElem = $( '#' + editorName + elem.id, parentDoc )[0];
			if ( parentElem )
				if( parentElem.type == 'checkbox' )
					if( elem.type == 'checkbox' )
						elem.checked = parentElem.checked; //из чекбокса в чекбокс
					else
						elem.value = parentElem.checked ? parentElem.value : ''; //из чекбокса в НЕчекбокс
				else
					//из НЕчекбокса в чекбокс
					if( elem.type == 'checkbox' )
						elem.checked = parentElem.value ? true : false;
					//из НЕчекбокса в НЕчекбокс
					else
					{
						$( elem ).val( $( parentElem ).val() );

						// если контрол FCK
						setFckHtml( elem.id, $( parentElem ).val() );
					}
		}
	}
	/* для каждого элемента формы ищется элемент в родительском окне
	с аналогичным именем (=имя редактора + имя контрола),
	и если элемент найден значение элементе копируется в родительское окно */
	if ( $( '#success' ).length > 0 )
	{
		for( var i = 0; i < elements.length; i++ )
		{
			var elem = elements[i];
			var parentWindow = parent;
			if ( window.opener )
				parentWindow = window.opener;
			var parentDoc = parentWindow.document;

			var parentElem = $( '#' + editorName + elem.id, parentDoc )[0];
			if ( parentElem )
			{
				if( elem.type == 'checkbox' )
					if( parentElem.type == 'checkbox' )
						parentElem.checked = elem.checked; //из чекбокса в чекбокс
					else
						parentElem.value = elem.checked ? elem.value : ''; //из чекбокса в НЕчекбокс
				else
					if( parentElem.type == 'checkbox' )
						parentElem.checked = elem.value ? true : false; //из НЕчекбокса в чекбокс
					else {
						var elemVal = $(elem).val();
						// Проверка на соответствие тексту подсказки (DateTimeCtrl кладут в скриптпарамы свои инпут-хинт-тексты)
						var elemHintText = $('#' + elem.id + '-input-hint').val();
						if (elemVal == elemHintText)
							elemVal = '';
						$(parentElem).val(elemVal); //из НЕчекбокса в НЕчекбокс
					}
			}
		}

		/* если передано имя редактора всего массивного свойства,
		значит окно открыто в режиме создания нового объекта массивного свойства */
		var propEditorName = $( '#array-prop-editor-name' ).val();
		if ( propEditorName )
		{
			var parentWindow = parent;
			if ( window.opener )
				parentWindow = window.opener;

			// Флаг для перегрузки страницы в режиме выбора из попапа. Т.к. в режиме множественного выбора из списка в данное
			// поле складываются идентификаторы, то чтобы различать режимы, значение флага сделано отрицательным
			parentWindow.$( '#' + propEditorName ).val( -1 );
			/* нажимается кнопка добавления элемента в свойство */
			parentWindow.$( '#' + propEditorName + '_add' ).click();

			// После добавления нового элемента в родительском APE,
			// меняем editor-name в дочернем для правильной синхронизации
			if( $( '#editor-new-name' ).val() )
			{
				$( '#editor-name' ).val( $( '#editor-new-name' ).val() );
				$( '#array-prop-editor-name' ).val('');
				//такие же изменения делаем для всех ссылок
				$( 'a' ).each(
					function()
					{
						$( this ).attr( 'href', $( this ).attr( 'href' ).replace( /array-prop-editor-name=[^&]*/, 'array-prop-editor-name=' ) );
						$( this ).attr( 'href', $( this ).attr( 'href' ).replace( /editor-name=[^&]*/, 'editor-name=' + $( '#editor-new-name' ).val() ) );
					}
				);
			}
		}

		// Надо ли оставить окно открытым после синхронизации
		if( !keepWindowOpen )
			closePopupOrFrame();
	}
}


/*	Формирует строчку, в которой находятся идентификаторы выбранных строк списка (через ","),
	и, если передан флаг, соответствующие текстовые значения (через ",,"), разделённые ",,,,"

	Параметры:
		sListName	- имя листа
		bAddTexts	- флаг, означающий, что нужны не только значения-идентификаторы, но текстовые значения
*/
function getListSelectedItems( sListName, bAddTexts )
{
	// массив идентификаторов строк, отмеченных ранее
	var arCheckedRowsIds = $( '#' + sListName + '_checkedRows' ).val().split( ',' );
	// тексты к ним
	var arCheckedRowsTexts;
	if ( bAddTexts )
	{
		arCheckedRowsTexts = $( '#' + sListName + '_checkedRows_values' ).val().split( ',,' );
		// если массив текстов пуст, а массив идентификаторв не пуст -
		// значит, текст = пустая строка, соотв. в массиве должен быть 1 пустой элемент
		if ( arCheckedRowsTexts.length == 0 && arCheckedRowsIds.length == 1 )
			arCheckedRowsTexts[0] = '';
	}

	// идентификаторы строк, расположенных на текущей странице списка
	var arSelectableRowsIds = $( '#' + sListName + '_selRows' ).val().split( ',' );

	for( var i=0; i<arSelectableRowsIds.length; i++ )
	{
		var id = arSelectableRowsIds[i];
		var checkbox = $( '#' + sListName + '_' + id )[0];
		var position = GetPosInArray( arCheckedRowsIds, id );

		// если элемент выбран и его еще нет в массиве - необходимо добавить его
		if ( checkbox.checked && position == -1 )
		{
			arCheckedRowsIds.push( id );
			if ( bAddTexts )
			{
				var rowText = $( '#' + sListName + '_' + id + '_text' ).val().replace( /,/g, ',.' );
				arCheckedRowsTexts.push( rowText );
			}
		}

		// если элемент не выбран, но есть в массиве - необходимо его удалить
		if ( !checkbox.checked && position != -1 )
		{
			arCheckedRowsIds.splice( position, 1 );
			if ( bAddTexts )
				arCheckedRowsTexts.splice( position, 1 );
		}
	}
	var res = arCheckedRowsIds.join( ',' );
	if ( bAddTexts )
		res += ",,,," + arCheckedRowsTexts.join( ',,' ).replace( /,,,/g, ',,,.' );

	return res;
}


/*	Формирует строчку, в которой находятся идентификаторы выбранных в дереве узлов

	Параметры:
		sTreeName - имя дерева
*/
function getTreeSelectedItems( sTreeName )
{
	var arSelectedNodeIds = [];
	$( 'input[id^=' + sTreeName + '_checkbox_]:checked' ).each( function() {
		arSelectedNodeIds.push( this.id.replace( sTreeName + '_checkbox_', '' ) );
	});
	return arSelectedNodeIds.join( ',' );
}


/* Возвращает результат выбора из списка или дерева с чекбоксами.
	Предназначено для возврата значений в ArrayPropertyEditor или (Client)MultiSelectControl.

	Параметры:
		sSelectorName		- имя списка (дерева), используемого для выбора
		sOpenerCotrolId	- id контрола в родительском окне, в который записывается результат выбора.
									это имя ArrayPropertyEditor (оно совпадает с именем hidden поля)
									(а для MultiSelectControl - имя контрола + '_added')
									или имя ClientMultiSelect'а  / ClientArrayPropertyEditor'а
		sSelectorType		- необязат. тип контрола из которого происходит выбор (list или tree), если не передан - определяется по контексту
		sOpenerControlType- необязат. тип контрола в родительском окне (APE или ClientMultiSelect), если не передан - определяется по контексту
*/
function returnArrayPropSelectedItems( sSelectorName, sOpenerControlId, sSelectorType, sOpenerControlType )
{
	var sRes = '';

	// если тип не передан - определяется по контексту
	if ( !sSelectorType )
		if ( $( '#' + sSelectorName + '_checkedRows' ).length > 0 )
			sSelectorType = 'list';
		else
			sSelectorType = 'tree';

	var parentWindow = parent;
	if ( window.opener )
		parentWindow = window.opener;
	var parentDoc = parentWindow.document;

	// если тип не передан - определяется по контексту
	if ( !sOpenerControlType )
		if ( $( 'div[id=' + sOpenerControlId + '_container]', parentDoc ).hasClass('clientMultiSelectControl') )
			sOpenerControlType = 'ClientMultiSelect';
		else
			sOpenerControlType = 'APE';

	// если результат возвращается в APE
	if ( sOpenerControlType == 'APE' )
	{
		if ( sSelectorType == 'list' )
			//Получение строки с идентификаторами выбранных строк
			sRes = getListSelectedItems( sSelectorName );
		else if ( sSelectorType == 'tree')
			//Получение строки с идентификаторами выбранных узлов
			sRes = getTreeSelectedItems( sSelectorName );

		returnArrayPropValue( sRes, sOpenerControlId );
		closePopupOrFrame();
	}
	// если возвращается в ClientMultiSelect / ClientArrayPropertyEditor
	else if ( sOpenerControlType == 'ClientMultiSelect' )
	{
		if ( sSelectorType == 'list' )
			addClientMultiSelectOptionsFromList( sSelectorName, sOpenerControlId );
		else if ( sSelectorType == 'tree')
			addClientMultiSelectOptionsFromTree( sSelectorName, sOpenerControlId );
	}
}


/* Возвращает результат выбора из контрола.
	Предназначено для возврата значений в ArrayPropertyEditor или MultiSelectControl.

	Параметры:
		nValue				- значение, которое нужно передать в ArrayPropertyEditor
		sOpenerControlId	- id контрола в родительском окне, в который записывается результат выбора.
							это имя ArrayPropertyEditor (оно совпадает с именем hidden поля),
							а для MultiSelectControl - имя контрола + '_added'
*/
function returnArrayPropValue( nValue, sOpenerControlId )
{
	var parentWindow = parent;
	if ( window.opener )
		parentWindow = window.opener;

	var controlToReturn = parentWindow.$( '#' + sOpenerControlId );
	controlToReturn.val( nValue );
	if ( window.opener )
		window.opener.focus();
	/* Нажимается кнопка Add ArrayPropertyEditor'а. Контрол выбираем, используя
	   parentWindow.$(...) вместо $(..., parentWindow.document), так как в последнем
	   случае при использовании showPopupCentered почему-то не действует click() */
	parentWindow.$( '#' + sOpenerControlId + '_add' ).click();
}


/*
инициализация выпадащего списка, работающего в режиме множественного выбора
id - идентификатор контрола
*/
function initClientMultiselect( id )
{
	var p = $( '#' + id + 'Container' );
	/* включение чекбоксов на основании значения контрола */
	var ids = $( '#' + id ).val().split( ',' );
	for( var i = 0; i < ids.length; i++  )
		$( '#' + id + 'Option' + ids[ i ] )[0].checked = true;

	/* заполнение текстового значения на основании включенных чекбоксов */
	updateClientMultiselectStringValue( p );
}


/*
скрытие / раскрытие опций выпадащего списка, работающего в режиме множественного выбора
*/
function toggleClientMultisectCheckboxOptions( e )
{
	if( !e ) e = window.event;
	var src = getEventSrcElement( e );

	var p = $( src ).parents('.multiSelectControl').eq(0);
	$( '.optionsContainer', p ).toggle();
	if( $( '.optionsContainer:visible', p ).length > 0 )
	{
		$( p ).bind( 'click', function( e ) { e.stopPropagation(); } );
		$( 'body' ).unbind( 'click.multiSelectControl').bind( 'click.multiSelectControl', function() { $( '.optionsContainer', p ).hide(); } );
	}
}


/*
обработчик изменения значения выпадащего списка, работающего в режиме множественного выбора
*/
function onchangeClientMultiselect( e )
{
	if( !e ) e = window.event;

	var p = $( getEventSrcElement( e ) ).parents('.multiSelectControl').eq(0);
	updateClientMultiselectStringValue( p );
}


/*
проставление значений скрытого и видимого контролов на основании включенности чекбоксов
*/
function updateClientMultiselectStringValue( p )
{
	var controlName = p.attr('id').replace('Container','');

	var ids = '';
	var text = '';
	$( "input:checkbox", p ).each(
		function()
		{
			if( $( this )[0].checked )
			{
				var id = $( this ).attr( 'id' ).replace( controlName + 'Option', '' );
				ids += ( ids == '' ? '' : ',' ) + id;
				text += ( text == '' ? '' : ',' ) + $( 'label', $( this ).parents('.optionWrap').eq(0) ).text();
			}
		}
	);
	$('#' + controlName ).val( ids );
	/* если текстовое значение пусто - показывается значение атрибута 'input-hint' */
	if( text == '' )
	{
		text = $('#' + controlName + 'Text' ).attr( 'input-hint' );
		$('#' + controlName + 'Text' ).addClass( 'with-hint' );
	}
	else {
		$('#' + controlName + 'Text' ).removeClass( 'with-hint' );
	}

	$('#' + controlName + 'Text' ).val( text );
}


/* Функция, инициализирующая значения MultiSelectControl'ов, работающих на клиентских скриптах.
Разбирает значения из 2-х hidden полей и добавляет элементы в список */
function initClientMultiSelectControls()
{
	$( '.clientMultiSelectControl' ).each(
		function()
		{
			// Названия div'ов, с содержимым контрола имеет префикс '_container',
			// а значения самого контрола лежат в хиддене с идентификатором совпадающим с именем контрола
			var containerLength = 0 - '_container'.length;
			var controlId = this.id.slice( 0, containerLength );
			fillClientMultiSelectOptions( controlId,
				$( "#" + controlId ).val(),
				$( "#" + controlId + "_values" ).val() );
		}
	);
}


// Собирает URL с учетом всех параметров формы, родительской, для
// вызвавщей функцию кнопки. Если длина URL не превышает 2000 символов,
// меняет метод формы на get
//  e - параметр eventData, передаётся JQuery в момент Bind (см. addChangeFormMethod)
//  form - используется при ручном вызове, в этом случае в e надо передать null, а в form - JQuery-объект с формой (см. submitForm)
function changeFormMethod( e, form )
{
	if ( e != null )
		form = e.data;

	// Из FckEditor'ов значения копируются в соответствующие textarea
	$( "textarea" ).each( function(){
		var html = getFckHtml( this.id );
		if( html !== null )
			$( this ).val( html );
	});

	// Если на форме есть непустые файл-контролы, то форму нужно post'ить
	var fileFilled;
	$( "input:file", form ).each( function()
		{
			if( $( this ).val() )
				fileFilled = true;
		}
	);
	if( fileFilled )
		return true;

	// определяем URL сабмита формы
	var url;
	var action = form.attr( 'action' );
	if ( ! action )
		// если не задан action - берется текущий url
		url = document.URL;
	else
	{
		// параметры, переданные в action при get'e игнорируются - поэтому если
		// в action передавались параметры, то форма post'ится
		if ( action.indexOf('?') != -1 )
		{
			form.attr( 'method', 'post' );
			return true;
		}

		// Собирается url с учетом action формы
		url = "http://" + document.domain;
		var lastSlashIndex = location.pathname.lastIndexOf( '/' );

		if ( lastSlashIndex != -1 )
			url += location.pathname.substr( 0, lastSlashIndex );

		url += '/' + action;
	}

	var urlParams = [];

	// к url добавляется параметр с именем и значением нажатой кнопки
	if ( e && $( e.target ).attr( "name" ) != "" )
		urlParams.push( $( e.target ).attr( "name" ) + "=" + $( e.target ).val() );

	$( "input:checkbox", form ).each( function()
		{
			if ( $( this ).attr( "name" ) != '' && !$( this )[0].disabled )
				urlParams.push( $( this ).attr( "name" ) + "=" + ( $( this ).val() == '' ? 'on' : $( this ).val() ) );
		}
	);

	$( "textarea, input:not(input[type='submit'],input[type='checkbox'],input[type='radio'],input[type='image'])", form ).each( function()
		{
			if ( $( this ).attr( "name" ) != '' && !$( this )[0].disabled  )
				urlParams.push( $( this ).attr( "name" ) + "=" + ( $( this ).val() ? urlEncode( $( this ).val() ) : "" ) );
		}
	);

	$( "input:radio", form ).each( function()
		{
			if ( $( this ).attr( "name" ) != '' && !$( this )[0].disabled && $( this )[0].checked )
				urlParams.push( $( this ).attr( "name" ) + "=" + $( this ).val() );
		}
	);

	$( "select", form ).each( function()
		{
			if ( $( this ).attr( "name" ) != '' && !$( this )[0].disabled )
			{
				var value = $( this ).val();
				/* если селект с множественным выбором, val() возвращает массив */
				if( value instanceof Array )
					value = value.join(",");
				urlParams.push( $( this ).attr( "name" ) + "=" + ( value ? urlEncode( value ) : "" ) );
			}
		}
	);

	url += ( url.indexOf( '?' ) == -1 ? "?" : "&" ) + urlParams.join("&");

	if ( url.length < 2000 )
		form.attr( 'method', 'get' );
	else
		form.attr( 'method', 'post' );

	return true;
}


// При загрузке страницы прикрепляет ко всем кнопкам без onclick'ов и специальных классов
// обработчик, меняющий метод сабмита формы на get в случае строки не превышающей 2000 символов.
function addChangeFormMethod()
{
	$( "input:submit,input:image" ).filter( ":not(.disableSafeFormSubmit)" ).each( function()
		{
			if ( typeof( $( this ).attr( 'onclick' ) ) != 'function' )
			{
				$( this ).bind( 'click', $( this ).parents( 'form' ), changeFormMethod );
			}
		}
	);
}


/* Добавляет новое значение в MultiSelect, декодируя текстовое значение


	Параметры:
		controlId	- ID контрола-мультиселекта
		id			- значение
		value		- текстовое значение, в котором запятые заменены на ',.'
		document	- документ, в котором лежит контрол
*/
function addClientMultiSelectOption( controlId, id, value, document )
{
	value = value.replace( /,./g, ',' );
	var wasInsert = false;
	var divContent = '<div id="' + controlId + id + '">' +
						'<span>' + value + '</span> ' +
						'<img src="img/remove.gif" title="remove" alt="Clear" class="imgclear" onclick="deleteClientMultiSelectOption( \'' +
						controlId + '\',\'' + id + '\' )"/>' +
					'</div>';

	// Если задана функция сортировки, то ищется место для вставки нового элемента
	// функция сортировки задается в кастомном коде. Она должна называться clientMultiSelectCompare и принимать три параметра:
	//		msControlId				- идентификатор мультиселекта, по нему можно различить два мультиселекта на одной странице
	//		object1, object2		- два объекта, характеризующие 2 строки в мультиселекте. Объекты содержат 2 свойства: id и value
	// функция должна возвращать true, если object1 > object2
	if ( typeof( clientMultiSelectCompare ) != "undefined" )
	{
		$( '#' + controlId + '_controls > div', document ).each( function()
			{
				var object1 = { id: this.id.replace( controlId, '' ), value: $( this ).text() };
				var object2 = { id: id, value: value };

				if ( clientMultiSelectCompare( controlId, object1, object2 ) )
				{
					$( this ).before( divContent );
					wasInsert = true;
					return false;
				}
			} );
	}

	if ( ! wasInsert )
		$( '#' + controlId + '_controls', document ).append( divContent );
}


/* Заполнение строк в MultiSelect по значениям в хидденах

	Параметры:
		controlId	- ID контрола-мультиселекта
		id			- идентификаторы записей (значение хиддена)
		value		- тексты записей (значение хиддена)
		document	- документ, в котором лежит контрол
*/
function fillClientMultiSelectOptions( controlId, ids, values, document )
{
	ids = ids.split( ',' );
	values = values.split( ',,' );
	// если массив текстов пуст, а массив идентификаторв не пуст -
	// значит, текст = пустая строка, соотв. в массиве должен быть 1 пустой элемент
	if ( values.length == 0 && ids.length == 1 )
		values[0] = '';

	for ( var i=0; i<ids.length; i++ )
		addClientMultiSelectOption( controlId, ids[i], values[i], window.document );
}


/*	Функция вызывается в попап-окне добавления элементов в виде списка в
	ClientMultiSelect / ClientArrayPropertyEditor

	Параметры:
		sSelectedItems - строка выбранных значений, в которой находятся идентификаторы выбранных строк списка (через ",")
								и соответствующие текстовые значения (через ",,"), разделённые ",,,,"
								например "1,2,,,,аа,,бб"
		parentControlId - имя контрола в родительском окне, в который надо вернуть значения
*/
function addClientMultiSelectOptions( sSelectedItems, parentControlId )
{
	var a = sSelectedItems.split( ',,,,' );
	// массив идентификаторов выбранных значений
	var idArray = a[0].split( ',' );
	// массив текстов выбранных значений
	var textArray = a[1].replace( /,,,./g, ',,,' ).split( ',,' );
	// если массив текстов пуст, а массив идентификаторв не пуст -
	// значит, текст = пустая строка, соотв. в массиве должен быть 1 пустой элемент
	if ( textArray.length == 0 && idArray.length == 1 )
		textArray[0] = '';

	/* id находящихся в контроле объектов */
	var parentWindow = parent;
	if ( window.opener )
		parentWindow = window.opener;
	var parentDoc = parentWindow.document;
	var ids = $( '#' + parentControlId, parentDoc ).val();
	if ( ids == '' )
		ids = ',';
	else
		ids = ',' + ids + ',';
	/* тексты находящихся в контроле объектов */
	var texts = $( '#' + parentControlId + '_values', parentDoc ).val();

	for ( var i=0; i<idArray.length; i++ )
	{
		// Проверка уникальности добавляемых значений
		var id = idArray[i];
		if ( ids.indexOf( ',' + id + ',' ) == -1 )
		{
			var text = textArray[i];

			addClientMultiSelectOption( parentControlId, id, text, parentDoc );

			ids += id + ',';
			texts += ( texts != '' ? ',,' : '' ) + text;
		}
	}
	ids = ids.substr( 1, ids.length - 2 );

	// Обновление значений хидденов
	$( '#' + parentControlId, parentDoc ).val( ids );
	$( '#' + parentControlId + '_values', parentDoc ).val( texts );

	/* если в родительском окне объявлена функция обработчик заполнения контрола, вызывается она,
	   по аналогии с linkObjectControlOnValueSet */
	if ( typeof( parentWindow.clientApeOnValuesAdded ) != "undefined" )
		parentWindow.clientApeOnValuesAdded( parentControlId );

	parentWindow.$('#' + parentControlId ).change();
	closePopupOrFrame();
}


// Используется функцией returnArrayPropSelectedItems
// Функция вызывается в попап-окне добавления элементов в виде списка в
// ClientMultiSelect / ClientArrayPropertyEditor
// и добавляет выбранные значения из списка listControlId в parentControlId
function addClientMultiSelectOptionsFromList( listControlId, parentControlId )
{
	// получение выбранных значений
	var s = getListSelectedItems( listControlId, true );
	// добавление значений в контрол
	addClientMultiSelectOptions( s, parentControlId );
}


// Используется функцией returnArrayPropSelectedItems
// Вызывается в попап-окне добавления элементов в виде дерева в
// ClientMultiSelect / ClientArrayPropertyEditor
// и добавляет выбранные значения из дерева treeControlId в parentControlId
function addClientMultiSelectOptionsFromTree( treeControlId, parentControlId )
{
	// получение идентификаторов выбранных узлов
	var s = getTreeSelectedItems( treeControlId );
	// получение соответствующих им текстов
	var textArray = [];
	var idArray = s.split( ',' );
	for ( var i=0; i<idArray.length; i++ )
	{
		var id = idArray[i];
		var text = $( '#' + treeControlId + '_' + id + ' > .treeSelectStyle' ).text();
		text = text.replace( /,/g, ',.' );
		textArray[i] = text;
	}
	var texts = textArray.join( ',,' );
	s += ',,,,' + texts.replace( /,,,/g, ',,,.' );

	// добавление значений в контрол
	addClientMultiSelectOptions( s, parentControlId );
}


/* Удаление значения из ClientMultiSelect'а

	Параметры:
		control - имя контрола-multiselect'а, из которого удаляется значение
		id - удаляемое значение
*/
function deleteClientMultiSelectOption( control, id )
{
	$( '#' + control + id ).remove();

	// Хиддены обрамляются запятыми, чтоб было проще делать replace удаляемого значения
	var ids = $( '#' + control ).val().split( ',' );
	var values = $( '#' + control + '_values' ).val().split( ",," );
	var newIds = '';
	var newValues = '';

	for( var i =0; i<ids.length; i++ )
	{
		if ( ids[i] != id )
		{
			newIds += ( newIds == '' ? '' : ',' ) + ids[i];
			newValues += ( newValues == '' ? '' : ',,' ) + values[i];
		}
	}

	$( '#' + control ).val( newIds );
	$( '#' + control + '_values' ).val( newValues );

	/* если в окне объявлена функция обработчик очищения контрола, вызывается она */
	if ( typeof( clientApeOnValuesDeleted ) != "undefined" )
		clientApeOnValuesDeleted( control, id );
}


/*	Перемещает строку таблицы вверх на 1 позицию путем обмена текущей строки с предыдущей

	Параметры:
		id - идентификатор тега tr перемещаемой строки
		down - признак того, что пользователь нажал на кнопку вниз строки выше
*/
function moveArrayPropertyEditorItemUp( id, down )
{
	// строка, выше которой нужно перенести текущую
	var idPrev = $( '#' + id ).prev( 'tr[id]' ).attr( 'id' );
	// если текущая чтрока не самая верхняя
	if ( idPrev )
	{
		// изменение класса перемащаемой строки, для выделения её цветом
		$( '#' + ( down ? idPrev : id ) ).addClass( 'active' );

		// имеется ли выделенная строка, т.е. отличается ли фон выделенной от фона невыделенной
		var hasActiveState = $( '#' + ( down ? idPrev : id ) ).css( 'backgroundColor' ) !=
			$( '#' + ( down ? id : idPrev ) ).css( 'backgroundColor' );

		if( !hasActiveState )
			$( '#' + ( down ? idPrev : id ) ).removeClass( 'active' );

		// сохранение id выделеных checkbox-ов для IE
		var checkboxCache = [];
		if ( $.browser.msie )
			$( '#' + id + ' input:checkbox:checked' ).each(
				function( i ){
					checkboxCache[ i ] = '#' + this.id;
				}
			);

		// перенос строчкой выше с задержкой для подсветки переносимой строки ещё до начала переноса
		if ( hasActiveState )
			setTimeout( function() {
				$( '#' + idPrev ).before( $( '#' + id ) );
			}, 20 );
		else
			$( '#' + idPrev ).before( $( '#' + id ) );

		// замена значений hidden-ов с порядковым номером
		var curOldOrder = $( '#' + id + '_order' ).val();
		$( '#' + id + '_order' ).val( $( '#' + idPrev + '_order' ).val() );
		$( '#' + idPrev + '_order' ).val( curOldOrder );

		// восстановление признака выделенности checkbox-ов для IE
		if ( $.browser.msie )
		{
			$( '#' + id + ' input:checkbox:checked' ).removeAttr( 'checked' );
			$( checkboxCache.join( ',' ) ).attr( 'checked', 'checked' );
		}

		if( hasActiveState )
		{
			// анимация выделенного цвета строки в исходный
			var defaultBgColor = $( '#' + ( down ? id : idPrev ) ).children( 'td' ).css( 'backgroundColor' );
			setTimeout ( function(){
				$( '#' + ( down ? idPrev : id ) + ' td' ).animate(
					{ backgroundColor: defaultBgColor },
					500,
					function(){
						// удаление стиля бэкграунда, чтобы можно было опять выдлеить строку добавлением класса
						$( this )[0].style.backgroundColor = '';
						// удаление класса, чтобы вернуть цвет по умолчанию без стиля
						$( this ).parent( 'tr' ).removeClass( 'active' );
					}
				);
			}, 20 );
		}
	}
}


/*	Помечает строку таблицы как перемещаемую

	Параметры:
		id - идентификатор тега tr перемещаемой строки
		e - event, необходим для того, чтобы не выбрасывать событие click дальше, иначе обработчик click( clearMoveSelection ) сразу сработает
*/
function selectTableRowToMove( id, e, mode )
{
	if ( mode == null )
		mode = 'ape';

	/* выполнение остальных обработчиков события отменяется */
	e.cancelBubble = true;

	var oldSelectedTr = $( 'tr.tableRowToMove' ).attr( 'id' );

	/* очищается все, что связано со стилями переноса */
	clearMoveSelection();

	/* помечена новая строка для перемещения */
	if ( oldSelectedTr != id )
	{
		/* класс строки меняется, что бы выделить перемещаемую строку среди прочих */
		$( '#' + id ).addClass( 'tableRowToMove' );
		/* на onclick выделенной строки вешается отменение выделения */
		$( '#' + id ).click( clearMoveSelection );

		/* стили строк, выбираемых для переноса выделенной */
		var allTrExceptSelected = $('#' + id).siblings('tr[id]:not(.newItemEditorRow)');
		allTrExceptSelected.mouseover(
			function(){
				$( this ).addClass( 'tableRowMoveAfter' );
			}
		);
		allTrExceptSelected.mouseout(
			function(){
				$( this ).removeClass( 'tableRowMoveAfter' );
			}
		);
		if ( mode == 'ape' )
		{
			/* каждой строке прицепляется обработчик click (в котором выполняется непосредственно перенос)
			в event.data обработчика будет лежать id tr'a строки */
			allTrExceptSelected.click( apeMoveAfterTableRow );
		}
		else
		{
			/* каждой строке прицепляется обработчик click (в котором выполняется непосредственно перенос)
			в event.data обработчика будет лежать id tr'a строки */
			allTrExceptSelected.click( listMoveAfterTableRow );
		}
	}
	return false;
}


/*	Очищает все связаное с переносом строки, стили и значение контрола */
function clearMoveSelection()
{
	$('tr.tableRowMoveAfter').removeClass('tableRowMoveAfter');
	$( 'tr.tableRowToMove' ).siblings().unbind( 'mouseover' ).unbind( 'mouseout' ).unbind( 'click' );
	$( 'tr.tableRowToMove' ).unbind( 'mouseover' ).unbind( 'mouseout' ).unbind( 'click' ).removeClass( 'tableRowToMove' );
}

// Помечает выбранную ранее строку таблицы "после" выбранной
function apeMoveAfterTableRow( e )
{
	return moveAfterTableRow( e, 'ape' );
}

// Помечает выбранную ранее строку таблицы "после" выбранной
function listMoveAfterTableRow( e )
{
	return moveAfterTableRow( e, 'list' );
}

/*	Помечает выбранную ранее строку таблицы "после" выбранной

	Параметры:
		e - event
*/
function moveAfterTableRow( e, mode )
{
	if ( mode == null )
		mode = 'ape';

	/* выполнение остальных обработчиков события отменяется */
	e.cancelBubble = true;

	/* ищем tr по которому кликнули */
	var clickedTr = $( getEventSrcElement( e ) );
	if( ! clickedTr.is( 'tr' ) )
		clickedTr = clickedTr.parents( 'tr' );
	/* id строки, на которую кликнули, за ней будет помещена ранее выбранная */
	var id = clickedTr.attr( 'id' );

	/* определяется, какая строка должна быть перемещена после указанной */
	var idToMove = $( 'tr.tableRowToMove' ).attr( 'id' );

	if ( idToMove != '' && idToMove != id )
	{
		// Обработка перемещения для АПЕ
		if ( mode == 'ape' )
		{
			// сохранение id чекнутых checkbox-ов для IE
			var checkboxCache = [];
			if ( $.browser.msie )
				$( '#' + idToMove + ' input:checkbox:checked' ).each(
					function( i ){
						checkboxCache[ i ] = '#' + this.id;
					}
				);

			// перенос "после" указанной строки ранее выбранной
			$( '#' + id ).after( $( '#' + idToMove ) );

			// пересчет значений hidden-ов с порядковым номером для всех строк после указанной
			$( '#' + id + '~tr' ).each(
				function(i){
					var order = Number(i) + 1 + Number($( '#' + id + '_order' ).val());
					$( '#' + this.id + '_order' ).val( order );
				}
			);

			// восстановление признака выделенности checkbox-ов для IE
			if ( $.browser.msie )
			{
				$( '#' + idToMove + ' input:checkbox:checked' ).removeAttr( 'checked' );
				$( checkboxCache.join( ',' ) ).attr( 'checked', 'checked' );
			}
		}
		// Обработка перемещения для списка
		else
		{
			var listName = clickedTr.parent().parent().attr('id');
			var listId1 = id.replace( 'row' + listName, '');
			var listId2 = idToMove.replace( 'row' + listName, '' );
			submitForm( listName + '_move,' + listName + '_moveAfter', listId2 + ',' + listId1 );
		}

		/* очистка стилей связанных с переносом и значения контрола "id перемещаемой строки" */
		clearMoveSelection();
	}

	return false;
}


/*	Перемещение строки таблицы вниз на 1 позицию путем обмена текущей строки со следующей,
	что равносильно перемещению вверх предыдущей строки, поэтому можно использовать вызов
	функции moveUp, передав ей идентификатор следующей строки, относительно данной

	Параметры:
		id - идентификатор тега tr перемещаемой строки
*/
function moveArrayPropertyEditorItemDown( id )
{
	var nextRow = $('#' + id).next('tr[id]');
	if (nextRow.hasClass('newItemEditorRow'))
		return;
	var nextId = nextRow.attr('id');
	if ( nextId )
		moveArrayPropertyEditorItemUp( nextId, true );
}


/* Открывает окно ровно по центру экрана

	Параметры:
		windowUrl		-
		windowName		-
		windowWidth		-
		windowHeight	-
		windowFeatures	-
*/
function openWindowCentered( windowUrl, windowName, windowWidth, windowHeight, windowFeatures )
{
	var left = Math.floor( ( window.screen.width - windowWidth ) / 2 );
	var top = Math.floor( ( window.screen.height - windowHeight ) / 2 );
	if ( windowFeatures != "" )
		windowFeatures = windowFeatures + ",";
	var features = windowFeatures + "resizable=yes,scrollbars=yes,width=" + windowWidth + ",height=" + windowHeight + ",top=" + top + ",left=" + left;
	window.open( windowUrl, windowName, features );
	return false;
}


/*
Если определена функция showPopupCentered, открывает страницу с переданным url во фрэйме, иначе в новом окне
	url				- адрес страницы
	windowWidth		- ширина окна или фрэйма
	windowHeight	- высота окна или фрэйма
	submitIds		- для showPopupCentered - строка с идентификаторами кнопок, выполняющих submit внутри дива, через ","
	windowName		- для window.open - имя окна
	windowFeatures	- для window.open - параметры окна
*/
function openWindowOrShowPopupCentered( url, windowWidth, windowHeight, submitIds, windowName, windowFeatures )
{
	if( $("#IsMobileVersion").val() == "1" )
	{
		windowWidth = windowGeometry.getViewportWidth();
		windowHeight = windowGeometry.getViewportHeight();
	}
	else
	{
		if( windowWidth == 0 ) windowWidth = 800;
		if( windowHeight == 0 ) windowHeight = 600;
	}
	if( typeof showPopupCentered == "function" )
		showPopupCentered( url, windowWidth, windowHeight, submitIds );
	else
		openWindowCentered( url, windowName, windowWidth, windowHeight, windowFeatures );
	return false;
}


/*
Версия функции openWindowOrShowPopupCentered, принимающая неразобранную
строку windowMode. Эта строка должна содержать параметры width и height, в противном
случае размеры окна будут установлены по умолчанию 800x600.
	url				- адрес страницы
	submitIds		- для showPopupCentered - строка с идентификаторами кнопок, выполняющих submit внутри дива, через ","
	windowName		- для window.open - имя окна
	windowMode		- строка параметров через запятую, задающая размеры окна и дополнительные параметры для window.open
*/
function openWindowOrShowPopupCenteredWithMode( url, submitIds, windowName, windowMode)
{
	windowMode = "," + windowMode;
	var widthRegexp = /,width=(\d+)/;
	var heightRegexp = /,height=(\d+)/;

	var ar = windowMode.match( widthRegexp );
	var windowWidth = ( ar ? parseInt( ar[1] ) : 800 );

	ar = windowMode.match( heightRegexp );
	var windowHeight = ( ar ? parseInt( ar[1] ) : 600 );

	windowMode = windowMode.replace( widthRegexp, "" ).replace( heightRegexp, "" );
	// Удаление добавленной нами начальной запятой. Если исходная строка содержала
	// только ширину и высоту окна, slice() оставит строку пустой.
	windowMode = windowMode.slice( 1 );
	return openWindowOrShowPopupCentered( url, windowWidth, windowHeight, submitIds, "" , windowMode );
}


/*
	Параметры:
		lookupUrl		- url страницы для выполнения запроса автоматического завершения того, что написал пользователь.
						Т.е. попытка получить объект по тексту, введенному пользователем.
		lookupHandler	- функция обработчик результатов lookup запроса, ей передаются 2 параметра,
						собственно результат и имя LinkObject контрола.
						Функция должна возвращать true - если открытие диалога выбора значения нужно и false - иначе
		listUrl			- адрес диалога выбора значения
		name			- имя LinkObject контрола
		windowWidth		- ширина окна выбора значений
		windowHeight	- высота окна выбора значений
*/
function linkObjectControlOnSelectButtonClick( lookupUrl, lookupHandler, listUrl, name, windowWidth, windowHeight, bOpenSelectionWindow )
{
	if ( bOpenSelectionWindow == undefined )
		bOpenSelectionWindow = true;

	/* если в контроле не проставлен id, т.е. он либо пустой либо пользователь что-то ввел туда руками,
	и контрол с текстовым значением не пуст, т.е. остается только ситуация, когда пользователь что-то ввел руками */
	if( lookupUrl && !$( '#' + name ).val() && $( '#' + name + 'Name' ).val() )
	{
		$.ajax(
			{
				async: false,
				type: "GET",
				url: lookupUrl + urlEncode( $( '#' + name + 'Name' ).val() ),
				success:
					function( data ){
						bOpenSelectionWindow = data ? eval( lookupHandler + '( "'+ data + '", "' + name + '" )' ) : true;
					}
			}
		);
	}

	/* выбор значения в popup окне */
	if ( bOpenSelectionWindow )
	{
		/* если в контроле не заполнен id и если в url есть маркер фильтра, то он будет заменён на введенное пользователем значение,
			таким образом оно передаётся в интерфейс выбора, там оно может быть использовано в качестве значения фильтра */
		if ( !$( '#' + name ).val() )
			listUrl = listUrl.replace( '&&', urlEncode( $( '#' + name + 'Name' ).val() ) );
		else
			listUrl = listUrl.replace( '&VAL&', urlEncode( $( '#' + name ).val() ) );

		openWindowOrShowPopupCentered( listUrl, windowWidth, windowHeight, "", '_blank', 'scrollbars=1' );
	}

	return false;
}


/*	Cтандартный обработчик lookup запроса LinkObject контрола. В случае, если
	lookup запрос вернул пару: идентификатор, значение; помещает ее в контрол и возвращает false,
	в противном случае - true. Т.е. возвращает признак необходимости открытия диалога выбора значения.

	Параметры:
		res -
		name -
*/
function linkObjectControlLookupHandler( res, name )
{
	var arRes = res.split(';');
	if ( arRes.length == 2 )
	{
		$( '#' + name ).val( arRes[ 0 ] );
		$( '#' + name + 'Name' ).val( arRes[ 1 ] );
		return false;
	}
	else
		return true;
}


/*	Очищает значение LinkObjectControl'а

	Параметры:
		name -
*/
function clearLinkObjectControl( name )
{
	$( '#' + name ).val( '' );
	$( '#' + name + 'Name' ).val( '' );
	/* если в окне объявлена функция обработчик заполнения контрола, вызывается она */
	if ( typeof( window.linkObjectControlOnValueSet ) != "undefined" )
		window.linkObjectControlOnValueSet( name, '', '' );

	/* если у контрола проставлен пользовательский onchange (т.е. он есть у хиддена) - он вызывается */
	$('#' + name ).change();

	return false;
}


/*
Отмена стандартной обработки Enter в случае, когда показывается подсказка
*/
function onLinkObjectControlKeyDown( ev )
{
	if( ev.which == 13 )
	{
		var c = $( ev.target );
		var p = c.parent();
		if( $( '.hint', p ).length > 0 )
		{
			ev.preventDefault();
			ev.stopPropagation();
			return false;
		}
	}
}

/* обработка нажатия на кнопку в linkObjectControl'ах
используется для отображения подсказки для выбора значений */
var linkObjectControlAutoCompleteCall = null;
function onLinkObjectControlKeyUp( ev )
{
	if (!ev.target) { ev.target = ev.srcElement; };

	if ( ev.target != null )
		/* игнорируются табуляция и спец клавиши */
		if ( ev.which != 9 && !ev.altKey && !ev.ctrlKey && !ev.shiftKey )
		{
			var processKey = true;

			var c = $( ev.target );
			var p = c.parent();
			var sel = $( '.hint li.selected', p );

			if( ev.which == 27 )
			{
				processKey = false;
				$( '.hint', p ).remove();
			}
			if( ev.which == 13 )
			{
				processKey = false;
				sel.mouseup();
				ev.preventDefault();
				ev.stopPropagation();
			}

			if( ev.which == 38 || ev.which == 40 )
			{
				if( $( '.hint', p ).length > 0 )
				{
					processKey = false;

					if( sel.length == 0 )
						$( '.hint li:first-child', p ).addClass( "selected" );
					else
					{
						if( ev.which == 38 && $( '.hint li:first-child.selected', p ).length == 0 )
							sel.removeClass( "selected" ).prev().addClass( "selected" );

						if( ev.which == 40 && $( '.hint li:last-child.selected', p ).length == 0 )
							sel.removeClass( "selected" ).next().addClass( "selected" );
					}
				}
			}

			if( processKey )
			{
				/* перед отправкой делается задержка, чтобы быстропечатающий человек не создавал много запросов на сервер */
				if ( linkObjectControlAutoCompleteCall )
					window.clearTimeout( linkObjectControlAutoCompleteCall );
				linkObjectControlAutoCompleteCall = window.setTimeout( "linkObjectControlAutoComplete('" + ev.target.id + "', '" + ev.which + "')", 100 );
			}
		}
}


/* отображение подсказки с выбранными значениями для linkObjectControl'а */
function linkObjectControlAutoComplete( controld, keyCode )
{
	var targetControl = $( "#" + controld );

	/* если значение контрола изменилось - делается запрос на сервер, а значение сохраняется в атрибуте */
	if( targetControl.attr('oldValue') != targetControl.val() )
	{
		targetControl.attr( 'oldValue', targetControl.val() );
		/* для hidden с идентификатором очищается значение и вызывается обработчик изменения */
		$( '#' + controld.replace( 'Name', '' ) ).val('').change();
	}
	else
		return;

	// Ссылка на страницу получения списка значений
	var url = $('#' + controld.replace( 'Name', 'PageUrl' ) ).val() + '?control=' + controld.replace( 'Name', '' )
		+ '&text=' + urlEncode( targetControl.val() )
		+ '&hintSqlKey=' + urlEncode( $('#' + controld.replace( 'Name', 'Session' ) ).val() );

	var paramNames = $('#' + controld.replace( 'Name', 'PageParamNames' ) ).val().split(',');

	for( var pIndex = 1; pIndex <= paramNames.length; pIndex++ )
		url += '&param' + pIndex + "=" + $( '#' + paramNames[pIndex-1] ).val();

	if( ( typeof linkObjectControlGetAutoCompleteUrl == "function" ) )
	{
		url = linkObjectControlGetAutoCompleteUrl( url, controld );
	}

	// Запрос
	$.ajax(
		{
			async: true,
			type: "GET",
			url: url + "&ts=" + ( new Date().valueOf() ),
			success: function( data )
			{
				// Если получены данные
				if ( data.length != 0 )
				{
					// Если пришедший ответ соответствует тексту, который сейчас написан в контроле
					if ( data.indexOf( '$' + targetControl.val() + '$' ) == 0 )
					{
						// Находим контейнер для показа помощи
						var hintContainer = targetControl.parent();

						// Заполняем блок помощи
						$( '.hint', hintContainer ).remove();
						hintContainer.append( data.replace( '$' + targetControl.val() + '$', '' ) );

						/* Если в списке всего один элемент, но при этом пользователь не стирал бэкспейсом,
						сразу происходит нажатие на него и автозаполнение */
						if ( $('li', hintContainer ).length == 1 && keyCode != 8 )
							$('li', hintContainer )[0].onmousedown();
					}
				}
				// подсказка скрывается
				else
					$( '.hint', targetControl.parent() ).remove();
			}
		}
	);

	linkObjectControlAutoCompleteCall = null;
}

/* обработчик нажатия на вариант из подсказки к linkObjectControl'у */
function selectHintOption( controlId, id, name )
{
	/* при выборе значения из списка проставляются и видимое пользователю значение и то,
	которое хранится для отслеживания изменений - последнее, для которого запрашивалась подсказка */
	$('#' + controlId + 'Name').val( name ).attr( 'oldValue', name );
	$( '.hint', $('#' + controlId ).parent() ).remove();
	$('#' + controlId ).val( id ).change();
}

/* подсвечивает вариант из посказки к linkObjectControl'у */
function highlightHintOption( option )
{
	var o = $( option );
	var p = o.parent();
	$( "li.selected", p ).removeClass("selected");
	o.addClass("selected");
}


/* скрывает окно подсказки при потере фокуса контролом */
function onLinkObjectControlFocusLost( ev )
{
	if (!ev.target) { ev.target = ev.srcElement; };
	/* пауза нужна для того, чтобы в случае, если пользователь ткнул в пункт подсказки он успел выбраться */
	window.setTimeout( function(){ $( '.hint', $( "#" + ev.target.id ).parent() ).remove(); }, 200 );
}


/*	Инициализация контрола управляющего отображением скрывающегося списка
	и первоначальное сокрытие этого списка

	Параметры:
		id - идентификатор списка
*/
function initToggle( id )
{
	// заголовок
	var $dt = $( '#' + id + ' dt' );
	// знак в заголовке
	var $sign = $( '<span>+</span>' )
		.prependTo( $dt );
	// список
	var $dd = $( '#' + id + ' dd' )
		.hide();
	// при клике на заголовок - скрытие/отображение списка
	// и изменение знака
	$dt.click(
		function(){
			if ( $dd.css( 'display' ) == 'none' )
				$dd.slideDown( 'fast', function(){ $sign.text( '-' ); } );
			else
				$dd.slideUp( 'fast', function(){ $sign.text( '+' ); } );
		}
	);
}


/*	Функция, синхронизирующая два input контрола
	current - id элемента в который копируется value
	toSynchronize - id Элемента из которого копируется value

	Параметры:
		current			-
		toSynchronize	-
*/
function fileControlSynchronize( current, toSynchronize )
{
	var dest = document.getElementById( current );
	var sourse = document.getElementById ( toSynchronize );

	if ( dest.value != sourse.value )
		dest.value = sourse.value;

	$( dest ).change();
}


/*	подгружает ветви дерева, скрывает и отображает подгруженные ветви
	получает Id узла на +- которого кликнули и имя дерева

	Параметры:
		nodeId -
		treeName -
		dataLoadedCallback - ссылка на функцию, которая вызывется после того, как будет получен результат
			запроса на сервер
*/
function treeNodeChildrenToggle( nodeId, treeName, dataLoadedCallback )
{
	// дети узла, которого нужно развернуть
	var jChild = $( '#' + treeName + '_' + nodeId + ' ul' );

	// если дети ещё не подгружены с сервера, но "+" присутствует, т.е. дети у данного узла есть
	if ( !jChild[0] )
	{
		// на время загрузки дочерних узлов обработчик onclick снимается
		// чтобы предотвратить загрузку дубликатов узлов при повторном нажатии
		var onclick = $( '#' + treeName + '_' + nodeId + '_control' ).attr( 'onclick' );
		$( '#' + treeName + '_' + nodeId + '_control' ).removeAttr( 'onclick' );

		$.get( "tree-handler.aspx", { id: nodeId, url: $( '#' + treeName + '_url' ).val(), tree: treeName, activeId: $( '#' + treeName ).val() },
			function( data ){
				// если пришёл текст с сообщением об ошибке - потомков у данного узла нет - '+' убирается
				if ( data == 'No records found' )
					treePlusMinusChange( nodeId, treeName, true );
				else {
					$( '#' + treeName + '_' + nodeId ).append( data );
					treePlusMinusChange( nodeId, treeName, false );
					// возвращение обработчика после загрузки и добавления узлов
					// двумя способами, чтобы работало в jQuery 1.2 и 1.6
					var $control = $( '#' + treeName + '_' + nodeId + '_control' );
					if ( /^1\.6/.test($.fn.jquery) )
						$control.attr( 'onclick', onclick );
					else
						$control.click( onclick );
				}
				if ( dataLoadedCallback )
					dataLoadedCallback.call( this, treeName, nodeId );
			}
		);
	}
	// если дети уже есть
	else
	{
		// переключается видимость детей
		jChild.toggle();
		// меняется знак
		treePlusMinusChange( nodeId, treeName, false );
	}

	return false;
}


/*	Меняет картинки +- при клике,
	определяя является ли она картинкой последнего элемента - рисует угловой
	если нет - рисует Т-образный
	определяет была ли картика "+" - тогда рисует "-", нет - рисует "+"
	в режиме removeSign заменят +- на shifter

	Параметры:
		nodeId		- идентификатор узла, на знаке которого произошёл клик
		treeName	- имя дерева
		removeSign	- признак того, нужно ли удалять знак +/-
					( в случае если оказалось, что у узла нет потомков)
*/
function treePlusMinusChange( nodeId, treeName, removeSign )
{
	var jControl = $( '#' + treeName + '_' + nodeId + '_control' );
	var currentClass = jControl.attr( 'class' );
	jControl.attr( 'class',
		removeSign ?
			currentClass.replace( 'plus|minus', 'shifter' ) :
			currentClass.indexOf( 'plus' ) > -1 ?
				currentClass.replace( 'plus', 'minus' ) :
				currentClass.replace( 'minus', 'plus' )
	);
}


/*	Разворачивает дерево до выделенного узла, основываясь на hidden поле дерева

	Параметры:
		treeName - имя дерева
		nodeId - узел, который был раскрыт на предыдущем шаге
*/
function treeInit( treeName, nodeId )
{
	// получаем путь к выделенному узлу из hidden-поля дерева
	var treeUnrollPath = $( '#' + treeName + '-path' ).val().split( '.' );

	// последовательно подгружаем и раскрываем узлы, с полученными из hiddena Id
	for ( var i=0; i<treeUnrollPath.length; i++ )
	{
		/* если узел не передан, то раскрытий выполнятся для 1-го узла из пути,
		иначе для следующего после переданного узла */
		if ( !nodeId || nodeId == treeUnrollPath[i-1] )
		{
			/* в качестве callback функции на окончание прогрузки дочерних узлов, передается ссылка на treeInit */
			treeNodeChildrenToggle( treeUnrollPath[i], treeName, treeInit );
			break;
		}
	}

	// Выделенному в данный момент узлу вызывается click на крестике для показа всех дочерних элементов
	$( '.treeSelectStyleActive' ).prev('img,span').click();

	// Если был прогружен весь путь, пристыковываем к выбранному узлу меню команд, если оно есть
	if( nodeId == treeUnrollPath[ treeUnrollPath.length - 1 ] ) {
		var $node = $('.treeSelectStyleActive');
		var menu = $node.parents('.treeEditorTree').children('.treeEditorMenu').children();
		if( menu.length > 0 ) {
			$node.parent().addClass('treeItemWithMenu');
			$node.wrapInner('<span class="treeItemLabel"/>').append( $('<span class="treeItemMenu"/>').append(menu) );
		}
	}
}


/*  Показать редактор дерева по центру страницы в скриптовом попапе
	name - название BaseTreeEditor'а
*/
function showTreeEditorInPopup( name )
{
	if( window.customShowTreeEditorInPopup )
		return customShowTreeEditorInPopup( name );

	return showHtmlPopup( $('.treeEditorTree').nextAll(), 800, 600, {
		onClose: function() {
			// Перегружаем страницу, показывая в редакторе под деревом элемент, выбранный в дереве.
			// Перед этим очищаем команду (если попап был открыт после того как пользователь нажал
			// кнопку добавления дочернего элемента, мы не должны повторно посылать нажатие кнопки
			// и переоткрывать попап)
			submitForm( name + 'cmd', '', '' );
			return false;
		}
	});
}


/*	Обновляет число на картинке CAPTCHA.

	Параметры:
		name - имя CAPTCHA элемента
*/
function ReloadCaptchaImage( name )
{
	/* к ссылке на картинку добавляется уникальная часть, и обновляется свойство src картинки,
	чтобы она перегрузилась с сервера заново */
	var uuid = generateUUID();
	$('#' + name + 'guid').val(uuid);

	var src = 'get-captcha-image.aspx?key-name=' + name + '&guid=' + uuid;
	$('#' + name + '-image').attr( 'src', '' );
	$('#' + name + '-image').attr( 'src', src );

	return false;
}

// Генерация уникальных ключей
function generateUUID() {
	var d = new Date().getTime();
	if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
		d += performance.now(); // Таймер высокой точности
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}


/*	Возвращает url редактору FCK

	Параметры:
		url -
*/
function ReturnUrlToFck( url ){
	window.opener.SetUrl( url );
	window.close();
	return false;
}


/*	Возвращает url раздела редактору FCK

	Параметры:
		url			-
		sectionPart	-
*/
function ReturnSectionUrlToFck( url ){
	window.opener.SetUrl( url );
	window.close();
	return false;
}


// Назначение:				получает строковое представление даты	и времени, сформированное на основании шаблона
// Возращаемое значение:	строковое представление числа
// Параметры:				date - дата
//							template - строка шаблона, например, "yyyy-MM-dd hh-mm-ss" - результатом будет строка "2004-01-01 14-25-15"
function getFormattedDate( date, template )
{
	if ( ( typeof date == "object" ) && ( date instanceof Date ) )
	{
		// заменяется год
		template = template.replace( "yyyy", date.getFullYear() );
		template = template.replace( "yy", date.getYear() );

		// заменяется месяц, добавляя лидирующий 0
		// так как месяцы нумеруются начиная с 0, то прибавляем при выводе 1
		if ( (date.getMonth()+1).toString().length < 2 )
			template = template.replace( "MM", "0" + (date.getMonth()+1) );
		else
			template = template.replace( "MM", (date.getMonth()+1) );

		template = template.replace( "M", (date.getMonth()+1) );

		// заменяется день, добавляя лидирующий 0
		if ( date.getDate().toString().length < 2 )
			template = template.replace( "dd", "0" + date.getDate() );
		else
			template = template.replace( "dd", date.getDate() );

		template = template.replace( "d", date.getDate() );

		// заменяются часы, добавляя лидирующий 0
		if ( date.getHours().toString().length < 2 ){
			template = template.replace( "hh", "0" + date.getHours() );
			template = template.replace( "HH", "0" + date.getHours() );
		}
		else{
			template = template.replace( "hh", date.getHours() );
			template = template.replace( "HH", date.getHours() );
		}

		template = template.replace( "h", date.getHours() );
		template = template.replace( "H", date.getHours() );

		// заменяются минуты, добавляя лидирующий 0
		if ( date.getMinutes().toString().length < 2 ) {
			template = template.replace( "nn", "0" + date.getMinutes() );
			template = template.replace( "mm", "0" + date.getMinutes() );
		}
		else{
			template = template.replace( "nn", date.getMinutes() );
			template = template.replace( "mm", date.getMinutes() );
		}

		template = template.replace( "h", date.getMinutes() );
		template = template.replace( "m", date.getMinutes() );

		// заменяются секунды, добавляя лидирующий 0
		if ( date.getSeconds().toString().length < 2 )
			template = template.replace( "ss", "0" + date.getSeconds() );
		else
			template = template.replace( "ss", date.getSeconds() );

		template = template.replace( "s", date.getSeconds() );

		return template;
	}
}


/*
	Назначение: получение даты из строки в указанном формате
	Результат: вернёт дату, или упадёт - если получит некорректные значения параметров.
		Макросы YYYY, MM, DD обязательны
	Параметры:
		sDate - строковое представление даты, формат должен соответсвовать sTemplate.
		sTemplate - шаблон строки, он может содержать следующие макросы YYYY, MM, DD, hh, mm, ss в любом регистре
*/
function getDateFromString( sDate, sTemplate )
{
	var nPos;		// рабочая переменная
	var sYear;		// год
	var sMonth;		// месяц
	var sDay;		// день
	var dtDate;		// дата - результат

	// дата
	nPos = sTemplate.indexOf("YYYY");
	if ( nPos == -1 ) nPos = sTemplate.indexOf("yyyy");
	sYear = sDate.substr( nPos, 4 );
	nPos = sTemplate.indexOf("MM");
	sMonth = sDate.substr( nPos, 2 );
	nPos = sTemplate.indexOf("DD");
	if ( nPos == -1 ) nPos = sTemplate.indexOf("dd");
	sDay = sDate.substr( nPos, 2 );

	// Создание объекта даты,
	// а часы/минуты/секунды будут добавляться в него встроенными методами
	// -1 т.к. месяцы начинают считаться с нуля
	dtDate = new Date( sYear, sMonth - 1, sDay );

	// время
	nPos = sTemplate.indexOf("hh");
	if ( nPos == -1 ) nPos = sTemplate.indexOf("HH");
	if ( nPos > 0 ) dtDate.setHours( sDate.substr( nPos, 2 ) );
	nPos = sTemplate.indexOf("mm");
	if ( nPos > 0 ) dtDate.setMinutes( sDate.substr( nPos, 2 ) );
	nPos = sTemplate.indexOf("ss");
	if ( nPos == -1 ) nPos = sTemplate.indexOf("SS");
	if ( nPos > 0 ) dtDate.setSeconds( sDate.substr( nPos, 2 ) );

	return dtDate;
}


/*	Вставляет в контрол название выбранного в палитре цвета */
function fillColorPickerControl(controlName, cell) {
	var hexColor = getHexRGBColor(cell.style.backgroundColor);
	$('#' + controlName).val(hexColor);
	$('#' + controlName + '-color-name').val(cell.title);
	$('#' + controlName + '-img-picker').attr('style', 'background-color: ' + hexColor).removeClass('empty');
	$('#' + controlName + '-pallete').hide();
}

/*	Очищает контрол выбора цвета */
function clearColor( controlName ) {
	$('#' + controlName).val('');
	$('#' + controlName + '-color-name').val('');
	$('#' + controlName + '-img-picker').attr('style', '').addClass('empty');
	$('#' + controlName + '-pallete').hide();
}

/*	Показывает и скрывает палитру */
function showHideColorPallete ( controlName, e )
{
	var x = 0, y = 0;

	if (!e) e = window.event;

	if ( e.pageX || e.pageY )
	{
		x = e.pageX;
		y = e.pageY;
	}
	else if (e.clientX || e.clientY)
	{
		x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
		y = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
	}

	var $pallete = $('#' + controlName + '-pallete');
	$pallete.css({ left: x - 40 + 'px', top: y + 'px', display: 'block' });
	$(document)
		// закрываем уже открытое меню, если есть
		.trigger('click.colorpicker')
		// текущее закрываем по клику в пустом месте документа
		.bind('click.colorpicker', function () {
			$pallete.hide();
			$(document).unbind('click.colorpicker');
		});

	// чтобы не сработал обработчик, установленный на document
	// `return false` в этом случае не достаточно
	e.cancelBubble = true; // IE
	if (e.stopPropagation)
		e.stopPropagation(); // W3C
}

/*	Преобразует rgb( n, n, n ) в #FFFFFF
	Если передана пустая строка, возвращает пустую строку */
function getHexRGBColor( color )
{
	color = color.replace(/\s/g,"");
	var aRGB = color.match( /^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);

	if(aRGB)
	{
		color = '#';
		for ( var i=1; i<=3; i++ )
		color += Math.round((aRGB[i][aRGB[i].length-1]=="%"?2.55:1)*parseInt(aRGB[i])).toString(16).replace(/^(.)$/,'0$1');
	}
	else
		color = color.replace(/^#?([\da-f])([\da-f])([\da-f])$/i, '$1$1$2$2$3$3');

	return color.toUpperCase();
}


/*	Позволяет IE корректно обрабатывать прозрачность png-файлов
	пример исполльзования:
	в описание стилей элемента, которому нужно добавить обработку png-прозрачности в IE
	добавить одно из правил:
		filter: expression( fixPNG(this ) )
		filter: expression( fixPNGCrop(this ) )
		filter: expression( fixPNGScale(this ) )
	правила имеют следующие отличия:
		"image"	- увеличивает или уменьшает размеры контейнера до совпадения с размерами картинки
		"crop"	- картинка урезается границами элемента контейнера
		"scale"	- маштабируется таким образом, чтобы её границы совпали с границами элемента-контейнера
*/
function fixPNG( element ) {
	fixPNGMode( element, 'image' );
}
function fixPNGCrop( element ) {
	fixPNGMode( element, 'crop' );
}
function fixPNGScale( element ) {
	fixPNGMode( element, 'scale' );
}
function fixPNGMode( element, sizingMethod )
{
	// если броузер IE версии 5.5 или 6
	if ( /MSIE (5\.5|6).+Win/.test( navigator.userAgent ) )
	{
		var src;
		if ( element.tagName == 'IMG' )
		{
			if ( /\.png$/.test( element.src ) )
			{
				src = element.src;
				element.src = "img/spacer.gif";
			}
		}
		else
		{
			src = element.currentStyle.backgroundImage.match( /url\("(.+\.png)"\)/i );
			if ( src )
			{
				src = src[1];
				element.runtimeStyle.backgroundImage = "none";
			}
		}

		if ( src )
			element.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader( src='" + src + "', sizingMethod='" + sizingMethod + "')";
	}
}


/*	Увеличивает значения Control'а на значение delta

	Параметры:
		control	- идентификатор инпута или сам инпут в виде DOM-объекта или объекта jQuery
		delta	- размер приращения
		min		- минимальная граница
		max		- максимальная граница
*/
function incrementControlValue( control, delta, min, max )
{
	var $c;
	if ( typeof(control) === "string" )
		$c = $( '#' + control );
	else
		$c = $(control);

	if ( !$c[0].disabled )
	{
		var controlValue = $c.val();

		/* точность, определяется как максимальное число знаков после десятичной точки
		для значения контрола и приращения */
		var precision = 0;

		var dotPos = delta.toString().indexOf( "." );
		if( dotPos != -1 )
			precision = delta.toString().length - dotPos - 1;

		dotPos = controlValue.toString().indexOf( "." );
		if( dotPos != -1 )
		{
			var precision1 = controlValue.toString().length - dotPos - 1;
			if( precision1 > precision )
				precision = precision1;
		}

		// попытка преобразовать введённое значение в число
		var res = parseFloat( controlValue );
		if( isNaN( res ) )
			res = parseFloat( min );

		res += parseFloat( delta );

		// если число выходит за допустимые пределы, то записываются эти пределы, иначе само число
		if ( res < min )
			$c.val( min );
		else if( res > max )
			$c.val( max );
		else
			$c.val( res.toFixed( precision ) );

		$c.change();
		$c.trigger("spin-change");
	}
}


/*	Уменьшает значения Control'а на значение delta

	Параметры:
		id		- идентификатор контрола
		delta	- размер приращения
		min		- минимальная граница
		max		- максимальная граница
*/
function decrementControlValue( id, delta, min, max )
{
	// вызов инкремента, но с отрицательным приращением
	incrementControlValue( id, -delta, min, max );
}


/*
Перебирает все textarea на странице, для которых проставлен флаг
отображения в виде CKEditor, и создаёт для них CKEditor'ы.
Задаёт стили по умолчанию для CKEditor'ов (их можно переопределить в ckeditor/config.js)
*/
function InitCkEditorsOnPage()
{
	// ГЛОБАЛЬНАЯ НАСТРОЙКА
	CKEDITOR.config.contentsCss = "Css/ck_editorarea.css";
	CKEDITOR.config.customConfig = null;
	CKEDITOR.config.extraPlugins += ",STImage";
	CKEDITOR.config.filebrowserUploadUrl = "ck-upload.aspx";

	// значения по умолчанию: <http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.config.html#.toolbar_Full>
	CKEDITOR.config.toolbar_Full = [
		{ name: "document",    items: [ "Source","-","Maximize","Print" ] },
		{ name: "clipboard",   items: [ "Cut","Copy","Paste","PasteText","PasteFromWord","-","Undo","Redo" ] },
		{ name: "insert",      items: [ "Image","Link","Unlink","Anchor","Table","HorizontalRule","SpecialChar","Flash" ] },
		{ name: "editing",     items: [ "Find","Replace","SelectAll" ] },
		"/",
		{ name: "styles",      items: [ "Styles" ] },
		{ name: "basicstyles", items: [ "Bold","Italic","Underline","Strike","Subscript","Superscript","-","RemoveFormat" ] },
		{ name: "paragraph",   items: [ "NumberedList","BulletedList","-","Outdent","Indent","-","JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock" ] },
		{ name: "colors",      items: [ "TextColor","BGColor" ] },
		{ name: "tools",       items: [ "ShowBlocks","-","About" ] }
	];

	CKEDITOR.config.stylesSet = [
		{ "name": "Heading 3", "element": "h3" },
		{ "name": "Heading 4", "element": "h4" }
	];

	CKEDITOR.config.templates = "";

	// НАСТРОЙКА, СПЕЦИФИЧНАЯ ДЛЯ ПРОЕКТА (кастомизация)
	if( typeof( CKEDITOR_editorConfig ) !== "undefined" )
		CKEDITOR_editorConfig( CKEDITOR.config );

	// в качестве значения свойства toolbar могут использоваться строки "Full" и "Basic"
	// избавляемся от них, чтобы в дальнейшем завязываться на то, что свойство toolbar - это массив
	if( typeof( CKEDITOR.config.toolbar ) === "string")
		CKEDITOR.config.toolbar = CKEDITOR.config["toolbar_" + CKEDITOR.config.toolbar];

	// если в кастомизации были добавлены шаблоны, добавляем кнопку вставки шаблона на тулбар
	if( CKEDITOR.config.templates ) {
		for( var i = 0; i < CKEDITOR.config.toolbar.length; i++ ) {
			var toolbox = CKEDITOR.config.toolbar[ i ];
			if( toolbox.name === "insert" ) {
				// вставляем перед кнопкой вставки спецсимволов
				var pos = toolbox.items.indexOf( "SpecialChar" );
				if( pos >= 0 )
					toolbox.items.splice( pos, 0, "Templates" );
				break;
			}
		}
	}

	$(".replace-with-ck").each( function() {
		var $this = $( this );

		// НАСТРОЙКА КОНКРЕТНОГО РЕДАКТОРА
		var config = {
			language: $this.attr("fck-language"),
			width: $this.attr("fck-width"),
			height: $this.attr("fck-height"),
			bodyClass: $this.attr("fck-body-class")
		};

		// автоматическая вставка разрывов страницы
		if( $this.attr("fck-page-size" ) ) {
			config.extraPlugins = "" + CKEDITOR.config.extraPlugins + ",STAutoPageSeparators";

			// добавляем в конец панели "insert" тулбара кнопки "Вставить разрыв страницы" (стандартная) и
			// "Автоматически вставлять разрывы страницы" (реализуется нашим плагином autoPageSeparators)
			config.toolbar = CKEDITOR.tools.clone( CKEDITOR.config.toolbar );
			for( var i = 0; i < config.toolbar.length; i++ ) {
				var toolbox = config.toolbar[ i ];
				if( toolbox.name === "insert" ) {
					toolbox.items.push("-");
					toolbox.items.push("PageBreak");
					toolbox.items.push("STAutoPageSeparators");
					break;
				}
			}
		}

		// абсолютные ссылки - передача параметра siteAddress на страницу Upload
		var siteAddress = $this.attr( "fck-absolute-site-address" );
		if( siteAddress ) {
			var url = config.filebrowserUploadUrl || CKEDITOR.config.filebrowserUploadUrl;
			config.filebrowserUploadUrl = url + ( url.indexOf("?") === -1 ? "?" : "&" ) +
				"siteAddress=" + encodeURIComponent( siteAddress );
		}

		// НАСТРОЙКА, СПЕЦИФИЧНАЯ ДЛЯ КОНКРЕТНОГО РЕДАКТОРА (кастомизация)
		if( typeof( CKEDITOR_concreteEditorConfig ) !== "undefined" )
			CKEDITOR_concreteEditorConfig( this, config );

		// замена <textarea> на визуальный редактор
		CKEDITOR.replace( this, config );
	} );
}


/*	Выбирает элемент из коллекции элементов с классом replace-with-fck и вызывает для него InitFckEditor
	В паре с обработчиком FCKeditor_OnComplete последовательно создает все FCK редакторы на странице.
	Автоматически добавляется в обработчики body.onload при задании свойства ShowAsFckEditor = true для TextControl.
*/
function InitFckEditorsOnPage()
{
	if ( $( ".replace-with-fck" ).length > 0 )
	{
		var textareaToReplace = $( ".replace-with-fck" )[0];
		$( textareaToReplace ).attr( "class", "" );

		InitFckEditor( textareaToReplace.name, $( textareaToReplace ).attr( "fck-width" ), $( textareaToReplace ).attr( "fck-height" ), $( textareaToReplace ).attr( "fck-body-class" ) );
	}

	return true;
}


/*	Создает редактор FCK

	Параметры:
		sName	- имя редактора, совпадает с именем контрола, который он подменяет
		Width	- ширина поля редактирования
		Height	- высота поля редактирования
		BodyClass - дополнительный CSS класс для body внутри созданного FCKEditor'а (опционален)
*/
function InitFckEditor( sName, Width, Height, BodyClass )
{

	// заменяется кусок пути от последнего '/' на '/script/fckeditor/'
	var sBasePath = document.location.pathname.replace( /\/[^\/]*$/, '/script/fckeditor/' );

	var oFCKeditor = new FCKeditor( sName );
	oFCKeditor.BasePath = sBasePath;
	oFCKeditor.Height = Height;
	oFCKeditor.Width = Width;
	oFCKeditor.BodyClass = BodyClass;
	oFCKeditor.ReplaceTextarea();

	return oFCKeditor;
}


/*
	Обработчик, вызываемый движком FCK после создания экземпляра FckEditor (после вызова oFCKeditor.ReplaceTextarea()).
*/
function FCKeditor_OnComplete( editorInstance ) {
	InitFckEditorsOnPage();
}


/* Получить HTML из FCKEditor'а или CKEditor'а, привязанного к textarea с заданным id.
   Если FCKEditor/CKEditor не найден, возвращается null.
 */
function getFckHtml( id ) {
	var oEditor = null;
	if( typeof(FCKeditorAPI) != 'undefined' ) {
		oEditor = FCKeditorAPI.GetInstance( id );
		if( oEditor )
			return oEditor.GetHTML() || "";
	}
	if( typeof(CKEDITOR) != 'undefined' ) {
		oEditor = CKEDITOR.instances[ id ];
		if( oEditor )
			return oEditor.getData() || "";
	}
	return null;
}


/* Проставить HTML FCKEditor'у или CKEditor'у, привязанному к textarea с заданным id.
   Если FCKEditor/CKEditor не найден, вызов игнорируется.
 */
function setFckHtml( id, html ) {
	var oEditor = null;

	//Если на странице есть FCKeditor, то определены функции из FCKeditorAPI
	if( typeof(FCKeditorAPI) != "undefined" ) {
		oEditor = FCKeditorAPI.GetInstance( id ) ;
		//Если контрол - FCKEditor, и в нем уже прогрузилось EditingArea,
		// то в него можно загрузить информацию
		// если она еще не прогроузилась, то информация автоматически добавится из
		// hidden-поля при завершении инициализации FCKEditor
		if ( oEditor && oEditor.EditingArea )
			oEditor.SetHTML( html );
	}

	//Аналогично для CKEditor
	if( oEditor == null && typeof(CKEDITOR) != "undefined" ) {
		oEditor = CKEDITOR.instances[ id ];
		if ( oEditor )
			oEditor.setData( html );
	}
}


/*	Переключает язык

	Параметры:
		sNewLangPostfix	- постфикс нового языка
		sControls		- идентификаторы контролов, в которых происходит редактирование
		sLanguages		- список всех языков
*/
function changeLanguage( sNewLangPostfix, sControls, sLanguages )
{
	var sOldLangPostfix = getActiveLanguage( sLanguages );
	if ( sNewLangPostfix != sOldLangPostfix )
	{
		//Флаг готовности
		var ready = true;

		//Если на странице есть FCKeditor
		if( typeof (FCKeditorAPI) != "undefined" )
		{
			// Строка типа 234,64,274 преобразуется в строку типа #234,#64,#274
			// по селектору типа #234,#64,#274 получаются все многоязычные контролы
			// для каждого вызывается функция
			$( sControls.replace( /[^,]+/g, '#$&' ) ).each(
				function(){
					//Если текущий контрол - FCKeditor
					var oEditor = FCKeditorAPI.GetInstance( this.id ) ;
					//Еще не прогрузился
					if ( oEditor != null && oEditor.Status == 0 )
						ready = false;
				}
			);
		}

		if( ready )
		{
			saveActiveLanguageTexts( sControls, sLanguages );
			showLanguageTexts( sNewLangPostfix, sControls );

			// переключается активность вкладок
			$( '#' + sOldLangPostfix ).parent().removeClass( 'activeTab' );
			$( '#' + sNewLangPostfix ).parent().addClass( 'activeTab' );
		}
	}
	return false;
}


/*	Возвращает id активного в данный момент языка

	Параметры:
		sLanguages	- список всех языков
*/
function getActiveLanguage( sLanguages )
{
	return $( sLanguages.replace( /[^,]+/g, '.activeTab #$&' ) ).attr( 'id' );
}


/*	Сохраняет тексты из видимых контролов в hidden-поля

	Параметры:
		sControls - список видимых контролов
		sLanguages - список всех языков
*/
function saveActiveLanguageTexts( sControls, sLanguages )
{
	//постфикс текущего языка
	//определяем по активной ссылке
	var sOldLangPostfix = getActiveLanguage( sLanguages );

	$( sControls.replace( /[^,]+/g, '#$&' ) ).each(
		function(){
			var jOld = $( '#' + this.id + "-" + sOldLangPostfix );
			var jControl = $( '#' + this.id );

			var value = getFckHtml( this.id );
			if( value === null ) // не FCK
				value = jControl.val();
			jOld.val( value );
		}
	);
}


/* Подгружает значения для нового переключаемого языка

	Параметры:
		sNewLangPostfix	- постфикс нового языка
		sControls		- список многоязычных контролов
*/
function showLanguageTexts( sNewLangPostfix, sControls )
{
	$( sControls.replace( /[^,]+/g, '#$&' ) ).each(
		function(){
			jNewHidden = $( '#' + this.id + '-' + sNewLangPostfix );
			//Подгружаем в видимый контрол информацию из hidden-поля
			$( this )
				.val( jNewHidden.val() )
				.addClass( jNewHidden.attr( 'validate-error' ) ? 'errorclass' : '' );

			// проставление класса ближайшему родительскому tr-у
			// вызывается один раз в javascript, чтобы не проставлять много раз в XSL
			// актуально только при первом вызове
			$( this ).parents( "tr:first" ).addClass( 'languageSelectionItem' );

			// если контрол FCK
			setFckHtml( this.id, jNewHidden.val() );
		}
	);
}


/*	Показывает/скрывает необязательные контролы

	Параметры:
		groupName		-
		openedCaption	-
		closedCaption	-
*/
function toggleOptionalControls( groupName, openedCaption, closedCaption ) {

	var trDisplayType = $.browser.msie ? 'block' : 'table-row';

	$( '#trig-' + groupName ).toggleClass( 'collapsed' );

	$( 'tr.' + groupName ).each(
		function(){
			if( $( this ).css( 'display' ) == trDisplayType )
			{
				$( this ).css( 'display', 'none' );
				$( '#capt-' + groupName ).text( closedCaption );
				$( '#' + groupName ).val( '' );
			}
			else
			{
				$( this ).css( 'display', trDisplayType );
				$( '#capt-' + groupName ).text( openedCaption );
				$( '#' + groupName ).val( '1' );
			}
		}
	);
}


/* Сдвигает ползунок вертикальной полосы прокрутки, до метки, значение которой содержится в хиддене
	verticalScrollBookmark, после чего очищает значение метки */
function scrollToBookmark()
{
	/* если на странице есть сообщение об ошибке, то страница скроллируется до этого сообщения */
	if( $("div.error").length > 0 )
	{
		windowGeometry.setVerticalScroll( $("div.error").offset().top );
		$( '#verticalScrollBookmark' ).val( '0' );
	}
	/* иначе скроллируется до того положения, которое было сохранено в 'закладке' */
	else
	{
		if( $( '#verticalScrollBookmark' ).length != 0 && $( '#verticalScrollBookmark' ).val() != "-1" )
		{
			windowGeometry.setVerticalScroll( $( '#verticalScrollBookmark' ).val() );
			$( '#verticalScrollBookmark' ).val( '0' );
		}
	}
}

/* Сохраняет положение скроллера в хиддене verticalScrollBookmark,
	который создает BaseForm, для того, чтобы при перегрузке страницы вернуться на
	то же место на странице, где была нажата кнопка */
function saveBookmarkPosition()
{
	if( $( '#verticalScrollBookmark' ).val() != "-1" )
	{
		$( '#verticalScrollBookmark' ).val( windowGeometry.getVerticalScroll() );
		return true;
	}
}


/*	открывает окно (frame) поверх текущего

	Параметры:
		properties	- свойства фрейма, включая src (url)
		effects		- эффекты при открытии, закрытии и перезагрузке
*/
function showPopup( properties, effects ){

	var $frame, 					// jQuery объект фрейма
	    $outerClose,				// jQuery объект внешней кнопки закрытия
		$bg;						// jQuery объект фона

	// обработка загрузки всплывающего окна
	var loadPopup = function () {
		var load = function () {
			// при клике вне всплывающего окна - закрытие
			// используем namespace "popup", чтобы можно было снять именно этот обработчик с body
			$(properties.presentation.bgCss ? '.popupIframeBg' : 'body').bind('click.popup', removePopup);

			// во фрейме может быть открыта страница другого сайта, к содержимому которой нет доступа
			try {
				var frameDocument = $frame[0].contentWindow.document;

				// обработка нажатия кнопки закрытия внутри всплывающего окна
				$(properties.behaviour.closeButton, frameDocument).click(removePopup);

				// обработка нажатия кнопки отправки формы внутри всплывающего окна
				$(properties.behaviour.submitButton, frameDocument).click(submitPopup);

				if ($(properties.behaviour.closeButton, frameDocument).hasClass('needClose'))
					removePopup();
			}
			catch(e) { }
		};

		effects.onLoad ? effects.onLoad($frame, load) : load();

		if (properties.behaviour.onLoad)
			properties.behaviour.onLoad($frame);
	};

	// удаление popup и всех служебных элементов
	var removePopup = function () {

		var clean = function () {
			// снимается обработчик закрытия фрейма при клике вне фрейма
			$(properties.presentation.bgCss ? '.popupIframeBg' : 'body').unbind( 'click', removePopup );

			$frame.remove();

			if( $bg ) {
				$bg.remove();
				$outerClose.remove();
			}
		};

		effects.onClose ? effects.onClose( $frame, clean ) : clean();
		return false;
	};

	// обработка нажатия кнопки отправить во всплывающем окне
	var submitPopup = function () {
		$frame
			.unbind('load')
			.load(
				function () {
					/* если в документе нет контролов, непрошедших валидацию, - frame очищается */
					if (!$('.errorclass, div.txtHighlighted', $($frame)[0].contentWindow.document)[0])
					{
						if (properties.behaviour.onBeforeSubmit)
							properties.behaviour.onBeforeSubmit($frame);

						removePopup();

						if (properties.behaviour.onSubmit)
							properties.behaviour.onSubmit($frame);
					}
					/* иначе (валидация не пройдена) заново вешаются обработчики кнопок */
					else
						loadPopup();
				}
			);
	};

	// формирование HTML кода фрейма c атрибутами
	var frameHTML = '<iframe ';
	for ( var attr in properties.attributes )
		frameHTML += attr + '="' + encodeAttribute( "" + properties.attributes[attr] ) + '" ';
	frameHTML += '></iframe>';

	// добавление фрейма в документ
	$frame = $( frameHTML )
		.load( loadPopup )
		.css( properties.presentation.css )
		.appendTo( 'body' );

	// обработка параметров фона
	if ( properties.presentation.bgCss ) {
		$bg = $( '<div>' )
			.css(properties.presentation.bgCss)
			.addClass( 'popupIframeBg' )
			.appendTo( 'body' );

		// контейнер для крестика, выходящего за пределы контейнера.
		var outerClose = '<div class="popupIframeOuterClose">&#215;</div>';
		$outerClose = $(outerClose).appendTo( $bg );

		var left = $frame.offset().left + $frame.width() - $("body").offset().left + 'px';
		var top = properties.presentation.css.top + 'px';

		$outerClose.css( 'left', left ).css( 'top', top );
	}

	// обработка значка "загрузка"
	if ( effects.loadingImage ){
		var $loading = $( '<img src="' + effects.loadingImage + '" />' )
			.appendTo( 'body' )
			// когда картинка подгрузится - позиционирование по центру
			.load( function() {
				$loading.css( {
					position: 'absolute',
					top: windowGeometry.getVerticalScroll() + ( windowGeometry.getViewportHeight() - $loading.height() )/2,
					left: windowGeometry.getHorizontalScroll() + ( windowGeometry.getViewportWidth() - $loading.width() )/2
				} );
			} );
		// к обработчикам загрузки фрейма добавляется удаление картинки
		$frame.load( function(){ $loading.remove(); } );
	}


	return false;
}


/* Отобразить указанные элементы / HTML в виде попапа

	content - содержимое попапа - всё что можно передать в $()
	width - ширина попапа
	height - высота попапа
	params - словарик дополнительных параметров
	  onClose - обработчик, который будет вызван перед закрытием попапа (если пользователь нажал кнопку закрытия)
				Если обработчик инициирует перезагрузку страницы, он может возвратить false, чтобы предотвратить
				стандартные действия при закрытии попапа (избежать мелькания).
*/
function showHtmlPopup( content, width, height, params )
{
	if( $("#IsMobileVersion").val() == "1" )
	{
		width = windowGeometry.getViewportWidth() - 20;
		height = windowGeometry.getViewportHeight() - 20;
	}

	/* Если размеры попапа больше размеров окна, необходимо оставить поля, для того,
	чтобы попам можно было закрыть */
	if( height > windowGeometry.getViewportHeight() )
		height = windowGeometry.getViewportHeight() - 40;
	if( width > windowGeometry.getViewportWidth() )
		width = windowGeometry.getViewportWidth() - 40;

	// Вертикальный скролл
	var vertScroll = windowGeometry.getVerticalScroll();
	/* если это все показывается внутри другого фрейма, то надо прибавить разницу
	между положением родитеслького фрейма и положением скроллера в дедушке */
	if( parent != window )
		vertScroll = vertScroll +
			parent.windowGeometry.getVerticalScroll() -
			parent.$( parent.document.getElementById(window.name) ).offset().top;

	var top = Math.max( 0, ( windowGeometry.getViewportHeight() - height ) / 2 );
	var left = Math.max( 0, ( windowGeometry.getViewportWidth() - width ) / 2 );
	var bgWidth = Math.max( windowGeometry.getDocumentWidth(), windowGeometry.getViewportWidth() );
	var bgHeight = Math.max( $(document).height(), $(window).height() );

	// затемнение содержимого страницы при отображении попапа
	var body = $('body');
	var background = $( '<div class="popupBg">' ).css({ width: bgWidth, height: bgHeight }).appendTo( body );
	background.click( closeHtmlPopup );

	// добавление попапа
	//
	// Если у contents есть родитель, попап добавляется в него.  Это позволяет отобразить
	// в попапе кусок DOM-дерева формы, при этом благодаря тому что попап сам останется в
	// форме, продолжат работать кнопки сабмита.
	//
	// Если у contents нет родителя (например, передана просто строка HTML), попап добавляется в body
	//
	var popup = $( '<div class="popup">' );
	var contents = $(content);
	var inDom = contents.parents('body').length > 0;
	if( inDom )
		popup.insertAfter( contents[0] );
	else
		popup.appendTo( body );
	popup.append( contents );
	popup.css( { width: width, height: height, top: top, left: left } );

	// добавление кнопки закрытия
	$( '<div id="popupClose"><span id="close">&#215;</span></div>' ).prependTo( popup ).click( closeHtmlPopup );

	function closeHtmlPopup() {
		// скрываем попап
		popup.fadeOut( 'fast' );
		background.remove();

		// вызываем прикладной обработчик закрытия, если он задан
		// Если обработчик возвратил false, больше ничего не делаем
		// (предполагается, что в этом случае обработчик инициировал перезагрузку страницы)
		if( params && params.onClose ) {
			if( params.onClose() === false )
				return;
		}

		// Если содержимое попапа было в DOM, возвращаем его на место.
		// Код ниже работает, только если содержимое попапа располагалось в DOM последовательно
		// (либо это был единственный элемент), иначе всё будет свалено в родительский элемент первого элемента.
		if( inDom )
			contents.insertBefore( popup );
		popup.remove();
	}

	// анимированное открытие попапа
	popup.fadeIn( 'fast' );
}


/*	Открывает всплывающее окно или фрейм с редактором изображения

	Параметры:
		a			- ссылка по нажатию которой открывается редактор
*/
function openAdjustedImageWindow( a )
{
	var url = a.href;
	var controlId = $( a ).parents(".imageFileControl:first").find(":file").attr("id");
	// Если существуют хиддены с параметрами коррекции изображения, то в url добавляются параметры
	// коррекции
	if ( $( '#' + controlId + '-brightness').length != 0 )
	{
		url += '&image-brightness=' + $( '#' + controlId + '-brightness').val()
		+ '&image-contrast=' + $( '#' + controlId + '-contrast').val()
		+ '&crop-top-x=' + $( '#' + controlId + '-ctx').val()
		+ '&crop-top-y=' + $( '#' + controlId + '-cty').val()
		+ '&crop-bottom-x=' + $( '#' + controlId + '-cbx').val()
		+ '&crop-bottom-y=' + $( '#' + controlId + '-cby').val()
		+ '&image-saturation=' + $( '#' + controlId + '-saturation').val()
		+ '&image-rotate=' + $( '#' + controlId + '-rotate').val();
	}

	// если нажата ссылка предпросмотра изображения, получаются его размеры
	// открывается фрейм этих размеров и в фрейме показывается изображение
	if ( url.indexOf( 'image-file-loader' ) > -1 )
		openImageCentered( url );
	// иначе открывается редактор 800х600
	else
		openWindowOrShowPopupCentered( url, 800, 600, 'applyBtn', this.target );
}

// Рисует по центру экрана изображение
function openImageCentered( url )
{
	var openWindow = function( width, height ) {
		openWindowOrShowPopupCentered( url, width, height, 'applyBtn', this.target );
	};
	var $image = $('<img>').attr( 'src', url ).appendTo('body').hide();
	/*image.onload opera fix*/ if($.browser.opera)$image.onload=function(){if(this.readyState)this.onload=function(){return false;};};
	$image.load( function() { openWindow( $( this ).width(), $( this ).height() ); $( this ).remove(); } );
}

/* Экранирование строки со значением HTML-атрибута.
   Пример использования:
	   document.write( '<img src="' + encodeAttribute( src ) + '"></img>' );
   Спецификация (какие символы надо экранировать):
	   http://www.w3.org/TR/html5/syntax.html#character-reference-in-attribute-value-state
*/
function encodeAttribute( string )
{
	return string
		.replace( '&', '&amp;' )
		.replace( '"', '&#34;' )
		.replace( "'", '&#39;' );
}

/*	выполняет URLEncode переданной строки

	Текст функции взят отсюда
		http://www.webtoolkit.info/javascript-url-decode-encode.html
*/
function urlEncode( string )
{
	string = string.replace(/\r\n/g,"\n");
	var utftext = "";

	for (var n = 0; n < string.length; n++) {

		var c = string.charCodeAt(n);

		if (c < 128) {
			utftext += String.fromCharCode(c);
		}
		else if((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		}
		else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}
	}
	return escape( utftext );
}


/*	выполняет URLDecode переданной строки

	Текст функции взят отсюда
		http://www.webtoolkit.info/javascript-url-decode-encode.html
*/
function urlDecode( utftext ) {
	var string = "";
	var i = 0;
	var c = c1 = c2 = 0;

	while ( i < utftext.length ) {

		c = utftext.charCodeAt(i);

		if (c < 128) {
			string += String.fromCharCode(c);
			i++;
		}
		else if((c > 191) && (c < 224)) {
			c2 = utftext.charCodeAt(i+1);
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		}
		else {
			c2 = utftext.charCodeAt(i+1);
			c3 = utftext.charCodeAt(i+2);
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}
	return unescape( string );
}


/* Меняет параметр flashvars у flash-объекта и перегружает его
	Применяется для показа видеофайлов из списка */
function changeVideoFile( id, fileUrl, imageUrl, description )
{
	$( '#' + id )[0].sendEvent("STOP");
	$( '.videoDescription' ).html( description );
	var obj = { type: "video", file: fileUrl, image: imageUrl };
	$( '#' + id )[0].sendEvent( "LOAD", obj );
}


/* Флаг ожидания загрузки файлов - если равен false, то загрузка еще не начиналась, и при
	вызове функции waitForUpload показывается popup окно wait-for-upload.aspx,
	если равен true, то popup окно уже прогрузилось - выполняется Onclick, заданный пользователем и
	 submit формы*/
waitForUpload.prototype.inProgress = false;

/* Функция, отображающая прогресс операции отправки чего-то большого на сервер.
Предназначена для обработки нажатия на элемент, выполняющий submit формы. При первом нажатии
открывает окно wait-for-upload.aspx, дожидается завершения его загрузки и выполняет 2-е нажатие,
при котором выполняется post данных.
	event - соответствующее событие
	width - ширина окна ожидания
	height - высота окна ожидания
	onclick - пользовательский обработчик щелчка по элементу - выполняется после успешной загрузки
		окна ожидания
*/
function waitForUpload( event, width, height, onclick )
{
	var element = getEventSrcElement( event );
	// При первой загрузке - выводится окно ожидания
	if( !waitForUpload.prototype.inProgress )
	{
		waitForUpload.prototype.inProgress = true;
		showPopupCentered(
			"wait-for-upload.aspx",
			width, height, "",
			{
				// После загрузки выполняется щелчок по элементу, вызвавшему событие
				onLoad: function()
				{
					element.click();
				}
			}
		);
		return false;
	}
	// Вторая загрузка - пользовательская обработка щелчка и сабмит формы
	else
		onclick( element );

	return true;
}


/*
	Возвращает индекс строки в массиве строк или -1, в случае если строка в массиве не найдена

	Параметры:
		ar - массив строк
		s - искомая строка
*/
function GetPosInArray( ar, s )
{
	var res = -1;
	for ( var i = 0; i < ar.length; i++ )
	{
		if ( ar[i] == s )
		{
			res = i;
			break;
		}
	}
	return res;
}


/*
Для всех чекбоксов на форме пересчитывает видимость дублирующего hidden поля.
Это нужно для того, чтобы выключенные чекбоксы приходили в форме как все нормальные контролы.
*/
function fixCheckboxes()
{
	$( "input:checkbox" ).each( function()
		{
			if ( $( this ).attr( "name" ) != '' )
				OnCheckBoxChanged( $( this ).attr( "id" ) );
		}
	);
}


/* изменяет значения чекбоксов, если чекбокс disabled, меняет значение соответствующего ему хиддена */
function OnCheckBoxChanged( id )
{
	var checkB = document.getElementById( id );
	var checHidden = document.getElementById(id + '_value');
	if ( checHidden && checkB ) {
		checHidden.value = checkB.checked ? checkB.value : '';
		/* hidden отправляется на сервер только, если чекбокс активен и выключен либо если чекбокс в режиме access denied */
		$(checHidden).ST_toggleAttr("disabled", !$(checkB).attr('readonly') && (checkB.disabled || checkB.checked));
	}
}


/* Закрыть попап (используя window.close) или фрейм ("нажимая" на кнопку Close) */
function closePopupOrFrame()
{
	if (window.opener) {
		window.opener.focus();
		window.close();
	}
	else
	/*на onload фрейма провешивается обработчик кнопки close, вызывающий функцию закрытия окна(см. ShowPopup)
	Возможно 2 случая -
	1)closePopupOrFrame() вызывается до загрузки фрейма (если провешена с помощью RegisterPageOnloadFunction) и
	2)closePopupOrFrame() вызывается после загрузки фрейма, например, при нажатии на ссылку*/
		window.parent.$("#close", document)
			/*1) closePopupOrFrame() вызывается до загрузки фрейма. Тогда ставится специальный класс, который потом проанализируется в ShowPopup.
			При обнаружении этого класса фрейм будет закрыт*/
			.addClass('needClose')
			/*2)closePopupOrFrame() вызывается после загрузки фрейма. На кнопке close уже висит click(), который провешен
			onload-ом и закрывает фрейм.*/
			.click();
}

function descriptiveTextOnFocus( e, text )
{
	if( $(e).hasClass('with-hint') )
	{
		e.value = '';
		$(e).removeClass( 'with-hint' );
		if( e.getAttribute( 'data-original-type' ) != null )
			e.type = e.getAttribute( 'data-original-type' );
	}
}

function descriptiveTextOnBlur( e, text )
{
	if( e.value == '' )
	{
		e.value = text;
		$(e).addClass( 'with-hint' );
		if( e.type == 'password' ) {
			e.setAttribute( 'data-original-type', e.type );
			e.type = 'text';
		}
	}
}


/* Получение позиции курсора в тексте */
function getCaretPosition (ctrl) {
	var CaretPos = 0;	// IE Support
	if (document.selection) {
	ctrl.focus ();
		var Sel = document.selection.createRange ();
		Sel.moveStart ('character', -ctrl.value.length);
		CaretPos = Sel.text.length;
	}
	// Firefox support
	else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		CaretPos = ctrl.selectionStart;
	return (CaretPos);
}
/* Установка курсора в указанную позицию */
function setCaretPosition(ctrl, pos){
	if(ctrl.setSelectionRange)
	{
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}

/* получение границ выделенной области в тексте */
function getSelectedField( ctrl )
{
	var st = 0;
	var fin = 0;
	if (document.selection) {
		ctrl.focus ();
		var Sel = document.selection.createRange ();
		var selLength = Sel.text.length;
		Sel.moveStart ('character', -ctrl.value.length);
		fin = Sel.text.length;
		st = fin - selLength;
	}
	// Firefox support
	else if (ctrl.selectionStart || ctrl.selectionStart == '0')
	{
		st = ctrl.selectionStart;
		fin = ctrl.selectionEnd;
	}
	return { start: st, end: fin };
}

/*
обработка вставки в поле ввода даты, если содержимое вставки соответствует формату даты,
то оно целиком записывается в поле ввода, иначе операция вставки отменяется
*/
function onDatePaste( e, format )
{
	// Контрол
	var elem = getEventSrcElement( e );

	/* если есть доступ к клипборду */
	if( e && e.clipboardData && e.clipboardData.getData )
	{
		var txt = e.clipboardData.getData('text/plain');
		/* формируется регулярное выражение для проверки, все буквы из шаблоны даты меняются на цифры */
		var template = format.replace( /([mdy])/gi, '\\d' ).replace( /(\.)/gi, '\\.' );
		/* если содержимое соответствует шаблону, заменяется содержимое поля ввода */
		if( txt.match( new RegExp( template ) ) )
			$(elem).val( txt )
	}
	/* стандартная обработка все запрещается */
	return false;
}

/*
Проверка вводимых символов при вводе даты
	event - событие нажатия на клавишу
	format - формат даты вида "dd.MM.yyyy"
	hint - локализованная строка подсказка вида "дд.мм.гггг"
*/
function checkInputDate( event, format, hint ) {
	// Проверка вводимого символа
	code = event.keyCode;
	if (
		!(
			( code>=48 && code<=57 ) || ( code>=96 && code<=105 )
			|| code==8 || code==46 || code==35 || code==36
			|| code==37 || code==39 || code==9 || event.ctrlKey || event.shiftKey
		)
	)
		return false;

	// Контрол
	var t = event.target || event.srcElement;
	// Позиция курсора
	var cPos = getCaretPosition(t);
	// Выделение
	var sel = getSelectedField( t );

	if( (code>=48 && code<=57) || (code>=96 && code<=105) )
	{
		if( cPos >= t.value.length ) return false;
		iCh = (code <= 57) ? code-48 : code-96;
		ch = format.charAt(cPos);
		// если после курсора стоит разделитель - сдвигаем курсор вправо
		if( ch && ch != 'd' && ch != 'M' && ch != 'y' )
			cPos++;
		// заменяем следующий за курсором символ вводимым сиволом
		t.value= t.value.substring( 0, cPos ) + iCh + t.value.substring( cPos+1 );
		ch = format.charAt(cPos+1);
		if( ch && ch != 'd' && ch != 'M' && ch != 'y' )
			setCaretPosition( t, cPos+2 );
		else
			setCaretPosition( t, cPos+1 );

		return false;
	}
	else if( code == 8 )
	{
		// удаляем выделенный текст
		if( sel.start != sel.end )
		{
			t.value= t.value.substring( 0, sel.start ) + hint.substring(sel.start, sel.end) + t.value.substring( sel.end );
			setCaretPosition( t, sel.start );
		}
		// удаляем один символ
		else
		{
			if( cPos == 0 ) return false;
			var ch = format.charAt(cPos-1);
			if( ch && ch != 'd' && ch != 'M' && ch != 'y' )
				cPos--;
			t.value= t.value.substring( 0, cPos-1 ) + hint.charAt( cPos-1 ) + t.value.substring( cPos );
			setCaretPosition( t, cPos-1 );
		}
		// если перед курсором стоит раздедитель, сдвигаем курсор влево
		cPos = getCaretPosition(t);
		var ch = format.charAt( cPos-1 );
		if( ch && ch != 'd' && ch != 'M' && ch != 'y' )
			setCaretPosition( t, cPos-1 );
		return false;
	}
	else if( code == 46 )
	{
		// удаляем выделенный текст
		if( sel.start != sel.end )
		{
			t.value= t.value.substring( 0, sel.start ) + hint.substring(sel.start, sel.end) + t.value.substring( sel.end );
			setCaretPosition( t, sel.start );
		}
		// удаляем один символ
		else
		{
			if( cPos == format.length ) return false;
			var ch = format.charAt( cPos );
			if( ch && ch != 'd' && ch != 'M' && ch != 'y' )
				cPos++;
			t.value= t.value.substring( 0, cPos ) + hint.charAt(cPos) + t.value.substring( cPos+1 );
			setCaretPosition( t, cPos );
		}
		return false;
	}
	return true;
}

/*
Проверка вводимых символов при вводе даты
	event - событие нажатия на клавишу
	format - формат даты вида "HH:mm"
	hint - локализованная строка подсказка вида "чч:мм"
*/
function checkInputTime( event, format, hint ) {
	// Проверка вводимого символа
	code = event.keyCode;
	if (
			!(
			((code>=48 && code<=57)
			|| code==8 || code==46 || code==35 || code==36
			|| code==37 || code==39 || (code>=96 && code<=105) || code==9)
			//&& !event.shiftKey
			)
		)
		return false;

	// Контрол
	var t = event.target || event.srcElement;
	// Позиция курсора
	var cPos = getCaretPosition(t);
	// Выделение
	var sel = getSelectedField( t );

	if( (code>=48 && code<=57) || (code>=96 && code<=105) )
	{
		if( cPos >= t.value.length ) return false;
		iCh = (code <= 57) ? code-48 : code-96;
		ch = format.charAt(cPos);
		// если после курсора стоит разделитель - сдвигаем курсор вправо
		if( ch && ch != 'H' && ch != 'm' )
			cPos++;
		// заменяем следующий за курсором символ вводимым сиволом
		t.value= t.value.substring( 0, cPos ) + iCh + t.value.substring( cPos+1 );
		ch = format.charAt(cPos+1);
		if( ch && ch != 'H' && ch != 'm' )
			setCaretPosition( t, cPos+2 );
		else
			setCaretPosition( t, cPos+1 );

		return false;
	}
	else if( code == 8 )
	{
		// удаляем выделенный текст
		if( sel.start != sel.end )
		{
			t.value= t.value.substring( 0, sel.start ) + hint.substring(sel.start, sel.end) + t.value.substring( sel.end );
			setCaretPosition( t, sel.start );
		}
		// удаляем один символ
		else
		{
			if( cPos == 0 ) return false;
			var ch = format.charAt(cPos-1);
			if( ch && ch != 'H' && ch != 'm' )
				cPos--;
			t.value= t.value.substring( 0, cPos-1 ) + hint.charAt( cPos-1 ) + t.value.substring( cPos );
			setCaretPosition( t, cPos-1 );
		}
		// если перед курсором стоит раздедитель, сдвигаем курсор влево
		cPos = getCaretPosition(t);
		var ch = format.charAt( cPos-1 );
		if( ch && ch != 'H' && ch != 'm' )
			setCaretPosition( t, cPos-1 );
		return false;
	}
	else if( code == 46 )
	{
		// удаляем выделенный текст
		if( sel.start != sel.end )
		{
			t.value= t.value.substring( 0, sel.start ) + hint.substring(sel.start, sel.end) + t.value.substring( sel.end );
			setCaretPosition( t, sel.start );
		}
		// удаляем один символ
		else
		{
			if( cPos == format.length ) return false;
			var ch = format.charAt( cPos );
			if( ch && ch != 'H' && ch != 'm' )
				cPos++;
			t.value= t.value.substring( 0, cPos ) + hint.charAt(cPos) + t.value.substring( cPos+1 );
			setCaretPosition( t, cPos );
		}
		return false;
	}
	return true;
}


function dateControlOnFocus( e, text )
{
	var ctrl = $(e);

	if( ctrl.hasClass('with-hint') )
	{
		ctrl.removeClass( 'with-hint' );
	}

	// Установка курсора на первый символ. В онфокусе не срабатывает, поэтому вызывается с задержкой.
	window.setTimeout( function() {
		setCaretPosition(ctrl[0], 0);
	}, 10 );
	ctrl.one("mouseup.focus", function(e) {
		window.setTimeout(function() {
			setCaretPosition(ctrl[0], 0);
		}, 10);
	});
	ctrl.one("mousedown", function() {
		$(this).unbind("mouseup.focus");
	});
}

function dateControlOnBlur( control, template )
{
	$( control ).change();
}

function dateControlOnChange( control, template )
{
	/* если значение контрола очищается кодом, туда прописывается текст шаблона */
	if( control.value == '' )
		control.value = template;

	$( control ).ST_toggleClass( "with-hint", control.value == template );
}


// методы для обеспечения жизнедеятельности контролв PredefinedListControl
var PredefinedListControl =
{
	// обработчик кнопки добавления
	onAddButtonClicked: function( e )
	{
		var name = $( e.target ).attr( 'id' );
		name = name.substring( 0, name.lastIndexOf( '_' ) );

		// если в селекте есть значение
		var $select = $( '#' + name + '_select' );
		if( $select.val() )
		{
			// если значения ещё нет в списке
			var $values = $( '#' + name );
			if( ( ',' + $values.val() + ',' ).indexOf( ',' + $select.val() + ',' ) === -1 )
			{
				// добавление
				this.add( name, $select.val(), $select.children('option:selected').text() );

				// очистка после добавления
				$select.val( '' );
			}
		}
		return false;
	},

	// добавление значения в список
	add: function( controlName, itemName, itemText )
	{
		// клонирование и заполнение шаблонной строки
		var $cont = $( '#' + controlName + '_cont' );
		var $item = $cont.find('tr.template').clone();
		$item.removeClass('template').attr( 'data-item-name', itemName ).show();
		$item.children('.text').text( itemText );

		// добавление строки
		$cont.children('.list').append( $item );

		// добавление значения в хидден
		var $values = $( '#' + controlName );
		$values.val( $values.val() + ',' + itemName );
	},

	// обработчик кнопки перемещения вверх элемента списка
	onMoveItemUp: function( e )
	{
		// перемещение вверх
		var $this = $( e.target ).parents('tr:first');
		var $prev = $this.prevAll('tr:not(.template):first');
		if( ! $prev.length )
			return;
		$this.insertBefore( $prev );

		// получение name
		var name = $this.parents('.predefined-list-control:first').attr('id');
		name = name.substring( 0, name.lastIndexOf( '_' ) );

		// обновление хиддена, хранящего выбранные элементы
		var $values = $( '#' + name );
		$values.val( ( ',' + $values.val() + ',' )
			.replace(
				',' + $prev.attr('data-item-name') + ',' + $this.attr('data-item-name') + ',',
				',' + $this.attr('data-item-name') + ',' + $prev.attr('data-item-name') + ',' )
			.replace( /^,+/, '' )
			.replace( /,+$/, '' ) );

		return false;
	},

	// обработчик кнопки перемещения вниз элемента списка
	onMoveItemDown: function( e )
	{
		// перемещение вниз
		var $this = $( e.target ).parents('tr:first');
		var $next = $this.nextAll('tr:not(.template):first');
		if( ! $next.length )
			return;
		$this.insertAfter( $next);

		// получение name
		var name = $this.parents('.predefined-list-control:first').attr('id');
		name = name.substring( 0, name.lastIndexOf( '_' ) );

		// обновление хиддена, хранящего выбранные элементы
		var $values = $('#' + name );
		$values.val( ( ',' + $values.val() + ',' )
			.replace(
				',' + $this.attr('data-item-name') + ',' + $next.attr('data-item-name') + ',',
				',' + $next.attr('data-item-name') + ',' + $this.attr('data-item-name') + ',' )
			.replace( /^,+/, '' )
			.replace( /,+$/, '' ) );

		return false;
	},

	// обработчик кнопки удаления элемента списка
	onRemoveItem: function( e )
	{
		var $this = $( e.target ).parents('tr:first');

		// получение name
		var name = $this.parents('.predefined-list-control:first').attr('id');
		name = name.substring( 0, name.lastIndexOf( '_' ) );

		// удаление из хиддена, хранящего выбранные элементы
		var $values = $('#' + name );
		$values.val( ( ',' + $values.val() + ',' )
			.replace( ',' + $this.attr('data-item-name') + ',', ',' )
			.replace( /^,+/, '' )
			.replace( /,+$/, '' ) );

		// удаление <tr>
		$this.remove();

		return false;
	}
};

//функция, позволяющая при загрузке картинки в ImageFileControl сразу показывать preview
function addImageControlsOnChange()
{
	$('.imageFileControlUpload .fileContainer .fakeFileInput_file').change( function() {
	if( window.FileReader != undefined )
	{
		//использование html5 для получения тела картинки и записи его src в preview
		var file = this.files[0];
		var fr = new FileReader();
		var imageControl = this;
		fr.onload = ( function() {
			prepareTdForImageControlPreview(imageControl).append( $('<img/>').attr( 'src', this.result ).attr('height', 80 ).click( function() { openImageCentered( this.src ); } ).css('cursor','pointer'));
		});
		fr.readAsDataURL(file);
	}
	else
	if( $.browser.msie )
	{
		//для ie своя логика, т.к. там не поддерживается FileReader
		prepareTdForImageControlPreview(this).append( $('<img/>').attr( 'src', 'file://'+this.value ).attr('height', 80 ) );
	}
	}
	);
}

function prepareTdForImageControlPreview( imageControl )
{
	var tr = $(imageControl).parents('.imageFileControl').find('tr');
	tr.find('.imageFileControlPreview').remove();
	return $("<td class='imageFileControlPreview'/>").prependTo( tr );
}

/* Вспомогательные функции для поддержки перетаскивания файлов в FileControl,
   вынесенные для использования в прикладных скриптах */
var DropZone = {

	//стилизовать dropZone после того как пользователь выполнил drop (отпустил кнопку мыши)
	showBeginDrop: function( dropZone, table ) {
		table.removeClass('drag-hover');
		dropZone.removeClass('hover');
		dropZone.addClass('drop');
	},

	//стилизовать dropZone после того как файлы были загружены на сервер
	showEndDrop: function( dropZone ) {
		dropZone.removeClass('error');
		dropZone.removeClass('drop');
		dropZone.text(dropZone.attr('drop-zone-title'));
	},

	// загрузить файл на сервер
	uploadFile: function( dropZone, file, onSuccess ) {
		this.uploadFiles( dropZone, [ file ], onSuccess );
	},

	// загрузить файлы на сервер
	uploadFiles: function( dropZone, files, onSuccess ) {
		var xhr = new XMLHttpRequest();

		xhr.upload.addEventListener('progress', function(event) {
			var percent = parseInt(event.loaded / event.total * 100);
			dropZone.text('Загрузка: ' + percent + '%');
		}, false);

		xhr.onreadystatechange = function(event) {
			if (event.target.readyState == 4) {
				if (event.target.status == 200)
					onSuccess( event );
				else {
					//сообщение о произошедшей ощибке.
					DropZone.showError( dropZone, dropZone.attr('drop-zone-error') );
				}
			}
		};

		xhr.open('POST', 'upload-file.aspx');
		var fd = new FormData;
		for( var i = 0; i < files.length; i++ )
			fd.append("file[]", files[i]);
		xhr.send(fd);
	},

	//функция, которая показывает сообщение об ошибке, а через секунду возвращает dropZone в исходный вид
	showError: function( dropZone, text ) {
		dropZone.text(text);
		dropZone.addClass('error');
		setTimeout( function() {
			DropZone.showEndDrop( dropZone );
		}, 1000 );
	},

	/* проставление значений в скрытые поля, которые нужны будут FileControlу на сервере для сохранения файла

	   responseText - ответ сервера после загрузки файла
	   inputFileName - название FileControl'а (оно же префикс хидденов, в которые проставляем значения)
	*/
	fillHiddens: function( responseText, inputFileName ) {
		var arr = responseText.split(",");
		$('#' + inputFileName + '-file-name').val( arr[0] );
		$('#' + inputFileName + '-content-type').val( arr[1] );
		$('#' + inputFileName + '-file-length').val( arr[2] );
		$('#' + inputFileName + '-temp-subfolder').val( arr[3] );
	},

	//создать хиддены для FileControl'а с указанным именем
	//хиддены никуда не добавляются, просто возвращаются
	createHiddens: function( inputFileName ) {
		return $([
			this._createHidden( inputFileName + '-file-name' ),
			this._createHidden( inputFileName + '-content-type' ),
			this._createHidden( inputFileName + '-file-length' ),
			this._createHidden( inputFileName + '-temp-subfolder' )
		]);
	},

	//создать хидден с указанным name
	_createHidden: function( name ) {
		var hidden = document.createElement('input');
		hidden.setAttribute( 'type', 'hidden' );
		hidden.id = name;
		hidden.name = name;
		return hidden;
	}
};

function CreateDropZoneForFileControl()
{
	var dropZone = $(this).parents('.fileControlUpload').find('.dropZone');

	//для видеофайлконтрола ничего не делаем
	if( $(this).parents('.videoFileControl').length > 0 )
	{
		dropZone.hide();
		return true;
	}

	//при наведении на всю таблицу, содержащую файл-контрол, делаем его большим, чтоб удобнее было попасть в область
	var table = $(dropZone).parents('.fileControlUpload');

	//проверяем, какой у нас файлконтрол - image или обычный
	var isImage = 1;
	if( $(dropZone).parents('.imageFileControl').length == 0 )
		isImage = 0;

	 // Добавляем класс hover при наведении
	table[0].ondragover = function() {
		dropZone.addClass('hover');
		table.addClass('drag-hover');
		dropZone.removeClass('error');
		dropZone.removeClass('drop');
		return false;
	};

	 // Убираем класс hover
	dropZone[0].ondragleave = function() {
		table.removeClass('drag-hover');
		dropZone.removeClass('hover');
		return false;
	};

	// Обрабатываем событие Drop
	dropZone[0].ondrop = function(event) {
		event.preventDefault();
		DropZone.showBeginDrop( dropZone, table );

		if( event.dataTransfer.files.length == 0 )
		{
			DropZone.showEndDrop( dropZone );
			return false;
		}

		var file = event.dataTransfer.files[0];

		//при попытке передать в ImageFileControl файл неверного типа - выдача ошибки
		if( ( isImage == 1 ) && ( file.type.substr(0,5) != 'image' ) ){
			DropZone.showError( dropZone, dropZone.attr('file-wrong-type-message') );
			return false;
		}

		//получаем имя FileControlа, в который был перетащен файл
		var inputFileName = $(this).parents('.fileControlUpload').find("input[type=file]").attr("name");

		DropZone.uploadFile( dropZone, file, function( event ) {
			fileUploaded( event, file, inputFileName, isImage );
		});
	};

	// Постобрабочик
	function fileUploaded(event, file, inputFileName, isImage) {
		//файл загрузился успешно
		DropZone.showEndDrop( dropZone );

		var response = $.trim( event.target.responseText );
		var arr = response.split(",");

		DropZone.fillHiddens( response, inputFileName );

		//если картинка - показываем превьюшку
		if( isImage == 1 )
		{
			var fr = new FileReader();
			var imageControl = this;
			fr.onload = function() {
				var imageUrl = 'image-file-loader.aspx?file=' + arr[0] + '&path=' + arr[3] + '&prefix=';
				prepareTdForImageControlPreview( dropZone ).append( $('<img/>').attr( 'src', this.result ).attr('height', 80 ).click( function() { openImageCentered( imageUrl ); }).css('cursor','pointer') );
			};
			fr.readAsDataURL(file);
		}

		//проставляем название загруженного файла, чтобы его видел пользователь
		$('#' + inputFileName + '_fake').val( arr[0] );

		//вызываем кастомное событие, для обработки добавления файла на отдельных страницах
		$('#' + inputFileName ).trigger('file-changed');
	}
}

/*инициализация контрола диапазона значений со слайдером*/
function InitRanger(name, minVal, maxVal, decimalDigits) {
	var $rangeContainer = $('#' + name + '-range-container');
	var $sliderWrapper = $rangeContainer.find('.slider-wrapper');
	var $sliderFrom = $rangeContainer.find('.slider-from');
	var $sliderTo = $rangeContainer.find('.slider-to');
	var $sliderLeft = $rangeContainer.find('.slider-left');
	var $sliderRight = $rangeContainer.find('.slider-right');
	var $sliderCenter = $rangeContainer.find('.slider-center');
	var $rangeFrom = $rangeContainer.find('#' + name + '-range-from');
	var $rangeTo = $rangeContainer.find('#' + name + '-range-to');

	var sliderWrapperWidth = $sliderWrapper.width();
	var sliderFromWidth = $sliderFrom.width();
	var sliderToWidth = $sliderTo.width();

	var effectiveSliderWidth = sliderWrapperWidth - sliderFromWidth - sliderToWidth;

	//1 штука = stepPx px
	var stepPx = effectiveSliderWidth / (maxVal - minVal);
	//сохраняем шаг, граничные значения и число знаков после запятой в аттрибуты контейнера, чтобы можно было их изменить функцией снаружи
	$rangeContainer.attr("stepPx", stepPx);
	$rangeContainer.attr("minVal", minVal);
	$rangeContainer.attr("maxVal", maxVal);
	$rangeContainer.attr("decimalDigits", decimalDigits);

	SetSlidersPosition();

	/* смещение по x от левой точки бегунка до точки "захвата",
	так же используется как флаг, означающий, что бегунок схватили и тащут */
	var fromIsMoved = -1;
	var toIsMoved = -1;

	$rangeFrom.change(function () {
		//проверка, что введено число
		if (isNaN(parseFloat($rangeFrom.val())))
			$rangeFrom.val($rangeContainer.attr("minVal"));

		//если значение "С" сделали больше значения "ПО", то делаем их равными
		if (parseFloat( $rangeFrom.val() ) > parseFloat( $rangeTo.val() ))
			$rangeFrom.val($rangeTo.val());

		SetSlidersPosition();
	});

	$rangeTo.change(function () {
		//проверка, что введено число
		if (isNaN( parseFloat( $rangeTo.val() ) ))
			$rangeTo.val($rangeContainer.attr("maxVal"));

		//если значение "С" сделали больше значения "ПО", то делаем их равными
		if (parseFloat( $rangeFrom.val() ) > parseFloat( $rangeTo.val() ))
			$rangeTo.val($rangeFrom.val());

		SetSlidersPosition();
	});

	//запоминаем, что нажат бегунок нижней границы диапазона
	$sliderFrom.mousedown( function (e) {
		/* в мобильной версии хрома ctrl[0].getBoundingClientRect() возвращается уже с учетом скрола, а в других браузерах нет,
		а jquery в нашей версии на это не расчитывает и лажает, поэтому вычитаем смещение body, которое будет либо равно размерам скролла, либо 0 */
		fromIsMoved = e.pageX - $sliderFrom.offset().left + $("body").offset().left;
		$('body').mousemove( handleSliderMove );
		/* отключение выделения в браузере, работает быстро даже в хроме :) */
		e.preventDefault();
	});
	initTouch( $sliderFrom[0] );

	//запоминаем, что нажат бегунок верхней границы диапазона
	$sliderTo.mousedown(function (e) {
		/* в мобильной версии хрома ctrl[0].getBoundingClientRect() возвращается уже с учетом скрола, а в других браузерах нет,
		а jquery в нашей версии на это не расчитывает и лажает, поэтому вычитаем смещение body, которое будет либо равно размерам скролла, либо 0 */
		toIsMoved = e.pageX - $sliderTo.offset().left + $("body").offset().left;
		$('body').mousemove( handleSliderMove );
		/* отключение выделения в браузере, работает быстро даже в хроме :) */
		e.preventDefault();
	});
	initTouch( $sliderTo[0] );

	$('body').mouseup( stopDragging );
	$('body').bind( 'touchend', stopDragging );

	function stopDragging( e )
	{
		fromIsMoved = -1;
		toIsMoved = -1;
		$('body').unbind( "mousemove", handleSliderMove );
		$('body').unbind( "touchmove", handleSliderMove );
	}

	//при движении мыши, если был нажат один из бегунков, меняем его позицию и значение в соотвествующем контроле
	function handleSliderMove( e )
	{
		var minVal = parseFloat( $rangeContainer.attr("minVal") );
		var maxVal = parseFloat( $rangeContainer.attr("maxVal") );
		var stepPx = parseFloat( $rangeContainer.attr("stepPx") );

		if ( fromIsMoved > -1 ) {
			//позиция бегунка относительно контейнера слайдера
			/* в мобильной версии хрома ctrl[0].getBoundingClientRect() возвращается уже с учетом скрола, а в других браузерах нет,
			а jquery в нашей версии на это не расчитывает и лажает, поэтому вычитаем смещение body, которое будет либо равно размерам скролла, либо 0 */
			var posX = e.pageX - $sliderWrapper.offset().left - fromIsMoved + $("body").offset().left;
			//значение цены, соответствующее этой позиции
			rangeFromVal = ( 1 / stepPx * posX + minVal ).toFixed( decimalDigits );
			//если нижняя граница стала больше верхней, то делаем нижняя = верхняя
			if ( parseFloat( rangeFromVal ) > parseFloat( $rangeTo.val() ) )
				rangeFromVal = parseFloat( $rangeTo.val() ).toFixed( decimalDigits );
			//установка значения цены контролу
			$rangeFrom[0].value = rangeFromVal;
			mousePositionX = e.pageX;

			// вызов события изменения значения в поле ввода, чтобы был вызван еще и пользовательский обработчик (если нужно)
			$rangeFrom.trigger("change");
		}

		if ( toIsMoved > -1 ) {
			/* в мобильной версии хрома ctrl[0].getBoundingClientRect() возвращается уже с учетом скрола, а в других браузерах нет,
			а jquery в нашей версии на это не расчитывает и лажает, поэтому вычитаем смещение body, которое будет либо равно размерам скролла, либо 0 */
			var posX = e.pageX - $sliderWrapper.offset().left - toIsMoved + $("body").offset().left;
			var rangeToVal = ( 1 / stepPx * ( posX - parseFloat( $sliderTo.width() ) ) + minVal ).toFixed( decimalDigits );
			if ( parseFloat( rangeToVal ) < parseFloat( $rangeFrom.val() ) )
				rangeToVal = parseFloat( $rangeFrom.val() ).toFixed( decimalDigits );
			$rangeTo[0].value = rangeToVal;
			mousePositionX = e.pageX;

			// вызов события изменения значения в поле ввода, чтобы был вызван еще и пользовательский обработчик (если нужно)
			$rangeTo.trigger("change");
		}
	}

	//по данным числовым значениям диапазона выставляем ползунки и цветную линию
	function SetSlidersPosition() {
		var minVal = parseFloat( $rangeContainer.attr("minVal") );
		var maxVal = parseFloat( $rangeContainer.attr("maxVal") );
		var stepPx = parseFloat( $rangeContainer.attr("stepPx") );

		if( parseFloat( $rangeTo.val() ) > maxVal )
			$rangeTo.val( maxVal.toFixed( decimalDigits ) );

		if ( parseFloat($rangeFrom.val()) < minVal )
			$rangeFrom.val( minVal.toFixed( decimalDigits ) );

		var sliderFromPosition = Math.round( stepPx * ( $rangeFrom.val() - minVal ) );
		$sliderFrom[0].style.left = sliderFromPosition + "px";

		var sliderLeftWidth = sliderFromPosition;
		$sliderLeft[0].style.width = sliderLeftWidth + "px";

		var sliderToPosition = Math.round(stepPx * ($rangeTo.val() - minVal)) + sliderFromWidth;
		$sliderTo[0].style.left = sliderToPosition + "px";

		var sliderRightWidth = sliderWrapperWidth - sliderToPosition - sliderToWidth;
		$sliderRight[0].style.width = sliderRightWidth + "px";

		var sliderCenterWidth = sliderWrapperWidth - sliderLeftWidth - sliderRightWidth;
		$sliderCenter[0].style.width = sliderCenterWidth + "px";
	}
}

var touchStartTime = 0;
function touchHandler(event)
{
	var touches = event.changedTouches,
	first = touches[0],
	type = "";
	switch( event.type )
	{
		case "touchstart":
			type = "mousedown";
			touchStartTime = Date.now();
			break;
		case "touchmove":
			type = "mousemove";
			break;
		case "touchend":
			if( Date.now() - touchStartTime < 200 )
				type = "click";
			else
				type = "mouseup";
			touchStartTime = 0;
			break;
	}

	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent(type, true, true, window, 1,
		first.screenX, first.screenY,
		first.clientX, first.clientY, false,
		false, false, false, 0/*left*/, null);
	first.target.dispatchEvent(simulatedEvent);
	if( type != "" )
		event.preventDefault();
}

function initTouch( element )
{
	if ( element.addEventListener )
	{
		element.addEventListener("touchstart", touchHandler, true);
		element.addEventListener("touchmove", touchHandler, true);
		element.addEventListener("touchend", touchHandler, true);
	}
}

function SetMinMaxValForRangeControl(name, minVal, maxVal, decimalDigits, rangeFromVal, rangeToVal) {
	var $rangeContainer = $('#' + name + '-range-container');
	var $sliderWrapper = $rangeContainer.find('.slider-wrapper');
	var $sliderFrom = $rangeContainer.find('.slider-from');
	var $sliderTo = $rangeContainer.find('.slider-to');

	var $rangeFrom = $rangeContainer.find('#' + name + '-range-from');
	var $rangeTo = $rangeContainer.find('#' + name + '-range-to');

	var effectiveSliderWidth = $sliderWrapper.width() - $sliderFrom.width() - $sliderTo.width();

	//1 штука = stepPx px
	var stepPx = effectiveSliderWidth / (maxVal - minVal);
	$rangeContainer.attr("stepPx", stepPx);
	$rangeContainer.attr("minVal", minVal);
	$rangeContainer.attr("maxVal", maxVal);
	$rangeContainer.attr("decimalDigits", decimalDigits);

	//смотрим, передано ли новое значение значения "от", если да -- проставляем его, если нет  -- оставляем старое.
	// Если получившееся значение -- вне диапазона, то это будет проверено, когда вызывется onchange контрола, поэтому тут не проверяем
	var newRangeFromVal;
	if (rangeFromVal)
		newRangeFromVal = rangeFromVal;
	else
		newRangeFromVal = $rangeFrom.val();

	var newRangeToVal;
	if (rangeToVal)
		newRangeToVal = rangeToVal;
	else
		newRangeToVal = $rangeTo.val();

	$rangeFrom.val(newRangeFromVal);
	$rangeTo.val(newRangeToVal);

	$rangeFrom.change();
	$rangeTo.change();
}

function setCheckboxSelectorValue( name ) {
	var resultVal = '';

	$('#' + name + '-values input').each( function () {
		if ( this.checked ) {
			if ( resultVal != '' )
				resultVal += ", ";
			resultVal += $('label[for=' + this.name + ']').html();
		}
	});

	$('#' + name )[0].onfocus();
	$('#' + name ).val( resultVal );
	$('#' + name )[0].onblur();

	$('#' + name + '-values').hide();
}

function checkboxSelectorShow( e, name )
{
	if (!e) e = window.event;

	var f = function()
	{
		$('#' + name + '-values').hide();
		$('body').unbind( 'click', f );
	}

	if ( $('#' + name + '-values').css('display') == 'none' )
	{
		$('body').click( f );
	}
	$('#' + name + '-values').toggle();
	e.stopPropagation();
}

function maskTextOnFocus( e, text )
{
	var ctrl = $(e);

	if( ctrl.hasClass('with-hint') )
	{
		ctrl.removeClass( 'with-hint' );
	}

	// Невалидное значение никак не обрабатывается, т.к. не соответствует маске
	if ( !validateMask( e, $('#' + e.id + '-mask').val() ) )
		return true;

	var index =	ctrl.val().indexOf('_');
	if ( index == -1 )
		index = $('#' + e.id + '-mask').val().indexOf('_');

	// Установка курсора на первый символ _. В онфокусе не срабатывает, поэтому вызывается с задержкой.
	window.setTimeout( function() {
		setCaretPosition(ctrl[0], index);
	}, 10 );
	ctrl.one("mouseup.focus", function(e) {
		window.setTimeout(function() {
			setCaretPosition(ctrl[0], index);
		}, 10);
	});
	ctrl.one("mousedown", function() {
		$(this).unbind("mouseup.focus");
	});
}

function maskTextOnBlur( e, text )
{
	if( e.value == text )
	{
		$(e).addClass( "with-hint" );
	}

	$(e).change();
}

function maskTextOnDown( event, mask ) {
	// Контрол
	var t = event.target || event.srcElement;
	// Позиция курсора
	var cPos = getCaretPosition(t);
	// Выделение
	var sel = getSelectedField( t );

	var code = event.keyCode;
	var symbol = String.fromCharCode(code);

	// Невалидное значение никак не обрабатывается, т.к. не соответствует маске
	if ( !validateMask( t, mask ) )
		return true;

	// Backspace
	if( code == 8 )
	{
		// удаляем выделенный текст
		if( sel.start != sel.end )
		{
			t.value= t.value.substring( 0, sel.start ) + mask.substring(sel.start, sel.end) + t.value.substring( sel.end );
			setCaretPosition( t, sel.start );
		}
		// удаляем один символ
		else
		{
			if( cPos == 0 ) return false;
			var ch = mask.charAt(cPos-1);
			while ( ch && ch != '_' ) {
				cPos--;
				ch = mask.charAt(cPos-1);
			}
			// Если еще не уперлись в левый край маски, удаляется символ
			if ( cPos > 0 ) {
				t.value= t.value.substring( 0, cPos-1 ) + mask.charAt( cPos-1 ) + t.value.substring( cPos );
				setCaretPosition( t, cPos-1 );
			}
		}
		return false;
	}
	else if( code == 46 )
	{
		// удаляем выделенный текст
		if( sel.start != sel.end )
		{
			t.value= t.value.substring( 0, sel.start ) + mask.substring(sel.start, sel.end) + t.value.substring( sel.end );
			setCaretPosition( t, sel.start );
		}
		// удаляем один символ
		else
		{
			if( cPos == mask.length ) return false;
			var ch = mask.charAt( cPos );
			while( ch && ch != '_' ) {
				cPos++;
				ch = mask.charAt( cPos );
			}
			t.value= t.value.substring( 0, cPos ) + mask.charAt(cPos) + t.value.substring( cPos+1 );
			setCaretPosition( t, cPos );
		}
		return false;
	}
}

/*
Проверка вводимых символов при вводе по маске
	event - событие нажатия на клавишу
	mask - маска
*/
function maskTextOnPress( event, mask ) {
	// Контрол
	var t = event.target || event.srcElement;

	// Невалидное значение никак не обрабатывается, т.к. не соответствует маске
	if ( !validateMask( t, mask ) )
		return true;

	// Любые нажатия с контролом обрабатываются как есть
	if ( event.ctrlKey )
		return true;

	pasteMaskedSymbol( t, mask, getChar(event) );

	return false;
}

// Валидация значения контрола по маске
function validateMask( control, mask ) {

	// Очевидно невалидное значение, т.к. превышает размер маски
	if ( control.value.length > mask.length )
		return false;

	// Если любой из символов значения контрола не соответсвует маске - значение не валидно
	for( var i=0; i<control.value.length; i++ ) {
		if ( mask[i] != '_' && mask[i] != control.value[i] )
			return false;
	}

	// Если длина маски больше значения контрола, но он валиден, то к значению контола добавляется недостающая часть маски
	if ( control.value.length < mask.length ) {
		control.value += mask.substring(control.value.length);
		var index =	control.value.indexOf('_');
		if ( index == -1 )
			index = $('#' + e.id + '-mask').val().indexOf('_');
		setCaretPosition(control, index);
	}
	return true;
}

function pasteMaskedSymbol( control, mask, symbol ) {
	// Позиция курсора
	var cPos = getCaretPosition(control);

	if(cPos >= control.value.length) return false;
	var ch = mask.charAt(cPos);
	// если после курсора не стоит разделитель - сдвигаем курсор вправо
	while (ch && ch != '_') {
		cPos++;
		ch = mask.charAt(cPos);
	}
	setCaretPosition(control, cPos);
	if(cPos >= control.value.length) return false;

	// заменяем следующий за курсором символ вводимым сиволом
	control.value = control.value.substring(0, cPos) + symbol + control.value.substring(cPos + 1);

	// если после курсора не стоит разделитель - сдвигаем курсор вправо
	cPos++;
	ch = mask.charAt(cPos);
	while (ch && ch != '_') {
		cPos++;
		ch = mask.charAt(cPos);
	}
	setCaretPosition(control, cPos);
}

function checkAllowedSymbol( event, symbols ) {
	// Любые нажатия с контролом обрабатываются как есть
	if ( event.ctrlKey )
		return true;

	var symbol = getChar( event );

	/* Разные служебные символы. Кроме ФФ все браузеры вообще для них не вызывают кейпресс,
	а значит и проверку символа. Но ФФ вызывает, поэтому такая вот обработка */
	if( symbol == null )
		return true;

	if ( symbols.indexOf(symbol) != -1 )
		return true;

	return false;
}

/* удаление из контрола всех символов, не входящих в перечень разрешенных */
function removeDisallowedSymbols( event, symbols )
{
	var control = getEventSrcElement( event );
	var re = new RegExp("[^" + symbols + "]", "g" );
	control.value = control.value.replace( re, "" );
}

function onTextPaste( event, mask, symbols ) {
	// Контрол
	var t = event.target || event.srcElement;

	/* если есть доступ к клипборду */
	if( event && event.clipboardData && event.clipboardData.getData )
	{
		var txt = event.clipboardData.getData('text/plain');

		var newTxt = '';

		// Обработка допустимых символов
		if ( symbols != '' ) {
			for( var i=0; i<txt.length; i++ ) {
				if ( symbols.indexOf( txt[i]) != -1 ) {
					newTxt += txt[i].toString();
				}
			}
		}
		else {
			newTxt = txt;
		}

		var sel = getSelectedField( t );

		// Обычная вставка
		if ( mask == '' ) {
			t.value = t.value.substring( 0, sel.start ) + newTxt + t.value.substring( sel.end );
			setCaretPosition( t, sel.start );
		}
		else {
			// Обработка по маске
			var emptySymCnt = 0, emptySymFromCursor = 0;
			for( var i=0; i<mask.length; i++ ) {
				if ( mask[i] == '_' ) {
					emptySymCnt++;
					if ( i >= sel.start )
						emptySymFromCursor++;
				}
			}

			// Если количество символов для вставки совпадает с размером маски, то вставляется все значение целиком независимо от позиции курсора
			if ( emptySymCnt == newTxt.length ) {
				emptySymFromCursor = emptySymCnt;
				setCaretPosition( t, 0 );
			}

			// Вставка происходит только если количество вставляемых символов меньше числа свободных полей маски
			if ( emptySymFromCursor >= newTxt.length ) {
				for( var i=0; i<newTxt.length; i++ ) {
					pasteMaskedSymbol( t, mask, newTxt[i] );
				}
			}
		}

		return false;
	}
	/* стандартная обработка все запрещается */
	return false;
}

function getChar( event ) {
	// IE
	if ( event.which == null )
	{
		// спец. символ
		if ( event.keyCode < 32 ) return null;
		return String.fromCharCode( event.keyCode )
	}

	// все кроме IE
	if ( event.which != 0 && event.charCode != 0 )
	{
		// спец. символ
		if ( event.which < 32 ) return null;
		return String.fromCharCode( event.which );
	}

	// спец. символ
	return null;
}

/* Функция вешает на попытку закрыть окно предупреждение с вопросом. Получает текст подтверждения и идентификаторы ссылок и кнопок -
либо те, которые надо включить в список объектов, на которые подписывается окно, либо те, которые надо исключить */
function preventWindowClose( text, includeIds, excludeIds ) {
	window.onbeforeunload = function() { return preventWindowCloseUnload( text ); };
	var inc = [];
	if ( includeIds )
		inc = includeIds.split(',');

	var exc = [];
	if ( excludeIds )
		exc = excludeIds.split(',');

	// Ссылки
	$('a').each( function() {
		// С ссылки надо снять подпись
		if ( ( inc.length > 0 && inc.indexOf(this.id) == -1 ) || ( exc.length > 0 && exc.indexOf(this.id) != -1 ) ) {
			$(this).click( resetPreventionOfClosedWindow );
		}
	});

	// Кнопки
	$('input[type=submit]').each( function() {
		// С ссылки надо снять подпись
		if ( ( inc.length > 0 && inc.indexOf(this.id) == -1 ) || ( exc.length > 0 && exc.indexOf(this.id) != -1 ) ) {
			$(this).click( resetPreventionOfClosedWindow );
		}
	});

	// F5 | Ctrl + F5 - эти события сейчас не подписывают окно. По крайней мере в формике это не нужно - если в дальнейшем
	// понадобится - можно будет завести еще один входной параметр, нужен ли текст при перезагрузке окна
	$(window).keydown( function(event) {
		if ( event.ctrlKey && event.keyCode == 116 || event.keyCode == 116 || ( event.ctrlKey && event.keyCode == 82 ) )
			resetPreventionOfClosedWindow();
	} );
}

/* Возвращает текст и заполняет event.returnValue - в примере делается так,
хотя в хроме и яндексе достаточно просто текст вернуть, ничего не заполняя*/
function preventWindowCloseUnload( text, evt ) {
	if ( typeof evt == 'undefined' )
		evt = window.event;
	if ( evt )
		evt.returnValue = text;
	return text;
}

/* Сброс обработчика окна предупреждения о закрытии - по нажатию на одну из ссылок/кнопок из списка */
function resetPreventionOfClosedWindow() {
	var onload = window.onbeforeunload;
	window.onbeforeunload = null;
	setTimeout( function() { window.onbeforeunload = onload; }, 1000 );
}
