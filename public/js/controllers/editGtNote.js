/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function() {
    /*  Initialize Elements
     _____________________________________________ */
// Assign jQuery Form Validation Engine to Forms (Sign Up and Login)
    $("#goodThingForm").validationEngine('attach', {promptPosition : "topRight", scroll: false, showOneMessage:true});

// Initialize Modal Window for Login / SignUp
    $('#editModal').modal({
        backdrop: 'static',
        show: true
    });

    // Pre-populate datepicker with note date
    var date = new Date($("#datepicker").attr("data-value"));
    var noteDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    $(".datepicker").attr("data-value",noteDate);

    $('.datepicker').pickadate({
        // Escape any “rule” characters with an exclamation mark (!).
        format: 'ddd, mmm dd, yyyy',
        formatSubmit: 'yyyy-mm-dd',
        hiddenPrefix: 'prefix__',
        hiddenSuffix: '__suffix',
        hiddenName: true
    });


    // File Upload plugin
    initializePekeUpload({reset:true});

    $("#editGoodThingForm_submit").click(function(e) {
        e.preventDefault();

        // HTML for Spinner
        var spinner =  "<strong><i class='fa fa-spinner fa-pulse fa-lg'></i></strong>";

        // Get the form ID
        var formId = "#" + $(this).attr("id");

        // Get Note ID
        var noteID = $(this).attr("name");

        // Validate form before sending
        if ($("#goodThingForm").validationEngine('validate')) {

            // Verify if file name is supposed to be in the #file 'value' attribute
            if( ($("#file").hasClass("wait"))){
                $('.pkdragarea').validationEngine('showPrompt', '...Processing Image. Try Again.', 'red', 'bottomRight',true);
                return;
            }

            // Form validation OK, Hide all messages
            $(formId).validationEngine('hideAll');

            // Show Spinner in Button
            $(this).html(spinner);

            $('#file').attr('type', 'text');

            // Post the form data to the Server
            $.post($("#goodThingForm").attr("action"), $("#goodThingForm").serialize(), function (data) {
                if (data) {
                    // Change Attribute 'type' back to 'file'
                    $('#file').attr('type', 'file');

                    // Reset to original File Default: (Not Required)
                    $("#file").removeClass("validate[required]");
                    $("#file").removeClass("wait");
                    // Remove file name from 'value'
                    $("#file").attr('value', '');

                    $('#editModal').modal('hide');// Hide Modal Window

                    $('#'+noteID).html(data);
                }
                else {
                    // Code to handle error
                }
                // Show Spinner in Button
                $(this).html("Update");
            });
        }
    });
});

//# sourceURL=dynamicEditGtNote.js