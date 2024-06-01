"use strict";

window.addEventListener("DOMContentLoaded", () => {
  //tabs start
  const tabs = document.querySelectorAll(".tabheader__items .tabheader__item");
  const tabContent = document.querySelectorAll(".tabcontainer .tabcontent");
  const tabsParent = document.querySelector(".tabheader__items");
  let animate = false;

  function hideTabContent() {
    tabContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", `${animate ? "fade" : null}`);
    });
    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }
  function showTabContent(item = 0) {
    tabContent[item].classList.remove("hide");
    tabContent[item].classList.add("show", `${animate ? "fade" : null}`);
    tabs[item].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (e) => {
    if (e.target && e.target.matches(".tabheader__item")) {
      tabs.forEach((item, index) => {
        if (e.target === item) {
          hideTabContent();
          showTabContent(index);
        }
      });
    }
  });
  // tabs end
  // timer start
  const deadline = "2024-05-21";

  function getTimeRemaining(endTime) {
    let days, hours, minutes, seconds;
    const total = Date.parse(endTime) - Date.parse(new Date());

    if (total <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      days = Math.floor(total / (1000 * 60 * 60 * 24));
      hours = Math.floor(((total / 1000) * 60 * 60) % 24);
      minutes = Math.floor((total / 1000 / 60) % 60);
      seconds = Math.floor((total / 1000) % 60);
    }

    return { total, days, hours, minutes, seconds };
  }

  function setZero(n) {
    return n >= 0 && n < 10 ? `0${n}` : n;
  }

  function setClock(selector, endTime) {
    const timer = document.querySelector(selector);
    const daysElements = timer.querySelector("#days");
    const hoursElements = timer.querySelector("#hours");
    const minutsElements = timer.querySelector("#minutes");
    const secondsElements = timer.querySelector("#seconds");
    const IDinterval = setInterval(updateClock, 1000);
    updateClock();
    function updateClock() {
      const { total, days, hours, minutes, seconds } =
        getTimeRemaining(endTime);

      daysElements.innerHTML = setZero(days);
      hoursElements.innerHTML = setZero(hours);
      minutsElements.innerHTML = setZero(minutes);
      secondsElements.innerHTML = setZero(seconds);

      if (total.total <= 0) {
        clearInterval(IDinterval);
      }
    }
  }
  setClock(".timer", deadline);
  // timer end
  // modal start
  const openModalBtn = document.querySelectorAll("[data-open-modal]");
  const modal = document.querySelector("[data-modal]");
  const closeModalBtn = document.querySelector("[data-close-modal]");

  function openModal() {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    modal.dataset.isOpen = true;

    clearTimeout(modalTimerId);
  }

  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  function closeModalAnotherVariants(event) {
    if (event.target === modal || event.code === "Escape") {
      if (modal.matches(".show")) {
        closeModal();
      }
    }
  }

  openModalBtn.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  closeModalBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => closeModalAnotherVariants(e));

  document.addEventListener("keydown", (e) => closeModalAnotherVariants(e));

  const modalTimerId = setTimeout(openModal, 50000);

  function showModalByScroll() {
    if (
      window.scrollY + document.documentElement.clientHeight >=
        document.documentElement.scrollHeight &&
      modal.dataset.isOpen === "false"
    ) {
      openModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }
  window.addEventListener("scroll", showModalByScroll);
  //modal end
  //Menu Card start
  class MenuCard {
    constructor(src, alt, title, descr, price, parent) {
      this.parent = document.querySelector(parent);
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.change = 398.5;
      this.changeToAmd();
    }

    changeToAmd() {
      this.price = this.price * this.change;
    }
    render() {
      const element = document.createElement("div");
      element.style.cssText = "max-width = 300px";
      const { src, alt, title, descr, price } = this;
      element.innerHTML += `
        <div class="menu__item" style= "max-width = 280px">
        <img src=${src} alt=${alt} />
        <h3 class="menu__item-subtitle">${title}</h3>
        <div class="menu__item-descr">
          ${descr}
        </div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${price.toFixed(
            2
          )}</span> Amd/день</div>
        </div>
       </div>
        `;
      this.parent.append(element);
    }
  }

  getData("http://localhost:8888/menu").then((data) =>
    data.forEach((item) => {
      new MenuCard(
        `../back/uploads/${item.image}`,
        `${item.title}`,
        `${item.title}`,
        `${item.description}`,
        `${item.price}`,
        ".menu__field .container"
      ).render();
    })
  );

  // forms start

  async function postData(url, data) {
    return await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: data,
    });
  }

  async function getData(url) {
    const result = await fetch(url);

    if (result.ok) {
      return await result.json();
    }
  }

  const forms = document.querySelectorAll("form");
  const status = document.querySelector(".status");
  forms.forEach((form) => bindpostData(form));

  const messages = {
    loading: "Загрузка",
    success: "Успех",
    failure: "Отказ",
  };

  function bindpostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.textContent = messages.loading;

      const data = JSON.stringify(Object.fromEntries(new FormData(e.target)));

      postData("http://localhost:8888/data", data)
        .then((res) => {
          if (!res.ok) {
            status.textContent = messages.failure;
          } else {
            status.textContent = messages.success;
          }
        })
        .catch((err) => {
          status.textContent = messages.failure;
        })
        .finally(() => {
          const timerID = setTimeout(() => {
            e.target.reset();
            status.textContent = "";
            clearTimeout(timerID);
          }, 1500);
        });
    });
  }

  // const table = document.createElement("table");
  // const thead = document.createElement("thead");
  // const tbody = document.createElement("tbody");
  // table.append(thead,tbody);
  // document.body.append(table)

  // thead.innerHTML +=`
  // <tr>
  // <th>Id</th>
  // <th>Full Name</th>
  // <th>Phone Number</th>
  // </tr>
  // `

  // fetch("http://localhost:8888/users")
  // .then(data=>data.json())
  // .then((data)=>{
  //     data.forEach(({id,name,phone})=>{
  //         tbody.innerHTML+=`
  //         <tr>
  //         <td>${id}</td>
  //         <td>${name}}</td>
  //         <td>${phone}</td>
  //         </tr>

  //         `
  //     })
  // })
  // .catch(err=>console.log(err))
});
