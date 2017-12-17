$(document).ready(() => {

    const currentStudent = SDK.Student.currentStudent();
    const $EventList = $("#event-list");

//metode der henter alle events, lavet i sdk.java
    SDK.Event.getEvents((cb, Event) => {

        //parser data til Javascript
        Event = JSON.parse(Event);
        console.log(Event);

        //metode
        Event.forEach((event) => {

            let eventHtml = `
            <div class = "container">
               <table class = "table">
               
               <tr>
                    <th> Event Name</th>
                    <th> Event Description</th>
                    <th> Event Owner</th>
                    <th> Event Date</th>
                    <th> Event Location</th>
                    <th> Event Price</th>
                    <th> Participate in this event</th>
                    <th> See who is participating</th>
</tr>
<tbody>
<tr> 
<td> ${event.eventName}</td>
<td> ${event.description}</td>
<td> ${event.owner}</td>
<td> ${event.eventDate}</td>
<td> ${event.location}</td>
<td> ${event.price}</td>
<td><button class="btn attendingButton btn-default"  data-event-id="${event.idEvent}">Add to attending events</button></td>
<td><button class="btn attendingList btn-default" data-event-id="${event.idEvent}" data-toggle="modal" data-target="#attendingStudents-modal">See attending students</button></td>

</tr>


</tbody>
</table>
               
               </div>
            
            `;
            $EventList.append(eventHtml);


        });

        $(".attendingButton").click(function () {
            const idEvent = $(this).data("event-id");
            const event = Event.find((event) => event.idEvent === idEvent);
            console.log(idEvent);
            SDK.Event.joinEvent(idEvent, event.eventName, event.location, event.price, event.eventDate, event.description, (err, data) => {
                if (err && xhr.status === 401) {
                    $(".form-group").addClass("Error - 401");
                }
                else if (err) {
                    alert("Could not participate in events");
                } else {
                    window.location.href = "EventAttending.html";
                }
            });
        });

        $(".attendingList").click(function () {
            const idEvent = $(this).data("event-id");
            SDK.Event.getAttendingStudents(idEvent, (cb, students) => {
                if (students) {
                   // students = JSON.parse(students);

                    students.forEach((student) => {

                        const attendingStudentsHtml = `
                        <table class="table">
                            <thead>
                            <th>Name</th>
                            <th>Last name</th>
                        </thead>
                            
                        <tbody>
                            <tr>       
                            <td>${student.firstName}</td>
                            <td>${student.lastName}</td>
                            </tr>
                        </tbody>
                        </table>
                         `;
                        $("#attendingListContent").append(attendingStudentsHtml)
                    });
                } else {
                    $("#attendingList").html("Error");
                }

            });
        });
    });
    $("#closeModal").click(function () {
        //Avoids duplicate attendees
        $("#attendingListContent").children("table").remove();
        $("#attendingButton").html("");
    });
});