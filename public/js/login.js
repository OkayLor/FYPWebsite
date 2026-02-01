$(() => {
    if (!localStorage['jwt']) {
        // User is not logged in, show login button
        document.getElementById('login_btn').style.display = 'inline-block';
        document.getElementById('username').style.display = 'none';
        document.getElementById('logout_btn').style.display = 'none';
        // Hide the shopping cart icon
        document.getElementById('cart_icon').style.display = 'none';
        // Hide the admin-specific links
        document.getElementById('admin_panel_link').style.display = 'none';
        document.getElementById('update_news_link').style.display = 'none';
    } else {
        var settings = {
            "url": "/user/self",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer " + localStorage['jwt']
            },
        };

        // Send AJAX request to get user data
        $.ajax(settings).done(function (response) {
            console.log(response);
            const username = response.username;
            const userType = response.type;

            if (userType === 'Customer') {
                // User is logged in as a Customer
                // Show username, shopping cart, and logout button
                if (username) {
                    document.getElementById('username').textContent = username;
                    document.getElementById('username').style.display = 'inline-block';
                }
                document.getElementById('logout_btn').style.display = 'inline-block';
                document.getElementById('login_btn').style.display = 'none';
                document.getElementById('cart_icon').style.display = 'inline-block';
                // Hide the admin-specific links
                document.getElementById('admin_panel_link').style.display = 'none';
                document.getElementById('update_news_link').style.display = 'none';
            } else if (userType === 'Admin') {
                // User is logged in as an Admin
                // Show username, logout button, and the admin-specific links
                if (username) {
                    document.getElementById('username').textContent = username;
                    document.getElementById('username').style.display = 'inline-block';
                }
                document.getElementById('logout_btn').style.display = 'inline-block';
                document.getElementById('login_btn').style.display = 'none';
                document.getElementById('cart_icon').style.display = 'inline-block';
                // Show the admin-specific links
                document.getElementById('admin_panel_link').style.display = 'inline-block';
                document.getElementById('update_news_link').style.display = 'inline-block';


            }
        });
    }
});

$('#logout_btn').click(function () {
    localStorage.clear();
    delete localStorage['jwt'];
    window.location.href = '/';
});
