$(document).ready(function () {
    console.log(document.getElementById("btn_login"));
    console.log("window/document loaded");

    // Login AJAX Script
    $("#btn_login").click(function () {
        var email = $("#typeEmailX").val();
        var password = $("#typePasswordX").val();

        var settings = {
            "url": "/login",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
            },
            "data": JSON.stringify({
                "email": email,
                "password": password
            }),
        };
        // AJAX request to login
        $.ajax(settings).done(function (response) {
            console.log("Response:", response);
            if (!response.token) {
                alert(response.message);
            } else {
                localStorage["jwt"] = response.token;
                window.location.href = "/store";
            }
        }).fail(function (error) {
            console.log("Error:", error);
            alert("Login failed. Please check your credentials.");
        });
    });

    // Show Sign Up Form
    $("#btn_show_signup").click(function () {
        $("#login_form").hide();
        $("#signup_form").show();
    });

    // Show Login Form
    $("#btn_show_login").click(function () {
        $("#signup_form").hide();
        $("#login_form").show();
    });

    // Sign Up AJAX Script
    $("#btn_signup").click(function () {
        // Clear previous validation feedback
        $(".form-control").removeClass("is-invalid");

        var username = $("#typeUsername").val();
        var email = $("#typeEmail").val();
        var password = $("#typePassword").val();
        var type = "Customer"; // Default value

        // Front-end validation for empty fields
        if (!username) {
            $("#typeUsername").addClass("is-invalid");
            return;
        }

        if (!email) {
            $("#typeEmail").addClass("is-invalid");
            return;
        }

        if (!password) {
            $("#typePassword").addClass("is-invalid");
            return;
        }

        // Front-end validation for email format
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            $("#typeEmail").addClass("is-invalid");
            return;
        }

        var fileInput = $("#profilePic")[0];

        // Create FormData object
        var formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("type", type);

        // Validate if a file is selected before appending it to the FormData
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            formData.append("profile_pic_url", file);
        }

        var settings = {
            "url": "/users",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "contentType": false,
            "data": formData
        };

        // AJAX request to create user
        $.ajax(settings).done(function (response) {
            console.log(response);
            // Handle the response as per your requirements
            window.location.href = "/login";
            alert("User created successfully. Please login to continue browsing.");
        }).fail(function (error) {
            console.error(error);
            var errorData = JSON.parse(error.responseText);
            // Handle the error response here
            if (error.status === 422) {
                // Differentiate between specific error codes
                if (errorData.errorCode === "DUPLICATE_USERNAME_EMAIL") {
                    alert("The username or email provided already has an account associated with it.");
                } else if (errorData.errorCode === "INVALID_IMAGE") {
                    alert("Invalid image. Please upload a valid image.");
                } else {
                    alert("An error occurred. Please try again.");
                }
            } else if (error.status === 500) {
                alert("An error occurred while processing your request. Please try again later.")
            } else {
                alert("Error occurred. Please try again later. If the problem persists, please contact the administrator.")
            }
        });
    });
});
