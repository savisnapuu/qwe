import _, { remove } from "lodash";
import "../styles/map.scss";
import skeletonMage from "../assets/skeleton_mage.png";
import idleScreenImage from "../assets/idle-screen.png";

document.getElementById("idle-screen-img").src = idleScreenImage;

window.addEventListener("storage", () => {
  if (localStorage.mapchange === "true") {
    handleMapChange.changeMap();
    localStorage.mapchange = "false";
  }
  if (localStorage.keypressright === "true") {
    testSlides.moveRight();
    localStorage.keypressright = "false";
  }
  if (localStorage.keypressleft === "true") {
    testSlides.moveLeft();
    localStorage.keypressleft = "false";
  }
  if (localStorage.slideIndexChange === "true") {
    removeSlide(localStorage.slideIndex);
    localStorage.slideIndexChange = "false";
  }
  if (localStorage.idleScreen === "true") {
    idleActive ? (idleActive = false) : (idleActive = true);
    idleActive ? hideIdle() : displayIdle();
    localStorage.idleScreen = "false";
  }
  if (localStorage.clearTracker === "true") {
    console.log("SOMETHING");
    removeTracker();
    localStorage.clearTracker = "false";
  }
  if (localStorage.newTracker === "true") {
    handleSlides.makeSlides();
    setActive();
    localStorage.newTracker = "false";
  }
});

function removeTracker() {
  const t = document.getElementById("combatant-tracker");
  while (t.firstChild) {
    t.removeChild(t.lastChild);
  }
}

function setActive() {
  const t = document.getElementById("combatant-tracker");
  t.children[0].classList.add("combatant-slide-active");
}

let idleActive = false;

function displayIdle() {
  const el = document.getElementById("idle-screen");
  el.style.opacity = "1";
}
function hideIdle() {
  const el = document.getElementById("idle-screen");
  el.style.opacity = "0";
}

function removeSlide(index) {
  const tracker = document.getElementById("combatant-tracker");
  tracker.children[index].remove();
}

const handleMapChange = {
  changeMap: () => {
    const t = document.getElementById("main-img");
    const url = localStorage.getItem("mapurl");
    console.log(url);
    let a = JSON.parse(localStorage.getItem("combatantData"));
    t.src = url;
  },
};

const handleSlides = {
  makeSlides: () => {
    let data = JSON.parse(localStorage.getItem("combatantData"));
    const t = document.getElementById("combatant-tracker");
    for (let i = 0; i < data.length; i++) {
      const div = document.createElement("div");
      div.classList.add("combatant-slide");
      if (data[i].type === "enemy") {
        div.classList.add("combatant-enemy");
      } else {
        div.classList.add("combatant-player");
      }
      div.innerHTML = handleSlides.slideHtml(data[i].name);
      t.append(div);
      div.setAttribute("data-name", data[i].name);
    }
  },
  slideHtml(name) {
    return `
        <div class="combatant-card-image">
          <img src="${skeletonMage}" class="combatant-image">
        </div>
        <div class="combatant-card-name">
          <p>${name}</p>
        </div>
    `;
  },
};

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
