import _, { clone } from "lodash";
import "../styles/index.scss";
import logo from "../assets/swordnshield.svg";
import skeletonMage from "../assets/skeleton_mage.png";
import skeletonWarrior from "../assets/skeleton_warrior.png";

document.getElementById("main-logo").src = logo;

const changeMap = {
  showBattleMap: (t) => {
    const url = document.getElementById(`${t}-url`).value;
    const img = document.getElementById("map-img");
    img.src = url;
    changeMap.handleStorage(url);
  },
  handleDisplay() {
    const buttons = document.querySelectorAll(".map-url");
    buttons.forEach((el) =>
      el.addEventListener("click", () => {
        this.showBattleMap(el.getAttribute("data-value"));
      })
    );
  },
  handleStorage(value) {
    localStorage.setItem("mapchange", "true");
    localStorage.setItem("mapurl", value);
  },
};
changeMap.handleDisplay();

const handleFields = {
  newPlayerField: () => {
    const buttons = document.querySelectorAll(".new-combatant-field");
    buttons.forEach((el) =>
      el.addEventListener("click", () => {
        handleFields.newField(el.getAttribute("data-value"));
      })
    );
  },
  htmlTemplate: (t) => {
    return `
      <input class="${t}-name" placeholder="Name" />
      <input class="${t}-hp" placeholder="HP" />
      <input class="${t}-initiative" placeholder="Init" />
      <input class="${t}-bonus" placeholder="Bonus" />
    `;
  },
  selectHtml() {
    return `
      <option value="jukusan">Jukusan</option>
      <option value="visna">Visna</option>
      <option value="orc_1">Orc_1</option>
      <option value="orc_2">Orc_2</option>
      <option value="orc_3">Orc_3</option>
    `;
  },
  newField: (t) => {
    const target = document.getElementById(`combatant-${t}-form-container`);
    const form = document.createElement("form");
    form.classList.add("combatant-form");
    t === "pl"
      ? form.setAttribute("combatant-type", "player")
      : form.setAttribute("combatant-type", "enemy");
    const finput = handleFields.htmlTemplate(t);
    form.innerHTML = finput;
    const div = document.createElement("div");
    div.classList.add("combatant-form-row");
    const button = handleFields.removeButton();
    if (t === "en") {
      const dice = handleFields.diceButton();
      form.append(dice);
    }
    const select = document.createElement("select");
    select.innerHTML = handleFields.selectHtml();
    form.prepend(select);
    form.append(button);
    div.append(form);
    target.append(div);
  },
  removeButton() {
    const button = document.createElement("button");
    button.classList.add("ci-remove");
    button.textContent = "X";
    button.type = "button";
    button.addEventListener("click", () => {
      button.parentElement.parentElement.remove();
    });
    return button;
  },
  diceButton() {
    const button = document.createElement("button");
    button.classList.add("material-symbols-outlined", "ci-dice");
    button.textContent = "casino";
    button.type = "button";
    button.addEventListener("click", () => {
      button.parentElement.children[2].value =
        Math.floor(Math.random() * 20) + 1;
    });
    return button;
  },
};
handleFields.newPlayerField();

let combatantData = [];
let sortedcombatantData = [];

const handleCombatantsData = {
  getData() {
    const forms = document.querySelectorAll(".combatant-form");
    forms.forEach((form) => {
      let type = form.getAttribute("combatant-type");
      let data = {
        img: form[0].value,
        name: form[1].value,
        hp: Number(form[2].value),
        init: Number(form[3].value) + Number(form[4].value),
        type: type,
      };
      combatantData.push(data);
    });
  },
  handleData: () => {
    sortedcombatantData = combatantData.sort((a, b) => {
      return b.init - a.init;
    });
    localStorage.setItem("combatantData", JSON.stringify(sortedcombatantData));
  },
  displayCombatants: () => {
    const btn = document.getElementById("start-combat");
    btn.addEventListener("click", () => {
      handleCombatantsData.getData();
      handleCombatantsData.handleData();
      handleSlides.makeSlides();
      handleSlides.setActive();
      handleSlides.removeSlide();
      localStorage.setItem("newTracker", "true");
    });
  },
};

handleCombatantsData.displayCombatants();

const handleSlides = {
  makeSlides: () => {
    const t = document.getElementById("combatant-tracker");
    for (let i = 0; i < sortedcombatantData.length; i++) {
      const div = document.createElement("div");
      div.classList.add("combatant-slide");
      if (sortedcombatantData[i].type === "enemy") {
        div.classList.add("combatant-enemy");
      } else {
        div.classList.add("combatant-player");
      }
      div.innerHTML = handleSlides.slideHtml(
        sortedcombatantData[i].name,
        sortedcombatantData[i].img
      );
      t.append(div);
      div.setAttribute("data-name", sortedcombatantData[i].name);
    }
  },
  setActive() {
    const t = document.getElementById("combatant-tracker");
    t.children[0].classList.add("combatant-slide-active");
  },
  slideHtml(name, img) {
    return `
        <div class="combatant-card-image">
          <img src="../src/assets/${img}.png" class="combatant-image">
        </div>
        <div class="combatant-card-name">
          <p>${name}</p>
        </div>
    `;
  },
  removeSlide() {
    const slides = document.querySelectorAll(".combatant-slide");
    slides.forEach((slide) =>
      slide.addEventListener("click", () => {
        if (slide.classList.contains("combatant-slide-active")) return;
        let a = Array.from(slide.parentElement.children).indexOf(slide);
        handleSlides.handleLocalStorage(a);
        slide.remove();
      })
    );
  },
  handleLocalStorage(x) {
    localStorage.setItem("slideIndex", x);
    localStorage.setItem("slideIndexChange", "true");
  },
};

const test12 = document.getElementById("display-map");
test12.addEventListener("click", () => {
  localStorage.setItem("battlemap", "test");
});

const handleSlideMovement = {
  moveRight() {
    const r = document.getElementById("arrow-right");
    r.addEventListener("click", () => {
      testSlides.moveRight();
      localStorage.setItem("keypressright", "true");
    });
  },
  moveLeft() {
    const l = document.getElementById("arrow-left");
    l.addEventListener("click", () => {
      testSlides.moveLeft();
      localStorage.setItem("keypressleft", "true");
    });
  },
  handleBoth() {
    this.moveRight();
    this.moveLeft();
  },
};

handleSlideMovement.handleBoth();

const testSlides = {
  moveRight() {
    const slides = document.querySelectorAll(".combatant-slide");
    const index = this.findActive();
    slides[index].classList.remove("combatant-slide-active");
    if (index === slides.length - 1) {
      slides[0].classList.add("combatant-slide-active");
    } else {
      slides[index + 1].classList.add("combatant-slide-active");
    }
  },
  moveLeft() {
    const slides = document.querySelectorAll(".combatant-slide");
    const index = this.findActive();
    slides[index].classList.remove("combatant-slide-active");
    if (index === 0) {
      slides[slides.length - 1].classList.add("combatant-slide-active");
    } else {
      slides[index - 1].classList.add("combatant-slide-active");
    }
  },
  findActive() {
    const slide = document.querySelector(".combatant-slide-active");
    const index = Array.from(slide.parentElement.children).indexOf(slide);
    return index;
  },
};

const eq = document.querySelectorAll(".combatant-image");
eq.forEach((el) => (el.src = skeletonMage));

const idleBtn = document.getElementById("idle-screen-btn");
idleBtn.addEventListener("click", () => {
  localStorage.setItem("idleScreen", "true");
});

const btn = document.getElementById("clear-combat-tracker");
btn.addEventListener("click", () => {
  const t = document.getElementById("combatant-tracker");
  combatantData = [];
  sortedcombatantData = [];
  localStorage.setItem("clearTracker", "true");
  while (t.firstChild) {
    t.removeChild(t.lastChild);
  }
});
