$(document).ready(function () {
    // Function to update navbar based on login status
    function updateNavbar() {
        const token = localStorage.getItem('jwt');
        console.log("Stored JWT token:", token); // Log the token to the console
        if (token) {
            var settings = {
                "url": "/user/self",
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Authorization": "Bearer " + token
                },
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
                const username = response.username;
                const userType = response.type;

                if (username) {
                    $('#username').text(username);
                    $('#user_dropdown').show();
                    $('#login_item').hide();
                }
                if (userType === 'Admin') {
                    $('#admin_panel_link').show();
                    $('#update_news_link').show();
                }
                $('#cart_icon').show();
            }).fail(function () {
                localStorage.removeItem('jwt');
                $('#login_item').show();
                $('#user_dropdown').hide();
                $('#admin_panel_link').hide();
                $('#update_news_link').hide();
                $('#cart_icon').hide();
            });
        } else {
            $('#login_item').show();
            $('#user_dropdown').hide();
            $('#admin_panel_link').hide();
            $('#update_news_link').hide();
            $('#cart_icon').hide();
        }
    }

    updateNavbar();

    $('#logout_btn').click(function () {
        localStorage.clear();
        window.location.href = '/';
    });

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
        $.ajax(settings).done(function (response) {
            console.log("Response:", response);
            if (!response.token) {
                alert(response.message);
            } else {
                localStorage.setItem("jwt", response.token);
                console.log("Token stored:", localStorage.getItem("jwt")); // Log the token stored in LocalStorage
                window.location.href = "/store";
            }
        }).fail(function (error) {
            console.log("Error:", error);
            alert("Login failed. Please check your credentials.");
        });
    });

    // Navigate to edit profile page
    $("#edit_profile_btn").click(function() {
        const token = localStorage.getItem('jwt');
        if (token) {
            var settings = {
                "url": "/editProfile",
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Authorization": "Bearer " + token
                },
            };

            console.log("Sending token:", token); // Log the token being sent in the request

            $.ajax(settings).done(function (response) {
                window.location.href = "/editProfile";
            }).fail(function (error) {
                console.log("Error:", error);
                alert("Unauthorized. Please log in again.");
                window.location.href = "/login";
            });
        } else {
            alert("No token found. Please log in.");
            window.location.href = "/login";
        }
    });
});
