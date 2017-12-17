$(document).ready(() => {

    $("#login-button").click(() => {

        let email = $("#inputEmail").val();
        let password = $("#inputPassword").val();

        SDK.Student.login(email, password, (err, data) => {
            if (err && err.xhr.status === 401) {
                $(".login-button").addClass("Error - 401");
            }
            else if (err) {
                console.log(err)
            } else {
                SDK.Student.getCurrentStudent((err,data) => {
                        if (err) {}

                            SDK.Storage.persist("currentStudent", data);
                            window.location.href = "firstPage.html";

                    }
                );
            }
        });

    });

});