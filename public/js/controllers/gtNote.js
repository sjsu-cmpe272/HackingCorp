var spinner = "<i class='fa fa-spinner fa-pulse fa-lg'></i>";
/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function() {
    /*  Detach Previous Elements
     _____________________________________________ */
    $(".panel").off('hover');
    $('.btn-ok').off('click');
    $(".editGT").off('click');

    /*  Initialize Elements
     _____________________________________________ */
    $(".panel-footer").hide();
    $(".panel").hover(function() {
            $(this).find("div.panel-footer").show();
        }, function() {
            $(this).find("div.panel-footer").hide();
        }
    );

    // On click of Delete GT Note
    $('#confirm-delete').on('show.bs.modal', function(e) {
        $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
        var neew = $(this).find('.btn-ok').attr('type', $(e.relatedTarget).data('short'));

        $('.debug-url').html($(this).find('.btn-ok').attr('type'));

    });

    // If Deletion of GT Note is Confirmed by user
    $('.btn-ok').on('click', function(e) {
        e.preventDefault();

        // Hide Confirmation Modal
        $("#confirm-delete").modal('hide');

        /*
        if(!$('#newGTLoad').is(':visible')) {
            // Show Modal with Spinner
            $("#newGTLoad").modal("show");
        }
        */
        showCentralSpinnerWithBackground(true);

        // Get URL
        var url = $(this).attr('href');

        // Post Action
        $.post(url, function (data) {
            if (data.result) {
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
});

//# sourceURL=dynamicGtNote.js