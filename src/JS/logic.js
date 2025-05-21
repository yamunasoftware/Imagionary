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

/* MESSAGE CONTROL FUNCTIONS */

//Show Opponent Message Function:
function showOpponentMessage() {
  //Message Array Variables:
  var outgoingArray = getCacheData(outgoingID, true);
  var incomingArray = getCacheData(incomingID, true);
  var combinedArray = [];

  //Element Variables:
  var box = document.getElementById('chatBox');
  var turns = 0;
  var chatContents = "";

  //Checks the Case:
  if (outgoingArray.length > 0) {
    //Loops through Array:
    mainLoop: while (turns < outgoingArray.length) {
      //Adds to the Combined Array:
      combinedArray.push(outgoingArray[turns]);

      turns++;
    }

    //Resets the Counter:
    turns = 0;

    //Loops through Array:
    secondLoop: while (turns < outgoingArray.length) {
      //Gets the Outgoing Data:
      var outgoingIndex = outgoingArray[turns].indexOf(outgoingKey) + outgoingKey.length;
      var outgoingString = outgoingArray[turns].substring(outgoingIndex);
      var outgoingStamp = parseInt(outgoingString);

      //Loop Variable:
      var counts = 0;

      //Loops through Array:
      thirdLoop: while (counts < incomingArray.length) {
        //Gets the Incoming Data:
        var incomingIndex = incomingArray[counts].indexOf(incomingKey) + incomingKey.length;
        var incomingString = incomingArray[counts].substring(incomingIndex);
        var incomingStamp = parseInt(incomingString);

        //Checks the Case:
        if (incomingStamp < outgoingStamp) {
          //Checks the Case:
          if (!combinedArray.includes(incomingArray[counts])) {
            //Adds the Elements Before:
            combinedArray = addBefore(combinedArray, outgoingArray[turns], incomingArray[counts]);
          }
        }

        else if (turns == outgoingArray.length - 1) {
          //Adds to the Main Array:
          combinedArray.push(incomingArray[counts]);
        }

        counts++;
      }

      turns++;
    }
  }

  else {
    //Loops through Array:
    incomingLoop: while (turns < incomingArray.length) {
      //Adds to the Combined Array:
      combinedArray.push(incomingArray[turns]);
      
      turns++;
    }
  }

  //Resets the Counter:
  turns = 0;

  //Loops through Array:
  uiLoop: while (turns < combinedArray.length) {
    //Checks the Case:
    if (combinedArray[turns].includes(outgoingKey)) {
      //Gets the Message:
      var index = combinedArray[turns].indexOf(outgoingKey);
      var message = combinedArray[turns].substring(0, index);

      //Gets the Stamp:
      var stamp = combinedArray[turns].replace(message, "");
      stamp = stamp.replace(outgoingKey, "");

      //Gets the Timestamp:
      var ago = Date.now() - parseInt(stamp);
      var timeStamp = getFormattedStamp(ago);

      //Checks the Case:
      if (turns != combinedArray.length-1) {
        //Checks the Case:
        if (combinedArray[turns+1].includes(outgoingKey)) {
          //Gets the Message:
          var nextIndex = combinedArray[turns+1].indexOf(outgoingKey);
          var nextMessage = combinedArray[turns+1].substring(0, nextIndex);

          //Gets the Stamp:
          var nextStamp = combinedArray[turns+1].replace(nextMessage, "");
          nextStamp = nextStamp.replace(outgoingKey, "");

          //Gets the Difference:
          var diff = (parseInt(nextStamp) - parseInt(stamp))/1000;

          //Checks the Case:
          if (diff < 60) {
            //Sets the Timestamp:
            timeStamp = "";
          }
        }
      }

      //Checks the Case:
      if (getCacheData(fullID, false) == null
        && getCacheData(codeID, false) != null) {
        //Adds to the Chat:
        chatContents +=
          "<div class='right chat-space'> <div class='chat'> " +
          message + "</div> <div class='stamp'>" + timeStamp + "</div> </div>";
      }

      else if (getCacheData(codeID, false) != null) {
        //Adds to the Chat:
        chatContents +=
          "<div class='left chat-space'> <div class='chatOther'> " +
          message + "</div> <div class='stamp'>" + timeStamp + "</div> </div>";
      }
    }

    else if (combinedArray[turns].includes(incomingKey)) {
      //Gets the Message:
      var index = combinedArray[turns].indexOf(incomingKey);
      var message = combinedArray[turns].substring(0, index);
      
      //Gets the Stamp:
      var stamp = combinedArray[turns].replace(message, "");
      stamp = stamp.replace(incomingKey, "");

      //Gets the Timestamp:
      var ago = Date.now() - parseInt(stamp);
      var timeStamp = getFormattedStamp(ago);

      //Checks the Case:
      if (turns != combinedArray.length-1) {
        //Checks the Case:
        if (combinedArray[turns+1].includes(incomingKey)) {
          //Gets the Message:
          var nextIndex = combinedArray[turns+1].indexOf(incomingKey);
          var nextMessage = combinedArray[turns+1].substring(0, nextIndex);

          //Gets the Stamp:
          var nextStamp = combinedArray[turns+1].replace(nextMessage, "");
          nextStamp = nextStamp.replace(incomingKey, "");

          //Gets the Difference:
          var diff = (parseInt(nextStamp) - parseInt(stamp))/1000;

          //Checks the Case:
          if (diff < 60) {
            //Sets the Timestamp:
            timeStamp = "";
          }
        }
      }

      //Checks the Case:
      if (getCacheData(fullID, false) == null
        && getCacheData(codeID, false) != null) {
        //Adds to the Chat:
        chatContents +=
          "<div class='left chat-space'> <div class='chatOther'> " +
          message + "</div> <div class='stamp'>" + timeStamp + "</div> </div>";
      }

      else if (getCacheData(codeID, false) != null) {
        //Adds to the Chat:
        chatContents +=
          "<div class='right chat-space'> <div class='chat'> " +
          message + "</div> <div class='stamp'>" + timeStamp + "</div> </div>";
      }
    }

    turns++;
  }

  //Sets the HTML:
  box.innerHTML = chatContents;
  box.scrollTop = box.scrollHeight;
}

//Close Chat Input Function:
function closeChatInput() {
  //Resets the Chat Input:
  document.getElementById('chatInput').value = "";
}

//Get Formatted Stamp Function:
function getFormattedStamp(time) {
  //Time Stamp Variable:
  var timeStamp = "";
  var ago = Math.floor(time/1000);
  
  //Checks the Case:
  if (ago < 60) {
    //Sets the Stamp:
    timeStamp += "now";
  }

  else if (ago >= 60 && ago < 3600) {
    //Sets the Stamp:
    timeStamp += Math.floor(ago/60) + "m";
  }

  else if (ago >= 3600 && ago < 86400) {
    //Sets the Stamp:
    timeStamp += Math.floor(ago/3600) + "h";
  }

  else if (ago >= 86400 && ago < 604800) {
    //Sets the Stamp:
    timeStamp += Math.floor(ago/86400) + "d";
  }

  else if (ago >= 604800 && ago < 2419200) {
    //Sets the Stamp:
    timeStamp += Math.floor(ago/604800) + "w";
  }

  else if (ago >= 2419200 && ago < 29030400) {
    //Sets the Stamp:
    timeStamp += Math.floor(ago/2419200) + "mo";
  }

  else if (ago >= 29030400) {
    //Sets the Stamp:
    timeStamp += Math.floor(ago/29030400) + "y";
  }

  //Returns the Timestamp:
  return timeStamp;
}

//Add Before Function:
function addBefore(array, value, add) {
  //Loop Variables:
  var localArray = [];
  var turns = 0;
  var passed = false;

  //Loops through Array:
  mainLoop: while (turns < array.length) {
    //Checks the Case:
    if (array[turns] == value && !passed) {
      //Adds to the Local Array:
      localArray.push(add);
      localArray.push(array[turns]);
      passed = true;
    }

    else {
      //Adds to the Local Array:
      localArray.push(array[turns]);
    }

    turns++;
  }

  //Returns the Local Array:
  return localArray;
}

/* UI FUNCTIONS */

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
    document.getElementById('gameCode').innerHTML = currentCode  + 
      "&nbsp; <button onclick='copyURL();'>  Copy </button>";
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
    var digit = Math.floor((Math.random() * 9) + 1);
    code += digit;

    turns++;
  }

  //Returns the Code:
  return code;
}

//Join URL Function:
function getURL() {
  //Checks the Case:
  if (getCacheData(codeID, false) == null) {
    //Gets the URL Parameters:
    var query = window.location.search;
    var urlParameters = new URLSearchParams(query);

    //Checks the URL Parameters:
    if (urlParameters.has("c")) {
      //Joins the Game:
      document.getElementById('codeInput').value = urlParameters.get("c");
      document.getElementById('joinButton').click();
    }
  }
}

//Copy Join Link Function:
function copyURL() {
  //Sets the Link:
  currentCode = getCacheData(codeID, false);
  var link = "https://imagionary.netlify.app/?c=" + currentCode;

  //Copies to Clipboard:
  navigator.clipboard.writeText(link);
  document.getElementById('gameCode').innerHTML = "Copied";
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