/* 
  ====== new data structure ======
  data = [
    [ // each maps to a key - value in local storage
      name  'Name', 
      id    'ID',
      motto 'Motto',
      bg    '../resource/background.jpg',
      icon  'icon.jpg'
    ]
  ]
*/
let nameIndex = 0;
let idIndex = 1;
let mottoIndex = 2;
let bgIndex = 3;
let iconIndex = 4;

var cardsData = {
  /* version */
  "cardsVersion": "v1.0.0 - deadly redo",
  "data": [],
};

var clickedTime = 0;

function initializeCardsData() {
  cardsData = {
    /* version */
    "cardsVersion": "v1.0.0 - deadly redo",
    "data": [],
  };
  saveCardsData();
}

function loadInitCardsData() {
  let result = JSON.parse(read('cardsData'));
  try {
    // data length check
    if (result.data.length <= 0) { throw 'no data is stored';}
    cardsData = result;
    return true;
  }
  catch (err) {
    saveCardsData();
    return false;
  }
}

function saveCardsData() {
  write('cardsData', JSON.stringify(cardsData));
}

function deleteData(index) {
  if (index == 0) {
    alert('Oh, no, I think you should not delete your card. ');
  } else {
    cardsData.data.splice(index, 1);
    refreshWindow(true);
  }
}

// basic write and read
function write(key, value) {
  localStorage.setItem(key, value);
  return value;
}

function read(key) {
  let result = localStorage.getItem(key);
  if (typeof result == undefined) {
    return "";
  } else {
    return result;
  }
}

// read the input function
function getInputByIds(idarr) {
  try {
    var resarr = idarr.map(function (idName) {
      // console.log(idName);
      var input = document.getElementById(idName);
      if (input.value.trim() == '') {
        let placeholder = input.placeholder;
        if (input.required) {
          input.setAttribute('style', 'background: #FFE6DB;');
          input.setAttribute('placeholder', 'Required');
          console.log(idName, 'is required');
        } else {
          input.setAttribute('style', 'background: #EEFCD6;');
          input.setAttribute('placeholder', 'Anything');
          input.value = structProcesser();
          console.log('made something');
        }
        setTimeout((function () {
          input.setAttribute('style', '');
          input.setAttribute('placeholder', placeholder);
          console.log('recover the color');
        }), 1000);
        throw 'blank input';
      } else {
        return input.value;
      }
    });
  }
  catch {
    return null;
  }
  idarr.map(function (idName) {
    document.getElementById(idName).value = '';
  })
  return resarr;
}

function makeACard(cardsDataArr) {
  // length is 3, which is a simple data
  if (cardsDataArr == null) {
    return false;
  } else if (cardsDataArr.length == 3) {
    cardsDataArr.push(randomBackgroundImg());
    cardsDataArr.push(randomIconImg());
    cardsData.data.push(cardsDataArr);
  }
  return true;
}

function randomBackgroundImg() {
  return './resources/background.jpg';
}

function randomIconImg() {
  return './resources/icon.jpg';
}

// sence change functions
function changeSenceOfWelcome(condition) {
  if (condition) {
    fadeOutById('welcome_scene');
    fadeInById('collectors_scene');
    refreshWindow(true);
    saveCardsData();
  }
}

function changeSenceOfLoading(condition) {
  if (condition) {
    fadeInById('collectors_scene');
    refreshWindow(true);
  } else {
    alert('填写信息, 生成卡片\n交换分享, 填充好友. ')
    fadeInById('welcome_scene');
  }
  fadeOutById('loading_scene');
}

function changeSenceOfDeleteData() {
  fadeInById('welcome_scene');
  fadeOutById('collectors_scene');
}

function fadeOutById(id, delay = 500) {
  var item = document.getElementById(id);
  item.style.opacity = 0;
  setTimeout(function () {
    item.hidden = true;
    item.style.opacity = 1;
  }, delay);
}

function fadeInById(id, delay = 500) {
  var item = document.getElementById(id);
  item.hidden = false;
  item.style.opacity = 0;
  setTimeout(function () {
    item.style.opacity = 1;
  }, delay);
}

function expand(idName, expandTo = 60.75) {
  document.getElementById(idName).setAttribute('style', `height: ${expandTo}vh;`);
  // console.log('expanded');
}

function fold(idName, foldTo = 27.25) {
  document.getElementById(idName).setAttribute('style', `height: ${foldTo}vh;`);
  // console.log('folded');
}

function refreshWindow(condition) {
  if (condition) {
    var mainBoard = document.getElementById('main_board');
    mainBoard.innerHTML = '';
    for (var i = 0; i < cardsData.data.length; i++) {
      mainBoard.innerHTML += `
      <div id="card_no_${i}"
            class="card"
            style="height: 27.25vh;"
            onmouseleave="fadeOutById('qrcode_${i}', 500); fold('card_no_${i}');"
            onclick="expand('card_no_${i}');
                     fadeInById('qrcode_${i}');"
            oncontextmenu="(function (event) {
              event.preventDefault();
              if (confirm('Do you really want to delete this card?')) {
                deleteData(${i});
              }
            })(event)">
          <div class="info_name">${cardsData.data[i][nameIndex]}</div>
          <div class="info_id">${cardsData.data[i][idIndex]}</div>
          <div class="info_moto">${cardsData.data[i][mottoIndex]}</div>
          <div class="qrcode"
               id="qrcode_${i}" hidden>
            <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(JSON.stringify(cardsData.data[i]))}&size=150x150">
          </div>
          <div class="background_img"><img src="${cardsData.data[i][bgIndex]}"></div>
          <div class="info_icon"><img src="${cardsData.data[i][iconIndex]}"></div>
        </div>
      `
    }
    saveCardsData();
  }
}

// the random sentences processor
// i will rewrite it later if i'm free

/*
  The following code is to generate a random sentence. 
  This script was inspired by PAIP's first chapter, 
  you can see it in my book Magic the Book: 
  https://github.com/li-yiyang/magic_the_book
  In my blog, i make it in Ruby, but I write it in js this time. 
*/

let sentenceIndex = 0; 
let subjectIndex = 1; // equal to objectIndex
let verbIndex = 2;
let objectIndex = 3;
let prepIndex = 4;
let adjAlt = 5;
let prepSubjectAltIndex = 6;
let nounIndex = 7;
let adjIndex = 8;

// the following update should only update the struct of sentence... maybe
structDataOfSentence = [
  [subjectIndex, verbIndex, objectIndex], // sentence index: 0

  [objectIndex, prepSubjectAltIndex], // subject index: 1

  [[
    '想', '爱', '写', '讨厌', '喜欢', '打', 
    '攻击', '杀', '抱', '缠', '吃', '追'
  ]], // verb index: 2

  [adjAlt, nounIndex], // object index: 3

  [[
    '和', '在', '与', '并', '或'
  ]], // prepIndex: 4

  [[
    '', // no adj
    adjIndex, // adj index
  ]], // adjAlt index: 5

  [[
    '', // no prep-noun structure
    [prepIndex, objectIndex], // prep, adj*-noun
  ]], // prep-noun* index 6

  [[
    '我', '你', '他', '她', '它', 
    '猫', '狗', '外星人', '女生', '男生', 
    '书本', '棉线', '论文', 'DDL', '困难', 
    '飞机', '火车', 
  ]], // nouns index: 7

  [[
    '可爱的', '漂亮的', '活泼的', '讨厌的', 
    '倒霉的', '生气的', '幸福的', '温柔的', 
    '好运的', '开心的', '不幸的', '暴力的', 
    '人畜无害的', '一帆风顺的', '起起落落落的', 
  ]] // adjIndex: 8
]

function structProcesser(structIndex = 0, structDataInput = structDataOfSentence) {
  return structDataInput[structIndex].map(function (item) {
    return processReadedData(item)
  }).join('');
}

function randomItemOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function processReadedData(item) {
  if (typeof item == "number") {
    return structProcesser(item);
  } else if (typeof item == "string") {
    return item;
  } else if (item instanceof Array) {
    let getedItem = randomItemOf(item);
    if (getedItem instanceof Array) {
      return getedItem.map(function (itemOfGeted) {
        return processReadedData(itemOfGeted);
      }).join('');
    } else {
      return processReadedData(getedItem);
    }
  }
}

function addWheelEvent() {
  var collectionsView = document.getElementById("main_board");
  let rollingSpeed = 1.5;
  collectionsView.addEventListener('wheel', function (event) {
    event.preventDefault();

    var topPostion = collectionsView.offsetTop;
    var bottomPostion = topPostion + collectionsView.offsetHeight;

    if (event.deltaY > 0 && bottomPostion > document.getElementById('background').offsetHeight * 0.9) {
      collectionsView.style.top = parseFloat(collectionsView.style.top || 0) - rollingSpeed + 'vh';
    } else if (event.deltaY < 0 && topPostion < document.getElementById('background').offsetHeight * 0.1) {
      collectionsView.style.top = parseFloat(collectionsView.style.top || 0) + rollingSpeed + 'vh';
    }
  });
}

function addMobieTouchEvent() {
  var collectionsView = document.getElementById("main_board");
  document.getElementById("main_board").addEventListener('touchstart',
      function (event) {
        if (event.touches.length == 1) {
          lastTouchPositionY = event.touches[0].clientY;
          console.log(lastTouchPositionY);
          return true;
        } else {
          return false;
        }
      })

  document.getElementById("main_board").addEventListener('touchmove', function (event) {
    var topPostion = collectionsView.offsetTop;
    var bottomPostion = topPostion + collectionsView.offsetHeight;
    if (event.touches.length == 1) {
      let deltaY = lastTouchPositionY - event.touches[0].clientY;
      event.preventDefault();
      if (deltaY > 0 && bottomPostion > document.getElementById('background').offsetHeight * 0.9) {
        collectionsView.style.top = parseFloat(collectionsView.style.top || 0) - rollingSpeed + 'vh';
      } else if (deltaY < 0 && topPostion < document.getElementById('background').offsetHeight * 0.14) {
        collectionsView.style.top = parseFloat(collectionsView.style.top || 0) + rollingSpeed + 'vh';
      }
      lastTouchPositionY = event.touches[0].clientY;
    }
  });
}

function addQRCodeSenderEvent() {
  // the following code from https://webkit.org/blog/10855/async-clipboard-api/
  // to fit the browser is a difficult thing...
  document.getElementById("bottom_button_text").addEventListener("click", async clickEvent => {
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

// from https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
function scanQRCode() {
  const formData = new FormData();
  const qrCode = document.getElementById('choose_qr_img').files[0];

  formData.append('MAX_FILE_SIZE', '1048576');
  formData.append('file', qrCode);

  fetch('https://api.qrserver.com/v1/read-qr-code/', {
    method: 'POST',
    body: formData,
  }).then(response => {
    // testDataToHoldResponse = response.clone();
    return response.json(); 
  })
  .then(res => function (res){
    testDataToHoldResponse = res;
    if (res['0']['symbol']['0']['error'] == null) {
      cardsData.data.push(JSON.parse(String(res['0']['symbol']['0']['data'])));
      refreshWindow(true);
      return true;
    }
    return false;
  }(res))
  .catch(error => {
    console.log("Error", error);
  })
}

// load when all the resources are loaded
document.onreadystatechange = function () {
  if (document.readyState == 'complete') {
    setTimeout(function () {
      changeSenceOfLoading(loadInitCardsData());
    }, 2500);

    addWheelEvent();
    addMobieTouchEvent();
    addQRCodeSenderEvent();
  }
}