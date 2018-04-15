// Leaving notification
window.onbeforeunload = function () {
    return 'You have unsaved changes, are you sure you want to leave?';
}
// Prevent ctrl s
document.addEventListener("keydown", function (ke) {
    if (ke.key == "F5" ||
        (ke.key === "s" && (ke.ctrlKey === true || ke.metaKey === true))) {
        ke.preventDefault();
    }
}, false);