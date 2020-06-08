$( function() {

    /*document.oncopy = function(){
        var selection = window.getSelection();
        var pageLink = "";
        console.log(selection + pageLink);
    }*/

    var touchStart = { x: 0, y: 0 };

    // Главный слайдер
    var configMainSlider = {
        loop: true,
        nav: true,
        dots: false,
        navSpeed: 500,
        autoplayHoverPause: true,
        items: 1,
        navText: [
            '<i class="icon-arrow-left"></i>',
            '<i class="icon-arrow-right"></i>'
        ],
        responsive: {
            0: {
                dots: true
            },
            1024:{
                dots: false
            }
        }
    }
    if(configSlider){
        if(configSlider.autoPlayTimeoutMain){
            configMainSlider.autoplay = true;
            configMainSlider.autoplayTimeout = configSlider.autoPlayTimeoutMain;
        }
    }
    $( '.slider-main' ).owlCarousel(configMainSlider);

    //// Навигация
    $( '.slider-main__nav ul > li' ).on({
        mouseover: function() {
            $( $( '.slider-main__item-service' )[ $( this ).index() ] ).stop( true, false ).show( 0 );
            $( '.slider-main__item-service' ).find( '.slider-main__item-text' ).show( 0 );
            $( '.slider-main__item-service' ).find( '.slider-main__item-icon' ).show( 0 );
        },
        mouseleave: function() {
            $( $( '.slider-main__item-service' )[ $( this ).index() ] ).stop( true, false ).hide( 0 );
            $( '.slider-main__item-service' ).find( '.slider-main__item-text' ).hide( 0 );
            $( '.slider-main__item-service' ).find( '.slider-main__item-icon' ).hide( 0 );
        }
    });

    // Главный слайдер паралакс
    var defaultBgWidth = 1920;
    setSliderBgPosition ( defaultBgWidth );

    $( window ).on( 'scroll', function() {
        setSliderBgPosition ( defaultBgWidth );
    });

    // Слайдеры
    parentsSliderInit();

    $( '.advantages' ).owlCarousel({
        loop: true,
        nav: true,
        navSpeed: 500,
        items: 1,
        navText: [
            '<i class="icon-arrow-left"></i>',
            '<i class="icon-arrow-right"></i>'
        ]
    });


    // Добавть для мобильной версии сайта
    // в меню последним пунктом поиск
    if ( getWindowWidth() < 768 ) {
        searchInMenu();
    } else {
        $( '.nav-search' ).remove();
    }

    // Убрать слили меню от мобильной версии
    // при изменении размеров окна браузера
    $( window ).on( 'resize', function() {
        if ( getWindowWidth() >= 768 ) {
            $( 'nav.main ul' ).removeAttr( 'style' );
            $( '.nav-search' ).remove();
        } else {
            searchInMenu();
            if ( !$( 'nav.main ul' ).is( ':visible' ) ) {
                $( 'nav.main' ).removeClass( 'open' );
            }
        }

        // Пересчет background-position-x для слайдера на главной
        setSliderBgPosition ( defaultBgWidth );
    });

    // Показать меню для мобильной версии
    $( 'nav.main' ).on( 'click', function(e) {
        if ( getWindowWidth() < 768 ) {
            if ( !$( e.target ).parents( 'li' ).hasClass( 'nav-search' ) ) {

                if ( $( this ).hasClass( 'open' ) ) {
                    $( this ).find( 'ul' ).slideUp( 200 );
                } else {
                    $( this ).find( 'ul' ).slideDown( 200 );
                }
                $( this ).toggleClass( 'open' );
            }
        }
    });
    // To top
    $( '.btn_to-top' ).on( 'click', function() {
        $( 'html, body' ).animate( { scrollTop : 0 }, 800 );
    });

    // Select
    selectInit();
    $( '.select__selected' ).on( 'click', function() {
        var list = $( this ).parents( '.select' ).find( '.select__list' );
        if ( $( this ).hasClass( 'opened' ) ) {
            list.slideUp( 300 );
        } else {
            list.slideDown( 300 );
        }
        $( this ).toggleClass( 'opened' );
    });

    $( '.select__list li' ).on( 'click', function() {
        var item = $( this ).addClass( 'active' ).text();
        $( this ).siblings().removeClass( 'active' );
        $( this ).parents( '.select' ).find( '.select__selected span' ).first().text( item );
        $( this ).parents( '.select-wrap' ).find( 'input' ).first().val( item ).trigger('change');
    });

    // Form
    formInit();
    $( '.form input[type="checkbox"].bx-accept-checkbox' ).on( 'click', function() {
        var checkboxes = $( this ).parents( '.form' ).find( 'input[type="checkbox"].bx-accept-checkbox' ),
            btnEnabled = true;

        checkboxes.each( function( idx, item ) {
            btnEnabled = btnEnabled && $( item ).prop( 'checked' );
        } );
        
        $( this ).parents( '.form' ).find( '.btn' ).prop( 'disabled', !btnEnabled );
    });

    // Скрать/открыть секцию
    $( '.section-title' ).on( 'click', function() {
        if ( $( this ).hasClass( 'opened' ) ) {
            $( this ).next().stop( true, false).slideUp( 300 );
        } else {
            $( this ).next().stop( true, false).slideDown( 300 );
        }
        $( this ).toggleClass( 'opened' );
    });

    // Tooltip
    $( '.tooltip-wrap a' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();
        $( this ).toggleClass( 'hover' );
    });

    $( '.tooltip-wrap a' ).on( 'mouseleave', function( e ) {
        e.stopPropagation();
        e.preventDefault();
        $( this ).removeClass( 'hover' );
    });

    // Скрать/открыть вопрос
    $( '.answers__item' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();
        if ( $( this ).hasClass( 'opened' ) ) {
            $( this ).find( '.answers__item-text' ).stop( true, false).slideUp( 300 );
        } else {
            $( this ).find( '.answers__item-text' ).stop( true, false).slideDown( 300 );
        }
        $( this ).toggleClass( 'opened' );
    });

    // Services
    $( '.service' ).on( 'click', function( e ) {
        if ( getWindowWidth() < 1024 ) {
            $( this ).toggleClass( 'hover' );
        }
    });

    // Services nav
    $( '.service-nav .nav > li > a' ).on({
        mouseover: function( e ) {
            var tooltip = $( '<div>' ),
                img = $( this ).find( 'img' );
            tooltip.addClass( 'service-nav-tooltip' )
                .text( $( this ).attr( 'data-name' ) );
            $( 'body' ).append( tooltip );
            $( '.service-nav-tooltip' )
                .css({
                    'top':  e.clientY + 15 + $( 'body' ).scrollTop(),
                    'left': e.clientX + $( '.service-nav-tooltip' ).outerWidth() + 20 > getWindowWidth() ? e.clientX - $( '.service-nav-tooltip' ).outerWidth() : e.clientX + 15,
                    'opacity': 1
                })
                .show( 1000 );

            img.attr( 'src', img.attr( 'data-src' ) );
        },
        mousemove: function( e ) {
            $( '.service-nav-tooltip' )
                .css({
                    'top':  e.clientY + 15 + $( 'body' ).scrollTop(),
                    'left': e.clientX + $( '.service-nav-tooltip' ).outerWidth() + 20 > getWindowWidth() ? e.clientX - $( '.service-nav-tooltip' ).outerWidth() : e.clientX + 15,
                });
        },
        mouseleave: function( e ) {
            var img = $( this ).find( 'img' );

            $( '.service-nav-tooltip' ).remove();

            if ( !$( this ).hasClass( 'active' ) ) {
                img.attr( 'src', img.attr( 'data-src-default' ) );
            }
        }
    });

    $( window ).on( 'load', function() {
        $( '.service-nav .nav > li > a > img' ).each( function() {
            if ( $( this ).parent().hasClass( 'active' ) ) {
                $( this ).attr( 'src', $( this ).attr( 'data-src' ) );
            } else {
                $( this ).attr( 'src', $( this ).attr( 'data-src-default' ) );
            }
        });
    });

    // Docs
    $( document ).on({
        mouseover: function( e ) {
            var tooltip = $( '<div>' );

            if ( $( this ).attr( 'data-name' ) ) {
                tooltip.addClass( 'file-tooltip' )
                    .text( $( this ).attr( 'data-name' ) );
                $( 'body' ).append( tooltip );
                $( '.file-tooltip' )
                    .css({
                        'top':  e.clientY + 15 + $( 'body' ).scrollTop(),
                        'left': e.clientX + $( '.file-tooltip' ).outerWidth() + 20 > getWindowWidth() ? e.clientX - $( '.file-tooltip' ).outerWidth() : e.clientX + 15,
                        'opacity': 1
                    })
                    .show( 1000 );
            }
        },
        mousemove: function( e ) {
            $( '.file-tooltip' )
                .css({
                    'top':  e.clientY + 15 + $( 'body' ).scrollTop(),
                    'left': e.clientX + $( '.file-tooltip' ).outerWidth() + 20 > getWindowWidth() ? e.clientX - $( '.file-tooltip' ).outerWidth() : e.clientX + 15,
                });
        },
        mouseleave: function( e ) {
            $( '.file-tooltip' ).remove();
        }
    }, '.file > a' );

    // Табы
    $( '.filial-tabs' ).tabs( { show: 'fade', hide: 'fade' } );
    $( '.services-tabs' ).tabs();

    // Filials list
    $( '.filial-select_default' ).on( 'click', function() {
        $( '.filial-list__default' ).addClass( 'active' );
        $( '.filial-list__abc' ).removeClass( 'active' );
    });

    $( '.filial-select_abc' ).on( 'click', function() {
        $( '.filial-list__abc' ).addClass( 'active' );
        $( '.filial-list__default' ).removeClass( 'active' );
    });

    $( '.filial-list__abc ul' ).each( function() {
        var li = $( '<li class="letter">' );
        li.text( $( this ).find( 'li' ).first().text()[0] );
        $( this ).append( li );
    });

    $( '.popup__content' ).on( 'touchstart', function() {
        touchStart.x = event.touches[ 0 ].pageX;
        touchStart.y = event.touches[ 0 ].pageY;
    });

    // Popup
    $( '.popup__content' ).on( 'mousewheel touchmove', function( e ) {
        var delta = e.deltaY || -touchStart.y + e.originalEvent.touches[0].pageY || -touchStart.y + e.originalEvent.changedTouches[0].pageY
        if ( delta > 0) {
            $( this ).stop( true, false ).animate({
                scrollTop: $( this ).scrollTop() - parseInt( $( this ).height() )
            }, 300 );
        } else {
            $( this ).stop( true, false ).animate({
                scrollTop: $( this ).scrollTop() + parseInt( $( this ).height() )
            }, 300 );
        }
        /*e.preventDefault();
        e.stopPropagation();*/
    });

    //// Close popup
    $( '.popup__btn_close, .popup__body' ).on( 'click', function( e ) {

        //e.stopPropagation();

        var elem = $( e.target );

        if ( elem.hasClass( 'popup__btn_close' ) || elem.hasClass( 'popup__body' ) ) {
            $( this ).parents( '.popup' ).fadeOut( 500, function() {
                // Удалить данные из popup
                $( '.popup_awards' ).find( '.media-block' ).remove();
                $( '.popup_awards' ).find( '.award__title_popup' ).remove();

                $( '.popup_news-inner' ).find( '.media-block' ).remove();
                $( '.popup_news-inner' ).find( '.news-inner__media-text' ).remove();

                $( '.popup_manager' ).find( '.img-wrap' ).remove();
                $( '.popup_manager' ).find( '.manager__title' ).remove();
                $( '.popup_manager' ).find( '.manager__text' ).remove();
                $( '.popup_manager' ).find( '.manager__about' ).remove();

                $( '.popup_services-inner' ).find( '.services-inner__title' ).remove();
                $( '.popup_services-inner' ).find( '.services-inner__text' ).remove();

                $( '.popup_media' ).find( '.media-block' ).remove();
            });
            setTimeout(function() {
                $( 'html' ).removeAttr( 'style' );
                }, 500);
        }
    });

	$( '.popup_ok' ).on( 'click', function( e ) {
	  $( this ).fadeOut( 500 );
	});

    //// question
    $( '.btn_question.question').on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();
        $.ajax('https://mobti.ru/ajax/setquestion.php');
        $( '.popup_question' ).hide();
        $( '.popup_question.question' ).fadeIn( 500 );
    });

    //// payment ways
    $( '.btn_question.payment').on( 'click', function( e ) {
        document.location.href='https://www.mobti.ru/uslugi/oplata-uslug.php';
    });

    //// reception
    $( '.btn_reception' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();
        hideScroll();
        $( '.popup_reception' ).fadeIn( 500 );
    });

    //// manager
    $( '.manager' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();

        var cloneImg = $( this ).find( '.img-wrap' ).clone();

        if ( cloneImg.find( 'img' ).attr( 'data-src' ) ) {
            cloneImg.find( 'img' ).attr( 'src', cloneImg.find( 'img' ).attr( 'data-src' ) );
        }

        $( '.popup_manager .popup__content' ).append( cloneImg );
        $( this ).find( '.manager__title' ).clone().appendTo( '.popup_manager .popup__content' );
        $( this ).find( '.manager__text' ).clone().appendTo( '.popup_manager .popup__content' );
        $( this ).find( '.manager__about' ).clone().show().appendTo( '.popup_manager .popup__content' );
        hideScroll();
        $( '.popup_manager' ).fadeIn( 500 );
    });

    //// newsletters
    // $( '.newsletters' ).on( 'click', function( e ) {
    //   e.stopPropagation();
    //   e.preventDefault();

    //   var cloneImg = $( this ).find( '.img-wrap' ).clone();

    //   if ( cloneImg.find( 'img' ).attr( 'data-src' ) ) {
    //     cloneImg.find( 'img' ).attr( 'src', cloneImg.find( 'img' ).attr( 'data-src' ) );
    //   }

    //   $( '.popup_awards .popup__content' ).append( cloneImg );
    //   $( this ).find( '.award__title' ).clone().addClass( 'award__title_popup').prependTo( '.popup_awards .popup__more' );

    //   $( '.popup_awards' ).fadeIn( 500 );
    // });
    $( '.newsletters__img, .newsletters__video' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();

        var media = $( '<div>' ),
            itemIndex = $( this ).parents( '[class^="col-"]').index();
        media.addClass( 'media-block' );

        $( this ).parents( '.row' )
            .find( '.newsletters__img, .newsletters__video' )
            .each( function( index, item ) {                
                var cloneItem = $( item ).clone();

                if ( cloneItem.hasClass( 'newsletters__video_custom' ) ) {  // custom video

                    cloneItem.find( '.item-video' )
                        .removeAttr( 'style' )
                        .attr( 'id', 'item-video_' + index )
                        .addClass( 'item-video_custom' )
                        .append( $( '<div>' ).addClass( 'item-video__play' ) );

                        cloneItem.find( '.item-video').append(cloneItem.find( '.newsletters__video-title' ));

                } else if ( cloneItem.hasClass( 'newsletters__video' ) ) {   // youtube-rutube                 

                    cloneItem.find( '.item-video' ).removeAttr( 'style' );
                    cloneItem.find( 'img' ).remove();
                    
                    var videoUrl = cloneItem.find('a').prop( 'href' );

                    if (videoUrl.match('^http://rutube.ru') || videoUrl.match('^https://rutube.ru')) {  // rutube

                        cloneItem.find( '.item-video' )
                        .removeAttr( 'style' )
                        .attr( 'id', 'item-video_' + index )
                        .addClass( 'item-video_custom item-video_rutube' )
                        .append( $( '<div>' ).addClass( 'item-video__play' ) );
                        
                        cloneItem.find('a').removeClass( 'owl-video' );
                    }
                }

                if ( cloneItem.find( 'img' ).attr( 'data-src' ) ) {
                    cloneItem.find( 'img' ).attr( 'src', cloneItem.find( 'img' ).attr( 'data-src' ) );
                }

                cloneItem.children().clone().appendTo( media );
            });

        $( '.popup_media .popup__content' ).prepend( media );

        setTimeout( function() {
            var videoHeight = $( '.popup_media .popup__content' ).width() * 9 / 16;
            $( '.popup_media .popup__content' ).find( '.item-video' ).css( 'height', videoHeight );
            if ( $( '.media-block' ).children().length > 1 ) {
                var mediaBlock = $( '.media-block' );
                mediaBlock.owlCarousel({
                    loop: false,
                    nav: true,
                    dots: false,
                    navSpeed: 500,
                    autoHeight: true,
                    items: 1,
                    lazyLoad: true,
                    video: true,
                    videoHeight: videoHeight,
                    center: true,
                    navText: [
                        '<i class="icon-arrow-left"></i>',
                        '<i class="icon-arrow-right"></i>'
                    ],
                    responsive: {
                        0: {
                            nav: false
                        },
                        768:{
                            nav: true
                        }
                    },
                    onChange: function() {
                        if ( player ) {
                            player.stop();
                        }
                    }/*,
                     onDrag: function() {
                     console.log(this.drag.targetEl);
                     return false;
                     }*/
                });

                mediaBlock.trigger( 'to.owl.carousel', [ itemIndex, 1, true ] );

            } else if ( $( '.media-block' ).children().length == 1 ) {
                var mediaBlock = $( '.media-block' );
                mediaBlock.owlCarousel({
                    loop: false,
                    nav: false,
                    dots: false,
                    autoHeight: true,
                    items: 1,
                    lazyLoad: true,
                    video: true,
                    videoHeight: videoHeight,
                    center: true
                });
            }
        }, 100);
        hideScroll();
        $( '.popup_media' ).fadeIn( 500 );
    });

    var player;
    var playerPlayButton;
    $( document ).on( 'click', '.item-video__play', function() {
        

        if ($(this).parent().hasClass('item-video_rutube')) {

            playerPlayButton = $(this);

            player = {
                start : function() {
                    playerPlayButton.parent().append('<iframe class="rutubeFrame" src="' +  playerPlayButton.siblings('a').prop('href') + '?autoStart=true" allowfullscreen></iframe>');
                    playerPlayButton.hide();
                },
                stop: function() {
                    playerPlayButton.siblings('.rutubeFrame').remove();
                    playerPlayButton.show();
                }
            };

            player.start();


        } else {

            playerPlayButton = $(this);

            player = {
                start : function() {
                    playerPlayButton.parent().append('<video class="CustomPlayer" src="' +  playerPlayButton.siblings('a').prop('href') +'" controls autoplay></video>');
                    playerPlayButton.hide();
                    playerPlayButton.siblings('img').hide();
                },
                stop: function() {
                    playerPlayButton.siblings('.CustomPlayer').remove();
                    playerPlayButton.show();
                    playerPlayButton.siblings('img').show();
                }
            };

            player.start();

        }      
        

        /*
        var width  = $( '.popup_media .popup__content' ).width(),
            id     = $( this ).parent().attr( 'id' ),
            file   = $( this ).parent().find( 'a' ).attr( 'href' );
        player = jwplayer( id ).setup({
            'file': file,
            'width': width,
            'height': width * 9 / 16,
            'dock': true,
            'controlbar': 'bottom',
            'players':[{
                'type': 'html5',
                'src': '/bitrix/components/bitrix/player/mediaplayer/player'
            }],
            'logo.hide': true,
            'bufferlength': 10,
            'plugins':[]
        });
        player.play();
        */
    });

    //// awards
    $( '.award' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();

        var media = $( '<div>' ).addClass( 'media-block' ),
            itemIndex = $( this ).parents( '[class^="col-"]').index();

        $( '.award' ).each( function() {
            var cloneImg = $( this ).find( '.img-wrap' ).clone(),
                item = $( '<div>' ),
                more = $( '<div>' ).addClass( 'more-title' ).hide();

            if ( cloneImg.find( 'img' ).attr( 'data-src' ) ) {
                cloneImg.find( 'img' ).attr( 'src', cloneImg.find( 'img' ).attr( 'data-src' ) );
            }

            item.append( cloneImg );
            $( this ).find( '.award__title' ).clone().addClass( 'award__title_popup' ).appendTo( more );
            item.append( more );
            media.append( item );
        });

        $( this ).find( '.award__title' ).clone().addClass( 'award__title_popup' ).prependTo( '.popup_awards .popup__more' );
        $( '.popup_awards .popup__more #printBut' ).attr( 'href', $( this ).find( 'img' ).attr( 'data-print-href' ) );
        $( '.popup_awards .popup__more #pdfBut' ).attr( 'href', $( this ).find( 'img' ).attr( 'data-pdf-src' ) );
        $( '.popup_awards .popup__content' ).prepend( media );

        setTimeout( function() {
            if ( $( '.media-block' ).children().length > 1 ) {
                var mediaBlock = $( '.media-block' );
                mediaBlock.owlCarousel({
                    loop: true,
                    nav: true,
                    dots: false,
                    navSpeed: 500,
                    autoHeight: true,
                    items: 1,
                    lazyLoad: true,
                    center: true,
                    navText: [
                        '<i class="icon-arrow-left"></i>',
                        '<i class="icon-arrow-right"></i>'
                    ],
                    responsive: {
                        0: {
                            nav: false
                        },
                        768:{
                            nav: true
                        }
                    }
                });

                mediaBlock.trigger( 'to.owl.carousel', [ itemIndex, 1, true ] );
                mediaBlock.on( 'change.owl.carousel changed.owl.carousel', function( e ) {
                    if ( e.property.name != 'position' ) return;

                    var current = e.relatedTarget.current(),
                        items = $( this ).find( '.owl-stage' ).children(),
                        add = e.type == 'changed';

                    items.eq( e.relatedTarget.normalize( current ) ).toggleClass( 'current', add ).siblings().removeClass( 'current' );

                    $( this ).parents( '.popup_awards' )
                        .find( '.popup__more .award__title_popup' )
                        .remove();
                    $( this ).parents( '.popup_awards' )
                        .find( '.popup__more #printBut' )
                        .attr( 'href', '' );
                    $( this ).parents( '.popup_awards' )
                        .find( '.popup__more' )
                        .prepend( $( this ).find( '.current .award__title_popup' ).clone() );
                    $( this ).parents( '.popup_awards' )
                        .find( '.popup__more #printBut' )
                        .attr( 'href', $( this ).find( '.current img' ).attr( 'data-print-href' ) );
                    $( this ).parents( '.popup_awards' )
                        .find( '.popup__more #pdfBut' )
                        .attr( 'href', $( this ).find( '.current img' ).attr( 'data-pdf-src' ) );
                });
            }
        }, 100);
        hideScroll();
        $( '.popup_awards' ).fadeIn( 500 );
    });

    //// news-inner
    $( '.news-inner__media' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();

        var media = $( '<div>' ).addClass( 'media-block' ),
            itemIndex = $( this ).index();

        $( '.news-inner__media' ).each( function() {
            var cloneImg = $( this ).find( '.img-wrap' ).clone(),
                item = $( '<div>' ),
                more = $( '<div>' ).addClass( 'more-title' ).hide();

            if ( cloneImg.find( 'img' ).attr( 'data-src' ) ) {
                cloneImg.find( 'img' ).attr( 'src', cloneImg.find( 'img' ).attr( 'data-src' ) );
            }

            item.append( cloneImg );
            $( this ).find( '.news-inner__media-text' ).clone().appendTo( more );
            item.append( more );
            media.append( item );
        });

        $( this ).find( '.news-inner__media-text' ).clone().prependTo( '.popup_news-inner .popup__more' );
        $( '.popup_news-inner .popup__content' ).prepend( media );

        setTimeout( function() {
            if ( $( '.media-block' ).children().length > 1 ) {
                var mediaBlock = $( '.media-block' );
                mediaBlock.owlCarousel({
                    loop: true,
                    nav: true,
                    dots: false,
                    navSpeed: 500,
                    autoHeight: true,
                    items: 1,
                    lazyLoad: true,
                    center: true,
                    navText: [
                        '<i class="icon-arrow-left"></i>',
                        '<i class="icon-arrow-right"></i>'
                    ],
                    responsive: {
                        0: {
                            nav: false
                        },
                        768:{
                            nav: true
                        }
                    }
                });

                mediaBlock.trigger( 'to.owl.carousel', [ itemIndex, 1, true ] );
                mediaBlock.on( 'change.owl.carousel changed.owl.carousel', function( e ) {
                    if ( e.property.name != 'position' ) return;

                    var current = e.relatedTarget.current(),
                        items = $( this ).find( '.owl-stage' ).children(),
                        add = e.type == 'changed';

                    items.eq( e.relatedTarget.normalize( current ) ).toggleClass( 'current', add ).siblings().removeClass( 'current' );

                    $( this ).parents( '.popup_news-inner' )
                        .find( '.popup__more .news-inner__media-text' )
                        .remove();
                    $( this ).parents( '.popup_news-inner' )
                        .find( '.popup__more' )
                        .prepend( $( this ).find( '.current .news-inner__media-text' ).clone() );
                });

            }
        }, 100);
        hideScroll();
        $( '.popup_news-inner' ).fadeIn( 500 );
    });

    //// services
    $( '.service .btn_request' ).on( 'click', function( e ) {
        if($(this).is('button')){
            e.stopPropagation();
            e.preventDefault();
            var code = $(this).attr('bx-service');
            hideScroll();
            $('.bx_service_'+code).fadeIn(500);
        }
    });

    //// services-inner
    $( '.services-inner__btn' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();

        $( this ).find( '.services-inner__title' ).clone().appendTo( '.popup_services-inner .popup__content' );
        $( this ).find( '.services-inner__text' ).clone().appendTo( '.popup_services-inner .popup__content' );
        hideScroll();
        $( '.popup_services-inner' ).fadeIn( 500 );
    });

    //// resume
    $( '.btn_resume' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();
        hideScroll();
        $( '.popup_resume' ).fadeIn( 500 );
    });

    $( '.upload-link' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();

        $( this ).parent().find( 'input' ).click();
    });

    $( '.upload input' ).on( 'change', function( e ) {
        var file = $( this ).val();
        $( this ).parent().find( '.input-file' ).text( file );
    });

    //// media
    $( '.history__img, .history__video' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();

        var media = $( '<div>' ),
            itemIndex = $( this ).index();
        media.addClass( 'media-block' );

        $( this ).parents( '.history__media' )
            .find( '.history__img, .history__video' )
            .each( function( index, item ) {
                var cloneItem = $( item ).clone();

                if ( cloneItem.hasClass( 'history__video' ) ) {
                    cloneItem.find( '.item-video' ).removeAttr( 'style' );
                    cloneItem.find( 'img' ).remove();
                }

                if ( cloneItem.find( 'img' ).attr( 'data-src' ) ) {
                    cloneItem.find( 'img' ).attr( 'src', cloneItem.find( 'img' ).attr( 'data-src' ) );
                }

                cloneItem.children().clone().appendTo( media );
            });
        $( '.popup_media .popup__content' ).prepend( media );

        setTimeout( function() {
            var videoHeight = $( '.popup_media .popup__content' ).width() * 9 / 16;
            $( '.popup_media .popup__content' ).find( '.item-video' ).css( 'height', videoHeight );
            if ( $( '.media-block' ).children().length > 1 ) {
                var mediaBlock = $( '.media-block' );
                mediaBlock.owlCarousel({
                    loop: true,
                    nav: true,
                    dots: false,
                    navSpeed: 500,
                    autoHeight: true,
                    items: 1,
                    lazyLoad: true,
                    video: true,
                    videoHeight: videoHeight,
                    center: true,
                    navText: [
                        '<i class="icon-arrow-left"></i>',
                        '<i class="icon-arrow-right"></i>'
                    ],
                    responsive: {
                        0: {
                            nav: false
                        },
                        768:{
                            nav: true
                        }
                    }
                });

                mediaBlock.trigger( 'to.owl.carousel', [ itemIndex, 1, true ] );

            } else if ( $( '.media-block' ).children().length == 1 ) {
                var mediaBlock = $( '.media-block' );
                mediaBlock.owlCarousel({
                    loop: false,
                    nav: false,
                    dots: false,
                    autoHeight: true,
                    items: 1,
                    lazyLoad: true,
                    video: true,
                    videoHeight: videoHeight,
                    center: true
                });
            }
        }, 100);
        hideScroll();
        $( '.popup_media' ).fadeIn( 500 );
    });

    //// about video
    $( '.about-video' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();

        var media = $( '<div>' ),
            itemIndex = $( this ).parents( '[class^="col-"]').index();
        media.addClass( 'media-block' );

        $( '.about-video' ).each( function( index, item ) {
            var cloneItem = $( item ).clone();
            cloneItem.find( '.item-video' ).removeAttr( 'style' ).appendTo( media );
        });
        $( '.popup_media .popup__content' ).prepend( media );

        setTimeout( function() {
            var videoHeight = $( '.popup_media .popup__content' ).width() * 9 / 16;
            $( '.popup_media .popup__content' ).find( '.item-video' ).css( 'height', videoHeight );
            if ( $( '.media-block' ).children().length > 1 ) {
                var mediaBlock = $( '.media-block' );
                mediaBlock.owlCarousel({
                    loop: true,
                    nav: true,
                    dots: false,
                    navSpeed: 500,
                    autoHeight: true,
                    items: 1,
                    lazyLoad: true,
                    video: true,
                    videoHeight: videoHeight,
                    center: true,
                    navText: [
                        '<i class="icon-arrow-left"></i>',
                        '<i class="icon-arrow-right"></i>'
                    ],
                    responsive: {
                        0: {
                            nav: false
                        },
                        768:{
                            nav: true
                        }
                    }
                });

                mediaBlock.trigger( 'to.owl.carousel', [ itemIndex, 1, true ] );

            } else if ( $( '.media-block' ).children().length == 1 ) {
                var mediaBlock = $( '.media-block' );
                mediaBlock.owlCarousel({
                    loop: false,
                    nav: false,
                    dots: false,
                    autoHeight: true,
                    items: 1,
                    lazyLoad: true,
                    video: true,
                    videoHeight: videoHeight,
                    center: true
                });
            }
        }, 100);
        hideScroll();
        $( '.popup_media' ).fadeIn( 500 );
    });

    //// media video
    if ( $( '.item-video' ).length != 0 ) {
        $( '.item-video' ).each( function() {
            var self = $( this );
            if ( self.find( 'a' ).prop( 'href' ).indexOf( 'youtube.com' ) + 1 ) {
                console.log('youtube');
                self.append(
                    $( '<img>' )
                        .prop( 'src',
                        'https://img.youtube.com/vi/' +
                        self.find( 'a' ).prop( 'href' ).split( '?v=' )[1] +
                        '/hqdefault.jpg' )
                );

            } else if ( self.find( 'a' ).prop( 'href' ).indexOf( 'rutube.ru' ) + 1 ) {
                $(this).children('.newsletters__video-title').css('margin-top', '19%');

            } else if ( self.find( 'a' ).prop( 'href' ).indexOf( 'vimeo.com' ) + 1 ) {
                $.ajax({
                    type: 'GET',
                    url: 'http://vimeo.com/api/v2/video/' + self.find( 'a' ).prop( 'href' ).split( 'vimeo.com/index.html' )[1] + '.xml',
                    dataType: 'xml',
                    success: function (xml) {
                        self.append( $( '<img>' ).prop( 'src', $( xml ).find( 'thumbnail_large' ).text() ) );
                    }
                });
            }
        });
    }

    //// media webcam
    var idIntreval = false;
    /*$( '.btn-webcam' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();
        var id_cam = $(this).attr('data-cam');
        var id_el = $(this).attr('data-el');
        /*$.get('/wwwcams/cam00-x.php?camid='+id_cam+'&q=1&el='+id_el, function(data) {
            $('.popup_webcam img').attr('src','/wwwcams/cam00-x.php?camid='+id_cam+'&q=1&el='+id_el);
            $('.popup_webcam img').attr('data-cam',id_cam);
            idIntreval = setInterval('video_cam_show()', 1000);
        });*/
        /*
        $('.popup_webcam img').attr('src','/wwwcams/cam00-x.php?camid='+id_cam+'&q=1&el='+id_el);
        $('.popup_webcam img').attr('data-cam',id_cam);
        idIntreval = setInterval('video_cam_show()', 1000);
        $( '.popup_webcam' ).fadeIn( 500 );
    });*/

    $('.popup_webcam .popup__btn_close').on('click',function(){
        console.log(idIntreval);
        if(idIntreval)
            clearInterval(idIntreval);
        $('.popup_webcam img-wrap img').attr('src','');
    })

    $('.btn-webcam').on('click', function(e){
    	e.stopPropagation();
        e.preventDefault();
        var id_cam = $(this).attr('data-cam'),
        	id_el = $(this).attr('data-el');
        
        $('.popup__wait').show();
        $('.popup__more').hide();
            
        $.ajax({
        	method: 'POST',
        	url: '/ajax/getcam.php',
        	data: {'EL':id_el,'CAM':id_cam},
        	success: function(data){
        		$('.popup_webcam .img-wrap').html(data);
                $('.popup__wait').hide();
                $('.popup__more').show();
                
        		webCamCallback();
        	}
    	});
        
        $('.popup_webcam').fadeIn(200);
    });


    function webCamCallback(){
    	if($('#player').length > 0){
    		$('.popup__wrapper').css({'width':'640px'});
    		var url = $('#player').data('url');
    		$('#player').data('url','');
    		var player = new MJPEG.Player("player", url);
    	    player.start();
    	}
    	$('.popup_webcam .popup__btn_close, .popup__body').on('click',function(){
    		if(player){
    			player.stop();
    		}
    		 $('.popup_webcam').fadeOut(200);
    		 if($('.popup_webcam .img-wrap').length > 0){
	    		$('.popup_webcam .img-wrap').html('');
	    	}
	    });
    }

    // media gps
    $( '.service-gps .img-wrap' ).on( 'click', function( e ) {
        e.stopPropagation();
        e.preventDefault();

        var media = $( '<div>' ),
            itemIndex = $( this ).attr('data-item');
        media.addClass( 'media-block' );

        $( this ).parents( '.service-gps-row' )
            .find( '.service-gps .img-wrap' )
            .each( function( index, item ) {
                var cloneItem = $( item ).clone();

                if ( cloneItem.find( 'img' ).attr( 'data-src' ) ) {
                    cloneItem.find( 'img' ).attr( 'src', cloneItem.find( 'img' ).attr( 'data-src' ) );
                }

                cloneItem.children().clone().appendTo( media );
            });
        $( '.popup_media .popup__content' ).prepend( media );
        console.log(itemIndex);
        setTimeout( function() {
            if ( $( '.media-block' ).children().length > 1 ) {
                var mediaBlock = $( '.media-block' );
                mediaBlock.owlCarousel({
                    slideSpeed : 300,
                    paginationSpeed : 400,
                    singleItem:true,
                    loop: true,
                    nav: true,
                    dots: false,
                    autoHeight: true,
                    items: 1,
                    lazyLoad: false,
                    center: true,
                    navText: [
                        '<i class="icon-arrow-left"></i>',
                        '<i class="icon-arrow-right"></i>'
                    ],
                    responsive: {
                        0: {
                            nav: false
                        },
                        768:{
                            nav: true
                        }
                    }
                });

                mediaBlock.trigger( 'to.owl.carousel', [ itemIndex, 1, true ] );

            } else if ( $( '.media-block' ).children().length == 1 ) {
                var mediaBlock = $( '.media-block' );
                mediaBlock.owlCarousel({
                    loop: false,
                    nav: false,
                    dots: false,
                    autoHeight: true,
                    items: 1,
                    lazyLoad: true,
                    center: true
                });
            }
        },100);
        hideScroll();
        $( '.popup_media' ).fadeIn( 500 );
    });

    //// datepicker
    $( '.date' ).datepicker({
        showOn: 'button',
        buttonText: '',
        minDate: new Date(),
        beforeShow: function( input, inst ) {            
            var popupTop = 0,
                popupTopCSS = 0 || parseInt( $( this ).parents( '.popup__wrapper' ).css( 'top' ) ) - $( this ).parents( '.popup__wrapper' ).height() / 2;
            windowHeight = $( window ).height();
            inputTop = $( this ).offset().top,
                inputLeft = $( this ).offset().left;
            if ( $( this ).parents( '.popup__wrapper' ).offset() ) {
                popupTop = $( this ).parents( '.popup__wrapper' ).offset().top;
            }
            setTimeout( function() {
                if ( getWindowWidth() < 480 ) {
                    inst.dpDiv.css({
                        top: 15,
                        left: 15
                    });
                } else if ( getWindowWidth() < 768 ) {
                    inst.dpDiv.css({
                        top: inputTop - popupTop,
                        left: inputLeft - 50 + 'px'
                    });
                } else {
                    inst.dpDiv.css({
                        top: popupTopCSS + inputTop - popupTop,
                        left: inputLeft - 50 + 'px'
                    });
                }
                if ( inputTop - popupTop + 200 > windowHeight ) {
                    if ( getWindowWidth() < 480 ) {
                        inst.dpDiv.css({
                            top: 15,
                            left: 15
                        });
                    } else {
                        inst.dpDiv.css({
                            top: 30,
                            left: 30
                        });
                    }
                }
            }, 100);
        },
        beforeShowDay: checkUnavailableDates
    });

    // Поиск в меню моб. версии
    function searchInMenu() {
        if ( !$( 'nav.main ul li' ).last().hasClass( 'nav-search' ) ) {
            $( 'nav.main ul' ).append( $( '<li>' ).addClass( 'nav-search' ) );
            $( 'nav.main ul li' ).last().append( $( '.search' ).clone() );
        }
    }

    // Инициализация выпадающего списка
    function selectInit() {
        var select = $( '.select' );
        select.each( function() {
            var items = $( this ).find( '.select__list li' ),
                active = items.siblings( '.active' ).text(),
                first = items.first().text(),
                selected;

            if ( active ) {
                selected = active;
            } else {
                selected = first;
                items.first().addClass( 'active' );
            }

            $( this ).find( '.select__selected span' ).first().text( selected );
            $( this ).find( 'input' ).first().val( selected );
        });
    }

    function parentsSliderInit() {
        var partners = $( '.partners' ),
            partnersItems = partners.children().length;

        if ( partnersItems > 5 ) {
            objectConstruct = {
                loop: true,
                nav: true,
                dots: true,
                navSpeed: 500,
                lazyLoad: true,
                center: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    480: {
                        items: 2
                    },
                    768: {
                        items: 3
                    },
                    1024:{
                        items: 4
                    },
                    1200: {
                        items: 5
                    }
                }
            };
        } else {
            objectConstruct = {
                items: partnersItems,
                navSpeed: 500,
                lazyLoad: true,
                responsive: {
                    0: {
                        items: Math.min( 1, partnersItems ),
                        loop: true,
                        nav: true,
                        dots: true
                    },
                    480: {
                        items: Math.min( 2, partnersItems ),
                        loop: partnersItems > 2,
                        nav: partnersItems > 2,
                        dots: partnersItems > 2
                    },
                    768: {
                        items: Math.min( 3, partnersItems ),
                        loop: partnersItems > 3,
                        nav: partnersItems > 3,
                        dots: partnersItems > 3
                    },
                    1024:{
                        items: Math.min( 4, partnersItems ),
                        loop: partnersItems > 4,
                        nav: partnersItems > 4,
                        dots: partnersItems > 4
                    },
                    1200: {
                        items: Math.min( 5, partnersItems ),
                        loop: false,
                        nav: false,
                        dots: false
                    }
                }
            };
        }
        if(configPartnerSlider){ //объявлется глобальным объектом на главной странице
            if(configPartnerSlider.autoPlayTimeoutMain){
                objectConstruct.autoplay = true;
                objectConstruct.autoplayHoverPause = true;
                objectConstruct.autoplayTimeout = configPartnerSlider.autoPlayTimeoutMain;
            }
        }
        partners.owlCarousel(objectConstruct);
    }

    // Получить шурину окна
    function getWindowWidth() {
        var width;
        $( 'html' ).css( 'overflow', 'hidden' );
        width = +$( 'html' ).width();
        $( 'html' ).css( 'overflow', 'visible' );
        $( 'html' ).removeAttr( 'style' );
        return width;
    }

    // Иницилизация форм
    function formInit() {
        $( 'form.form' ).each( function() {
            if ( $( this ).find( 'input[type="checkbox"]' ).first().prop( 'checked' ) ) {
                $( this ).find( '.btn' ).first().prop( 'disabled', false );
            } else {
                $( this ).find( '.btn' ).first().prop( 'disabled', true );
            }
        });
    }

    // Расчет позиции background-position-x для слайдера на главной
    function setSliderBgPosition ( bgWidth ) {
        $( '.buildings' ).css( 'backgroundPosition', ( $( window ).width() - bgWidth ) / 2 -  $( window ).scrollTop() / 4 + 'px 0' );
    }
    function hideScroll () {
        $( 'html' ).css({
            'overflow': 'hidden',
            'paddingRight': getWindowWidth() - $('html').width()
        });
    }

    document.oncopy = function() {
        if(window.location.pathname.indexOf('press-tsentr') != -1 ) {
            var body_element = document.getElementsByTagName('body')[0];
            var selection = window.getSelection();
            console.log(selection.toString());
            var selectionString = selection.toString();
            var index = selectionString.indexOf('See more at');
            if (index > 2)
                selectionString = selectionString.substring(0, index - 3);

            // Вы можете selection текст в этой строчке
            var pagelink = selectionString + "... Читайте далее " + window.location.href;

            var copytext = pagelink;
            var newdiv = document.createElement('div');
            newdiv.style.position = 'absolute';
            newdiv.style.left = '-99999px';
            body_element.appendChild(newdiv);
            newdiv.innerHTML = copytext;
            selection.selectAllChildren(newdiv);
            window.setTimeout(function () {
                body_element.removeChild(newdiv);
            }, 0);
        }
    };
});

// Русификация календаря
$(function($){
    $.datepicker.regional['ru'] = {
        closeText: 'Закрыть',
        prevText: '&#x3c; Пред',
        nextText: 'След &#x3e;',
        currentText: 'Сегодня',
        monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
            'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
            'Июл','Авг','Сен','Окт','Ноя','Дек'],
        dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
        dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
        dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
        weekHeader: 'Не',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''};
    $.datepicker.setDefaults($.datepicker.regional['ru']);
});

// Установка дат, в которые невозможен приема
var $unavailableDates = new Array();

function setUnavailableDates( unavailableDates ) {
    return $unavailableDates = unavailableDates;
}

function checkUnavailableDates( allDate ) {
    var $return = true,
        $returnClass = 'available',
        today = new Date();

    $checkDate = $.datepicker.formatDate('dd.mm.yy', allDate);

    for ( var i = 0; i < $unavailableDates.length; i++ )
    {

        if ( $unavailableDates[i] == $checkDate ||
            ( allDate.getYear() <= today.getYear() && allDate.getMonth() <= today.getMonth() && allDate.getDate() < today.getDate()) ||
            allDate.getDay() == 0 ) {
            $return = false;
            $returnClass = 'unavailable';
        }
    }
    return [ $return, $returnClass ];
}

function removeParameter(url, parameter)
{
    var urlparts= url.split('?');

    if (urlparts.length>=2)
    {
        var urlBase=urlparts.shift(); //get first part, and remove from array
        var queryString=urlparts.join("?"); //join it back up

        var prefix = encodeURIComponent(parameter)+'=';
        var pars = queryString.split(/[&;]/g);
        for (var i= pars.length; i-->0;)               //reverse iteration as may be destructive
            if (pars[i].lastIndexOf(prefix, 0)!==-1)   //idiom for string.startsWith
                pars.splice(i, 1);
        url = urlBase+'?'+pars.join('&');
    }
    return url;
}
function insertParam(key, value)
{
    key = escape(key); value = escape(value);

    var kvp = document.location.search.substr(1).split('&');

    var i=kvp.length; var x; while(i--)
{
    x = kvp[i].split('=');

    if (x[0]==key)
    {
        x[1] = value;
        kvp[i] = x.join('=');
        break;
    }
}

    if(i<0) {kvp[kvp.length] = [key,value].join('=');}

    //this will reload the page, it's likely better to store this until finished
    return kvp.join('&');
}

function video_cam_show()
{
    $('.popup_webcam img').each(function(){
        var src = $(this).attr('src');
        //$(this).attr('src', (src.substr(0, src.indexOf('?')) + '?q=2' + Math.floor(Math.random()*1001)));
        $(this).attr('src', removeParameter(src, 'q') + insertParam('q', Math.floor(Math.random()*1001)));
    });
    return false;

}

$(function(){
 $formBlock = $('.online-request-form');
 var windowMarginTop = 0;
 var itemMarginTop = 0;
 if($formBlock.length)itemMarginTop = $formBlock.offset().top;
 var formH = $formBlock.height();
 //isFormOnScreen($formBlock);

 // function isFormOnScreen(form){
 //    if($formBlock.length){
 //     windowMarginTop = $(this).scrollTop();
 //     if (windowMarginTop +80 > itemMarginTop && windowMarginTop < (itemMarginTop+formH)) {
 //       if(location.hash != "#form") changeHash("#form");
 //    }
 //     else changeHash("");
 //  }
 // }

// function changeHash(str){
//     if (str != "") {
//         if(history.pushState) history.pushState(null, null, str);
//             else location.hash = str;
//     }
//
// }
//     $(window).scroll(function () {
//        isFormOnScreen($formBlock);
//     });
});

$(document).ready(function() {
    $('.js-tooltip').powerTip({
        followMouse: true, 
        offset: 20
    });
});
