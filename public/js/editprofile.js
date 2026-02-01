$(() => {
    var fetchedPassword;

    if (!localStorage['jwt']) {
        window.location.href = "/store";
    } else {
        var settings = {
            "url": "/user/self",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer " + localStorage['jwt']
            },
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            $("#username_profile").val(response.username);
            $("#email").val(response.email);
            fetchedPassword = response.password;
            $("#type").val(response.type);
            $("#profile_pic_url").attr("src", response.profile_pic_url);

            // Move the code that updates the user profile inside this callback function
            $('#btn_update').click(function (event) {
                event.preventDefault(); // prevent default form submit event
                const fileInput = $('#profile_pic_input')[0];
                const file = fileInput.files[0];
                var userUpdateData = {};

                // Check if the new password field is empty
                const newPassword = $("#new_password").val();
                if (newPassword === "") {
                    userUpdateData = {
                        username: $("#username_profile").val(),
                        email: $("#email").val(),
                        current_password: fetchedPassword,
                        type: 'Customer'
                    };
                } else {
                    userUpdateData = {
                        username: $("#username_profile").val(),
                        email: $("#email").val(),
                        current_password: $("#current_password").val(),
                        new_password: newPassword,
                        type: 'Customer'
                    };
                }

                if (file) {
                    // User selected a file, add the profile_pic_url to the userUpdateData
                    const formData = new FormData();
                    formData.append("username", userUpdateData.username);
                    formData.append("email", userUpdateData.email);
                    if (newPassword === "") {
                        formData.append("current_password", userUpdateData.current_password);
                    } else {
                        formData.append("current_password", userUpdateData.current_password);
                        formData.append("new_password", userUpdateData.new_password);
                    }
                    formData.append("type", userUpdateData.type);
                    formData.append("profile_pic_url", file);

                    console.log(formData);

                    // Perform the AJAX request to update the profile with the FormData
                    updateProfileWithImage(formData);
                } else {
                    // No image selected, update the profile without the profile_pic_url
                    updateProfileWithoutImage(userUpdateData);
                }
            });

            function updateProfileWithImage(formData) {
                var settings = {
                    "url": "/users/self",
                    "method": "PUT",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "Bearer " + localStorage['jwt']
                    },
                    "processData": false,
                    "contentType": false,
                    "data": formData
                };

                $.ajax(settings).done(function (response) {
                    if (response.message === "Incorrect current password") {
                        alert("Incorrect current password. Please enter the correct current password.");
                    } else {
                        alert("User profile has been successfully updated");
                        location.reload();
                    }
                }).fail(function (error) {
                    console.log(error);
                    alert("An error occurred while updating the profile");
                });
            }
            function updateProfileWithoutImage(userUpdateData) {
                var settings = {
                    "url": "/users/self",
                    "method": "PUT",
                    "timeout": 0,
                    "headers": {
                        "Authorization": "Bearer " + localStorage['jwt'],
                        "Content-Type": "application/json" // Set the content type to JSON
                    },
                    "data": JSON.stringify(userUpdateData), // Convert the JavaScript object to JSON
                };

                $.ajax(settings).done(function (response) {
                    console.log(response);
                    if (response.message === "Incorrect current password") {
                        alert("Incorrect current password. Please enter the correct current password.");
                    } else {
                        alert("User profile has been successfully updated");
                        location.reload();
                    }
                }).fail(function (error) {
                    console.log(error);
                    alert("An error occurred while updating the profile");
                });
            }

            // Event listener for the Reset Image button
            $('#btn_reset_image').click(function () {
                const fileInput = $('#profile_pic_input')[0];
                const fileNameDisplay = $('#file_name_display');
                const defaultImage = './public/images/user_profile_pic/default.png';

                // Reset the file input value and clear the displayed file name
                fileInput.value = '';
                fileNameDisplay.text('');

                // Create the userUpdateData object with the default profile_pic_url
                const userUpdateData = {
                    username: $("#username_profile").val(),
                    email: $("#email").val(),
                    current_password: fetchedPassword,
                    type: 'Customer',
                    profile_pic_url: defaultImage // Set the default image URL
                };

                // Perform the AJAX request to update the profile with the default image URL
                updateProfileWithoutImage(userUpdateData);
            });

            $('#btn_back').click(function () {
                window.location.href = "/store";
            });

            $('#profile_pic_input').on('change', function () {
                const fileInput = this;
                const fileNameDisplay = $('#file-selected-text');

                if (fileInput.files.length > 0) {
                    const filename = fileInput.files[0].name;
                    fileNameDisplay.text("File Selected: " + filename).show();
                } else {
                    fileNameDisplay.hide();
                }
            });
        }).fail(function (error) {
            console.log("Error fetching user data:", error);
            alert("Unauthorized. Please log in again.");
            window.location.href = "/login";
        });
    }
});
