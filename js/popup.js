function showPopup(message, missingType = null) {
    const popup = document.getElementById('popup-message');
    const popupText = document.getElementById('popup-text');
    if (popup && popupText) {
        popupText.innerHTML = message;
        if (missingType) {
            popupText.classList.add(missingType);
        }
        popup.style.display = 'block';
    }
}

function closePopup() {
    const popup = document.getElementById('popup-message');
    const popupText = document.getElementById('popup-text');
    if (popup) {
        popup.style.display = 'none';
        popupText.classList.remove('missing-coins', 'missing-bth');
    }
}

export { showPopup, closePopup };