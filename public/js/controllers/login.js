/**
 * Created by Carlos on 11/25/15.
 */
/* Execute When Document is Ready
 ------------------------------------------------ */
// VARIABLES
var spinner = "<i class='fa fa-spinner fa-pulse fa-lg'></i>";

$(document).ready(function() {
    // Assign jQuery Form Validation Engine to Forms (Sign Up and Login)
    $("#signupForm").validationEngine('attach', {promptPosition : "topRight", scroll: false, showOneMessage:true});
    $("#loginForm").validationEngine('attach', {promptPosition : "topRight", scroll: false, showOneMessage:true});

    /*
    $('#newGTLoad').on('hidden.bs.modal', function (e) {
        // Initialize Modal Window for Login / SignUp
        $('#loginModal').modal({
            backdrop: 'static',
            show: true
        });
    });
    */
    // Initialize Modal Window for Login / SignUp
    $('#loginModal').modal({
        backdrop: 'static',
        show: true
    });

    $('#registerForm_Show').click(function(e){
        e.preventDefault();

        $("#logInDiv").fadeOut(400, function(){
            $("#signUpDiv").fadeIn(200);
        });
    });

    $('.signinForm_Show').click(function(e){
        e.preventDefault();

        $("#signUpDiv").fadeOut(400, function(){
            $("#logInDiv").fadeIn(200);
        });

        $("#forgotDiv").hide();
    });

    $('#forgotForm_Show').click(function(e){
        e.preventDefault();

        $("#logInDiv").fadeOut(400, function(){
            $("#forgotDiv").fadeIn(200);
        });
    });

    $("a.btn-facebook, a.btn-google, a.btn-linkedin").click(function(e){
        // Hide LoginDivision and Show Spinner
        showSpinner(true);
    });

    $( "form" ).submit(function( event ) {
        event.preventDefault();

        // Get the form ID
        var formId = "#"+$(this).attr("id");

        // Validate form before sending
        if((!$(formId).find("div").hasClass("error-flag")) && $(formId).validationEngine('validate') ) {
            $("#messageLogin").html(''); // Erase Messages
            $("#messageLoginDiv").hide();

            // Hide LoginDivision and Show Spinner
            showSpinner(true);

            // Post the form data to the Server
            $.post($(formId).attr("action"), $(formId).serialize(), function (data) {
                $(formId)[0].reset();    // Reset form for eventual re-use
                switch (data.element) {
                    case "login":
                    case "signup":
                        if (data.error) {
                            $("#messageLogin").html(data.message);
                            $("#messageLoginDiv").fadeIn("slow");
                        } else {
                            $('#loginModal').modal('hide');// Hide Modal Window
                            $(location).attr('href', '/');  // Redirect after login to the main page '/'
                        }
                        break;
                    case "reset":
                        $("#forgotDiv").html(data.message);
                        break;
                }
                showSpinner(false);// Show LoginDivision and Hide Spinner
            });
        }

    });

    // On 'email' keyup, start timer countdown
    var field = '#email';           // Element being monitored for - Done Typing.
    var doneTypingInterval = 500;   // Time in ms, 0.5 second
    var typingTimer;                // Variable to store a timer (typingTimer)

    $(field).change(function(){
        $(field).trigger( "keyup" );
    });

    $(field).keyup(function(){
        clearTimeout(typingTimer);
        if ($(this).val()) {
            typingTimer = setTimeout(doneTyping(field), doneTypingInterval);
        }
    });
});

// User "finished typing username," Verify if available in DB
function doneTyping (field) {
    var inputVal = $(field).val();
    var resultMsg = "<div id='emailMsg' class='alert alert-danger nomarginbottom minipaddingall'>Email Already Registered</div>";
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(reg.test(inputVal)) {
        $.post("/checkuser", {email: inputVal}, function (id) {
            console.log("Result: ", id.available);
            if (id.available) {
                resultMsg = resultMsg.replace(/danger/g, 'success');
                resultMsg = resultMsg.replace(/Email Already Registered/g, 'New Account!');
                fieldSuccess(field,true);  // This function requires: field ID and true (success)/ false (error)
            } else fieldSuccess(field,false);

            $("#emailMsg").remove();
            $(field).parent('div').append(resultMsg);
        });
    } else {
        //handle Invalid Email Format Error
        fieldSuccess(field,false);
        $("#emailMsg").remove();
    }
}

// Function to attach error or success classes to a field (parent division)
function fieldSuccess(field,success){
    if (success) {
        $(field).parent('div').removeClass("has-error has-feedback error-flag");
        $(field).parent('div').addClass("has-success has-feedback").focus();
        $("#signupForm_submit").removeClass('disabled');
    } else {
        $(field).parent('div').removeClass("has-success has-feedback");
        $(field).parent('div').addClass("has-error has-feedback error-flag").focus();
        $("#signupForm_submit").addClass('disabled');
    }
}

function showSpinner(show){
    if(show){
        // Hide LoginDivision and Show Spinner
        $("#loginDivider").hide();
        $("#loginSpinner").show();
    } else {
        // Show LoginDivision and Hide Spinner
        $("#loginDivider").show();
        $("#loginSpinner").hide();
    }
}

//# sourceURL=dynamicLogin.js