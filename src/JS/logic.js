/* SERVICE-WORKER REGISTRATION */

//Registers the Service Worker:
navigator.serviceWorker.register('/service-worker.js', {
  scope: 'https://imagionary.netlify.app'
});

/* GAME CONTROL VARIABLES */

//Game Array Variable:
var words = [
  "Angel",
  "Eyeball",
  "Pizza",
  "Angry",
  "Fireworks",
  "Pumpkin",
  "Baby",
  "Flower",
  "Rainbow",
  "Beard",
  "Flying Saucer",
  "Recycle",
  "Bible",
  "Giraffe",
  "Sand Castle",
  "Bikini",
  "Glasses",
  "Snowflake",
  "Book",
  "High Heel",
  "Stairs",
  "Bucket",
  "Ice Cream Cone",
  "Starfish",
  "Bumble Bee",
  "Igloo",
  "Strawberry",
  "Butterfly",
  "Lady Bug",
  "Sun",
  "Camera",
  "Lamp",
  "Tire",
  "Cat",
  "Lion",
  "Toast",
  "Church",
  "Mailbox",
  "Toothbrush",
  "Crayon",
  "Night",
  "Toothpaste",
  "Dolphin",
  "Nose",
  "Truck",
  "Egg",
  "Olympics",
  "Volleyball",
  "Eiffel Tower",
  "Peanut",
  "Bat"
];

/* GAME CONTROL FUNCTIONS */

//Join URL Function:
function joinURL() {
  //Checks the Case:
  if (getCacheData(codeID, false) == null) {
    //Gets the URL Parameters:
    var query = window.location.search;
    var urlParameters = new URLSearchParams(query);

    //Checks the URL Parameters:
    if (urlParameters.has("c")) {
      //Joins the Game:
      joinGame(urlParameters.get("c"));
    }
  }
}

//Show Opponent Message Function:
function showOpponentMessage() {
  //Array Variables:
  var outgoingArray = getCacheData(outgoingID, true);
  var incomingArray = getCacheData(outgoingID, true);
  var combinedArray = [];
  var timeArray = [];

  //Element Variables:
  var box = document.getElementById('chatBox');
  document.getElementById('chatInput').value = "";

  //Contents Variables:
  var turns = 0;
  var turnsUI = 0;

  //Sort Variables:
  var turnsTime = 0;
  var swaps = 0;

  //Message Key Variables:
  var turnsOutgoing = 0;
  var turnsIncoming = 0;
  var chatContents = "";

  //Loops through Array:
  outgoingLoop: while (turnsOutgoing < outgoingArray.length) {
    //Adds to the Array:
    combinedArray.push(outgoingArray[turnsOutgoing]);

    turnsOutgoing++;
  }

  //Loops through Array:
  incomingLoop: while (turnsIncoming < incomingArray.length) {
    //Adds to the Array:
    combinedArray.push(incomingArray[turnsIncoming]);

    turnsIncoming++;
  }

  //Loops through Array:
  mainLoop: while (turns < combinedArray.length) {
    //Checks the Case:
    if (combinedArray[turns].includes(outgoingKey)) {
      //Gets the Timestamp:
      var index = combinedArray[turns].indexOf(outgoingKey) + outgoingKey.length;
      var timestamp = JSON.parse(combinedArray[turns].substring(index));
      timeArray.push(timestamp);
    }

    else if (combinedArray[turns].includes(incomingKey)) {
      //Gets the Timestamp:
      var index = combinedArray[turns].indexOf(incomingKey) + incomingKey.length;
      var timestamp = JSON.parse(combinedArray[turns].substring(index));
      timeArray.push(timestamp);
    }

    turns++;
  }

  //Loops through Swaps:
  secondLoop: while (swaps >= 0) {
    //Sets the Swaps:
    swaps = 0;
    
    //Loops through Array:
    thirdLoop: while (turnsTime < timeArray.length) {
      //Checks the Case:
      if (turnsTime < timeArray.length - 1) {
        //Checks the Case:
        if (timeArray[turnsTime] > timeArray[turnsTime + 1]) {
          //Makes the Time Swap:
          var value = timeArray[turnsTime + 1];
          timeArray[turnsTime + 1] = timeArray[turnsTime];
          timeArray[turnsTime] = value;

          //Makes the Combined Swap:
          var value = combinedArray[turnsTime + 1];
          combinedArray[turnsTime + 1] = combinedArray[turnsTime];
          combinedArray[turnsTime] = value;
          swaps++;
        }
      }

      else {
        //Checks the Case:
        if (timeArray[turnsTime] < timeArray[turnsTime - 1]) {
          //Makes the Time Swap:
          var value = timeArray[turnsTime - 1];
          timeArray[turnsTime - 1] = timeArray[turnsTime];
          timeArray[turnsTime] = value;

          //Makes the Combined Swap:
          var value = combinedArray[turnsTime - 1];
          combinedArray[turnsTime - 1] = combinedArray[turnsTime];
          combinedArray[turnsTime] = value;
          swaps++;
        }
      }

      turnsTime++;
    }

    //Checks the Case:
    if (swaps == 0) {
      //Sets the Swaps:
      swaps = -1;
    }
  }

  //Loops through Array:
  fourthLoop: while (turnsUI < combinedArray.length) {
    //Checks the Case:
    if (combinedArray[turnsUI].includes(outgoingKey)) {
      //Gets the Message:
      var index = combinedArray[turnsUI].indexOf(outgoingKey) - 1;
      var message = combinedArray[turnsUI].substring(0, index);

      //Checks the Case:
      if (getCacheData(fullID, false) == null
        && getCacheData(codeID, false) != null) {
        //Adds to the Chat:
        chatContents += 
          "<div class='right'> <div class='chat space'> " + 
          message + "</div> </div>";
      }

      else if (getCacheData(codeID, false) != null) {
        //Adds to the Chat:
        chatContents += 
          "<div class='right'> <div class='chatOther space'> " + 
          message + "</div> </div>";
      }
    }

    else if (combinedArray[turnsUI].includes(incomingKey)) {
      //Gets the Message:
      var index = combinedArray[turnsUI].indexOf(incomingKey) - 1;
      var message = combinedArray[turnsUI].substring(0, index);

      //Checks the Case:
      if (getCacheData(fullID, false) == null
        && getCacheData(codeID, false) != null) {
        //Adds to the Chat:
        chatContents += 
          "<div class='right'> <div class='chatOther space'> " + 
          message + "</div> </div>";
      }

      else if (getCacheData(codeID, false) != null) {
        //Adds to the Chat:
        chatContents += 
          "<div class='right'> <div class='chat space'> " + 
          message + "</div> </div>";
      }
    }
    
    turnsUI++;
  }

  //Sets the HTML:
  box.innerHTML = chatContents;
  box.scrollTop = box.scrollHeight;
}

//Show Control Message Function:
function showControlMessage(message) {
  //Sets the Control Message:
  document.getElementById('controlMessage').innerHTML = message;
}

//Show Game Message Function:
function showGameMessage(message) {
  //Shows the Game Message:
  document.getElementById('gameCode').innerHTML = message;
}

//Show Controls Function:
function showControls() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Turns off Join Controls:
    document.getElementById('controlContainer').style.display = "none";
    document.getElementById('chatContainer').style.display = "block";
    document.getElementById('gameContainer').style.display = "block";
  }

  else {
    //Turns on Join Controls:
    document.getElementById('controlContainer').style.display = "block";
    document.getElementById('chatContainer').style.display = "none";
    document.getElementById('gameContainer').style.display = "none";
  }
}

//Show Draw Controls Function:
function showDrawControls() {
  //Checks the Case:
  if (getCacheData(fullID, false) == null
    && getCacheData(codeID, false) != null) {
    //Sets the Controls:
    document.getElementById('guessContainer').style.display = "none";
    document.getElementById('drawContainer').style.display = "block";
  }

  else if (getCacheData(codeID, false) != null) {
    //Sets the Controls:
    document.getElementById('guessContainer').style.display = "block";
    document.getElementById('drawContainer').style.display = "none";
  }

  else {
    //Sets the Controls:
    document.getElementById('drawContainer').style.display = "none";
    document.getElementById('guessContainer').style.display = "none";
  }
}

//Show Message Function:
function showMessage() {
  //Checks the Case:
  if (getCacheData(fullID, false) == null
    && getCacheData(codeID, false) != null) {
    //Sets the Screen Data:
    currentCode = getCacheData(codeID, false);
    document.getElementById('gameCode').innerHTML =
      currentCode + "&nbsp; &nbsp; <button onclick='copyJoinLink(" +
      JSON.stringify(currentCode) + ");'> Copy </button>";
  }

  else if (getCacheData(codeID, false) != null) {
    //Sets the Message:
    document.getElementById('gameCode').innerHTML = "Joined Game";
  }
}

//Show Result Function:
function showResult() {
  //Checks the Case:
  if (getCacheData(guessID, false).toLowerCase() ==
    getCacheData(wordID, false).toLowerCase()) {
    //Checks the Case:
    if (getCacheData(fullID, false) == null
      && getCacheData(codeID, false) != null) {
      //Shows Lose Screen:
      document.getElementById('header').style.color = "#FF3333";
      document.getElementById('header').innerHTML = "You Lose!";

      //Waits and Resets:
      deleteGame();
      clearCacheData();
      setTimeout(function () {
        //Reloads Page:
        window.location.href = "https://imagionary.netlify.app";
      }, 1000);
    }

    else if (getCacheData(codeID, false) != null) {
      //Shows Win Screen:
      document.getElementById('header').style.color = "#73BB88";
      document.getElementById('header').innerHTML = "You Win!";

      //Waits and Resets:
      clearCacheData();
      setTimeout(function () {
        //Reloads Page:
        window.location.href = "https://imagionary.netlify.app";
      }, 1000);
    }
  }

  else if (getCacheData(guessID, false) != "") {
    //Checks the Case:
    if (getCacheData(fullID, false) == null
      && getCacheData(codeID, false) != null) {
      //Shows Lose Screen:
      document.getElementById('header').style.color = "#73BB88";
      document.getElementById('header').innerHTML = "You Win!";

      //Waits and Resets:
      deleteGame();
      clearCacheData();
      setTimeout(function () {
        //Reloads Page:
        window.location.href = "https://imagionary.netlify.app";
      }, 1000);
    }

    else if (getCacheData(codeID, false) != null) {
      //Shows Lose Screen:
      document.getElementById('header').style.color = "#FF3333";
      document.getElementById('header').innerHTML = "You Lose! <br />" + getCacheData(wordID, false);

      //Waits and Resets:
      clearCacheData();
      setTimeout(function () {
        //Reloads Page:
        window.location.href = "https://imagionary.netlify.app";
      }, 1000);
    }
  }
}

//Show Word Function:
function showWord() {
  //Checks the Case:
  if (getCacheData(fullID, false) == null
    && getCacheData(codeID, false) != null) {
    //Sets the Screen Data:
    document.getElementById('header').innerHTML = getCacheData(wordID, false);
  }
}

//Random Word Function:
function randomWord() {
  //Returns Random Word:
  var max = words.length - 1;
  var index = Math.round((Math.random() * max));
  return words[index];
}

//Generate Code Function:
function generateCode() {
  //Loop Variables:
  var turns = 0;
  var code = "";

  //Loops through Array:
  mainLoop: while (turns < 20) {
    //Gets the Digit:
    var digit = Math.floor(Math.random() * 10);
    code += digit;

    turns++;
  }

  //Returns the Code:
  return code;
}
//Copy Join Link Function:
function copyJoinLink(code) {
  //Sets the Link:
  var link = "https://imagionary.netlify.app/?c=" + code;
  navigator.clipboard.writeText(link);
  document.getElementById('gameCode').innerHTML = "Copied";
}

//Disable Actions Function:
function disableActions() {
  //Disables All Action Buttons:
  document.getElementById('drawContainer').style.display = "none";
  document.getElementById('guessContainer').style.display = "none";
  setCacheData(disableID, disable, true);
}

//Show Disabled Message:
function showDisabledMessage() {
  //Checks the Case:
  if (getCacheData(disableID, false) != null) {
    //Shows the Message:
    showControlMessage("Saved");
  }
}

//Check Disabled Function:
function checkDisabled() {
  //Checks the Case:
  if (getCacheData(disableID, false) != null) {
    //Disables Actions:
    disableActions();
  }
}

//Enable Loading Function:
function enableLoading() {
  //Enables the Loading Screen:
  document.getElementById('loading').style.display = "block";
  document.getElementById('mainContent').style.display = "none";
}

//Disable Loading Function:
function disableLoading() {
  //Disables the Loading Screen:
  document.getElementById('loading').style.display = "none";
  document.getElementById('mainContent').style.display = "block";
}