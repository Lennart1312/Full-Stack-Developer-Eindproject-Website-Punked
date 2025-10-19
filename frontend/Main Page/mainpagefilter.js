// mainpagefilter.js

document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedGenre = btn.dataset.filter;
            const cards = document.querySelectorAll('.product-card');

            // Update button styling
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            cards.forEach(card => {
                const genre = card.dataset.genre;
                if (selectedGenre === "all" || genre === selectedGenre) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});
