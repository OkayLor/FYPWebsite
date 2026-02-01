$(document).ready(function () {
    const ownedGamesList = $('#owned-games-list');
    const noGamesText = $('#no-games-text');
    const deleteButton = $('#deleteOwnedBtn');

    if (!localStorage['jwt']) {
        window.location.href = "/login";
        return;
    }

    function loadOwnedGames() {
        $.ajax({
            url: "/owned/games",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage['jwt']
            }
        }).done(function (games) {
            ownedGamesList.empty();

            if (!games || games.length === 0) {
                noGamesText.text('You do not own any game.').show();
                deleteButton.prop('disabled', true);
                return;
            }

            noGamesText.hide();
            deleteButton.prop('disabled', false);

            games.forEach(function (game) {
                const gameContainer = $('<div>').addClass('game-container');
                const checkboxWrapper = $('<div>').addClass('form-check mb-0');
                const checkbox = $('<input>').attr({
                    type: 'checkbox',
                    name: 'ownedCheckbox',
                    value: game.gameid
                }).addClass('form-check-input owned-checkbox');

                checkboxWrapper.append(checkbox);

                const gameDetails = $('<div>').addClass('game-details flex-grow-1 text-center');
                const gameTitle = $('<h3>').text(game.title);
                gameDetails.append(gameTitle);

                gameContainer.append(checkboxWrapper, gameDetails);
                ownedGamesList.append(gameContainer);
            });
        }).fail(function (error) {
            console.error('Error fetching owned games:', error);
            ownedGamesList.empty();
            noGamesText.text('An error occurred while fetching your owned games information.').show();
            deleteButton.prop('disabled', true);
        });
    }

    function verifyUserAndLoad() {
        $.ajax({
            url: "/user/self",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage['jwt']
            }
        }).done(function (response) {
            if (response.type === 'Customer' || response.type === 'Admin') {
                loadOwnedGames();
            } else {
                window.location.href = "/login";
            }
        }).fail(function () {
            window.location.href = "/login";
        });
    }

    deleteButton.on('click', function () {
        const selectedIds = $('input[name="ownedCheckbox"]:checked').map(function () {
            return $(this).val();
        }).get();

        if (selectedIds.length === 0) {
            alert('Please select at least one game to delete.');
            return;
        }

        $.ajax({
            url: "/owned/games",
            method: "DELETE",
            contentType: "application/json",
            data: JSON.stringify({ gameIds: selectedIds }),
            headers: {
                "Authorization": "Bearer " + localStorage['jwt']
            }
        }).done(function (response) {
            alert((response && response.message) || 'Selected games deleted.');
            loadOwnedGames();
        }).fail(function (xhr) {
            console.error('Error deleting owned games:', xhr);
            const msg = (xhr.responseJSON && xhr.responseJSON.message) || 'Failed to delete owned games.';
            alert(msg);
        });
    });

    verifyUserAndLoad();
});

