$(document).ready(() => {
    if (!localStorage['jwt']) {
        // Redirect to the login page if the user is not logged in
        window.location.href = "/login";
    } else {
        // If the JWT token is present, make an AJAX request to verify the user's identity
        var settings = {
            "url": "/user/self",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer " + localStorage['jwt']
            },
        };

        $.ajax(settings).done(function (response) {
            if (response.type === 'Customer' || response.type === 'Admin') {

                const getReviewsUrl = "/self/reviews";

                // Function to fetch and display reviews
                function displayReviews() {
                    $.ajax({
                        url: getReviewsUrl,
                        headers: {
                            "Authorization": "Bearer " + localStorage['jwt']
                        },
                        method: "GET",
                        dataType: "json",
                        success: function (response) {
                            console.log("Reviews response:", response); // Console log the response
                            if (response.length === 0) {
                                $("#reviews-container").html("<p>You have not posted any reviews.</p>");
                            } else {
                                $("#reviews-container").empty();
                                response.forEach((review) => {
                                    // Create a card for each review
                                    const card = `
                                        <div class="col-md-6 mb-4 review-card" data-review-id="${review.id}">
                                            <div class="card">
                                                <div class="card-body">
                                                    <h5 class="card-title">${review.title}</h5>
                                                    <p class="card-text">${review.review}</p>
                                                    <p class="card-text"><strong>Rating:</strong> ${review.rating}</p>
                                                    <p class="card-text"><strong>Created:</strong> ${new Date(review.created).toLocaleString()}</p>
                                                    <p class="card-text"><strong>Likes:</strong> ${review.likes}</p>
                                                    <button class="btn btn-danger delete-btn" data-review-id="${review.id}">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                    $("#reviews-container").append(card);
                                });

                                // Add click event listener to delete buttons
                                $(".delete-btn").click(function () {
                                    const reviewId = $(this).data("review-id");
                                    const deleteButton = $(this); // Save a reference to the delete button

                                    deleteReview(reviewId, deleteButton);
                                });
                            }
                        },
                        error: function (error) {
                            console.log("Error fetching reviews:", error);
                            $("#reviews-container").html("<p>Failed to fetch reviews.</p>");
                        }
                    });
                }

                // Modify the deleteReview function to target the review card with the specific reviewId
                function deleteReview(reviewId, deleteButton) {
                    var id = reviewId;
                    var settings = {
                        "url": "/self/reviews/" + id,
                        "method": "DELETE",
                        "timeout": 0,
                        "headers": {
                            "Authorization": "Bearer " + localStorage["jwt"]
                        },
                    };
                    $.ajax(settings).done(function (response) {
                        console.log(response);
                        // Find the review card with the data-review-id attribute and remove it from the page
                        $(".review-card[data-review-id='" + reviewId + "']").remove();
                        // Show the alert that the review is deleted successfully
                        alert("Review deleted successfully!");
                        // Refresh the list of reviews
                        displayReviews();
                    }).fail(function (error) {
                        console.log("Error deleting review:", error);
                    });
                }
                // Call the function to display reviews when the page loads
                displayReviews();
            } else {
                window.location.href = "/login";
            }
        }).fail(function (error) {
            // Redirect to the login page if there's an error or if the user is not authorized
            window.location.href = "/login";
        });
    }
});
