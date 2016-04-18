/* Execute When Document is Ready
 ------------------------------------------------ */
var $datePicker, picker; // Store datepicker element

$(document).ready(function() {
    /*  Initialize Elements
     _____________________________________________ */
    // Assign jQuery Form Validation Engine to Forms (Sign Up and Login)
    $("#goodThingForm").validationEngine('attach', {promptPosition : "topRight", scroll: false, showOneMessage:false, binded:false});

    // Initialize ToolTips
    $('[data-toggle="tooltip"]').tooltip();

    // File Upload plugin
    initializePekeUpload({reset:true});

    // Set Date Picker Date
    setDatePickerDate(new Date());

    // Initialize Date Picker
    $datePicker = initializeDatePicker();

    // Use the picker object directly.
    picker = $datePicker.pickadate('picker');

    /*  ACTIONS on DOM Elements
     _____________________________________________ */

    // Submit New Good Thing
    $("form").submit(function (event) {
        event.preventDefault();

        // Get the form ID
        var formId = "#" + $(this).attr("id");

        // Validate form before sending
        if ($(formId).validationEngine('validate')) {

            // Verify if file name is supposed to be in the #file 'value' attribute
            if( ($("#file").hasClass("validate[required]")) && ( !$("#file").attr("value") ) ){
                $('.pkdragarea').validationEngine('showPrompt', '...Processing Image. Try Again.', 'red', 'bottomRight',true);
                return;
            }

            // Form validation OK, Hide all messages
            $(formId).validationEngine('hideAll');

            // Show Modal with Spinner
            showCentralSpinnerWithBackground(true);

            // Change Input to 'text' since we are only sending the file name; file allready uploaded
            $('#file').attr('type', 'text');

            // Post the form data to the Server
            $.post($(formId).attr("action"), $(formId).serialize(), function (data) {
                if (data.result) {
                    if(data.url && !data.token){
                        // Got to the facebook authentication site and get Token
                        $(location).attr('href', data.url);
                    } else if(data.url && data.token) {
                        // Go directly to server, since we have valid token.
                        $(location).attr('href', '/facebook/authorization/callback/' + data.token);
                    } else {
                        // Change Attribute 'type' back to 'file'
                        $('#file').attr('type', 'file');

                        // Reset to original File Default: (Not Required)
                        $("#file").removeClass("validate[required]");

                        // Remove file name from 'value'
                        $("#file").attr('value', '');

                        // Destroy date picker: due to Bug is not reseting!
                        picker.stop();

                        // Reset form for eventual re-use
                        $(formId)[0].reset();

                        // Re-initialize PekeUpload for re-use
                        initializePekeUpload({reset: true});

                        // Verify; if posts Qty = 3; ask for Facebook 'Like' | else, close modal
                        if(data.count == 3){
                            window.setTimeout(likeUs, 1000); //Timer to close modal after checkmark is shown.
                        } else {
                            window.setTimeout(closeModal, 1000); //Timer to close modal after checkmark is shown.
                        }
                    }
                }
                else {
                    // Close Modal with Spinner
                    hideCentralSpinner();

                    $("#newGTModal").html("<i class='fa fa-fa-exclamation-circle fa-5x'></i><br><h3>An Error Occurred. Please, try again.</h3>");
                    $("#newGTModal").modal("show");
                }
            });
        }
    });

    $('#newGTComplete').on('hidden.bs.modal', function (e) {
        // Reset Spinner
        $(".modal-body").html("<i class='fa fa-spinner fa-pulse fa-5x'></i>");

        // Re-Add Class to make modal x-small
        $("#newGTCompleteModalSize").addClass("modal-xs");
    });

});

function likeUs() {
    // Close Modal with Spinner
    hideCentralSpinner();

    // Get HTML and insert in Modal reusable window
    var likeHTML = $("#likeUse").html();
    $("#newGTCompleteModalSize").removeClass("modal-xs");
    $("#newGTCompleteModalBody").html(likeHTML);
    $("#newGTModal").modal("show");
};

function closeModal() {
    // Close Modal with Spinner
    hideCentralSpinner();

    // Set Date Picker Date
    setDatePickerDate(new Date());

    // Initialize Date Picker
    $datePicker = initializeDatePicker();

    // Use the picker object directly.
    picker = $datePicker.pickadate('picker');

    // Find Hidden Input created by "Picker" and add "name" value
    // due to a bug this is not reseting with the form reset.
    $("#dateDiv").children("input:hidden").attr("name","date");

    $("#newGTModal").modal("hide");
}

function setDatePickerDate(date){
    // Date Picker
    date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    $(".datepicker").attr("data-value",date);
}

function initializeDatePicker() {

    var picker = $('.datepicker').pickadate({
        // Escape any “rule” characters with an exclamation mark (!).
        format: 'ddd, mmm dd, yyyy',
        formatSubmit: 'yyyy-mm-dd',
        hiddenPrefix: 'prefix__',
        hiddenSuffix: '__suffix',
        hiddenName: true
    });

    return picker;
}

//# sourceURL=dynamicNewGT.js