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

window.onload = function() {
    setTimeout(() => {
        let ad_flag = false;
        $('ins.adsbygoogle').each(function(){
            if ($(this).data('ad-status')) {
                if ($(this).data('ad-status') == 'unfilled') {
                    $(this).closest('.card').remove();
                }
                ad_flag = true;
            } else {
                $(this).closest('.card').remove();
            }
        });

        if (ad_flag) {
            console.info('嗨！我是健忘工程師～');
            console.info('你在看網站的架構嗎？有甚麼問題或建議歡迎跟我說唷！');
            console.info('非常感謝你沒有使用 Adblock (廣告阻擋器) (*´▽`*)');
            console.info('(ㅅ˘ㅂ˘) 祝福你事事順心，都不會遇到 bug');
        } else {
            console.warn('嗨！我是健忘工程師～');
            console.warn('你在看網站的架構嗎？有甚麼問題或建議歡迎跟我說唷！');
            console.warn('(／‵Д′)／~ ╧╧ 你是不是有使用 Adblock (廣告阻擋器)');
            console.warn('如果我的筆記對你有一點點幫助的話就幫我關掉吧～求求你了(╥﹏╥)');
            console.warn('如果你關閉 Adblock (廣告阻擋器)，我會非常感謝你的(*´▽`*)');
        }
    }, 5000)
};
