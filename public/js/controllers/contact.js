/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function() {

    // Add and remove some class to improve layout when logged in
    $("#contactMessage").removeClass("pull-right");
    $("#contactAddress").addClass("text-center");

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