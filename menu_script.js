const playClassic = document.querySelector(".classic");
const playCustom = document.querySelector(".custom");
const widthSelector = document.querySelector(".widthSelector");
const heightSelector = document.querySelector(".heightSelector");

playClassic.addEventListener("click", () => {
    window.location.replace("./classic/game.html");
});
playCustom.addEventListener("click", () => {
    let width = widthSelector.value;
    let height = heightSelector.value;
    let redirect = "./custom/game.html?width=" + width + "&height=" + height;
    window.location.replace(redirect);
});

ding = function (tone) {
    playSound("sine", tone, .2);
}