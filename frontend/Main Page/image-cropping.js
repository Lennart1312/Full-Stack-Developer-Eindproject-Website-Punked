document.addEventListener("DOMContentLoaded", () => {
    const profileImageInput = document.getElementById('profileImage');
    const avatarPreview = document.getElementById('avatarPreview');
    const cropContainer = document.getElementById('crop-container');
    const cropImage = document.getElementById('crop-image');
    const confirmCropBtn = document.getElementById('confirm-crop');
    const resetAvatarBtn = document.getElementById('reset-avatar');
    let cropper;

    // ─── Load Avatar on Page Load ───
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        avatarPreview.src = savedAvatar;
        document.querySelectorAll('.avatar, .profile-icon, .dropdown-avatar')
            .forEach(img => img.src = savedAvatar);
    }

    // ─── Handle New Image Upload ───
    profileImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            cropImage.src = event.target.result;
            cropContainer.style.display = 'flex';

            cropImage.onload = function () {
                if (cropper) cropper.destroy();
                cropper = new Cropper(cropImage, {
                    aspectRatio: 1,
                    viewMode: 1,
                    background: false,
                    autoCropArea: 1,
                    movable: true,
                    zoomable: true,
                    scalable: false,
                    rotatable: false,
                });
            };
        };

        reader.onerror = () => {
            alert("Error reading image. Try again.");
        };

        reader.readAsDataURL(file);
    });

    // ─── Confirm & Save Cropped Avatar ───
    confirmCropBtn.addEventListener('click', () => {
        if (!cropper) return;

        const canvas = cropper.getCroppedCanvas({ width: 200, height: 200 });
        const avatarDataURL = canvas.toDataURL('image/png');

        avatarPreview.src = avatarDataURL;
        localStorage.setItem('userAvatar', avatarDataURL);

        document.querySelectorAll('.avatar, .profile-icon, .dropdown-avatar')
            .forEach(img => img.src = avatarDataURL);

        cropContainer.style.display = 'none';
        cropper.destroy();
        cropper = null;
    });

    // ─── Reset Avatar to Default ───
    if (resetAvatarBtn) {
        resetAvatarBtn.addEventListener('click', () => {
            const defaultAvatar = '../Assets/StandardIcon.png';
            localStorage.removeItem('userAvatar');
            avatarPreview.src = defaultAvatar;
            document.querySelectorAll('.avatar, .profile-icon, .dropdown-avatar')
                .forEach(img => img.src = defaultAvatar);
            alert("Avatar reset to default.");
        });
    }
});
