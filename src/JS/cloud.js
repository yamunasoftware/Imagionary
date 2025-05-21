/* CLOUD DATABASE ACCESS */

/* CONFIG */

//Config Data Variable:
const firebaseConfig = {
  apiKey: "AIzaSyAKJPnB4CkuufkEwAshtP4np7YIr-lEf48",
  authDomain: "imagionary-67032.firebaseapp.com",
  projectId: "imagionary-67032",
  storageBucket: "imagionary-67032.appspot.com",
  messagingSenderId: "345604483690",
  appId: "1:345604483690:web:1ed3a08a449245023a3813"
};

//Initializes App:
firebase.initializeApp(firebaseConfig);
var database = firebase.firestore();

/* DATA VARIABLES */

//Game Variables:
var currentCode = "";
var drawing = [];
var outgoing = [];
var incoming = [];
var full = false;
var word = "";
var guess = "";
var disable = true;
var check = false;

//ID Variables:
var codeID = "currentCode";
var drawingID = "drawing";
var outgoingID = "outgoing";
var incomingID = "incoming";
var fullID = "full";
var wordID = "word";
var guessID = "guess";
var disableID = "disable";
var checkID = "check";

//Cloud Response Variables:
var collectionName = "games";
var outgoingKey = "$outgoing:";
var incomingKey = "$incoming:";

/* CLOUD STORAGE FUNCTIONS */

//Check Game Function:
function checkGame(code) {
  //Gets Server Response:
  database.collection(collectionName).doc(code).get().then((docRef) => {
    //Checks the Case:
    if (docRef.exists) {
      //Sets the Check:
      check = true;
      setCacheData(checkID, check, true);
    }

    else {
      //Sets the Check:
      setCacheData(checkID, check, true);
    }
  })
    .catch((error) => {
      //Error Message:
      disableLoading();
      showGameMessage("An Error Ocurred");
      clearCacheData();
    });
}

//Create Game Function:
function createGame() {
  //Checks the Case:
  if (getCacheData(codeID, false) == null) {
    //Sets the Drawing:
    enableLoading();
    resetDrawing();

    //Sets the Word:
    word = randomWord();
    setCacheData(wordID, word, false);

    //Sets the Code:
    currentCode = generateCode();
    setCacheData(codeID, currentCode, false);
    checkGame(currentCode);

    //Checks the Case:
    if (!getCacheData(checkID, true)) {
      //Sets the Cloud Database:
      database.collection(collectionName).doc(currentCode).set({
        drawing: JSON.stringify(drawing),
        outgoing: JSON.stringify(outgoing),
        incoming: JSON.stringify(incoming),
        full: JSON.stringify(full),
        guess: guess,
        word: word
      })
        .then((docRef) => {
          //Sets the Cache Data:
          setCacheData(drawingID, drawing, true);
          setCacheData(guessID, guess, false);
          setCacheData(outgoingID, outgoing, true);
          setCacheData(incomingID, incoming, true);

          //Control Functions:
          showControls();
          showDrawControls();
          showMessage();
          showWord();
          disableLoading();
        })
        .catch((error) => {
          //Error Message:
          disableLoading();
          showGameMessage("An Error Ocurred");
          clearCacheData();
        });
    }

    else {
      //Creates Game Again:
      createGame();
    }
  }
}

//Join Game Function:
function joinGame(code) {
  //Checks the Case:
  if (getCacheData(codeID, false) == null) {
    //Gets the Game Code:
    enableLoading();
    currentCode = code;

    //Checks the Case:
    if (currentCode != "") {
      //Updates the Code:
      database.collection(collectionName).doc(currentCode).get().then((docRef) => {
        //Checks the Case:
        if (!JSON.parse(formatData(JSON.stringify(docRef.data().full)))) {
          //Updates the Full:
          full = true;
          setCacheData(codeID, currentCode, false);
          setCacheData(fullID, full, true);

          //Updates the Game:
          database.collection(collectionName).doc(currentCode).update({
            full: JSON.stringify(getCacheData(fullID, true))
          }).then((docRef) => {
            //Gets the Data:
            getGame();

            //Control Functions:
            showControls();
            showDrawControls();
            showMessage();
            showWord();
            disableLoading();
          })
            .catch((error) => {
              //Error Message:
              disableLoading();
              showGameMessage("Invalid Code");
              clearCacheData();
            });
        }

        else {
          //Error Message:
          disableLoading();
          showGameMessage("Invalid Code");
          clearCacheData();
        }
      })
        .catch((error) => {
          //Error Message:
          disableLoading();
          showGameMessage("Invalid Code");
          clearCacheData();
        });
    }

    else {
      //Displays the Information:
      disableLoading();
      showGameMessage("Invalid Code");
      clearCacheData();
    }
  }
}

//Delete Game Function:
function deleteGame() {
  //Deletes the Game:
  database.collection(collectionName).doc(currentCode).delete().then((docRef) => {
    //Deleted!
  })
    .catch((error) => {
      //Error Message:
      disableLoading();
      showGameMessage("An Error Ocurred");
      clearCacheData();
    });
}

/* CLOUD GAME FUNCTIONS */

//Send Game Function:
function sendGame() {
  //Checks the Case:
  if (getCacheData(fullID, false) == null
    && getCacheData(codeID, false) != null) {
    //Saves the Drawing:
    enableLoading();
    saveDrawing();

    //Updates the Game:
    currentCode = getCacheData(codeID, false);
    database.collection(collectionName).doc(currentCode).update({
      drawing: JSON.stringify(getCacheData(drawingID, true)),
    })
      .then((docRef) => {
        //Disables Loading:
        disableLoading();
      })
      .catch((error) => {
        //Error Message:
        disableLoading();
        showGameMessage("An Error Ocurred");
      });
  }

  else if (getCacheData(codeID, false) != null) {
    //Saves the Drawing:
    enableLoading();
    saveDrawing();

    //Updates the Game:
    currentCode = getCacheData(codeID, false);
    database.collection(collectionName).doc(currentCode).update({
      drawing: JSON.stringify(getCacheData(drawingID, true)),
      full: JSON.stringify(getCacheData(fullID, true))
    })
      .then((docRef) => {
        //Disables Loading
        disableLoading();
      })
      .catch((error) => {
        //Error Message:
        disableLoading();
        showGameMessage("An Error Ocurred");
      });
  }
}

//Send Guess Function:
function sendGuess(attempt) {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Guess:
    enableLoading();
    guess = attempt;
    setCacheData(guessID, guess, false);

    //Checks the Case:
    if (getCacheData(guessID, false) != "") {
      //Updates the Game:
      currentCode = getCacheData(codeID, false);
      database.collection(collectionName).doc(currentCode).update({
        guess: getCacheData(guessID, false)
      })
        .then((docRef) => {
          //Checks for Win:
          disableLoading();
          showResult();
        })
        .catch((error) => {
          //Error Message:
          disableLoading();
          showGameMessage("An Error Ocurred");
        });
    }

    else {
      //Sets the Message:
      showControlMessage("Invalid Guess");
    }
  }
}

//Send Message Function:
function sendMessage(text) {
  //Checks the Case:
  if (text != "" && !text.includes(outgoingKey)
    && !text.includes(incomingKey)) {
    //Checks the Case:
    if (getCacheData(fullID, false) == null
      && getCacheData(codeID, false) != null) {
      //Adds to the Outgoing:
      outgoing = getCacheData(outgoingID, true);
      outgoing.push(text + outgoingKey + JSON.stringify(Date.now()));
      setCacheData(outgoingID, outgoing, true);
      showOpponentMessage();

      //Updates the Message:
      currentCode = getCacheData(codeID, false);
      database.collection(collectionName).doc(currentCode).update({
        outgoing: JSON.stringify(getCacheData(outgoingID, true))
      })
        .catch((error) => {
          //Error Message:
          showGameMessage("An Error Ocurred");
        });
    }

    else if (getCacheData(codeID, false) != null) {
      //Adds to the Outgoing:
      incoming = getCacheData(incomingID, true);
      incoming.push(text + incomingKey + JSON.stringify(Date.now()));
      setCacheData(incomingID, incoming, true);
      showOpponentMessage();

      //Updates the Message:
      currentCode = getCacheData(codeID, false);
      database.collection(collectionName).doc(currentCode).update({
        incoming: JSON.stringify(getCacheData(incomingID, true))
      })
        .catch((error) => {
          //Error Message:
          showGameMessage("An Error Ocurred");
        });
    }
  }
}

//Get Game Function:
function getGame() {
  //Checks the Case:
  if (getCacheData(fullID, false) == null
    && getCacheData(codeID, false) != null) {
    //Enables Loading:
    enableLoading();

    //Gets the Game:
    currentCode = getCacheData(codeID, false);
    database.collection(collectionName).doc(currentCode).get().then((docRef) => {
      //Sets the Drawing:
      drawing = JSON.parse(formatData(JSON.stringify(docRef.data().drawing)));
      setCacheData(drawingID, drawing, true);

      //Sets the Outgoing:
      outgoing = JSON.parse(formatData(JSON.stringify(docRef.data().outgoing)));
      setCacheData(outgoingID, outgoing, true);

      //Sets the Outgoing:
      incoming = JSON.parse(formatData(JSON.stringify(docRef.data().incoming)));
      setCacheData(incomingID, incoming, true);

      //Sets the Guess:
      guess = formatData(JSON.stringify(docRef.data().guess));
      setCacheData(guessID, guess, false);

      //Sets the Word:
      word = formatData(JSON.stringify(docRef.data().word));
      setCacheData(wordID, word, false);
    })
      .then((docRef) => {
        //Shows the Game:
        disableLoading();
        displayDrawing();
        showOpponentMessage();
        showResult();
      })
      .catch((error) => {
        //Error Message:
        disableLoading();
        showGameMessage("An Error Ocurred");
      });
  }

  else if (getCacheData(codeID, false) != null) {
    //Enables Loading:
    enableLoading();

    //Gets the Game:
    currentCode = getCacheData(codeID, false);
    database.collection(collectionName).doc(currentCode).get().then((docRef) => {
      //Sets the Drawing:
      drawing = JSON.parse(formatData(JSON.stringify(docRef.data().drawing)));
      setCacheData(drawingID, drawing, true);

      //Sets the Outgoing:
      outgoing = JSON.parse(formatData(JSON.stringify(docRef.data().outgoing)));
      setCacheData(outgoingID, outgoing, true);

      //Sets the Outgoing:
      incoming = JSON.parse(formatData(JSON.stringify(docRef.data().incoming)));
      setCacheData(incomingID, incoming, true);

      //Sets the Guess:
      guess = formatData(JSON.stringify(docRef.data().guess));
      setCacheData(guessID, guess, false);

      //Sets the Word:
      word = formatData(JSON.stringify(docRef.data().word));
      setCacheData(wordID, word, false);

      //Sets the Full:
      full = JSON.parse(formatData(JSON.stringify(docRef.data().full)));
      setCacheData(fullID, full, true);
    })
      .then((docRef) => {
        //Shows the Game:
        disableLoading();
        displayDrawing();
        showOpponentMessage();
        showResult();
      })
      .catch((error) => {
        //Error Message:
        disableLoading();
        showGameMessage("An Error Ocurred");
      });
  }
}

/* CACHE DATA FUNCTIONS */

//Cache Data Get Function:
function getCacheData(id, read) {
  //Checks the Case:
  if (read) {
    //Returns the Data:
    return JSON.parse(localStorage.getItem(id));
  }

  else {
    //Returns the Data:
    return localStorage.getItem(id);
  }
}

//Cache Data Set Function:
function setCacheData(id, value, string) {
  //Checks the Case:
  if (string) {
    //Sets the Data:
    localStorage.setItem(id, JSON.stringify(value));
  }

  else {
    //Sets the Data:
    localStorage.setItem(id, value);
  }
}

//Remove Cache Data Function:
function removeCacheData(id) {
  //Removes Data:
  localStorage.removeItem(id);
}

//Clear Cache Data:
function clearCacheData() {
  //Clears Cache:
  localStorage.clear();
}

//Firebase Server Formatting Function:
function formatData(rawData) {
  //Replaces Info:
  var string = rawData.replace(/\\/g, "");
  var side = string.replace(/^./, "");
  var main = side.slice(0, -1);

  //Returns the String:
  return main;
}