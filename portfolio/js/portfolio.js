// jQuery scrolling
$(function() {
    $('a[href*="#"]').click(function(event) {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && 
        location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top
            }, Math.abs(window.scrollY - target.offset().top)/2);
            // event.preventDefault();
        }
    }
    });
});
