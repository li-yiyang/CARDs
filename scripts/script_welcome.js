// for the users who first use the CARDs
// (the Data is null)

function makeMeACard() {
  initializeCardsData();
  if (addaCard()){window.location.replace("./collectors.html");}
}

function playANote(noteName) {
  var audio = document.getElementById("note_" + noteName);
  audio.cloneNode().play();
}

// not using, bad perform
function pauseANote(noteName) {
  // document.getElementById("note_" + noteName).pause();
}