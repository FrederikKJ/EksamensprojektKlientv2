$(document).ready(() => {


    $(".update").click(() => {

        alert("test");

        const eventName = $("#update-event-name").val();
        const location = $("#update-event-location").val();
        const eventDate = $("#update-event-date").val();
        const price = $("#update-event-price").val();
        const description = $("#update-event-description").val();
        const idEvent = SDK.Url.getParameterByName("eventId");

        console.log(description);

        SDK.Event.updateEvent(idEvent, eventName, location, eventDate, price, description, (err, cb) => {
            console.log(eventName);
            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("error - 401");

            }
            else if (err) {
                alert("error in updating event");
                console.log(err.message);
            } else {
                alert("Your event was updated");
                window.href = "yourEvent.html";
            }
        })


    });
});