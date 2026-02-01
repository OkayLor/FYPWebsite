// jQuery code to handle the game search
$(document).ready(function () {

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
                $('#searchGame').on('input', function () {
                    searchGame();
                });

                function searchGame() {
                    const searchTitle = $('#searchGame').val();

                    // Make an AJAX request to the server to search for games
                    $.ajax({
                        url: `/community/search/${searchTitle}`, // Endpoint for searching games by title
                        method: 'GET',
                        headers: {
                            "Authorization": "Bearer " + localStorage['jwt']
                        },
                        success: function (response) {
                            // Process the search results and populate the search results list
                            const searchResultsList = $('#searchResults');
                            searchResultsList.empty();

                            if (response && response.length > 0) {
                                response.forEach(function (game) {
                                    const listItem = $('<li>').addClass('search-result-item').text(game.title);
                                    listItem.on('click', function () {
                                        selectGame(game);
                                        $('#searchGame').val(''); // Clear search bar on click
                                        searchResultsList.empty(); // Hide search results on click
                                    });
                                    searchResultsList.append(listItem);
                                });
                            } else {
                                const noResults = $('<li>').text('No games found.');
                                searchResultsList.append(noResults);
                            }
                        },
                        error: function (error) {
                            console.error('Error searching for games:', error);
                        },
                    });
                }

                function selectGame(game) {
                    updateSelectedGameText(game.title, game.gameid);
                }

                // Inside the updateSelectedGameText function, update the selected game title and ID
                function updateSelectedGameText(gameTitle, gameId) {
                    $('#selectedGameText').text(gameTitle);
                    $('#selectedGameText').data('gameid', gameId); // Store the game ID using jQuery data()
                }

                // Rating stars
                $('.rating-stars').on('click', function () {
                    const rating = $(this).data('rating');
                    $('#rating').val(rating);
                    $('.rating-stars').removeClass('checked');
                    $(this).prevAll('.rating-stars').addBack().addClass('checked');
                });

                // Function to create a review
                function createReview(reviewObj) {
                    $.ajax({
                        url: `/user/review`, // Endpoint for creating a review for a game
                        method: 'POST',
                        timeout: 0,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage["jwt"]
                        },
                        data: JSON.stringify(reviewObj), // Send the review data as a JSON string
                        success: function (response) {
                            console.log('Review submitted successfully:', response);
                            alert('Review submitted successfully!');
                            // Handle success response here (e.g., show a success message to the user)
                            location.reload();
                        },
                        error: function (error) {
                            console.error('Error creating review:', error);
                            // Handle error response here (e.g., show an error message to the user)
                            alert('Error creating review. Please try again later.', error);
                        },
                    });
                }

                // Handle the form submission
                $('button.btn-primary').on('click', function () {
                    const selectedGameText = $('#selectedGameText');
                    const gameId = selectedGameText.data('gameid');
                    const rating = $('#rating').val();
                    const reviewContent = $('#review').val();
                    if (gameId && rating !== "" && reviewContent !== "") {
                        const reviewObj = {
                            game_id: gameId,   // Set the game_id to the gameId variable
                            content: reviewContent,
                            rating: rating,
                        };
                        createReview(reviewObj); // Pass the reviewObj to the createReview function
                    } else {
                        // Handle form validation (e.g., show an error message if any field is empty)
                    }
                });
            } else {
                window.location.href = "/login";
            }

        }).fail(function (error) {
            // Redirect to the login page if there's an error or if the user is not authorized
            window.location.href = "/login";
        });
    }

});
