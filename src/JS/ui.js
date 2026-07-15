/* UI CONTROL FUNCTIONS */

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
    while (turns < outgoingArray.length) {
      combinedArray.push(outgoingArray[turns]);
      turns++;
    }

    //Loops through Outgoing Array:
    turns = 0;
    while (turns < outgoingArray.length) {
      //Gets the Outgoing Data:
      var outgoingIndex = outgoingArray[turns].indexOf(outgoingKey) + outgoingKey.length;
      var outgoingString = outgoingArray[turns].substring(outgoingIndex);
      var outgoingStamp = parseInt(outgoingString);

      //Loops through Incoming Array:
      var counts = 0;
      while (counts < incomingArray.length) {
        var incomingIndex = incomingArray[counts].indexOf(incomingKey) + incomingKey.length;
        var incomingString = incomingArray[counts].substring(incomingIndex);
        var incomingStamp = parseInt(incomingString);

        //Checks the Case:
        if (incomingStamp < outgoingStamp) {
          if (!combinedArray.includes(incomingArray[counts])) {
            combinedArray = addBefore(combinedArray, outgoingArray[turns], incomingArray[counts]);
          }
        }

        else if (turns == outgoingArray.length - 1) {
          combinedArray.push(incomingArray[counts]);
        }

        counts++;
      }

      turns++;
    }
  }

  else {
    //Adds to Combined Array:
    while (turns < incomingArray.length) {
      combinedArray.push(incomingArray[turns]);
      turns++;
    }
  }

  //Loops through Combined Array:
  turns = 0;
  while (turns < combinedArray.length) {
    if (combinedArray[turns].includes(outgoingKey)) {
      //Gets the Message Data:
      var index = combinedArray[turns].indexOf(outgoingKey);
      var message = combinedArray[turns].substring(0, index);
      var stamp = combinedArray[turns].replace(message, "");
      stamp = stamp.replace(outgoingKey, "");

      //Formats the Timestamp:
      var ago = Date.now() - parseInt(stamp);
      var timeStamp = getFormattedStamp(ago);

      //Checks the Case:
      if (turns != combinedArray.length-1) {
        if (combinedArray[turns+1].includes(outgoingKey)) {
          //Gets the Message Data:
          var nextIndex = combinedArray[turns+1].indexOf(outgoingKey);
          var nextMessage = combinedArray[turns+1].substring(0, nextIndex);
          var nextStamp = combinedArray[turns+1].replace(nextMessage, "");
          nextStamp = nextStamp.replace(outgoingKey, "");

          //Checks the Difference:
          var diff = (parseInt(nextStamp) - parseInt(stamp))/1000;
          if (diff < 60) {
            timeStamp = "";
          }
        }
      }

      //Checks the Chat:
      if (getCacheData(fullID, false) == null
        && getCacheData(codeID, false) != null) {
        chatContents +=
          "<div class='right chat-space'> <div class='chat'> " +
          message + "</div> <div class='stamp'>" + timeStamp + "</div> </div>";
      }

      else if (getCacheData(codeID, false) != null) {
        chatContents +=
          "<div class='left chat-space'> <div class='chatOther'> " +
          message + "</div> <div class='stamp'>" + timeStamp + "</div> </div>";
      }
    }

    else if (combinedArray[turns].includes(incomingKey)) {
      //Gets the Message Data:
      var index = combinedArray[turns].indexOf(incomingKey);
      var message = combinedArray[turns].substring(0, index);
      var stamp = combinedArray[turns].replace(message, "");
      stamp = stamp.replace(incomingKey, "");

      //Formats the Timestamp:
      var ago = Date.now() - parseInt(stamp);
      var timeStamp = getFormattedStamp(ago);

      //Checks the Case:
      if (turns != combinedArray.length-1) {
        if (combinedArray[turns+1].includes(incomingKey)) {
          //Gets the Message Data:
          var nextIndex = combinedArray[turns+1].indexOf(incomingKey);
          var nextMessage = combinedArray[turns+1].substring(0, nextIndex);
          var nextStamp = combinedArray[turns+1].replace(nextMessage, "");
          nextStamp = nextStamp.replace(incomingKey, "");

          //Checks the Difference:
          var diff = (parseInt(nextStamp) - parseInt(stamp))/1000;
          if (diff < 60) {
            timeStamp = "";
          }
        }
      }

      //Checks the Chat:
      if (getCacheData(fullID, false) == null
        && getCacheData(codeID, false) != null) {
        chatContents +=
          "<div class='left chat-space'> <div class='chatOther'> " +
          message + "</div> <div class='stamp'>" + timeStamp + "</div> </div>";
      }

      else if (getCacheData(codeID, false) != null) {
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
  document.getElementById('chatInput').value = "";
}

//Get Formatted Stamp Function:
function getFormattedStamp(time) {
  //Time Stamp Variables:
  var timeStamp = "";
  var ago = Math.floor(time/1000);
  
  //Checks the Case:
  if (ago < 60) {
    timeStamp += "now";
  }

  else if (ago >= 60 && ago < 3600) {
    timeStamp += Math.floor(ago/60) + "m";
  }

  else if (ago >= 3600 && ago < 86400) {
    timeStamp += Math.floor(ago/3600) + "h";
  }

  else if (ago >= 86400 && ago < 604800) {
    timeStamp += Math.floor(ago/86400) + "d";
  }

  else if (ago >= 604800 && ago < 2419200) {
    timeStamp += Math.floor(ago/604800) + "w";
  }

  else if (ago >= 2419200 && ago < 29030400) {
    timeStamp += Math.floor(ago/2419200) + "mo";
  }

  else if (ago >= 29030400) {
    timeStamp += Math.floor(ago/29030400) + "y";
  }
  return timeStamp;
}

//Add Before into Array Function:
function addBefore(array, value, add) {
  //Loop Variables:
  var localArray = [];
  var turns = 0;
  var passed = false;

  //Loops through Array to Add:
  while (turns < array.length) {
    if (array[turns] == value && !passed) {
      localArray.push(add);
      localArray.push(array[turns]);
      passed = true;
    }

    else {
      localArray.push(array[turns]);
    }

    turns++;
  }
  return localArray;
}

/* UI ELEMENTS FUNCTIONS */

//Show Control Message Function:
function showControlMessage(message) {
  document.getElementById('controlMessage').innerHTML = message;
}

//Show Game Message Function:
function showGameMessage(message) {
  document.getElementById('gameCode').innerHTML = message;
}

//Show Controls Function:
function showControls() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    document.getElementById('controlContainer').style.display = "none";
    document.getElementById('chatContainer').style.display = "block";
    document.getElementById('gameContainer').style.display = "block";
  }

  else {
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
    document.getElementById('guessContainer').style.display = "none";
    document.getElementById('drawContainer').style.display = "block";
  }

  else if (getCacheData(codeID, false) != null) {
    document.getElementById('guessContainer').style.display = "block";
    document.getElementById('drawContainer').style.display = "none";
  }

  else {
    document.getElementById('drawContainer').style.display = "none";
    document.getElementById('guessContainer').style.display = "none";
  }
}

//Show Message Function:
function showMessage() {
  //Checks the Case:
  if (getCacheData(fullID, false) == null
    && getCacheData(codeID, false) != null) {
    currentCode = getCacheData(codeID, false);
    document.getElementById('gameCode').innerHTML = currentCode  + 
      "&nbsp; <button onclick='copyURL();'>  Copy </button>";
  }

  else if (getCacheData(codeID, false) != null) {
    document.getElementById('gameCode').innerHTML = "Joined Game";
  }
}

//Show Result Function:
function showResult() {
  //Checks the Case:
  if (getCacheData(guessID, false).toLowerCase() ==
    getCacheData(wordID, false).toLowerCase()) {
    if (getCacheData(fullID, false) == null
      && getCacheData(codeID, false) != null) {
      //Shows Lose Screen:
      document.getElementById('header').style.color = "#FF3333";
      document.getElementById('header').innerHTML = "You Lose!";

      //Waits and Resets:
      deleteGame();
      clearCacheData();
      setTimeout(function () {
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
        window.location.href = "https://imagionary.netlify.app";
      }, 1000);
    }
  }

  else if (getCacheData(guessID, false) != "") {
    if (getCacheData(fullID, false) == null
      && getCacheData(codeID, false) != null) {
      //Shows Lose Screen:
      document.getElementById('header').style.color = "#73BB88";
      document.getElementById('header').innerHTML = "You Win!";

      //Waits and Resets:
      deleteGame();
      clearCacheData();
      setTimeout(function () {
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
    document.getElementById('header').innerHTML = getCacheData(wordID, false);
  }
}

//Random Word Function:
async function randomWord() {
  //Gets List of Words:
  const response = await fetch('/src/words.json').catch((error) => {
    showGameMessage("An Error Ocurred");
  });
  const words = await response.json();

  //Generates a Random Word:
  var max = words.length - 1;
  var index = Math.round((Math.random() * max));
  return words[index];
}

//Generate Game Code GUID Function:
function generateCode() {
  return crypto.randomUUID();
}

//Join URL Function:
function getURL() {
  //Checks the Case:
  if (getCacheData(codeID, false) == null) {
    var query = window.location.search;
    var urlParameters = new URLSearchParams(query);

    //Checks the URL Parameters:
    if (urlParameters.has("c")) {
      document.getElementById('codeInput').value = urlParameters.get("c");
      document.getElementById('joinButton').click();
    }
  }
}

//Copy Join Link Function:
function copyURL() {
  currentCode = getCacheData(codeID, false);
  var link = "https://imagionary.netlify.app/?c=" + currentCode;
  navigator.clipboard.writeText(link);
  document.getElementById('gameCode').innerHTML = "Copied";
}

//Enable Loading Function:
function enableLoading() {
  document.getElementById('loading').style.display = "block";
  document.getElementById('mainContent').style.display = "none";
}

//Disable Loading Function:
function disableLoading() {
  document.getElementById('loading').style.display = "none";
  document.getElementById('mainContent').style.display = "block";
}