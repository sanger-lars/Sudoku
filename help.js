class Help {
  log = console.log;
  alone(id) {
    return new Promise((resolve, reject) => {
      let felter = document.querySelector(id).querySelectorAll(".felt");
      let t, feltNr, nr;
      for (t = 0; t < felter.length; t++) {
        if (felter[t].querySelectorAll(".skjul").length === 8) {
          feltNr = t;
          nr = felter[t].querySelectorAll(".s:not(.skjul):not(.tom)")[0].innerText;
          felter[t].classList.add("green");
          break;
        }
      }

      setTimeout(function () {
        if (feltNr) {
          alert(`Da tallet ${nr} er alene her, skal det stå i dette felt. `);
          resolve(true);
        } else resolve(false);
      }, 0);
    });
  }

  rude(id) {
    return new Promise((resolve, reject) => {
      let test, rudeNr, arr, nr, tekst;
      let found = false;
      const plade = document.querySelector(id);
      const ruder = plade.querySelectorAll(".rude");
      rudeNr = 1;
      for (const rude of ruder) {
        log(rudeNr);
        arr = [];
        rude.querySelectorAll(".s:not(.skjul):not(.tom)").forEach(smallNr => {
          arr.push(smallNr.innerText);
        });
        //arr = arr.sort(); You don't have to sort it
        for (nr = 1; nr < 10; nr++) {
          test = arr.indexOf(nr.toString());
          if (test > -1) {
            if (!(arr.lastIndexOf(nr.toString()) > test)) {
              tekst = `${nr} er unikt i Rude ${rudeNr}.`;
              found = true;
              break;
            }
          }
        }
        if (found) {
          plade
            .querySelector(`#R${rudeNr}`)
            .querySelectorAll(".s:not(.skjul):not(.tom)")
            .forEach(smallNr => {
              if (smallNr.innerText == nr) {
                smallNr.parentNode.classList.add("green");
                setTimeout(function () {
                  alert(tekst);
                }, 100);
                resolve(true);
              }
            });
          break;
        }
        rudeNr++;
      } // ruder
      resolve(false);
    });
  }

  //rkk = [[], ["F1", "F2", "F3"], ["F4", "F5", "F6"], ["F7", "F8", "F9"]];

  test() {
    /*     function find_celle(str) {
      const samlet = str.split("-");
      const nnr = samlet[1].slice(-1);
      return document.getElementById(samlet[0]).children[nnr - 1];
    }  
    function lav_rækkeArr(rudeNr, feltNr = 1) {
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
    }*/

    let rkkArr = [];
    let L,
      tempArr,
      arr = [[]];
    for (let r = 1; r <= 7; r += 3) {
      for (let f = 1; f <= 7; f += 3) {
        rkkArr = lav_rækkeArr(`R${r}`, `F${f}`);
        rkkArr.forEach(feltID => {
          const felt = find_celle(feltID);
          if (felt.querySelector(".L") == null) L = "";
          else L = felt.querySelector(".L").innerText;
          tempArr = [L];
          felt.querySelectorAll(".s:not(.skjul):not(.tom)").forEach(smallNr => {
            tempArr.push(smallNr.innerText);
          });
          arr.push(tempArr);
        });
      }
    }
    return arr;
  }
} // class
