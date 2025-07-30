'use strict'

// const yamate = ["東京", "神田", "秋葉原", "御徒町", "上野",
//   "鶯谷", "日暮里", "西日暮里", "田端", "駒込", "巣鴨", "大塚",
//   "池袋", "目白", "高田馬場", "新大久保", "新宿", "代々木", "原宿",
//   "渋谷", "恵比寿", "目黒", "五反田", "大崎", "品川", "高輪ゲートウェイ",
//   "田町", "浜松町", "新橋", "有楽町",];

const yamate = ["東京", "神田", "秋葉原",];

const dragDrop = () => {
  const resultDiv = document.getElementById("route-map");
  resultDiv.innerHTML = "";

  const stationList = document.createElement("ul");
  stationList.className = "circle";
  stationList.style.listStyle = "none";
  stationList.style.padding = "0";

  const length = yamate.length;
  const angle = 360 / length;
  const radius = 310;

  const yamateShuffle = [...yamate];
  yamateShuffle.shift();
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  shuffleArray(yamateShuffle);
  yamateShuffle.unshift(yamate[0]);

  for (let i = 0; i < yamate.length; i++) {
    const stationItem = document.createElement("li");
    stationItem.className = "circle-item";
    stationItem.id = `station${i}`;
    stationItem.textContent = yamateShuffle[i];
    if (i === 0) {
      stationItem.draggable = false;
    } else {
      stationItem.draggable = true;
      stationItem.style.cursor = "pointer";
    }
    const x = Math.cos((angle * i - 20) * Math.PI / 180) * radius + "px";
    const y = Math.sin((angle * i - 20) * Math.PI / 180 * -1) * radius + "px";
    stationItem.style.cssText += `translate: ${x} ${y}`;

    stationItem.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", event.target.textContent);
      event.target.style.opacity = "0.5";
    });

    stationItem.addEventListener("dragend", (event) => {
      event.target.style.opacity = "1";
    });

    stationList.appendChild(stationItem);

  }

  stationList.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  stationList.addEventListener("drop", (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    const dropTarget = event.target.closest("li");

    if (dropTarget) {
      const draggedItem = Array.from(stationList.children).find(
        (item) => item.textContent === data
      );

      if (draggedItem !== dropTarget) {
        if (dropTarget.id === "station0") {
          alert("東京駅は動かせません");
        } else {
          const tempPosition = draggedItem.style.cssText;
          draggedItem.style.cssText = dropTarget.style.cssText;
          dropTarget.style.cssText = tempPosition;

          const tempId = draggedItem.id;
          draggedItem.id = dropTarget.id;
          dropTarget.id = tempId;
          dropTarget.style.opacity = "1";
        }
      }
    }
  });
  resultDiv.appendChild(stationList);
};

const messageClear = () => {
  Array.from(document.getElementsByClassName("result-message")).map((element) => {
    element.style.display = "none"
  });
};


const gameStart = () => {
  dragDrop();
  const music = document.querySelector("#music");
  audioPlay(music);
  document.getElementsByClassName("start-btn")[0].style.display = "none";
  document.querySelector(".mute-btn").style.display = "block";
};

const restart = () => {
  dragDrop();
  messageClear();
  document.getElementsByClassName("check-answer-btn")[0].style.display = "block";
};

const reset = () => {
  messageClear();
  dragDrop();
};

const audioPlay = (audio) => {
  audio.play();
  audio.volume = 0.2;
};

const checkAnswer = () => {
  messageClear();

  const answer = [];
  for (let i = 0; i < yamate.length; i++) {
    answer.push(document.getElementById(`station${i}`).textContent);
  }

  if (JSON.stringify(answer) === JSON.stringify(yamate)) {
    const soundCorrect = document.querySelector("#correct");
    const soundYay = document.querySelector("#yay");
    audioPlay(soundCorrect);
    audioPlay(soundYay);
    document.getElementsByClassName("result-message clear")[0].style.display = "block";
    document.getElementsByClassName("check-answer-btn")[0].style.display = "none";
  } else {
    const soundFailed = document.querySelector("#failed");
    audioPlay(soundFailed)
    document.getElementsByClassName("result-message failed")[0].style.display = "block";
    setTimeout(messageClear, 1000);
  }
};

const mute = () => {
  const music = document.querySelector("#music");
  const muteBtn = document.querySelector(".mute-btn");

  if (music.muted === false) {
    music.muted = true;
    muteBtn.style.filter = "brightness(0) saturate(100%) invert(78%) sepia(83%) saturate(174%) hue-rotate(146deg) brightness(89%) contrast(92%)";
  } else if (music.muted === true) {
    music.muted = false;
    muteBtn.style.filter = "none";
  }
};

