document.addEventListener('DOMContentLoaded', function () {
    const genreNav = document.querySelector('.genre-nav');

    if (!genreNav) return;

    const genreItems = genreNav.querySelectorAll('.genre-item');

    genreItems.forEach(genreItem => {
        const genreLink = genreItem.querySelector('a');
        const genreName = genreLink.textContent.trim().toLowerCase();

        const dropdownLinks = genreItem.querySelectorAll('.dropdown a');

        dropdownLinks.forEach(categoryLink => {
            categoryLink.addEventListener('click', function (e) {
                e.preventDefault();

                const categoryName = categoryLink.textContent.trim().toLowerCase().replace(/\s+/g, '-');

                // Redirect to Shop.html with genre and category query parameters
                const redirectUrl = `Shop.html?genre=${encodeURIComponent(genreName)}&category=${encodeURIComponent(categoryName)}`;
                window.location.href = redirectUrl;
            });
        });
    });
});
