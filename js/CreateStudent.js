$(document).ready(() =>{


    $("#createUser-button").click(() => {

        const firstName = $("#regFirstName").val();
        const lastName = $("#regLastName").val();
        const email = $("#regEmail").val();
        const password = $("#regPassword").val();
        const verifyPassword = $("#regVerifyPassword").val();


       if (!firstName ===" "  || !lastName ===" " || !email ===" " || !password === " " || !verifyPassword === " "){
          alert("Please fill out all the information")


        } else {
           if (password !== verifyPassword) {


               window.alert("Passwords do not match");
               return;
           }
           SDK.Student.register(firstName, lastName, email, password, verifyPassword, (err, data) =>{
               if(err && err.xhr.status === 400){
                   $(".margin-bottom").addClass("Error");
               }
                else if (err) {
                   console.log(err)
               } else{
                   window.alert("User has been created")
                   window.location.href ="login.html"
               }
           })
       }


             /*   SDK.Student.register(firstName, lastName, email, password, verifyPassword, (err, data)=> {
                    if (err && err .xhr.status === 400){
                        $(".form-group").addClass("has-error");

                } else if (err){
                        console.log(err);
                    }else {
                    window.alert("Your account has been created with:" + firstName + lastName + "\n Email:" + email + "(email is used as username");
                    window.location.href = "login.html";
                    }
                });
            } else {
                window.alert("Passwords are not identical");
            }
*/


    })
});