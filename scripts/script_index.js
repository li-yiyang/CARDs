setTimeout(testData, 2500)

function testData(){
  if (readData("cardsData") != null) {
    window.location.replace("./views/collectors.html")
  } else {
    window.location.replace("./views/welcome.html")
  }
}