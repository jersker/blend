/*
    Wait until all Javascript is initialized before loading DOM
*/

document.body.style.display = "none";

document.addEventListener("DOMContentLoaded", function(event) {
    document.body.style.display = "block";

    const fadeIn = (el, ms, callback) => {
        ms = ms || 400;
        const finishFadeIn = () => {
            el.removeEventListener('transitionend', finishFadeIn);
            callback && callback();
        };
        el.style.transition = 'opacity 0s';
        el.style.display = '';
        el.style.opacity = 0;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
            el.addEventListener('transitionend', finishFadeIn);
            el.style.transition = `opacity ${ms/1000}s`;
            el.style.opacity = 1
            });
        });
    };

    const fadeOut = (el, ms, callback) => {
        ms = ms || 400;
        const finishFadeOut = () => {
            el.style.display = 'none';
            el.removeEventListener('transitionend', finishFadeOut);
            callback && callback();
        };
        el.style.transition = 'opacity 0s';
        el.style.opacity = 1;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
            el.style.transition = `opacity ${ms/1000}s`;
            el.addEventListener('transitionend', finishFadeOut);
            el.style.opacity = 0;
            });
        });
    };

    const blend_page = document.getElementById("blend_page");
    const help_icon = document.getElementById("help_icon");
    const helper_card = document.getElementById("helper_card");
    const helper_card_x = document.getElementById("x");
    const footer = document.getElementsByTagName("footer")[0].querySelector("div#copyright");

    helper_card.setAttribute("style", "display:none; opacity:0");

    help_icon.addEventListener('click', () => {
        fadeIn(helper_card, 300);
        blend_page.setAttribute("style", "filter:brightness(0.6)");
    });
    helper_card_x.addEventListener('click', () => {
        fadeOut(helper_card, 300, null);
        blend_page.setAttribute("style", "filter:brightness(1)");
    });

    let date = new Date();
    footer.innerHTML = `© ${ date.getFullYear() } Jessica / Blend.js`;

});