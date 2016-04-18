var spinner = "<i class='fa fa-spinner fa-pulse fa-lg'></i>";
var confirmPressed = false;
/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function() {
    /*  Initialize Elements
     _____________________________________________ */
    $(".panel-footer").hide();
    $(".panel").hover(function() {
            $(this).removeClass('footermarginbottom');
            $(this).removeClass('footermarginbottom');
            $(this).find("div.panel-footer").show();
        }, function() {
            $(this).addClass('footermarginbottom');
            $(this).find("div.panel-footer").hide();
        }
    );

    // On click of Delete GT Note
    $('#confirm-delete').on('show.bs.modal', function(e) {
        $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
        var neew = $(this).find('.btn-ok').attr('type', $(e.relatedTarget).data('short'));

        $('.debug-url').html($(this).find('.btn-ok').attr('type'));

    });

    $('#confirm-delete').on('hidden.bs.modal', function(e) {
        if(confirmPressed){
            /*
            if(!$('#newGTLoad').is(':visible')) {
                // Show Modal with Spinner
                $("#newGTLoad").modal("show");
            }
            */
            showCentralSpinnerWithBackground(true);
        }
    });

    // If Deletion of GT Note is Confirmed by user
    $('.btn-default').on('click', function(e) {
        // Set Flag of what button was pressed
        confirmPressed = false;
    });

    // If Deletion of GT Note is Confirmed by user
    $('.btn-ok').on('click', function(e) {
        e.preventDefault();

        // HTML for Spinner
        var spinner =  "<strong><i class='fa fa-spinner fa-pulse fa-lg'></i></strong>";

        // Show Spinner in Button
        $(this).html(spinner);

        // Set Flag of what button was pressed
        confirmPressed = true;

        // Get URL
        var url = $(this).attr('href');

        // Post Action
        $.post(url, function (data) {
            if (data.result) {
                // Hide Confirmation Modal
                $("#confirm-delete").modal('hide');
                $("#"+data.id).fadeOut( "slow", function() {
                    $("#" + data.id).remove();

                    // Refresh "My Jar" by reloading
                    getClickedLink (null, e, '/myJar/'+$("#loadedYear").html());
                });
            }
            else {
                // Show Message for Cart Update
                $('#generalMessage').modal('show');
            }
            // Show Message in Button
            $(this).html("Ok");
        });
    });

    // Execute on Click of Edit of GT Note
    $(".editGT").click(function(e){
        e.preventDefault();

        // get url
        var url = $(this).attr('formaction');

        // Post to edit
        $.get(url, function (data){
            if(data){
                $("#editModalContent").html(data);
            }
        });
    });

    $('.selectedYear').click(function(e){
        e.preventDefault();

        // Get Selected Year and URL from Dropdown
        var year = $(this).html();
        var url = $(this).attr("href");

        // Refresh "My Jar" by reloading
        getClickedLink (null, e, url);

    })
});

//# sourceURL=dynamicMyJar.js