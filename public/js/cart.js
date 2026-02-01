$(document).ready(function () {
    var cartStuff;
    var total;
    var selectedGames = [];


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
                const userid = response.userid;
                
                // Simplified checkout function
                function handleCheckout() {
                    if (selectedGames.length === 0) {
                        alert("Please select at least one game to checkout");
                        return;
                    }

                    $.ajax({
                        url: "/checkout",
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + localStorage['jwt'],
                            "Content-Type": "application/json"
                        },
                        success: function (data) {
                            console.log("Order confirmed:", data);
                            window.location.href = "/order-confirmation";
                        },
                        error: function (error) {
                            console.error("Checkout failed:", error);
                            if (error.responseJSON && error.responseJSON.message) {
                                alert("Checkout failed: " + error.responseJSON.message);
                            } else {
                                alert("Checkout failed. Please try again later.");
                            }
                        },
                    });
                }

                function fetchCartInfo() {
                    $.ajax({
                        url: '/user/cart/AllInfo',
                        method: 'GET',
                        headers: {
                            "Authorization": "Bearer " + localStorage['jwt']
                        }
                    }).done(function (cartItems) {
                        cartStuff = cartItems;
                        console.log(cartStuff);
                        if (cartItems && cartItems.length > 0) {
                            var cartItemsContainer = $('#cartItems');
                            cartItemsContainer.empty();

                            cartItems.forEach(function (item) {
                                var cartItemBox = $('<div>').addClass('cart-item-box row align-items-center');
                                var checkboxColumn = $('<div>').addClass('col-1');
                                var checkbox = $('<input>').attr({
                                    type: 'checkbox',
                                    name: 'cartItemCheckbox',
                                    value: item.cart_id // Store the cart_id as the checkbox value
                                });
                                checkboxColumn.append(checkbox);

                                var cartItemInfoColumn = $('<div>').addClass('col-9');
                                var cartItem = $('<div>').addClass('cart-item');
                                var titleElement = $('<h4>').text(item.title);
                                var priceElement = $('<p>').text('Price: $' + Number(item.price).toFixed(2));

                                cartItem.append(titleElement);
                                cartItem.append(priceElement);
                                cartItemInfoColumn.append(cartItem);

                                var deleteButtonColumn = $('<div>').addClass('col-2');
                                var deleteButton = $('<button>').addClass('btn btn-danger btn-sm delete-btn').text('Delete');
                                deleteButton.data('cartId', item.cart_id); // Store the cart_id as data attribute for later use
                                deleteButtonColumn.append(deleteButton);

                                cartItemBox.append(checkboxColumn);
                                cartItemBox.append(cartItemInfoColumn);
                                cartItemBox.append(deleteButtonColumn);

                                cartItemsContainer.append(cartItemBox);

                                function updateTotalPrice() {
                                    var totalPriceElement = $('#totalPrice');
                                    totalPriceElement.text('Total: $' + calculateTotalPrice().toFixed(2));
                                }

                                function calculateTotalPrice() {
                                    total = 0;
                                    $('input[name="cartItemCheckbox"]:checked').each(function () {
                                        for (var i = 0; i < cartStuff.length; i++) {
                                            if (cartStuff[i].cart_id == $(this).val()) {
                                                total += Number(cartStuff[i].price);
                                            }
                                        }
                                    });
                                    return total;
                                }

                                $(document).on('change', 'input[name="cartItemCheckbox"]', function () {
                                    selectedGames = [];
                                    $('input[name="cartItemCheckbox"]:checked').each(function () {
                                        for (var i = 0; i < cartStuff.length; i++) {
                                            if (cartStuff[i].cart_id == $(this).val()) {
                                                selectedGames.push({ cartid: cartStuff[i].cart_id ,gameid: cartStuff[i].gameid });
                                            }
                                        }
                                        console.log(selectedGames);
                                    });

                                    function updateButtons() {
                                        if (total > 0) {
                                            $('#checkout-button').show();
                                        } else {
                                            $('#checkout-button').hide();
                                        }
                                    }
                                    updateTotalPrice();
                                    updateButtons();

                                });
                                updateTotalPrice();
                            });

                        } else {
                            var cartItemsContainer = $('#cartItems');
                            cartItemsContainer.empty();
                            cartItemsContainer.text('Your cart is empty.');
                        }
                    }).fail(function (error) {
                        console.error('Error fetching cart information:', error);
                        var cartItemsContainer = $('#cartItems');
                        cartItemsContainer.empty();
                        cartItemsContainer.text('An error occurred while fetching your cart information.');
                    });
                }

                $('#checkout-button').on('click', handleCheckout);
                fetchCartInfo();

                function deleteCartItem(cartId) {
                    $.ajax({
                        url: '/deletefromcart/' + cartId,
                        method: 'DELETE',
                        headers: {
                            "Authorization": "Bearer " + localStorage['jwt']
                        }
                    }).done(function (response) {
                        $(`.cart-item-box[data-cart-id="${cartId}"]`).remove();
                        alert("Item deleted from cart successfully!");
                        location.reload();
                    }).fail(function (error) {
                        console.error('Error deleting cart item:', error);
                        alert('An error occurred while deleting the cart item.');
                    });
                }
                $(document).on('click', '.delete-btn', function () {
                    var cartId = $(this).data('cartId');
                    deleteCartItem(cartId);
                });

            } else {
                window.location.href = "/login";
            }
        });
    }
});
