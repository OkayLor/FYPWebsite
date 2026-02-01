$(document).ready(function() {
    $('#search-button').on('click', function() {
        const searchInput = $('#search-input').val().toLowerCase();
        $('.game-container').each(function() {
            const title = $(this).find('h2').text().toLowerCase();
            const platforms = $(this).find('.platforms').text().toLowerCase();
            if (title.includes(searchInput) || platforms.includes(searchInput)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    $('.filter-btn').on('click', function() {
        const filter = $(this).data('filter');
        const games = $('.game-container').get();

        if (filter === 'all') {
            games.forEach(function(game) {
                $(game).show();
            });
        } else if (filter === 'release') {
            games.sort(function(a, b) {
                return $(b).data('release') - $(a).data('release');
            });
        } else if (filter === 'highest') {
            games.sort(function(a, b) {
                return $(b).data('price') - $(a).data('price');
            });
        } else if (filter === 'lowest') {
            games.sort(function(a, b) {
                return $(a).data('price') - $(b).data('price');
            });
        }

        $('#results').empty().append(games);
    });
});
