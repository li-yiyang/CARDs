// bottom_button function
function addCard() {
  var res = addaCard()
  if (res) {
    cardDataArray.push(res);
    cardsDataEndTag += 1;
    refreshWindow();
  }
}

let nameIndex = 0;
let idIndex = 1;
let motoIndex = 2;
let bgIndex = 3;
let iconIndex = 4;
let nextIndex = 5;
let rollingSpeed = 1.5;

var cardsDataEndTag = "";
var cardDataArray = [];
var collectionPosition = 0;
var collectionsView = null;

document.onreadystatechange = function () {
  if (document.readyState == 'complete') {
    collectionsView = document.getElementById("collections");
    if (updateData()) { } else { document.location.replace("./welcome.html") };
    refreshWindow();

    // add wheel event
    document.getElementById("collections").addEventListener('wheel', function (event) {
      var topPostion = collectionsView.offsetTop;
      var bottomPostion = topPostion + collectionsView.offsetHeight;

        if (event.deltaY > 0 && bottomPostion > document.getElementById('background').offsetHeight * 0.9) {
            collectionsView.style.top = parseFloat(collectionsView.style.top || 0) - rollingSpeed + 'vh';
        } else if (event.deltaY < 0 && topPostion < document.getElementById('background').offsetHeight * 0.14) {
            collectionsView.style.top = parseFloat(collectionsView.style.top || 0) + rollingSpeed + 'vh';
        }
      })
  }
}

function updateData() {
  cardsDataEndTag = readData("cardsData");

  if (cardsDataEndTag == "" || cardsDataEndTag == 0) {document.location.replace("./welcome.html")}

  var i = 0;
  while (i < cardsDataEndTag) {
    cardDataArray.push(readAtomData(i));
    let next_i = Number(readData(`next_no_${i}`));
    if (i < next_i) {
      i = next_i;
    } else {
      return false;
    }
  }
  return true;
}

// AtomData: [name, id, moto, bg, icon, next]
function readAtomData(i) {
  return [readData(`name_no_${i}`), readData(`id_no_${i}`), readData(`moto_no_${i}`), readData(`bg_no_${i}`), readData(`icon_no_${i}`), readData(`next_no_${i}`)];
}

function deleteDataAt(i) {
  if (i == 0) {return false; }
  let j = cardDataArray.findIndex(element => element[nextIndex] == i);
  if (j == -1) {return false;}
  writeData(`next_no_${cardDataArray[j - 1][nextIndex]}`, String(cardDataArray[j + 1][nextIndex]));
  cardDataArray[j][nextIndex] = `${i}`;
  localStorage.removeItem(`name_no_${i}`);
  localStorage.removeItem(`id_no_${i}`);
  localStorage.removeItem(`moto_no_${i}`);
  localStorage.removeItem(`bg_no_${i}`);
  localStorage.removeItem(`icon_no_${i}`);
  localStorage.removeItem(`next_no_${i}`);
  return true;
}

function refreshWindow() {
  collectionsView.innerHTML = "";

  for (var i = 0; i < cardDataArray.length; i++) {
    addACardToCardCollection(i);
  }
/*
  for (var i = 0; i < selectedCardIndex; i++) {
    offset = calculateOffsetBefore(i, collectionPosition);
    addACardToCardCollection(collectionsView, i, offset);
  }
  offset = calculateOffsetAt(collectionPosition);
  addACardToCardCollection(collectionPosition);
  for (i = selectedCardIndex; i < dataLength; i++) {
    offset = calculateOffsetAfter(i, collectionPosition);
    console.log(offset);
    console.log(i);
    addACardToCardCollection(collectionPosition, i, offset);
  }
*/
}

// Now I use the sine and cosine function to draw the cards. 
// The radius of the semi-circ is 39.71vh, which is half of the card_collections' height. 
// And the 27.25vh is the height of the card
/*
let r = 39.71;
let l = 27.25;

function calculateOffsetAt(selectedCardIndex) {
  return (1 - Math.cos(Math.atan(selectedCardIndex))) * r;
}

function calculateOffsetBefore(i, selectedCardIndex) {
  return (1 - Math.cos(i * Math.atan(selectedCardIndex) / selectedCardIndex)) * r;
}

function calculateOffsetAfter(i, selectedCardIndex) {
  let baseAngle = Math.asin((27.35 - 39.71 * Math.cos(Math.atan(selectedCardIndex))) / 39.71);
  return 39.71 * Math.sin(baseAngle + (i - selectedCardIndex) * (Math.PI - baseAngle) / (readData("cardsData") - selectedCardIndex));
}
*/

function addACardToCardCollection(cardDataArrayIdex) {
  collectionsView.innerHTML += `
  <div class="card" onclick="expandCard('${cardDataArrayIdex}');" id="card_no_${cardDataArrayIdex}" tabindex="${cardDataArrayIdex}" onblur="foldCard('${cardDataArrayIdex}');">
        <div class="info_name">
          ${cardDataArray[cardDataArrayIdex][nameIndex]}
        </div>
        <div class="info_icon">
          <img src="${cardDataArray[cardDataArrayIdex][iconIndex]}">
        </div>
        <div class="info_moto">
          ${cardDataArray[cardDataArrayIdex][motoIndex]}
        </div>
        <div class="edit_box" style="opacity: 0%;">
          <div class="input_tag">
            <span>Icon URL</span>
            <input id="icon_url_${cardDataArrayIdex}" class="input_line" placeholder="${cardDataArray[cardDataArrayIdex][iconIndex]}">
          </div>
          <div class="input_tag">
            <span>Background URL</span>
            <input id="background_url_${cardDataArrayIdex}" class="input_line" placeholder="${cardDataArray[cardDataArrayIdex][bgIndex]}">
          </div>
          <div class="middle_button" onclick="updateAtomData('${cardDataArrayIdex}')" style="margin-top: 1.8vh;" id="update_info_${cardDataArrayIdex}">Update Info</div>
          <div class="middle_button" onclick="" style="margin-top: 1.8vh;">Share QRCode</div>
        </div>
        <div class="background_img">
          <img src="${cardDataArray[cardDataArrayIdex][bgIndex]}">
        </div>
      </div>
  `
}

function _OLD_addACardToCardCollection(collectionsView, i, offset) {
  let name = readData(`name_no_${i}`);
  // let id = readData(`id_no_${i}`);
  let moto = readData(`moto_no_${i}`);
  let icon = readData(`icon_no_${i}`);

  // add a card
  collectionsView.innerHTML += `
  <div class="card" style="top: ${offset}vh;">
    <div class="info_name">
      ${name}
    </div>
    <div class="info_icon">
      <img src="${icon}">
    </div>
    <div class="info_moto">
      ${moto}
    </div>
  </div>`
}

function expandCard(id) {
  card = document.getElementById('card_no_'+id);
  //if (card.offsetHeight > card.offsetWidth * 1.05) {
    card.setAttribute('style', 'height: 60.67vh');
    card.getElementsByClassName("edit_box")[0].setAttribute("style", "opacity: 100%;");
  //}
}

function foldCard(id) {
  card = document.getElementById('card_no_'+id);
  if (card.offsetHeight > card.offsetWidth * 1.33) {
    card.setAttribute('style', '');
    card.getElementsByClassName("edit_box")[0].setAttribute("style", "opacity: 0%;");
  }
  console.log('fold');
}

function fadeIn(element) {
  
}

function updateAtomData(id) {
  let icon_url = document.getElementById(`icon_url_${id}`).value;
  let background_url = document.getElementById(`background_url_${id}`).value;

  cardDataArray[id][iconIndex] = icon_url;
  cardDataArray[id][bgIndex] = background_url;
  
  refreshWindow();
}