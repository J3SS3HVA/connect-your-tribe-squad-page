const burger = document.querySelector("h1 a")
const menu = document.querySelector(".menu")

burger.addEventListener("click", function() {
    menu.classList.toggle('show-menu');
});