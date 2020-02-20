
; /* Start:"a:4:{s:4:"full";s:93:"/local/components/maximaster/select.country.codes/templates/callback/script.js?15795228563079";s:6:"source";s:78:"/local/components/maximaster/select.country.codes/templates/callback/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
/**
 * Изменение поле телефон
 * @param selector
 * @param event
 */
function validatePhone(selector, event)
{
    // console.log(selector.val(), selector.mask());

    // Может ли поле быть пустым не вызывая при этом ошибку
    var canEmpty = selector.data('can-empty') === true;
    var group = selector.parents(".form-group");

    if (group.hasClass('has-success')) {
        if (event.keyCode == 8) {
            group.removeClass('has-success');
            !canEmpty && group.addClass('has-error');
        }
    } else {
        group.removeClass('has-success');
        !canEmpty && group.addClass('has-error');
    }
}

function setMaskForPhone()
{
    var selector = $("#inp_phone");
    var countryCode = selector.data("code");

    selector.mask("+" + countryCode + " (999) 999-99-99", {
        completed: function () {
            var group = selector.parents(".form-group");
            group.addClass('has-success');
            group.removeClass('has-error');
        }
    });
}

$(document).ready(function() {
    // скрываем блок, если он виден и кликаем не блока
    $(document).on("click", function (event) {
        var display = $('.js-countriesList').css("display");

        if (display == "block") {
            if ($(event.target).closest(".phone-wrapper").length === 0) {
                $('.js-countriesList').slideUp("normal");
            }
        }
    });

    // раскрывающийся список с кодами телефонов стран
    $('body').on("click", '.js-phone-wrapper__county-flag', function () {
        $('.js-countriesList').stop(true).slideToggle('medium');
        $("#inp_phone").focus();
    }).on("click", ".js-code-county", function () {
        var
            code = $(this).data("code"),
            imgSrc = $(this).data("img-src");

        // делаем так для того, чтобы можно было вывести 9-ку у кода страны
        $.mask.definitions['9'] = '';
        $.mask.definitions['n'] = '[0-9]';

        var selector = $("#inp_phone");
        var group = selector.parents(".form-group");

        selector.val("").mask("+" + code + " (nnn) nnn-nn-nn", {
            completed: function () {
                group.addClass('has-success');
                group.removeClass('has-error');
            }
        }).focus().attr("data-code", code);

        $(".js-office-country-code").val(code);
        $(".js-office-country-flag").val(imgSrc);

        // меняем флаг
        $('.js-flag-county').attr("src", imgSrc);

        $('.js-countriesList').slideUp("normal");
    });

    $(document).on('keydown', '#inp_phone', function () {
        if ($('.js-countriesList').css("display") == "block") {
            $('.js-countriesList').slideUp("normal");
        }

        validatePhone($("#inp_phone"), event);
    });

    setMaskForPhone();
    BX.addCustomEvent("onFrameDataReceived", function(json) {
        setMaskForPhone();
    });
});
/* End */
;; /* /local/components/maximaster/select.country.codes/templates/callback/script.js?15795228563079*/
