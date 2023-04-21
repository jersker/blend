/*
    Wait until all Javascript is initialized before loading DOM
*/

document.body.style.display = "none";

document.addEventListener("DOMContentLoaded", function(event) {
    document.body.style.display = "block";

    let date = new Date();
    const footer = document.getElementsByTagName("footer")[0].querySelector("div#copyright");
    footer.innerHTML = `© ${date.getFullYear()} Jessica / Blend.js`;

});