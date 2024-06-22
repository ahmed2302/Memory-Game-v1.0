let scoreArray = [];
if (localStorage.getItem("score")) {
  scoreArray = JSON.parse(localStorage.getItem("score"));
  addToRating();
}

let userName;
// click to start game button
document.querySelector(".splash-screen span").onclick = function () {
  userName = prompt("Enter Your Name");
  if (userName == null || userName == "") {
    document.querySelector(".name span").innerHTML = "Unknown";
  } else {
    document.querySelector(".name span").innerHTML = userName;
  }
  document.querySelector(".splash-screen").remove();
  timeer();
  blocks.forEach((block) => {
    block.classList.add("fliped");
    setTimeout(() => {
      block.classList.remove("fliped");
    }, duration * 3);
  });
  document.getElementById("background").play();
};

// main variables
let duration = 1000;
let tries = document.querySelector(".tries span");
let container = document.querySelector(".game-container");
let blocks = Array.from(container.children);
let orderRange = Array.from(Array(blocks.length).keys());
let fliped = [];
let matched = [];

blocks.forEach((block, index) => {
  shuffle(orderRange);
  block.style.order = orderRange[index];
  block.onclick = function () {
    block.classList.add("fliped");
    fliped = blocks.filter((block) => block.classList.contains("fliped"));
    if (fliped.length == 2) {
      noClick();
      isMatched(fliped[0], fliped[1]);
    }
  };
});

function noClick() {
  container.classList.add("no-click");
  setTimeout(() => {
    container.classList.remove("no-click");
  }, duration);
}

function isMatched(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology == fliped[1].dataset.technology) {
    firstBlock.classList.add("matched");
    secondBlock.classList.add("matched");
    firstBlock.classList.remove("fliped");
    secondBlock.classList.remove("fliped");
    document.getElementById("success").play();
    matched.push(firstBlock);
    matched.push(secondBlock);
    if (matched.length == 20) {
      addToLocalStorage();
      addToRating();
      document.getElementById("background").pause();
      setTimeout(() => {
        alert("you win");
        location.reload();
      }, duration / 2);
    }
  } else {
    tries.innerHTML++;
    document.getElementById("fail").play();
    setTimeout(() => {
      firstBlock.classList.remove("fliped");
      secondBlock.classList.remove("fliped");
    }, duration);
  }
}

function addToLocalStorage() {
  let score = {
    name: document.querySelector(".name span").innerHTML,
    tries: tries.innerHTML,
  };
  scoreArray.push(score);
  localStorage.setItem("score", JSON.stringify(scoreArray));
}

function addToRating() {
  document.querySelector(".statistics").innerHTML = "";
  scoreArray.forEach((score) => {
    let div = document.createElement("div");
    let name = document.createElement("span");
    name.appendChild(document.createTextNode(score.name));
    let tries = document.createElement("span");
    tries.appendChild(document.createTextNode(score.tries));
    div.appendChild(name);
    div.appendChild(tries);
    document.querySelector(".statistics").prepend(div);
  });
  let head = document.createElement("div");
  head.classList.add("head");
  let name = document.createElement("span");
  name.appendChild(document.createTextNode("Name"));
  let rating = document.createElement("span");
  rating.appendChild(document.createTextNode("Rating"));
  let tries = document.createElement("span");
  tries.appendChild(document.createTextNode("Tries"));
  head.appendChild(name);
  head.appendChild(rating);
  head.appendChild(tries);
  document.querySelector(".statistics").prepend(head);
}

function timeer() {
  let minutes = 5;
  let second = 0;
  document.querySelector(".timer .second").innerHTML =
    second < 10 ? `0${second}` : second;
  document.querySelector(".timer .minutes").innerHTML =
    minutes < 10 ? `0${minutes}` : minutes;
  let timer = setInterval(() => {
    document.querySelector(".timer .second").innerHTML =
      second < 10 ? `0${second}` : second;
    document.querySelector(".timer .minutes").innerHTML =
      minutes < 10 ? `0${minutes}` : minutes;
    if (second == 0) {
      if (minutes == 0) {
        clearInterval(timer);
        setTimeout(() => {
          alert("You Lose");
          location.reload();
        }, 0);
      }
      minutes--;
      second = 60;
    }
    second--;
  }, duration / 2);
}

function shuffle(array) {
  let current = array.length,
    temp,
    random;
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }
  return array;
}
