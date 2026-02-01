// gameid and title are defined globally in infoGames.ejs
$(document).ready(function () {
    $("#addToCartBtn").click(function () {
        if (localStorage['jwt']) {
            const settings = {
                url: "/user/self",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage['jwt']
                },
            };

            $.ajax(settings).done(function (response) {
                if (response.type === 'Customer' || response.type === 'Admin') {
                    // Verify if already owned or in cart
                    verifyIfOwned(gameid).then(function (isOwned) {
                        verifyIfInCart(gameid).then(function (isInCart) {
                            if (isOwned) {
                                alert("You already own this game!");
                            } else if (isInCart) {
                                alert("This game is already in your cart!");
                            } else {
                                // Add to cart with just gameid (server will select cheapest platform)
                                const formData = {
                                    gameid: gameid
                                };

                                $.ajax({
                                    url: '/addtocart',
                                    method: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify(formData),
                                    headers: {
                                        "Authorization": "Bearer " + localStorage['jwt']
                                    },
                                    success: function () {
                                        alert('Game added to cart successfully!');
                                    },
                                    error: function (error) {
                                        console.error('Error adding game to cart:', error);
                                        const errorMessage = error.responseJSON && error.responseJSON.message 
                                            ? error.responseJSON.message 
                                            : 'Failed to add game to cart. Please try again later.';
                                        alert(errorMessage);
                                    }
                                });
                            }
                        });
                    });
                } else {
                    window.location.href = '/login';
                }
            });
        } else {
            window.location.href = '/login';
        }
    });

    function verifyIfOwned(gameid) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "/owned/games",
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + localStorage['jwt']
                }
            }).done(function (totalGames) {
                const owned = totalGames.some(game => game.gameid == gameid);
                resolve(owned);
            }).fail(reject);
        });
    }

    function verifyIfInCart(gameid) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "/user/cart/AllInfo",
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + localStorage['jwt']
                }
            }).done(function (totalCart) {
                const exist = totalCart.some(item => item.gameid == gameid);
                resolve(exist);
            }).fail(reject);
        });
    }

    $("#backBtn").click(function () {
        window.location.href = "/store";
    });

    $("#addReviewBtn").click(function () {
        window.location.href = "/createReview";
    });
});
