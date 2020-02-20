
; /* Start:"a:4:{s:4:"full";s:88:"/local/components/maximaster/widget.callback/templates/.default/script.js?15795228563398";s:6:"source";s:73:"/local/components/maximaster/widget.callback/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/

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

/* End */
;
; /* Start:"a:4:{s:4:"full";s:43:"/local/js/prover-document.js?15553381244190";s:6:"source";s:28:"/local/js/prover-document.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
let documentChecker = {
    init : function() {
        this.$answerContainer = $('#contract_data');

        $(document).on('keyup', '.js-code-input', function() {
            var $this = $(this);
            var val = $this.val();
            var lastInt = parseInt(val.slice(-1));

            if (isNaN(lastInt)) {
                $this.val(val.substr(0, val.length - 1));
            } else if (val.length === 3) {
                switch (this.name) {
                    case 'part1':
                        $('.js-code-input[name=part2]').first().focus();
                        break;
                    case 'part2':
                        $('.js-code-input[name=part3]').first().focus();
                        break;
                    case 'part3':
                        $('.js-code-input[name=part4]').first().focus();
                        break;
                    case 'part4':
                        $('.js-check-document-submit').first().focus();
                        break;
                }
            }
        });

        $(document).on('click', '.js-check-document-submit', this.checkCode.bind(this));
    },

    concat: function () {
        var res = [];

        $('.js-code-input').each(function () {
            res.push(this.value);
        });

        return res.join('');
    },

    checkCode : function () {
        var code = this.concat();
        var context = this;
        $.ajax({
            url: '/payment/captcha.php',
            method: 'post',
            data: 'code=' + code,
            success: function (response) {
                if (response == '1') {
                    context.dbCheck(code);
                } else {
                    context.showError('Проверка &laquo;Я не робот&raquo; не пройдена.');
                }
            }
        })
    },


    dbCheck: function (code) {
        this.showLoading();
        $.ajax({
            url: '/payment/checkDocument.php',
            method: 'post',
            data: {'code' : code},
            dataType: 'json',
            success: this.showResponse.bind(this)
        });
    },

    showResponse : function(response) {

        if (response['STATUS']) {
            this.showSuccess(response['ObjectAdress']);
        } else {
            switch (response['ERROR_MESSAGE_CODE']) {
                case 'DOCUMENT_DOESNT_EXIST':
                    this.showError('Документ  не выдавался');
                    break;
                case 'EMPTY_FIELDS':
                    this.showError('Необходимо ввести проверочный код!');
                    break;
                case 'INVALID_CODE_LENGTH':
                    this.showError('Проверочный код должен состоять из 12 цифр!');
                    break;
                case 'FIELDS_NOT_CORRECT':
                    this.showError('Поле заполнено некорректно!');
                    break;
                case 'DB_QUERY_ERROR':
                    this.showError('Обнаружена внутренняя ошибка системы. Просим прощения за доставленные неудобства.');
                    break;
                default:
                    this.showError('Обнаружена неизвестная ошибка. Просим прощения за доставленные неудобства.');
            }
        }

    },

    showSuccess : function(adress)
    {
        this.$answerContainer.html('<div style="color: #00a650;">Документ выдавался на объект недвижимости, расположенный по адресу: <strong>' + adress + '</strong></div>');
        $('.easy_paydata').show("slow");
    },

    showError : function(error) {
        this.$answerContainer.html(`<div style='color: #DC1E42;'>${error}</div>`);
        $('.easy_paydata').show("slow");
    },

    showLoading : function() {
        this.$answerContainer.html('Загрузка...');
        $('.easy_paydata').show("slow");
    }
};


$(function() {
    documentChecker.init();
});

/* End */
;; /* /local/components/maximaster/widget.callback/templates/.default/script.js?15795228563398*/
; /* /local/js/prover-document.js?15553381244190*/
