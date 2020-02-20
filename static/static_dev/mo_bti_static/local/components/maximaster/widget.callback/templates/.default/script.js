
// Скрываем всплывашку при клике вне ее
$(document).on('click', function(e) {
    var $popups = $('.js-callback-block-form.callback-block-form--visible');
    $popups.each(function () {
        var $popup = $(this);
        if (!$popup.is(e.target) && !$popup.has(e.target).length) {
            var $block = $popup.closest('.js-callback-block');
            var $button = $block.find('.js-callback-block__button');

            $popup.removeClass('callback-block-form--visible');
            $button.removeClass('callback-block__button--close');

            if (!$button.data('callback_disabled')) {
                $button.addClass('callback-block__button--ringing');
            }
        }
    });
});

// Показываем всплывашку при клике по кнопке
$(document).on('click', '.callback-block__button', function(e) {
    var $button = $(this);
    var $block = $button.closest('.js-callback-block');
    var $popup = $block.find('.js-callback-block-form');

    if (!$popup.hasClass('callback-block-form--visible')) {
        $popup.addClass('callback-block-form--visible');
        $button.addClass('callback-block__button--close');
        $button.removeClass('callback-block__button--ringing');

        e.preventDefault();
        e.stopPropagation();
    }
});

// Валидация инпута ввода емейла
$(document).on('keyup', '.js-callback-block-form input[type="email"]', function(e) {
    var input = this;
    var $input = $(input);
    var $group = $input.parents('.form-group');

    var value = $input.val();
    var success = !!value.match(/^[^@\s]+@[^@\s]+\.[^@.\s]+$/);

    if (success) {
        $group.addClass('has-success');
    } else {
        $group.removeClass('has-success');
    }
});

$(document).on('submit', '.js-callback-block-form form', function(e) {
    e.preventDefault();

    var form = this;
    var $form = $(form);
    var url = $form.data('ajax-path');

    // Ранняя версия query, подключенная на основном сайте не поддерживает передачу FormData
    // var formData = new FormData(form);
    var formData = $form.serializeArray();

    var $popup = $form.closest('.js-callback-block-form');
    var $content = $popup.find('.js-callback-block-form__content');
    var $block = $popup.closest('.js-callback-block');
    var $button = $block.find('.js-callback-block__button');
    
    // Инпут ввода номера телефона
    var $phoneInput = $('#inp_phone', $form);
    var $phoneGroup = $phoneInput.parents('.form-group');
    var $phoneSuccess = $phoneGroup.hasClass('has-success');

    // Инпут ввода электронной почты
    var $emailInput = $('input[type="email"]', $form);
    var $emailGroup = $emailInput.parents('.form-group');
    var $emailSuccess = $emailGroup.hasClass('has-success');

    //console.log(url);
    //console.log(formData);

    if ($phoneSuccess || $emailSuccess) {
        $.ajax({
            url: url,
            method: 'POST',
            data: formData,
            success: function (result) {

                //console.log(result);

                var response = JSON.parse(result);
                $content.html(response.message);
                $button.data('callback_disabled', true);
            }
        });
    }
});
