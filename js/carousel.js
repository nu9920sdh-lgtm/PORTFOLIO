$(document).ready(function() {

    var $proj = $('.projects-carousel');
    var isSyncingProject = false;

    function getRealProjectIndex(event) {
        var carousel = event.relatedTarget;
        var count = event.item.count;
        var index = event.item.index - carousel._clones.length / 2;

        index = index % count;
        if (index < 0) {
            index += count;
        }

        return index;
    }

    window.syncProjectsCarousel = function(index) {
        if (!$proj.length) {
            return;
        }

        isSyncingProject = true;
        $proj.trigger('to.owl.carousel', [index, 300, true]);

        window.setTimeout(function() {
            isSyncingProject = false;
        }, 350);
    };

    $proj.owlCarousel({
        center: true,
        autoWidth: true,
        margin: 30,
        loop: true,
        dots: true,
        nav: true,
        navText: ['<img src="images/owl_prev.png" alt="prev">', '<img src="images/owl_next.png" alt="next">'],
    });

    $proj.on('changed.owl.carousel translated.owl.carousel', function(event) {
        if (isSyncingProject || !event.item || !window.updateProjectDetail) {
            return;
        }

        var projectIndex = getRealProjectIndex(event);
        if (window.getCurrentProjectDetailIndex && window.getCurrentProjectDetailIndex() === projectIndex) {
            return;
        }

        window.updateProjectDetail(projectIndex);
    });

        var owl = $('.people_contents');
    owl.owlCarousel({
        margin: 0,
        items: 2, center: true,
        loop: true,
        dots: false,
        nav: true,
        navText: ["<div class='nav-btn prev-slide'></div>", "<div class='nav-btn next-slide'></div>"],
    })
});
