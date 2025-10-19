// ───── Profile Dropdown Hover + Click ─────
function setupProfileDropdown() {
    const container = document.getElementById('profile-menu-container');
    const icon = document.getElementById('profile-icon');
    const dropdown = document.getElementById('profile-dropdown');

    if (!container || !icon || !dropdown) return;

    let isOver = false;

    const showDropdown = () => dropdown.classList.remove('hidden');
    const hideDropdown = () => dropdown.classList.add('hidden');

    container.addEventListener('mouseenter', () => {
        isOver = true;
        showDropdown();
    });

    container.addEventListener('mouseleave', () => {
        isOver = false;
        setTimeout(() => {
            if (!isOver) hideDropdown();
        }, 200);
    });

    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            hideDropdown();
        }
    });
}

// Automatically activate on page load (for static profiles)
document.addEventListener('DOMContentLoaded', () => {
    setupProfileDropdown();
});

// ───── Scroll to Profile Tabs (List/Favs/History) ─────
function goToSection(sectionId) {
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.profile-tabs li').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === sectionId);
    });
}
