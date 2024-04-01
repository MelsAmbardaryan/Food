"use strick"

window.addEventListener("DOMContentLoaded",()=>{
    //tabs start
    const tabs = document.querySelectorAll(".tabheader__items .tabheader__item");
    const tabContent = document.querySelectorAll(".tabcontainer .tabcontent");
    const tabsParent = document.querySelector(".tabheader__items");
    let animate = false;
    

    function hideTabContent(){
        tabContent.forEach(item =>{
            item.classList.add("hide")
            item.classList.remove("show", `${animate ? "fade": null}`)
        })
        tabs.forEach(item=>{
            item.classList.remove("tabheader__item_active")
        })
    }
    function showTabContent(item = 0){
     tabContent[item].classList.remove("hide")  
     tabContent[item].classList.add("show", `${animate ? "fade" : null}`)
     tabs[item].classList.add("tabheader__item_active")
    }
      
    hideTabContent()
    showTabContent()

    tabsParent.addEventListener("click", (e)=>{
        if(e.target && e.target.matches(".tabheader__item")){
            tabs.forEach((item,index)=>{
                if(e.target === item){
                    hideTabContent()
                    showTabContent(index)
                }
            })
        }
    })
// tabs end
// timer start
const dideline = "2024-05-21";

function getTimeRemaining(endTime){
    let dyas,hours,minutes,seconds
    const total = Date.parse(endTime) - Date.parse(new Date());

    if(total <= 0){
        days = 0;
        hours = 0;
        minutes = 0;
        seconds = 0;
    }else{
        days = Math.floor(total / (1000 * 60 * 60 * 24));
        hours = Math.floor((total / 1000 * 60 * 60) % 24);
        minutes = Math.floor((total / 1000 / 60) % 60);
        seconds = Math.floor((total/ 1000) %60)
    }
    


    return {total,days,hours,minutes,seconds}
    
}

function setZero(n){
    return n>=0 && n<10? `0${n}`:n
}

function setClock(selector,endTime){
    const timer = document.querySelector(selector);
    const daysElements = timer.querySelector("#days");
    const hoursElements = timer.querySelector("#hours");
    const minutsElements = timer.querySelector("#minutes");
    const secondsElements = timer.querySelector("#seconds");
    const IDinterval = setInterval(updateClock,1000)
     updateClock() 
    function updateClock(){

        const {total,days,hours,minutes,seconds} = getTimeRemaining(endTime)

        daysElements.innerHTML =setZero(days);
        hoursElements.innerHTML =setZero(hours);
        minutsElements.innerHTML =setZero(minutes);
        secondsElements.innerHTML =setZero(seconds)

    if(total.total <=0){
        clearInterval(IDinterval)
    }

    }


}
setClock(".timer",dideline)
// timer end
// modal start
const openModalBtn = document.querySelectorAll("[data-open-modal]");
const modal = document.querySelector("[data-modal]");
const closeModalBtn = document.querySelector("[data-close-modal]");

function openModal(){
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    modal.dataset.isOpen = true

    clearTimeout(modalTimerId)
}
function closeModal(){
    modal.classList.remove("show");
    document.body.style.overflow = "";
    
}
function closeModalAnotherVariants(event){
    if(event.target === modal || event.code === "Escape"){
        if(modal.matches(".show")){
        closeModal()
        }
        
    }
}

openModalBtn.forEach(btn=>{
    btn.addEventListener("click",openModal);
});

closeModalBtn.addEventListener("click",closeModal);

modal.addEventListener("click",(e)=>closeModalAnotherVariants(e))

document.addEventListener("keydown",(e)=>closeModalAnotherVariants(e))

const modalTimerId = setTimeout(openModal,50000)


function showModalByScroll(){
    if(window.scrollY + document.documentElement.clientHeight >= 
        document.documentElement.scrollHeight &&
        modal.dataset.isOpen === "false"
        ){
        openModal()
        window.removeEventListener("scroll",showModalByScroll)
    }
}
window.addEventListener("scroll",showModalByScroll)
//modal end
})
