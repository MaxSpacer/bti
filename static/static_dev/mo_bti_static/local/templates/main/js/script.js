$( function() {
// Скрыть/открыть вопрос
    $(document).on('click', '.answers__item', function (e) {
        e.stopPropagation();
        e.preventDefault();
        if ($(this).hasClass('opened')) {
            $(this).find('.answers__item-text').stop(true, false).slideUp(300);
        } else {
            $(this).find('.answers__item-text').stop(true, false).slideDown(300);
        }
        $(this).toggleClass('opened');
    });

    $('.bx-send-resume').on('click', function () {
        $('#bx_from_resume input[name=vac]').val($(this).next().val());
    })
});