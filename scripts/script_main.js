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
*/

function writeData(key, value) {
  localStorage.setItem(key, value);
}

function initializeCardsData() {
  localStorage.clear();
  // Spcifiy the version of CARDs
  writeData("cardsVersion", "0.0.1");
  writeData("cardsData", "0");
}

function testDataInit() {
  initializeCardsData();
  for (var i = 0; i < 50; i++) {
    addConent(i, i, i); 
  }
}

function addConent(name, id, moto, next = -1, bg = "../resources/background.jpg", icon = "../resources/icon.jpg") {
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
      id.setAttribute("palceholder", "ID")
    }), 1000);
  } else if (moto.value.trim() == "") {
    moto.setAttribute("style", "background: #EEFCD6;");
    moto.setAttribute("placeholder", "Anything");
    setTimeout((function () {
      moto.setAttribute("style", ""); 
      moto.setAttribute("placeholder", "Whatever You Like.");
      moto.value = "Anything"
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