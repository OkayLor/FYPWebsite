// Smooth scrolling for anchor links
$(document).ready(function () {
    $('a[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });
});

//Toggle the navbar collapse on mobile devices
$(document).ready(function () {
    $(".navbar-toggler").click(function () {
        $("#navbarNav").collapse("toggle");
    });
});

//Scroll animation
document.addEventListener("DOMContentLoaded", function () {
    var scrollAnimations = document.querySelectorAll(".scroll-animation");

    function checkScroll() {
        var windowHeight = window.innerHeight;

        for (var i = 0; i < scrollAnimations.length; i++) {
            var scrollAnimation = scrollAnimations[i];
            var scrollAnimationTop = scrollAnimation.getBoundingClientRect().top;

            if (scrollAnimationTop < windowHeight * 0.8) {
                scrollAnimation.classList.add("visible");
            }
        }
    }

    window.addEventListener("scroll", checkScroll);
});

// Activate Bootstrap tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

// Activate Bootstrap popovers
$(function () {
    $('[data-toggle="popover"]').popover();
});



