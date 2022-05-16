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
      });

      // the following code from https://webkit.org/blog/10855/async-clipboard-api/
      // to fit the browser is a difficult thing...
      document.getElementById("bottom_button_box").addEventListener("click", async clickEvent => {
        let items = await navigator.clipboard.read();
        for (let item of items) {
            if (!item.types.includes("text/plain"))
                continue;
    
            let reader = new FileReader;
            reader.addEventListener("load", loadEvent => {
                addDataByDataString(reader.result);
            });
            reader.readAsText(await item.getType("text/plain"));
            break;
        }
    });
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
  <div class="card" onmouseleave="foldCard('${cardDataArrayIdex}');" onclick="switchCard('${cardDataArrayIdex}');" id="card_no_${cardDataArrayIdex}" style="height: 27.25vh;">
        <div class="info_name">
          ${cardDataArray[cardDataArrayIdex][nameIndex]}
        </div>
        <div class="info_icon">
          <img src="${cardDataArray[cardDataArrayIdex][iconIndex]}">
        </div>
        <div class="info_moto">
          ${cardDataArray[cardDataArrayIdex][motoIndex]}
        </div>
        <div class="qr_code_box" onclick="copyQRCodeData(${cardDataArrayIdex});" hidden>
          <img src="https://api.qrserver.com/v1/create-qr-code/?data=${makeQRCodeData(cardDataArrayIdex)}&size=150x150&color=4D4D4D&bgcolor=FFFEF6" title="复制信息">
        </div>
        <div class="background_img">
          <img src="${cardDataArray[cardDataArrayIdex][bgIndex]}"> 
        </div>
      </div>
  `
}

function addDataByDataString(dataString) {
  console.log('test');
  if (decodeURIComponent(dataString).match(/cards:\/\/\[".+",".+",".+",".+",".+"\]/)) {
    let atomData = eval(decodeURIComponent(dataString).match(/\[.*\]/)[0]);
    for (var i = 0; i < cardDataArray.length; i++) {
      if (atomData[nameIndex] != cardDataArray[i][nameIndex] && 
          atomData[idIndex] != cardDataArray[i][idIndex] && confirm('In your clickboard, there seem to be a new CARDs data, would you add it? ')) {
        cardDataArray.push(atomData);
        refreshWindow();
        // console.log('yes')
        return true;
      }
    }
    // console.log('fail')
    return false;
  }
}

// I will get the data encrypted later if possible.
function copyQRCodeData(cardDataArrayIdex) {
  navigator.clipboard.writeText('cards://' + makeQRCodeData(cardDataArrayIdex));
  alert("Copied The Data! ");
}

function makeRawData(cardDataArrayIdex) {
  return `["${cardDataArray[cardDataArrayIdex][nameIndex]}","${cardDataArray[cardDataArrayIdex][idIndex]}","${cardDataArray[cardDataArrayIdex][motoIndex]}","${cardDataArray[cardDataArrayIdex][bgIndex]}","${cardDataArray[cardDataArrayIdex][iconIndex]}","${cardDataArray[cardDataArrayIdex][nextIndex]}"]`;
}

// use the qr-code-api
function makeQRCodeData(cardDataArrayIdex) {
  return encodeURIComponent(makeRawData(cardDataArrayIdex));
}

function _OLD_addACardToCardCollection(cardDataArrayIdex) {
  collectionsView.innerHTML += `
  <div class="card" onmouseup="expandCard('${cardDataArrayIdex}');" onmouseleave="foldCard('${cardDataArrayIdex}');" id="card_no_${cardDataArrayIdex}" tabindex="${cardDataArrayIdex}" onblur="foldCard('${cardDataArrayIdex}');" style="top: -${cardDataArrayIdex * 20 + 3}vh;" onhover="floatingCard('${cardDataArrayIdex}');">
        <div class="info_name">
          ${cardDataArray[cardDataArrayIdex][nameIndex]}
        </div>
        <div class="info_icon">
          <img src="${cardDataArray[cardDataArrayIdex][iconIndex]}">
        </div>
        <div class="info_moto">
          ${cardDataArray[cardDataArrayIdex][motoIndex]}
        </div>
        <div class="qr_code_box" hidden>
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

function switchCard(id) {
  card = document.getElementById('card_no_' + id);
  if (card.style.height == '27.25vh') {
    expandCard(id);
  } else if (card.style.height == '60.75vh') {
    foldCard(id);
  }
}

function expandCard(id) {
  card = document.getElementById('card_no_' + id);
  card.setAttribute('style', 'height: 60.75vh');
  card.getElementsByClassName("qr_code_box")[0].hidden = false;
}

function foldCard(id) {
  card = document.getElementById('card_no_' + id);
  card.setAttribute('style', 'height: 27.25vh;');
  card.getElementsByClassName("qr_code_box")[0].hidden = true;
  console.log('fold');
}

function foldCardForce(id) {
  card = document.getElementById('card_no_'+id);
  card.setAttribute('style', '');
  card.getElementsByClassName("qr_code_box")[0].hidden = true;
  console.log('flod');
}

function fadeIn(element) {
  
}

function updateAtomData(id) {
  let icon_url = document.getElementById(`icon_url_${id}`);
  let background_url = document.getElementById(`background_url_${id}`);
  if (icon_url.value.trim() == "" || background_url.value.trim() == "") {
    if (icon_url.value.trim() == "") {
      icon_url.setAttribute("style", "background: #EEFCD6;");
      icon_url.setAttribute("placeholder", "Make You A Random Icon...");
      setTimeout((function () {
        icon_url.setAttribute("style", "");
        icon_url.setAttribute("placeholder", "Icon URL");
        icon_url.value = getRandomPictureURL(300, 300, 'people');
      }), 1000);
    }
    if (background_url.value.trim() == "") {
      background_url.setAttribute("style", "background: #EEFCD6;");
      background_url.setAttribute("placeholder", "Make You A Random Background...");
      setTimeout((function () {
        background_url.setAttribute("style", "");
        background_url.setAttribute("placeholder", "Background URL");
      }), 1000);
      background_url.value = getRandomPictureURL(300, 400);
    }
  } else {
    cardDataArray[id][iconIndex] = icon_url.value;
    cardDataArray[id][bgIndex] = background_url.value;

    document.getElementById(`card_no_${id}`).focus();
    refreshWindow();
  }
}

// this function use the unsplash educational api to get a random photo
function getRandomPictureURL(width, height, keywords = "") {
  return `https://source.unsplash.com/random/${width}x${height}/?${keywords}`;
}