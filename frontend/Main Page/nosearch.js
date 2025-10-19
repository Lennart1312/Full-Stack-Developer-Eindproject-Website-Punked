document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-bar');
    const searchInput = searchForm.querySelector('.search-input');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const query = searchInput.value.trim();

        if (query.length > 0) {
            // Reload the No Results page itself with the new query
            window.location.href = `No Results.html?q=${encodeURIComponent(query)}`;
        }
    });
});
