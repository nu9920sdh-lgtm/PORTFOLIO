/* news단 반응형 */
function toggleNewsOwl() {
    const winW = window.innerWidth;   // 스크롤바 포함 실제 브라우저 폭
    const $news = $('.news_contents');

    if (winW <= 1024) {
        if (!$news.hasClass('owl-loaded')) {
            $news.addClass('owl-carousel owl-theme');
            $news.owlCarousel({
                items: 1,
                loop: true,
                margin: 16,
                dots: false,
                nav: false,
                responsive: {
                    0: { items: 1.2 },
                    480: { items: 1.6 },
                    600: { items: 2.1 },
                    800: { items: 2.2 }
                }
            });
        }
    } else {
        if ($news.hasClass('owl-loaded')) {
            $news.trigger('destroy.owl.carousel'); //구조복원
            $news.removeClass('owl-carousel owl-theme');
            $news.find('.owl-stage-outer').children().unwrap();
            $news.removeClass("owl-center owl-loaded owl-text-select-on");
        }
    }
}

// 최초 로드시
$(document).ready(function () {
    toggleNewsOwl();
});

// 리사이즈 시
$(window).on('resize orientationchange', function () {
    toggleNewsOwl();
});