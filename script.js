const log = console.log;
const rkk = [[], ["F1", "F2", "F3"], ["F4", "F5", "F6"], ["F7", "F8", "F9"]];
const kol = [[], ["F1", "F4", "F7"], ["F2", "F5", "F8"], ["F3", "F6", "F9"]];
let undos = [""];
let undoPointer = -1;
let bookmarkArr = [];
let moves = { m: [], bm: [] };
let help = new Help();

// const s_numbers = document.querySelectorAll(".s");
document.getElementById("clear").onclick = clear;
document.getElementById("undo-knap").onclick = hent_undo;
document.getElementById("link-knap").onclick = lav_bookmark_link;

document.getElementById("forward-knap").addEventListener("click", e => {
  undoPointer++;
  const p = undoPointer;
  if (p < undos.length) hent_undo(p);
  else {
    alert("Du kan ikke gå længere frem.");
    undoPointer--;
  }
});

document.getElementById("mark-knap").addEventListener("click", () => {
  bookmarkArr.push(undoPointer);
  show_bookmarks();
});

document.getElementById("help-knap").addEventListener("click", async () => {
  if (await help.alone(".plade")) return;
  if (await help.rude(".plade")) return;
  alert("ingen løsning");
});

document.querySelector(".plade").addEventListener("click", e => {
  e.target.parentNode.classList.toggle("green", false);
  if (e.target.classList[0] === "s") {
    const nrFelt = e.target.parentNode.children[5];
    const nr = e.target.innerText;
    nrFelt.innerText = nr;
    e.target.classList.add("skjul");

    const feltNr = e.target.parentNode.id;
    const rudeNr = e.target.parentNode.parentNode.id;
    behandl_soduko(rudeNr, feltNr, nr);
    setTimeout(function () {
      if (sudoku_finished()) alert("Du klarede den. Tillykke !");
    }, 100);
  }
});

document.querySelector(".plade").addEventListener("contextmenu", e => {
  e.target.parentNode.classList.toggle("green", false);
  if (e.target.classList[0] === "s") {
    e.preventDefault();
    e.target.classList.add("skjul");
    const nr = e.target.innerHTML;
    const feltNr = e.target.parentElement.id;
    const rudeNr = e.target.parentElement.parentElement.id;
    const t = rudeNr + feltNr + `-${nr}`;
    gem_undo(t);
  }
});

document.querySelector(".bookmarks").addEventListener("click", e => {
  if (e.target.classList[0] === "mark") hent_undo(parseInt(e.target.innerText));
});

document.querySelector(".bookmarks").addEventListener("contextmenu", e => {
  e.preventDefault();
  if (e.target.classList[0] === "mark") {
    const fundet = bookmarkArr.indexOf(parseInt(e.target.innerText));
    if (fundet !== -1) {
      bookmarkArr.splice(fundet, 1);
      e.target.remove();
    }
  }
});

function lav_rækkeArr(rudeNr, feltNr) {
  // find rækkeNr

  let rkkNr, i;
  for (i = 1; i < 4; i++) {
    if (rkk[i].includes(feltNr)) {
      rkkNr = i;
      break;
    }
  }

  // find første rude i rækken
  let R = rudeNr.slice(-1);
  if (R < 4) R = 1;
  else if (R < 7) R = 4;
  else R = 7;

  let tekst;
  let arr = [];
  for (i = 0; i < 3; i++) {
    tekst = "-" + rkk[rkkNr][i];
    arr.push("R" + R + tekst);
    arr.push("R" + (R + 1) + tekst);
    arr.push("R" + (R + 2) + tekst);
  }
  arr.sort();
  return arr;
}

function lav_kolonneArr(rudeNr, feltNr) {
  // find kolNr
  let kolNr, i;
  for (i = 1; i < 4; i++) {
    if (kol[i].includes(feltNr)) {
      kolNr = i;
      break;
    }
  }

  // find første rude i kolonnen
  let R = parseInt(rudeNr.slice(-1));
  while (R > 3) {
    R -= 3;
  }
  let tekst;
  let arr = [];
  for (i = 0; i < 3; i++) {
    tekst = "-" + kol[kolNr][i];
    arr.push("R" + R + tekst);
    arr.push("R" + (R + 3) + tekst);
    arr.push("R" + (R + 6) + tekst);
  }
  arr.sort();
  return arr;
}

function lav_rudeArr(rudeNr) {
  let i;
  let arr = [];
  for (i = 1; i < 10; i++) {
    arr.push(rudeNr + "-F" + i);
  }
  return arr;
}

function behandl_soduko(rudeNr, feltNr, nr) {
  function fjern_s(arr, nr) {
    let a;
    if (Array.isArray(arr)) {
      arr.forEach(element => {
        a = find_celle(element);
        a.querySelectorAll(".s")[nr].classList.add("skjul");
      });
    } else {
      a = find_celle(arr);
      a.querySelectorAll(".s").forEach((element, index) => {
        if (index !== 0) element.classList.add("skjul");
      });
    }
  }

  const rkkArr = lav_rækkeArr(rudeNr, feltNr);
  const kolArr = lav_kolonneArr(rudeNr, feltNr);
  const rudeArr = lav_rudeArr(rudeNr);
  fjern_s(rudeNr + "-" + feltNr, nr);
  fjern_s(rkkArr, nr);
  fjern_s(kolArr, nr);
  fjern_s(rudeArr, nr);
  const t = rudeNr + feltNr + `+${nr}`;
  gem_undo(t);
}

function find_celle(str) {
  const samlet = str.split("-");
  const nnr = samlet[1].slice(-1);
  return document.getElementById(samlet[0]).children[nnr - 1];
}

function clear() {
  let i = 0;
  document.querySelectorAll(".s").forEach((f, index) => {
    if (f.className == "s skjul") {
      f.className = "s";
    }
    f.innerHTML = i;
    i++;
    if (i == 10) i = 0;
  });

  document.querySelectorAll(".L").forEach((f, index) => {
    f.innerHTML = "";
  });

  gem_undo("clear");
}

function update_uNr() {
  document.getElementById("uNr").innerText = undoPointer;
}

function sudoku_finished() {
  if (undoPointer < 81) return false;
  const numre = document.querySelectorAll(".L"),
    len = numre.length;
  let n,
    OK = true;
  for (n = 0; n < len; n++) {
    if (numre[n].innerText == "") return false;
  }
  return true;
}

function gem_undo(mark = 0) {
  const u = document.querySelector(".plade");
  undoPointer++;
  undos[undoPointer] = u.innerHTML;
  if (mark !== 0) moves.m[undoPointer] = mark;
  update_uNr();
}

function show_bookmarks() {
  let div = document.querySelector(".bookmarks");
  div.innerHTML = "";
  bookmarkArr.forEach(mark => {
    let sp = document.createElement("div");
    sp.classList.add("mark");
    sp.innerText = mark;
    div.appendChild(sp);
  });
}

function hent_undo(mark) {
  const u = document.querySelector(".plade");
  if (undoPointer) {
    if (mark > 0) undoPointer = mark + 1;
    undoPointer--;
    u.innerHTML = undos[undoPointer];
    update_uNr();
  }
}

function lav_bookmark_link() {
  let url = document.URL;
  if (url.includes("?")) url = url.split("?")[0];
  let link = url + "?moves=," + undoPointer;
  moves.m.forEach(e => {
    link += `,${e}`;
  });
  bookmarkArr.forEach(e => {
    link += `,B${e}`;
  });
  navigator.clipboard.writeText(link).then(
    function () {
      alert("Linket er kopieret til clipboard !");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

navigator.serviceWorker.register("sw.js");
var zzz = "";
zzz = window.location.search;
gem_undo();

if (zzz !== "") {
  let arr = zzz.split(",");

  let t;
  for (t = 2; t < arr.length; t++) {
    if (arr[t] === "clear") {
      clear();
      continue;
    }
    if (arr[t].substr(4, 1) === "+") {
      let nr = parseInt(arr[t].substr(-1));
      let nr2 = nr > 4 ? nr + 2 : nr;

      let target = document.getElementById(arr[t].substr(0, 2)).children[
        arr[t].substr(3, 1) - 1
      ].children[nr2];

      const nrFelt = target.parentNode.children[5];
      nr = target.innerText;
      nrFelt.innerText = nr;
      target.classList.add("skjul");

      const feltNr = target.parentNode.id;
      const rudeNr = target.parentNode.parentNode.id;
      behandl_soduko(rudeNr, feltNr, nr);
      continue;
    }
    if (arr[t].substr(4, 1) === "-") {
      let nr = parseInt(arr[t].substr(-1));
      let nr2 = nr > 4 ? nr + 2 : nr;
      let target = document.getElementById(arr[t].substr(0, 2)).children[
        arr[t].substr(3, 1) - 1
      ].children[nr2];
      target.classList.add("skjul");

      const feltNr = arr[t].substr(2, 2);
      const rudeNr = arr[t].substr(0, 2);
      const tekst = rudeNr + feltNr + `-${nr}`;
      gem_undo(tekst);
      continue;
    }
    if (arr[t].substr(0, 1) === "B") {
      bookmarkArr.push(parseInt(arr[t].substr(1, 3)));
    }
  }
  show_bookmarks();
  undoPointer = parseInt(arr[1]);
  hent_undo(undoPointer);
}

log(help.test(".plade"));
//  function main() {}

//main();
