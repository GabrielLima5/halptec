function navBarSettings(){
    const ul = document.querySelector(".menu")
    const section = document.querySelectorAll("section")
    
    document.querySelector(".open-menu").addEventListener('click', e => {
        ul.classList.add("open");
        section.forEach(element => {
            element.style.opacity = 0.3;
        })
    });
    
    document.querySelector(".close-menu").addEventListener('click', e => {
        ul.classList.remove("open");
        section.forEach(element => {
            element.style.opacity = 1
        })
    })
}

function showOrHide(element){
    element.classList.toggle("hide")
}

function rotateArrow(element){
    element.classList.toggle("rotate")
}

function buttonSettings(){
    const buttons = [];
    const btn1 = document.querySelectorAll("button");
    const products = [document.querySelector("#product-1"), document.querySelector("#product-2"), document.querySelector("#product-3"), document.querySelector("#product-4"), document.querySelector("#product-5"), document.querySelector("#product-6"), document.querySelector("#product-7"), document.querySelector("#product-8")]
    
    for (let i = 0; i<=btn1.length-1; i++){
        if (btn1[i].className.includes("btn")){
            buttons.push(btn1[i])
        }
    }

    buttons.forEach((btn, i) =>{
        buttons[i].addEventListener('click', e => {
            showOrHide(products[i])
            rotateArrow(buttons[i])
        })
    })
}

function animationScroll() {
    const item = document.querySelectorAll("[data-animation]")
    let windowTop = window.pageYOffset + window.innerHeight * 0.80;
    item.forEach(element => {
        if (windowTop > element.offsetTop){
            element.classList.add("animate");
        }
    })
}

setInterval(animationScroll)

function initEvents(){
    navBarSettings()
    buttonSettings()
    animationScroll()
}

window.onload = initEvents