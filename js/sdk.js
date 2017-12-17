const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {


        let token = {
            "Authorization": SDK.Storage.load("token")
        };

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: token,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                console.log(data);
                cb(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
            }
        });

    },
    Student: {

        currentStudent: () => {
            return SDK.Storage.load("token");
        },
        logOut: (cb) => {

            SDK.request({
                method: "POST",
                url: "/students/logout",
            }, (err, data) => {
                if (err) {
                    return cb(err);
                }
                cb(null, data);
            });

            window.location.href = "index.html";
        },

        login: (email, password, cb) => {
            SDK.request({
                    data: {
                        email: email,
                        password: password
                    },
                    url: "/login",
                    method: "POST"
                },
                (err, data) => {


                    if (err) return cb(err);


                    SDK.Storage.persist("token", data);

                    cb(null, data);
                });
        },
        register: (regFirsName, regLastName, regEmail, regPassword, regVerifiedPassword, cb) => {
            SDK.request({
                data: {
                    firstName: regFirsName,
                    lastName: regLastName,
                    email: regEmail,
                    password: regPassword,
                    verifyPassword: regVerifiedPassword
                },
                url: "/register",
                method: "POST"
            }, (err, data) => {
                if (err) {
                    return cb(err);
                }
                console.log(data);

                SDK.Storage.persist("token", JSON.parse(data));

                cb(null, data);
            });
        },
        getCurrentStudent: (cb) => {
            SDK.request({
                method: "GET",
                url: "/students/profile",
                headers: {
                    Authorization: SDK.Storage.load("token"),
                },
            }, (err, data) => {
                if (err) {
                    return cb(err);
                }
                SDK.Storage.persist("Student", data);
                cb(null, data);
            });
        },
        /*
        loadingUser: (cb) =>{
        console.log("Token i SDK.Storage er: ", SDK.Storage.load("token"));
        SDK.request({
            method: "GET",
            url: "/students/profile",
            headers:{
                authorization: SDK.Storage.load("token"),
            },
        }, (err, user) => {
            if (err){
                console.log("fejl i loadingUser")
                return cb(err);
            }
            SDK.Storage.persist("User",user);
            cb(null,user);
        });
        */
    },
    Event: {
        getEvents: (cb, events) => {
            SDK.request({
                method: "GET",
                url: "/events",
                headers: {
                    Authorization: SDK.Storage.load("token"),
                    filter: {
                        include: ["events"]
                    }
                }
            }, (err, data) => {
                if (err) return cb(err);
                cb(null, data);
            });
        },


        joinEvent: (idEvent, eventName, location, price, eventDate, description, cb) => {
            SDK.request({
                data: {
                    idEvent: idEvent,
                    eventName: eventName,
                    location: location,
                    price: price,
                    eventDate: eventDate,
                    description: description,

                },
                method: "POST",
                url: "/events/join",
                authorization: SDK.Storage.load("token"),
            }, (err, data) => {
                if (err)
                    return cb(err);
                cb(null, data);
            });
        },


        getAttendingStudents: (idEvent, cb) => {
            SDK.request({
                method: "GET",
                url: "/events/" + idEvent + "/students",
                headers: {
                    authorization: SDK.Storage.load("token")
                },
            }, cb);
        },
        createEvent: (regEventName, regEventLocation, regEventDate, regEventPrice, regEventDescription, cb) => {
            SDK.request({
                method: "POST",
                url: "/events",
                data: {
                    eventName: regEventName,
                    location: regEventLocation,
                    eventDate: regEventDate,
                    price: regEventPrice,
                    description: regEventDescription,
                },
                headers: {
                    authorization: SDK.Storage.load("token")
                }
            }, cb);
        },
        yourEvents: (cb) => {
            SDK.request({
                method: "GET",
                url: "/events/myEvents",
                headers: {
                    Authorization: SDK.Storage.load("token")
                }
            }, cb)
        },
        deleteEvent: (idEvent, eventName, location, eventDate, price, description, cb) => {
            SDK.request({
                method: "PUT",
                url: "/events/" + idEvent + "/delete-event",
                data: {
                    delIdEvent: idEvent,
                    delEventName: eventName,
                    delLocation: location,
                    delEventDate: eventDate,
                    delPrice: price,
                    deldDscription: description,

                }
            }, cb);
        },
        updateEvent: (idEvent, eventName, location, eventDate, price, description, cb) => {
            SDK.request({
                method: "PUT",
                url: "/events/" + idEvent + "/update-event",
                data: {
                    eventName: eventName,
                    location: location,
                    eventDate: eventDate,
                    price: price,
                    description: description,
                }

            }, (err, data) => {
                if (err)
                    return cb(err);

                SDK.Storage.persist(data);

                cb(null, data);
            });
        },
        getEventsAttending: (cb) =>{
            SDK.request({
                method: "GET",
                url: "/students/" + SDK.Storage.load("currentStudent").idStudent + "/events",
                headers: {
                    filter: {
                        include:["events"]
                    }
                }


            }, cb)
        }
    },


    loadNav: (cb) => {
        $("#nav-container").load("nav.html", () => {
            const currentStudent = SDK.Student.currentStudent();
            if (currentStudent) {
                $(".navbar-right").html(`
            <li><a href="yourEvents.html">Your Events</a></li>
            <li><a href="events.html">All Events</a> </li>
            <li><a href="EventAttending.html">Events you are attending</a></li>
            <li><a href="createEvent.html">Create an Event</a> </li>
            <li><a href="updateEvent.html">Update an Event</a> </li>
            <li><a href="#" id="logout-link">Logout</a></li>
`);
            } else {
                $(".navbar-right").html(`
            <li><a href="login.html">Login <span class="sr-only">(currentStudent)</span></a></li>
            <li><a href="createStudent.html">Create User</a> </li>
          `);
            }
            $("#logout-link").click(() => {
                SDK.Student.logOut((err, data)=>
                {
                    if (err && err.xhr.status == 401) {
                        $(".form-group").addClass("has-error");
                    } else {
                        SDK.Storage.remove("token");
                        SDK.Storage.remove("student");
                        window.location.href = "index.html";
                    }
                });

            });

            cb && cb();
        });
    },

    //Nedstående metode er lån fra: https://github.com/Ibenfoldager/STFUClient/commit/98e93ad94c02d4980cf0e9512677d1e470565efc
    // Som er Iben Foldagers klient-kode, hun er i samme gruppe "STFU"
    // Den gør så man kan opdatere i forhold til det rigtige idEvent
    Url: {
        getParameterByName: (name) => {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }
    },

    Storage: {
        prefix: "DOEKSocial",
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: (key) => {
            window.localStorage.removeItem(SDK.Storage.prefix + key);

        }
    }
};


