/* eslint-disable node/no-unsupported-features/node-builtins */
(function($, moment, ClipboardJS, config) {
    // 複製文章連結
    new ClipboardJS('#share');

    // 複製完成提示
    $(document).on('click', '.copy', function () {
        let copied = $('.notification');
        copied.animate({
            bottom: "2%",
        }, 500);

        setTimeout(() => {
            copied.animate({
                bottom: "-15%",
            }, 1000);
        }, 1500);
    });

    // 點擊 navbar burger icon
    $(".navbar-burger").click(function() {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger, .navbar-menu").toggleClass("is-active");
    });

    // navbar 伸縮選單狀態 (觸控裝置)
    if ($(window).width() < 1088) {
        // 點擊 navbar 內層的選單
        $(".navbar-item.has-dropdown").click(function() {
            $(this).find('.navbar-dropdown').toggle('normal');
            $(this).find('.navbar-link:not(.is-arrowless)').toggleClass('dropdown-icon-rotate');
        });
    } else { // navbar 正常狀態 (寬螢幕)
        $(".navbar-item.has-dropdown").hover(function() {
            $(this).find('.navbar-link:not(.is-arrowless)').toggleClass('dropdown-icon-rotate');
        })
    }

    $(document).on('keydown', (event) => {
        if (event.key === "Escape") {
            $('.searchbox').removeClass('show');
        }
    });
}(jQuery, window.moment, window.ClipboardJS, window.IcarusThemeSettings));
