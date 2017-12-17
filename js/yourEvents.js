$(document).ready(() => {

    const $updateButton = $("#updateButton");
    const $yourEvents = $("#yourEvents");
    const $noEvents = $("#noEvents");

    $noEvents.hide();


    SDK.Event.yourEvents((err, events) => {
        events = JSON.parse(events);


        if (events.length === 0) {
            $noEvents.show();
        }

        events.forEach((event) => {
            const yourEventsHtml = `
            <div class="container">
    <table class="table">
       
       
       <thread>
           <tr>
              <th>Event</th>
              <th>Owner</th>
              <th>Description</th> 
              <th>Location</th>
              <th>Date</th> 
              <th>Price</th> 
           </tr>     
        </thread>
        
        
        <tbody>
            <tr>
            <td>${event.eventName}</td>
            <td>${event.owner}</td>
            <td>${event.description}</td>
            <td>${event.location}</td>
            <td>${event.eventDate}</td>
            <td>${event.price}</td>
            <td><button class ="btn deleteButton btn-default" data-id-delete="${event.idEvent}"> Delete Event</button></td>
            <td> <a href="updateEvent.html?eventId=${event.idEvent}"<button id="updateButton" class="btn btn-default"> Update Event</button></a></td>
            </tr>
            
        </tbody>
        
    </table>
    
</div> `;



               $yourEvents.append(yourEventsHtml);
           });

        //Delete event knap bliver lavet:
           $(".deleteButton").click(function () {


               const idEvent = $(this).data("id-delete");
               const event = events.find((event) => event.idEvent === idEvent);


               SDK.Event.deleteEvent(idEvent, event.eventName, event.location, event.eventDate,event.price, event.description, (err, data) => {
                   if (err && err.xhr.status === 401) {

                       $(".form-group").addClass("Error - 401")

                   }
                   else if (err) {
                       window.alert("Could not delete this event")
                   } else {
                       window.location.href = "yourEvents.html";
                   }
               })


           })


        })
    });
