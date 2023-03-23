/*
    Wait until all Javascript is initialized before loading DOM
*/

document.body.style.display = "none";

document.addEventListener("DOMContentLoaded", function(event) {
    document.body.style.display = "block";
});
