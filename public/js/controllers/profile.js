var confirmPressed = false;
var src = "default.png";
/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function() {
    /*  Initialize Elements
     _____________________________________________ */

    // Get the Media SRC and stored it in Global Variable
    src = $(".media").attr("src"); // Return to original value in case is necessary.

    // Initialize Form Validation
    $("#profileUpdateForm").validationEngine('attach', {promptPosition : "topRight", scroll: false, showOneMessage:true});

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

    // If Deletion of GT Note is Confirmed by user
    $('.btn-default').on('click', function(e) {
        // Set Flag of what button was pressed
        confirmPressed = false;
    });

    // Execute on Click of Edit of GT Note
    $(".editProfile").click(function(e){
        if(!$("#file").hasClass("wait")) {
            $(".panel-body").toggle();
            $(".editProfile").toggle();
        }
    });

    $("#cancelBT").click(function(e){
        // Return Picture to original image
        $(".media").attr("src",src);
    });

    $(".changePicture").click(function(e){
        e.preventDefault();
        initializePekeUpload({reset:true});
        $("#mediaUpload").toggle();
    });

    $("#updateBT").click(function(e){
        e.preventDefault();

        var formId ="#"+ $('#profileUpdateForm').attr('id');

        // Validate form before sending
        if ($(formId).validationEngine('validate')) {

            // Verify if file name is supposed to be in the #file 'value' attribute
            if( ($("#file").hasClass("wait"))){
                $('.pkdragarea').validationEngine('showPrompt', '...Processing Image. Try Again.', 'red', 'bottomRight',true);
                return;
            }

            // Form validation OK, Hide all messages
            $(formId).validationEngine('hideAll');

            // Show Modal with Spinner
            showCentralSpinnerWithBackground(true);

            $('#file').attr('type', 'text');
            // Post the form data to the Server
            $.post($(formId).attr("action"), $(formId).serialize())
                .done(function(data) {
                    // Change Attribute 'type' back to 'file'
                    $('#file').attr('type', 'file');

                    // Reset to original File Default: (Not Required)
                    $("#file").removeClass("validate[required]");
                    $("#file").removeClass("wait");
                    // Remove file name from 'value'
                    $("#file").attr('value', '');

                    // Hide Modal with Spinner
                    hideCentralSpinner();
                    $('#contentData').html(data);
                })
                .fail(function() {
                    alert( "error" );
                })
                .always(function() {
            });
        }
    })


});
//# sourceURL=dynamicProfile.js