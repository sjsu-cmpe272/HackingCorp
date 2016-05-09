/**
 * Created by Carlos on 5/8/16.
 */

/* Execute When Document is Ready
 ------------------------------------------------ */
$(document).ready(function(){

    // Function to make menu active
    $(".menu").click(function(e){
        $(".menu").removeClass("active");
        $(this).addClass("active");
    })

    // Execute on Click of Edit of GT Note
    $(".dbtables").change(function(e){
        e.preventDefault();

        console.log("Javascript to send dbtables");

        $.post('/data', function (data){
            if(data){
                $("#showData").html(data);
            } else {
                $("#showData").html("<p>Error</p>");
            }
        });
    });

});

/* Functions
 ------------------------------------------------------------ */


/* Function to get initial product data 'initialContent.html'
 ------------------------------------------------------------ */
function loadInitialContect() {
    event.preventDefault();

    $.get('/initialProducts', function(data) {
        if(data){
            $('#contentData').empty();  //Empty div 'contentData' from any previous code
            $('#contentData').html(data);   //Render new data on contentData section
        }
    });
}
