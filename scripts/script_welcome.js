// for the users who first use the CARDs
// (the Data is null)

function makeMeACard() {
  initializeCardsData();
  if (addaCard()){window.location.replace("./collectors.html");}
}