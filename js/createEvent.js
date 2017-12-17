$(document).ready(() =>{

    $("#createEvent-button").click(()=>{

        const eventName = $("#regEventName").val();
        const eventLocation = $("#regEventLocation").val();
        const eventDate = $("#regEventDate").val();
        const eventPrice = $("#regEventPrice").val();
        const eventDescription=$("#regEventDescription").val();

        if (!eventName || !eventLocation || !eventDate || !eventPrice || !eventDescription) {
            alert("Everything must be filled out :-)");
        }

        SDK.Event.createEvent(eventName, eventLocation,eventDate, eventPrice, eventDescription,(err,data)=> {
            if (err && err.xhr.status == 400){
                $(".form-group").addClass("has-error")
            }else if (err){
                console.log()
            }else {
                console.log(err)
                alert("Event has been created");
                window.location.href="index.html";
            }
        });
    });
});