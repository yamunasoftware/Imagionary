/* GAME SETUP */

//Canvas Variables:
var canvas;
var context;

//Mouse Variables:
var x = 0;
var y = 0;
var down = false;

//Wait Times:
var mouseWaitTime = 10;
var chatWaitTime = 1000;

//Onload:
window.onload = function () {
  /* Game Controls */

  //Gets the Game:
  getURL();
  getGame();

  //Control Functions:
  showControls();
  showDrawControls();
  showMessage();
  showWord();
  disableLoading();

  /* Game Setup */

  //Canvas Setup:
  canvas = document.getElementById('gameCanvas');
  context = canvas.getContext('2d');
  square('#FFFFFF', 0, 0, canvas.width);

  /* Intervals */

  //Mouse Interval:
  setInterval(function () {
    //Checks Mouse Down:
    mouseDown();
  }, mouseWaitTime);

  //Chat Interval:
  setInterval(function () {
    //Checks the Case:
    if (getCacheData(outgoingID, false) != null) {
      //Sets the Chat:
      showOpponentMessage();
    }
  }, chatWaitTime);

  /* Mouse Events */

  //Mouse Coordinates Event:
  canvas.addEventListener("mousemove", function (e) {
    //Gets Mouse X and Y:
    var rect = canvas.getBoundingClientRect();
    x = Math.round(e.clientX - rect.left);
    y = Math.round(e.clientY - rect.top);

    //Draws on the Screen:
    draw(true);
  });

  /* Touch Events */

  //Touch Scroll Disable Event:
  canvas.addEventListener("touchstart", function (e) {
    //Gets the Touch Coordinates:
    var rect = canvas.getBoundingClientRect();
    x = Math.round(e.touches[0].clientX - rect.left);
    y = Math.round(e.touches[0].clientY - rect.top);

    //Draws on the Screen:
    draw(false);
  });

  //Touch Coordinates Event:
  canvas.addEventListener("touchmove", function (e) {
    //Gets the Touch Coordinates:
    var rect = canvas.getBoundingClientRect();
    x = Math.round(e.touches[0].clientX - rect.left);
    y = Math.round(e.touches[0].clientY - rect.top);

    //Draws on the Screen:
    draw(false);
  });

  /* Touch Default Events */

  //Disables Default Events:
  canvas.addEventListener("touchstart", function(e) {e.preventDefault()});
  canvas.addEventListener("touchmove", function(e) {e.preventDefault()});
  canvas.addEventListener("touchend", function(e) {e.preventDefault()});
  canvas.addEventListener("touchcancel", function(e) {e.preventDefault()});

  /* Input Events */

  //Chat Input Event:
  document.getElementById('chatInput').addEventListener("input", function () {
    //Resets the Input Value:
    document.getElementById('chatInput').value = document.getElementById('chatInput').value.replace(/["]+/g, '');
  });

  //Code Input Event:
  document.getElementById('codeInput').addEventListener("input", function () {
    //Resets the Input Value:
    document.getElementById('codeInput').value = document.getElementById('codeInput').value.replace(/["]+/g, '');
  });

  //Guess Input Event:
  document.getElementById('guessInput').addEventListener("input", function () {
    //Resets the Input Value:
    document.getElementById('guessInput').value = document.getElementById('guessInput').value.replace(/["]+/g, '');
  });
}

/* CANVAS FUNCTIONS */

//Draw Function:
function draw(click) {
  //Checks the Case:
  if (getCacheData(fullID, false) == null
    && getCacheData(codeID, false) != null) {
    //Checks the Case:
    if (click) {
      //Checks the Case:
      if (down) {
        //Sets the Pixel Color:
        square('#000000', x, y, 1);
        showControlMessage("");
      }
    }

    else {
      //Sets the Pixel Color:
      square('#000000', x, y, 1);
      showControlMessage("");
    }
  }
}

//Erase Function:
function erase() {
  //Checks the Case:
  if (getCacheData(fullID, false) == null
    && getCacheData(codeID, false) != null) {
    //Erase Canvas:
    square('#FFFFFF', 0, 0, canvas.width);
    x = 0;
    y = 0;
  }
}

//Square Function:
function square(color, x, y, dimension) {
  //Draws Rectangle:
  context.fillStyle = color;
  context.fillRect(x, y, dimension, dimension);
}

//Mouse Down Function:
function mouseDown() {
  //Down Event:
  canvas.onmousedown = function () {
    //Sets the Down:
    down = true;
  }

  //Down Event:
  canvas.onmouseup = function () {
    //Sets the Down:
    down = false;
  }
}

/* DRAWING FUNCTIONS */

//Display Drawing Function:
function displayDrawing() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Drawing:
    drawing = getCacheData(drawingID, true);

    //Loop Variable:
    var turnsWidth = 0;

    //Loops through Array:
    mainLoop: while (turnsWidth < canvas.width) {
      //Loop Variable:
      var turnsHeight = 0;

      //Loops through Array:
      secondLoop: while (turnsHeight < canvas.height) {
        //Checks the Case:
        if (drawing[turnsWidth][turnsHeight] == "+") {
          //Draws the Pixel:
          square('#000000', turnsWidth, turnsHeight, 1);
        }

        turnsHeight++;
      }

      turnsWidth++;
    }
  }
}

//Reset Drawing Function:
function resetDrawing() {
  //Empties Array:
  drawing = [];

  //Loop Variables:
  var turnsWidth = 0;
  var subArray = [];

  //Loops through Array:
  mainLoop: while (turnsWidth < canvas.width) {
    //Pushes to Sub Array:
    subArray.push("-");

    turnsWidth++;
  }

  //Loop Variable:
  var turnsHeight = 0;

  //Loops through Array:
  secondLoop: while (turnsHeight < canvas.height) {
    //Pushes to Main Array:
    drawing.push(subArray);

    turnsHeight++;
  }

  //Saves the Drawing:
  setCacheData(drawingID, drawing, true);
}

//Saves Drawing:
function saveDrawing() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Drawing:
    drawing = getCacheData(drawingID, true);

    //Loop Variable:
    var turnsWidth = 0;

    //Loops through Array:
    mainLoop: while (turnsWidth < canvas.width) {
      //Loop Variable:
      var turnsHeight = 0;

      //Loops through Array:
      secondLoop: while (turnsHeight < canvas.height) {
        //Gets the Pixel Data:
        var data = context.getImageData(turnsWidth, turnsHeight, 1, 1).data;

        //Checks the Case:
        if (data[0] == 0 && data[1] == 0 && data[2] == 0) {
          //Sets the Drawing:
          drawing[turnsWidth][turnsHeight] = "+";
        }

        else {
          //Sets the Drawing:
          drawing[turnsWidth][turnsHeight] = "-";
        }

        turnsHeight++;
      }

      turnsWidth++;
    }

    //Sets the Drawing:
    setCacheData(drawingID, drawing, true);
  }
}