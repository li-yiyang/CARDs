// version
let cardsVersionNumber = 'v0.0.1';

// Data Struct
let nameIndex = 0;
let idIndex = 1;
let motoIndex = 2;
let bgIndex = 3;
let iconIndex = 4;
let nextIndex = 5;

function readCARDsVersion() {
  return readData("cardsVersion");
}

// Data I/O

let readData = readDataByLocalStorage;
if (ifLocalStorage()) {
  readData = readDataByLocalStorage;
} else {
  readData = readDataByCookies;
}

function ifLocalStorage() {
  if (typeof(Storage) !== "undefined") {
    return true;
  } else {
    // need to wrap a alert for my own... 
    alert("抱歉, 不支持 Web Storage 功能. \nSorry, Web Storage is not supported. ");
    return false;
  }
}

function readDataByLocalStorage(choose) {
  return localStorage.getItem(choose);
}

function readDataByCookies(choose) {
  // not done yet. 
}

/*
  It should be noted that this application 
  should only be applied to a relatively small 
  data number. Therefore, it seems impossible to 
  keep track of all the people's information in 
  the universe. 

  And also, I have to admit that I didn't do 
  anything to protect the data, which means 
  that you can easily steal the data by simply
  check the Local Storage of your browser. 

  However, my hope is to make a absolutely 
  local Card exchange application, which 
  means that none of the infomation would 
  go through the web, but simply stored locally. 
  (maybe... I don't know. )

  The DataStruct: 
  +--------------+--------------------------+
  |     key      |    notes for the data    |
  +==============+==========================+
  |              | the version of CARDs,    |
  | cardsVersion | although I'm not sure if |
  |              | I'd like to update it.   |
  +--------------+--------------------------+
  |  cardsData   | number of stored cards   |
  +--------------+--------------------------+
  |  name_no_0   | name of the card at no.0 |
  +--------------+--------------------------+
  |  id_no_0     | id of the card at no.0   |
  +--------------+--------------------------+
  |  moto_no_0   | moto of the card at no.0 |
  +--------------+--------------------------+
  |   bg_no_0    | background image url at  |
  |              | no.0                     |
  +--------------+--------------------------+
  |  icon_no_0   | icon image url at no.0   |
  +--------------+--------------------------+
  |  next_no_0   | NO of next item of no.0  |
  +--------------+--------------------------+
  
  the no.0 is the user's infomation and can 
  not be deleted. (other than delete the data
  base itself)

  it should be notice that: 
 nameIndex = 0;
 idIndex = 1;
 motoIndex = 2;
 bgIndex = 3;
 iconIndex = 4;
 nextIndex = 5;
  which suffer me a lot... really. 
*/

function writeData(key, value) {
  localStorage.setItem(key, value);
}

function initializeCardsData() {
  localStorage.clear();
  // Spcifiy the version of CARDs
  writeData("cardsVersion", cardsVersionNumber);
  writeData("cardsData", "0");
}

function testDataInit() {
  initializeCardsData();
  for (var i = 0; i < 50; i++) {
    addConent(i, i, i); 
  }
}

function addConent(name, id, moto, bg = "../resources/background.jpg", icon = "../resources/icon.jpg", next = -1) {
  var dataIndex = readData("cardsData");
  if (next == -1) {next = Number(dataIndex) + 1 };
  writeData("name_no_" + dataIndex, name);
  writeData("id_no_" + dataIndex, id);
  writeData("moto_no_" + dataIndex, moto);
  writeData("bg_no_" + dataIndex, bg);
  writeData("icon_no_" + dataIndex, icon);
  writeData("next_no_" + dataIndex, String(next));
  writeData("cardsData", String(Number(dataIndex) + 1));
  return [name, id, moto, bg, icon, next];
}

function addaCard() {
  var name = document.getElementById("name")
  var id = document.getElementById("id")
  var moto = document.getElementById("moto")
  if (name.value.trim() == "") {
    name.setAttribute("style", "background: #FFE6DB;");
    name.setAttribute("placeholder", "Required");
    setTimeout((function () {
      name.setAttribute("style", "");
      name.setAttribute("placeholder", "Name");
    }), 1000);
  } else if (id.value.trim() == "") {
    id.setAttribute("style", "background: #FFE6DB;");
    id.setAttribute("placeholder", "Required");
    setTimeout((function () {
      id.setAttribute("style", "");
      id.setAttribute("palceholder", "ID");
    }), 1000);
  } else if (moto.value.trim() == "") {
    moto.setAttribute("style", "background: #EEFCD6;");
    moto.setAttribute("placeholder", "Anything");
    setTimeout((function () {
      moto.setAttribute("style", ""); 
      moto.setAttribute("placeholder", "Whatever You Like.");
      moto.value = structProcesser();
    }), 1000);
  } else {
    let result = addConent(name.value, id.value, moto.value);
    name.value = "";
    id.value = "";
    moto.value = ""; 
    return result;
  }
  return false;
}

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