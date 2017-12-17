$(document).ready(() => {

    SDK.loadNav();

    const $EventsAttending = $("#EventsAttending");


    //metode:
    SDK.Event.getEventsAttending((cb, events) => {

        events = JSON.parse(events);

        events.forEach((event) => {
            const eventAttendingHTML = `
            <div class ="container">
                <table class = "table">
                <thread>
                <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Owner</th>
                <th>Date</th>
                <th>Location</th>
                <th>Price</th>
            </tr>             
</thread>
    <tbody>
    <tr>
    <td>${event.eventName}</td>
    <td>${event.description}</td>
    <td>${event.owner}</td>
    <td>${event.eventDate}</td>
    <td>${event.location}</td>
    <td>${event.price}</td>
</tr>    
</tbody>                                             
</table>         
            </div>`; $EventsAttending.append(eventAttendingHTML);
        })
    })

});