/*
Файл состоит из двух частей

- класс ScrollableSlideshow для управления слайдшоу, которое представляет собой
  горизоонтальную или вертикальную полоску превьюшек с кнопками вперёд и назад

- код инициализации image-gallery, который
  1) создаёт ScrollableSlideshow для управления превьюшками
  2) обрабатывает клик по превью для показа большого изображения

Класс ScrollableSlideshow можно использовать вне image-gallery, для этого нужно
подключить этот файл и дополнительно проставить скрытое поле #image-gallery-init
со значением "none", чтобы не инициализировалась image-gallery.

Вынести ScrollableSlideshow в отдельный файл нельзя, потому что он требуется
image-gallery, а image-gallery используется в старых проектах, куда можно
забыть включить новый отдельный JavaScript-файл.

По причинам совместимости оставлена возможность кастомизации image-gallery
посредством переопределения глобальных функций, таких как enableBackwardButton,
slideShowForward и прочие.  Для этого в проектах часто используется файл
image-gallery-customization.js.

Конструктор ScrollableSlideshow принимает объект, описывающий конфигурацию слайдшоу.
Код image-gallery занимается наполнением этого объекта самостоятельно, но для прикладного
кода существует возможность расширить этот объект, передав дополнительные ключи конфигурации.
Для этого надо задать глобальную переменную - объект scrollableSlideshowConfig.  Все ключи из
этого объекта передаются в ScrollableSlideshow (возможно переопределяя параметры,
подготовленные image-gallery).

Полный перечень ключей конфига: {
	container: (обязательный параметр) jQuery или DOM-элемент, содержащий элементы <li>, которые будут обрабатываться
	visibleSlidesCount: (обязательный параметр) число видимых превьюшек
	backwardButton: (опциональный параметр) кнопка Назад; если не передана, просто не обрабатывается
	forwardButton: (опциональный параметр) кнопка Вперёд; если не передана, просто не обрабатывается
	buttonEnabledClass:
		(опциональный параметр) CSS-класс, который будет удаляться у кнопок, когда их необходимо отключить
	    Если не передан, кнопки показываются/скрываются
		Изначально кнопки должны быть включены, код их отключит по мере надобности
	animation: (опциональный параметр) см. ниже
}

В большинстве случаев действия кнопок вперед/назад сводятся к изменению одного атрибута у
первого превью (например, margin-left для горизонтального слайдшоу, margin-top для вертикального).
Для этого случая достаточно определить атрибут конфига animation, например:

scrollableSlideshowConfig = {
	animation: {
		prop: 'margin-left',
		// значение, которое должно добавлять/прибавляться к текущему значению
		// свойства при нажатии кнопки, обычно ширина/высота превью + паддинг
		offset: 100,
		// длительность анимации, мс
		speed: 500 
	}
}

Вёрстка, с которой работает JavaScript-код в этом файле, создаётся XSLT из
slide-show-containers.xslt (тип слайдшоу "slide-show-image-gallery").
*/


function ScrollableSlideshow( config ) {
	config = config || {};

	this.cycled = !! config.cycled;

	if( ! config.hasOwnProperty('visibleSlidesCount') )
		throw('config.visibleSlidesCount is not defined');
	this.visibleSlidesCount = config.visibleSlidesCount;

	if( ! config.hasOwnProperty('container') )
		throw('config.container is not defined');
	this.container = $(config.container);

	this.backwardButton = $(config.backwardButton || []);
	this.forwardButton = $(config.forwardButton || []);
	this.buttonEnabledClass = config.buttonEnabledClass || null;

	this.animation = config.animation || null;
	if( this.animation ) {
		if( ! this.animation.prop )
			throw('config.animation.prop is not defined');
		if( ! this.animation.offset )
			throw('config.animation.offset is not defined');
		if( ! this.animation.speed && this.animation.speed !== 0 )
			throw('config.animation.speed is not defined');
	}

	this.slidesCount = $('li', this.container).length;
	this.currentSlideNumber = Number( $('li.current', this.container).attr('data-n') );

	this.animationInProgress = false;

	this._init();
}

ScrollableSlideshow.prototype = {

	_init: function() {
		var self = this, C = this.container;

		// простановка обработчиков кнопок
		if( this.backwardButton.length > 0 && ! this.backwardButton.attr("onclick") )
			this.backwardButton.click( function() { self.slideShowBackward(); return false; } );
		if( this.forwardButton.length > 0 && ! this.forwardButton.attr( "onclick" ) )
			this.forwardButton.click( function() { self.slideShowForward(); return false; } );

		// если все слайды влезают, скрываем кнопки навигации
		if ( this.visibleSlidesCount >= this.slidesCount )
		{
			this.disableBackwardButton();
			this.disableForwardButton();
		}
		// если текущий слайд находится вне div`a (невидим)
		else if ( this.currentSlideNumber > this.visibleSlidesCount )
		{
			for ( var i = 1; i <= this.currentSlideNumber - this.visibleSlidesCount; i++ )
				$('li:first-child', C).insertAfter( $('li:last-child', C) );

			// если последний отображаемый слайд (в данном случае текущий) - последний в коллекции
			// и не задано зацикливание скрываем кнопку прокрутки вперед
			if ( Number( $('li.current', C).attr('data-n') ) == this.slidesCount && ! this.cycled )
				this.disableForwardButton();
		}
		// если не задан параметр зацикливания, скрываем по необходимости кнопки навигации
		else 
		{
			this.disableBackwardButtonIfNeeded();
			this.disableForwardButtonIfNeeded();
		}
	},

	_buttonDisabled: function(button) {
		if( button.length === 0 )
			return false;
		return ! ( this.buttonEnabledClass ? button.hasClass( this.buttonEnabledClass ) : button.is(':visible') );
	},

	disableBackwardButton: function() { this.buttonEnabledClass ? this.backwardButton.removeClass( this.buttonEnabledClass ) : this.backwardButton.hide(); },
	disableForwardButton: function() { this.buttonEnabledClass ? this.forwardButton.removeClass( this.buttonEnabledClass ) : this.forwardButton.hide(); },
	enableBackwardButton: function() { this.buttonEnabledClass ? this.backwardButton.addClass( this.buttonEnabledClass ) : this.backwardButton.show(); },
	enableForwardButton: function() { this.buttonEnabledClass ? this.forwardButton.addClass( this.buttonEnabledClass ) : this.forwardButton.show(); },

	// скрываем кнопку пролистывания назад, если первый отображаемый слайд - первый по порядку (Number = 1)
	disableBackwardButtonIfNeeded: function() {
		if( ! this.cycled && $('li:first-child', this.container).attr('data-n') == '1' )
			this.disableBackwardButton();
	},

	disableForwardButtonIfNeeded: function() {
		if( ! this.cycled && Number( $('li:first-child', this.container).attr('data-n') ) > this.slidesCount - this.visibleSlidesCount )
			this.disableForwardButton();
	},

	// пролистывание вперёд
	slideShowForward: function( callback ) {
		if( this.animationInProgress || this._buttonDisabled( this.forwardButton ) )
			return;
		this.animationInProgress = true;
		this._slideShowForward( callback );
	},

	_slideShowForward: function( callback ) {
		if( ! this.animation )
			throw('Вы должны либо определить slideShowForward, либо настроить стандартную реализацию, передав в конструктор config.animation');
		var self = this, C = this.container;

		var css = {};
		css[ self.animation.prop ] = - self.animation.offset;
		$('li:first-child', C).animate( css, self.animation.speed, '', function() {
			$('li:first-child', C)
				.insertAfter( $('li:last-child', C) )
				.css( self.animation.prop, 0 );
			self._afterSlideShowForward();
			if( callback )
				callback();
		});
	},

	_afterSlideShowForward: function() {
		this.enableBackwardButton();
		this.disableForwardButtonIfNeeded();
		this.animationInProgress = false;
	},

	// пролистывание назад
	slideShowBackward: function( callback ) {
		if( this.animationInProgress || this._buttonDisabled( this.backwardButton ) )
			return;
		this.animationInProgress = true;
		this._slideShowBackward( callback );
	},

	_slideShowBackward: function( callback ) {
		if( ! this.animation )
			throw('Вы должны либо определить slideShowBackward, либо настроить стандартную реализацию, передав в конструктор config.animation');
		var self = this, C = this.container;

		$('li:last-child', C)
			.insertBefore( $('li:first-child', C) )
			.css( self.animation.prop, - self.animation.offset );

		var css = {};
		css[ self.animation.prop ] = 0;
		$('li:first-child', C).animate( css, self.animation.speed, '', function() {
			self._afterSlideShowBackward();
			if( callback )
				callback();
		});
	},

	_afterSlideShowBackward: function() {
		this.enableForwardButton();
		this.disableBackwardButtonIfNeeded();
		this.animationInProgress = false;
	}
};


// число видимых слайдов (помещающихся в div)
var visibleSlidesCount;
// общее число слайдов
var slidesCount;
// условие зацикливания показа слайдов
var cycled;
// объект ScrollableSlideshow
var slideshow;


$( function() {
	if( $("#image-gallery-init").val() == "none" )
		return;
	afterImagesLoaded( initSlideShow );
} );

/* подготовка слайдшоу к работе */
function initSlideShow()
{
	if( window.beforeInitSlideShow )
		beforeInitSlideShow();

	var config = {
		cycled: $('#cycled').val(),
		container: $('#slide-show-navigation'),
		backwardButton: $('#backwardlink'),
		forwardButton: $('#forwardlink'),
		visibleSlidesCount: window.getVisibleSlidesCount ? window.getVisibleSlidesCount() : visibleSlidesCount
	};

	if( window.scrollableSlideshowConfig )
		$.extend( config, window.scrollableSlideshowConfig );
	if( config.container.length == 0 )
		return;
	window.slideshow = new ScrollableSlideshow( config );

	// инициализация глобальных переменных, которые могут использовать кастомизацией
	window.visibleSlidesCount = slideshow.visibleSlidesCount;
	window.slidesCount = slideshow.slidesCount;
	window.cycled = slideshow.cycled;

	// кастомизация функций
	if( ! window.slideShowForward ) slideShowForward = function() { slideshow.slideShowForward(); }; else slideshow.slideShowForward = slideShowForward;
	if( ! window.slideShowBackward ) slideShowBackward = function() { slideshow.slideShowBackward(); }; else slideshow.slideShowBackward = slideShowBackward;

	if( ! window.enableForwardButton ) enableForwardButton = function() { slideshow.enableForwardButton(); }; else slideshow.enableForwardButton = enableForwardButton;
	if( ! window.disableForwardButton ) disableForwardButton = function() { slideshow.disableForwardButton(); }; else slideshow.disableForwardButton = disableForwardButton;
	if( ! window.enableBackwardButton ) enableBackwardButton = function() { slideshow.enableBackwardButton(); }; else slideshow.enableBackwardButton = enableBackwardButton;
	if( ! window.disableBackwardButton ) disableBackwardButton = function() { slideshow.disableBackwardButton(); }; else slideshow.disableBackwardButton = disableBackwardButton;

	// всем слайдам, кроме текущего, проставляем onclick
	$('li img.ThumbNail').not($('li.current img.ThumbNail')).one( 'click', selectNewSlide );

	showSlide();
}

function hideBackwardButton() { return slideshow.disableBackwardButtonIfNeeded(); }
function hideForwardButton() { return slideshow.disableForwardButtonIfNeeded(); }
function showForwardButton() { return slideshow.enableForwardButton(); }

//выбор другого слайда
function selectNewSlide()
{
	// текущему слайду проставляем onclick
	$('li.current .ThumbNail').one( 'click', selectNewSlide );
	// из контейнера с большим изображением убираем заголовок
	$('#slide-container div h4').remove();
	// оставшееся содержимое
	var $slideContainerContents = $('#slide-container div').children();
	// присоединяем к текущему слайду
	$('li.current').append( $slideContainerContents );
	// текущий слайд делаем 'не текущим'
	$('li.current').removeClass('current');
	// выбранный слайд делаем текущим
	$(this).parent().addClass( 'current' );
	// вызываем функцию показа большого изображения слайда
	showSlide();
}

//показ выбранного слайда
function showSlide()
{
	// Если задано кастомный показ слайда, то вызывается он
	if( window.showSlideCustomization )
	{
		showSlideCustomization( );
		return;
	}
	
	// div, в который поместится крупное изображение картинки с описанием
	var $slide = $('#slide-container div');
	// большое изображение и описание слайда
	var $slideContents = $('li.current').children().not('img.ThumbNail').not('h4');
	// заголовок слайда (клон)
	var $slideTitle = $('#slide-show-navigation li.current h4').clone();
	// присоединяем к диву, в котором должен вывестись сам слайд
	$slide.append( $slideTitle );
	$slide.append( $slideContents );
}