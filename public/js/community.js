$(document).ready(function () {
    function getUserIdFromToken(token) {
        return $.ajax({
            url: "/user/self",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then(function (response) {
            return response && response.userid ? response.userid : null;
        }).fail(function () {
            return null;
        });
    }

    function handleLikeButton(likeButton, review, userId, token) {
        if (!userId) {
            likeButton.remove();
        } else {
            var userLikedReviews = review.upvoteBy ? review.upvoteBy.split(',') : [];
            var isUserLikedReview = userLikedReviews.includes(userId.toString());

            if (isUserLikedReview) {
                likeButton.addClass('liked');
                likeButton.html('<i class="fas fa-thumbs-up like-icon"></i> Liked');
            }

            likeButton.click(function () {
                if (!localStorage['jwt']) {
                    window.location.href = "/login";
                } else {
                    var endpoint = isUserLikedReview
                        ? '/review/unvote/' + review.reviewid
                        : '/review/upvote/' + review.reviewid;

                    $.ajax({
                        url: endpoint,
                        method: 'PUT',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        },
                        success: function (response) {
                            if (response.message === "Upvoted successfully" || response.message === "Downvoted successfully") {
                                if (isUserLikedReview) {
                                    likeButton.removeClass('liked');
                                    likeButton.html('<i class="far fa-thumbs-up like-icon"></i> Like');
                                    userLikedReviews = userLikedReviews.filter(id => id !== userId.toString());
                                } else {
                                    likeButton.addClass('liked');
                                    likeButton.html('<i class="fas fa-thumbs-up like-icon"></i> Liked');
                                    userLikedReviews.push(userId.toString());
                                }
                                isUserLikedReview = !isUserLikedReview;
                                likes.text('Likes: ' + response.counter);
                            }
                        }
                    });
                }
            });
        }
    }

    function formatDate(dateString) {
        var options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function fetchReviews(sortBy) {
        var token = localStorage['jwt'];
        $.ajax({
            url: '/review/' + sortBy,
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (response) {
                var reviewsContainer = $('#reviews-container');
                reviewsContainer.empty();

                if (response && response.length > 0) {
                    getUserIdFromToken(token).then(function (userId) {
                        response.forEach(function (review) {
                            var postContainer = $('<div class="post-container">');
                            var postContent = $('<div class="post-content">');
                            var postHeader = $('<div class="post-header">');
                            var postAuthor = $('<span class="post-author">').text(review.username);
                            var postDate = $('<span class="post-date">').text(formatDate(review.created));
                            var postActions = $('<div class="post-actions">');
                            var likes = $('<span class="likes">').text('Likes: ' + review.counter);
                            var likeButton = $('<span class="like-button">').html('<i class="far fa-thumbs-up like-icon"></i> Like');

                            handleLikeButton(likeButton, review, userId, token);

                            postHeader.append(postAuthor, postDate);
                            postActions.append(likes, likeButton);
                            postContent.append('<p><strong>Game Title:</strong> ' + review.title + '</p>');
                            postContent.append('<p><strong>Content:</strong> ' + review.content + '</p>');
                            postContent.append('<p><strong>Rating:</strong> ' + review.rating + '</p>');
                            postContent.append(postActions);
                            postContainer.append(postHeader, postContent);
                            reviewsContainer.append(postContainer);
                        });
                    });
                } else {
                    reviewsContainer.html('<p>No reviews found.</p>');
                }
            },
            error: function () {
                $('#reviews-container').html('<p>An error occurred while fetching reviews.</p>');
            }
        });
    }

    $('#sorting-dropdown').change(function () {
        fetchReviews($(this).val());
    });

    fetchReviews('rating');

    $('.scroll-down-arrow').click(function () {
        var communityForumSectionTop = $('#community-forum-section').offset().top;
        var scrollOffset = communityForumSectionTop - 400;

        $('html, body').animate({
            scrollTop: scrollOffset
        }, 800);
    });

    $('#create-review-button').click(function () {
        if (localStorage['jwt']) {
            window.location.href = '/createReview';
        } else {
            window.location.href = '/login';
        }
    });
});
