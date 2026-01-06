/* GAME SETUP */

//Game Variables:
var canvas;
var context;
var x = 0;
var y = 0;
var down = false;
var mouseWaitTime = 10;
var chatWaitTime = 1000;

//Onload:
window.onload = function () {
  /* SETUP */

  //Gets the Game:
  getURL();
  getGame();

  //Control Functions:
  showControls();
  showDrawControls();
  showMessage();
  showWord();
  disableLoading();

  //Canvas Setup:
  canvas = document.getElementById('gameCanvas');
  context = canvas.getContext('2d');
  square('#FFFFFF', 0, 0, canvas.width);

  //Mouse Interval:
  setInterval(function () {
    mouseDown();
  }, mouseWaitTime);

  //Chat Interval:
  setInterval(function () {
    if (getCacheData(outgoingID, false) != null) {
      showOpponentMessage();
    }
  }, chatWaitTime);

  /* EVENTS */

  //Mouse Coordinates Event:
  canvas.addEventListener("mousemove", function (e) {
    //Gets Mouse X and Y:
    var rect = canvas.getBoundingClientRect();
    x = Math.round(e.clientX - rect.left);
    y = Math.round(e.clientY - rect.top);

    //Draws on the Screen:
    draw(true);
  });

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

  //Disables Default Events:
  canvas.addEventListener("touchstart", function(e) {e.preventDefault()});
  canvas.addEventListener("touchmove", function(e) {e.preventDefault()});
  canvas.addEventListener("touchend", function(e) {e.preventDefault()});
  canvas.addEventListener("touchcancel", function(e) {e.preventDefault()});

  //Chat Input Event:
  document.getElementById('chatInput').addEventListener("input", function () {
    document.getElementById('chatInput').value = document.getElementById('chatInput').value.replace(/["]+/g, '');
  });

  //Code Input Event:
  document.getElementById('codeInput').addEventListener("input", function () {
    document.getElementById('codeInput').value = document.getElementById('codeInput').value.replace(/["]+/g, '');
  });

  //Guess Input Event:
  document.getElementById('guessInput').addEventListener("input", function () {
    document.getElementById('guessInput').value = document.getElementById('guessInput').value.replace(/["]+/g, '');
  });

  //Create Button Event:
  document.getElementById('createButton').addEventListener("click", async function () {
    await createGame();
  });
}

/* CANVAS FUNCTIONS */

//Draw Function:
function draw(click) {
  //Checks the Case:
  if (getCacheData(fullID, false) == null
    && getCacheData(codeID, false) != null) {
    if (click) {
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

//Erase Canvas Function:
function erase() {
  //Checks the Case:
  if (getCacheData(fullID, false) == null
    && getCacheData(codeID, false) != null) {
    square('#FFFFFF', 0, 0, canvas.width);
    x = 0;
    y = 0;
  }
}

//Square Function:
function square(color, x, y, dimension) {
  context.fillStyle = color;
  context.fillRect(x, y, dimension, dimension);
}

//Mouse Down Function:
function mouseDown() {
  //Down Events:
  canvas.onmousedown = function () { down = true; }
  canvas.onmouseup = function () { down = false; }
}

/* DRAWING FUNCTIONS */

//Display Drawing Function:
function displayDrawing() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Drawing:
    drawing = getCacheData(drawingID, true);
    var turnsWidth = 0;

    //Loops through Array:
    while (turnsWidth < canvas.width) {
      var turnsHeight = 0;
      while (turnsHeight < canvas.height) {
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
  var turnsWidth = 0;
  var subArray = [];

  //Resets the Array:
  while (turnsWidth < canvas.width) {
    subArray.push("-");
    turnsWidth++;
  }

  //Saves the Drawing:
  var turnsHeight = 0;
  while (turnsHeight < canvas.height) {
    drawing.push(subArray);
    turnsHeight++;
  }
  setCacheData(drawingID, drawing, true);
}

//Save Drawing Function:
function saveDrawing() {
  //Checks the Case:
  if (getCacheData(codeID, false) != null) {
    //Gets the Drawing:
    drawing = getCacheData(drawingID, true);
    var turnsWidth = 0;

    //Saves the Drawing:
    while (turnsWidth < canvas.width) {
      var turnsHeight = 0;
      while (turnsHeight < canvas.height) {
        //Gets the Pixel Data:
        var data = context.getImageData(turnsWidth, turnsHeight, 1, 1).data;
        if (data[0] == 0 && data[1] == 0 && data[2] == 0) {
          drawing[turnsWidth][turnsHeight] = "+";
        }

        else {
          drawing[turnsWidth][turnsHeight] = "-";
        }

        turnsHeight++;
      }

      turnsWidth++;
    }
    setCacheData(drawingID, drawing, true);
  }
}