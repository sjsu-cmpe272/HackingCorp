/**
 * Created by Carlos on 11/11/15.
 */
var centralSpinner;  // Global Variable to store the spinner element

jQuery(function($) {'use strict';
    //Responsive Nav
    $('li.dropdown').find('.fa-angle-down').each(function(){
        $(this).on('click', function(){
            if( $(window).width() < 768 ) {
                $(this).parent().next().slideToggle();
            }
            return false;
        });
    });

    //Fit Vids
    if( $('#video-container').length ) {
        $("#video-container").fitVids();
    }

    //Initiat WOW JS
    new WOW().init();

    // portfolio filter
    $(window).load(function(){

        $('.main-slider').addClass('animate-in');
        $('.preloader').remove();
        //End Preloader

        if( $('.masonery_area').length ) {
            $('.masonery_area').masonry();//Masonry
        }

        var $portfolio_selectors = $('.portfolio-filter >li>a');

        if($portfolio_selectors.length) {

            var $portfolio = $('.portfolio-items');
            $portfolio.isotope({
                itemSelector : '.portfolio-item',
                layoutMode : 'fitRows'
            });

            $portfolio_selectors.on('click', function(){
                $portfolio_selectors.removeClass('active');
                $(this).addClass('active');
                var selector = $(this).attr('data-filter');
                $portfolio.isotope({ filter: selector });
                return false;
            });
        }

    });

    $('.timer').each(count);
    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }

    // Search
    $('.fa-search').on('click', function() {
        $('.field-toggle').fadeToggle(200);
    });

    // Contact form
    var form = $('#main-contact-form');
    form.submit(function(event){
        event.preventDefault();
        var form_status = $('<div class="form_status"></div>');
        var url = $(this).attr('action');

        // Validate form before sending
        if((!$(this).find("div").hasClass("has-error")) && $(this).validationEngine('validate') ) {

            form.prepend(form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn());

            $.post($(this).attr('action'), $(this).serialize())
                .done(function (data) {
                    form_status.html('<p class="text-success">Thank you for contacting us; We will reply as soon as possible.</p>').delay(3000).fadeOut();
                    $(form)[0].reset();    // Reset form for eventual re-use
                })
                .fail(function () {
                    form_status.html('<p class="text-success">An error has occurred... Please Try Again!</p>').delay(3000).fadeOut();
                });
        }
    });
    // Progress Bar
    $.each($('div.progress-bar'),function(){
        $(this).css('width', $(this).attr('data-transition')+'%');
    });
});

/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function(){
    // Remove the Facebook appended hash on callback after Facebook login
    removeFacebookAppendedHash();

    centralSpinner = initializeSpinner();

    // Assign jQuery Form Validation Engine to Forms (Sign Up and Login)
    $("#main-contact-form").validationEngine('attach', {promptPosition : "topRight", scroll: false, showOneMessage:false, binded:false});

    /* Redirect to Linkedin
    $("a.redirect").click(function(e){
        e.preventDefault();
        var url = $(this).attr('href');
        window.open(url,'_blank');
        return;
    });*/

    // Function to make menu active
    $(".menu").click(function(e){
        $(".menu").removeClass("active");
        $(this).addClass("active");
    })

    $("a").click(function (event) {

        // Check if the user clicked a social network link; if social network
        // follow link, if Not: execute function 'getClickedLink'
        var result = $(this).hasClass("socialLink");
        if(!$(this).hasClass("socialLink")) {
            getClickedLink(this, event); // 'this' = clicked link ; 'event'= click
        }
    });

    if(loggedUser != "Guest"){
        // Hide Promotional Elements
        hidePromotionalElements();

        /*
        if(!$('#newGTLoad').is(':visible')) {
            // Show Modal with Spinner
            $("#newGTLoad").modal("show");
        };
        */
        showCentralSpinnerWithBackground(false);

        // Load newGT
        $.get('/newgt', function (data) {
            if (data) {
                //$("#newGTLoad").modal("hide");// Hide Modal with Spinner
                hideCentralSpinner();
                $("#contentData").html(data);
            } else {

            }
        });
    }

    $("#showe").click(function(){
        var part1, part2, part3;
        part1 = "info";
        part2 = "goodjar";
        part3 = "us";
        $(this).html(part1+'@'+part2+'.'+part3);
    });

    $("#showp").click(function(){
        var part1, part2, part3;
        part1 = "(787";
        part2 = ") 246";
        part3 = "9293";
        $(this).html(part1+part2+'-'+part3);
    });
});

/* Functions
 ------------------------------------------------------------ */
// load PekeUpload
function initializePekeUpload(options){

    if(options.reset) {
        $(".pkrw").remove();
        $(".pkuparea").remove();
        $(".pekecontainer").remove();
        $('#file').attr('type', 'file');    // Change Attribute back to 'file'
        $('#file').val("");                 // Erase value to accept new filename.
        $("#file, #fileUser").pekeUpload({reset: true});
    } else {
        $("#file, #fileUser").pekeUpload({reset: false});
    }
}

/* Hide Promotional Elements
 ------------------------------------------------------------ */
function hidePromotionalElements() {
    $("#services, #home-slider, #action, #features, #clients, #testers, #membership, #footer").slideUp(500, function() {
        $(this).remove();
    });
}

/* Scroll to 'Clicked Element'
 ------------------------------------------------------------ */
function scrollToId (id) {
    $('html, body').animate({
        scrollTop: $(id).offset().top
    }, 2000);
}

/* Function to get initial product data 'initialContent.html'
 ------------------------------------------------------------ */
function loadInitialContect() {
    $.get('/initialProducts', function(data) {
        if(data){
            $('#contentData').empty();  //Empty div 'contentData' from any previous code
            $('#contentData').html(data);   //Render new data on contentData section
        }
    });
}

function getClickedLink (link, event, urlPassed, callback){
    event.preventDefault();

    var url;

    if(urlPassed) url = urlPassed;
    else url = $(link).attr('href');

    // Verify what kind of address was received: if '#' = Scroll, if '/' = route
    if(!url.match(/^#/)) {

        showCentralSpinnerWithBackground(false);

        // Verify if user clicked '/' to redirect
        if(url == '/') $(location).attr('href','/');

        $.get(url, function (data) {
            if (data != "logged_out") {
                if(url == '/login') {           // If the user wants to Login - Insert in Login modal Section
                    // Hide Central Spinner
                    hideCentralSpinner();

                    //Render new data on contentData section
                    $('#loginData').html(data);

                } else {                        // else, insert in Content Data Section.
                    hideCentralSpinner();

                    //Render new data on contentData section
                    $('#contentData').html(data);

                    // verify if a callback was provided
                    if(callback)
                        callback(data);
                }
            } else {
                $(location).attr('href', '/');  // Redirect after logout to the main page '/'
            }
        });
    } else {
        scrollToId(url);  // if not a route or post - scroll to section id
    }
}

function updateUserPhoto (filename){
    var areInUserProfile = $("#applicationID").val();
    if(areInUserProfile) {
        $.post('/userPhoto', {filename: filename}, function (data) {
            if (data) {
                $("#loadTesterInfo, #loadProviderInfo").html(data);
            }
        });
    } else {
        $(".file").val(filename);
    }
}

// Remove the ugly Facebook appended hash
// <https://github.com/jaredhanson/passport-facebook/issues/12>
function removeFacebookAppendedHash() {
    if (!window.location.hash || window.location.hash !== '#_=_')
        return;
    if (window.history && window.history.replaceState)
        return window.history.replaceState("", document.title, window.location.pathname);
    // Prevent scrolling by storing the page's current scroll offset
    var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
    };
    window.location.hash = "";
    // Restore the scroll offset, should be flicker free
    document.body.scrollTop = scroll.top;
    document.body.scrollLeft = scroll.left;
};

function fileChanged(imageName){
    // Show Thumbnail of new uploaded photo and hide Media upload (pekeupload)
    var newSrc = $("img.thumbnail").attr('src');
    $(".media").attr('src',newSrc);
    $("#mediaUpload").hide("slow");
}
function initializeSpinner(){
    var target = document.getElementById('spinner-center');
    var spinVar = new Spinner({
        lines: 13 // The number of lines to draw
        , length: 15 // The length of each line
        , width: 10 // The line thickness
        , radius: 25 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#fff' // #rgb or #rrggbb or array of colors
        , opacity: 0 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 2 // Rounds per second
        , trail: 80 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '48%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    }).spin(target);

    return spinVar;
}

function  showCentralSpinnerWithBackground(background) {
    $('#spinner-center').show();
    if(background){
        var colr = centralSpinner.opts.color;
        centralSpinner.opts.color = '#fff';
        $('#spinner').show();
    } else {
        var colr = centralSpinner.opts.color;

        // change spinner color to lightred
        centralSpinner.opts.color = '#D95260';
    }
}

function  hideCentralSpinner() {
    $('#spinner').hide();
    $('#spinner-center').hide();
}