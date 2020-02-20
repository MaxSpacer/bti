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
