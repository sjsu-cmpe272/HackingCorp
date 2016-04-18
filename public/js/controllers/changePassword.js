/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function() {
    /*  Initialize Elements
     _____________________________________________ */
    // Assign jQuery Form Validation Engine to Forms (Sign Up and Login)
    $("#changePasswordForm").validationEngine('attach', {promptPosition : "topRight", scroll: false, showOneMessage:true});

    $("#changePasswordForm_submit").click(function (e) {
        e.preventDefault();

        // Get the form ID
        var formId = "#" + $(this).attr("id");

        // Validate form before sending
        if ($("#changePasswordForm").validationEngine('validate')) {

            // Post the form data to the Server
            $.post($("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), function (data) {
                if (data) {
                    $('#editModal').modal('hide');// Hide Modal Window
                }
                else {
                    // Code to handle error
                    alert("Error Changing Email!")
                }
            });
        }
    });
});