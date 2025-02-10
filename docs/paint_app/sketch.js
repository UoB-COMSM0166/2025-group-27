var isPressed = false;
var isDouble = false;
var gridSet = false;
var followSpeed = false;
function setup() {
  cnv = createCanvas(800, 800);
  print("follow the instruction of button name, some keypress info: r=red,g=green,b=blue,c=default pen");
  background(255);
  //Canvas design
  //grid Mode
  if (gridSet) {
    grid();
  }

  //default setting
  fill(255, 255, 0);
  strokeWeight(5);

  //button design
  rect(0, 0, 50, 50);
  fill(255, 0, 0);
  text("change", 5, 25);
  text("color", 9, 35);
  fill(255, 255, 0);
  rect(700, 0, 100, 50);
  fill(255, 0, 0);
  text("brush size", 725, 30);
  fill(255, 255, 0);
  rect(0, 750, 50, 50);
  fill(255, 0, 0);
  text("save", 15, 780);
  fill(255, 255, 0);
  rect(750, 750, 50, 50);
  fill(255, 0, 0);
  text("clear", 760, 780);
  fill(255, 255, 0);
  rect(0, 350, 50, 50);
  fill(255, 0, 0);
  text("auto", 10, 370);
  text("scribbler", 2, 390);
  fill(255, 255, 0);
  rect(750, 350, 50, 50);
  fill(255, 0, 0);
  text("symmetry", 750, 380);
  fill(255, 255, 0);
  rect(700, 50, 100, 50);
  fill(255, 0, 0);
  text("opaque", 735, 80);
  fill(255, 255, 0);
  rect(50, 750, 50, 50);
  fill(255, 0, 0);
  text("grid", 65, 780);
  fill(255, 255, 0);
  rect(100, 750, 50, 50);
  fill(255, 0, 0);
  text("nogrid", 105, 780);
  fill(255, 255, 0);
  rect(150, 750, 50, 50);
  fill(255, 0, 0);
  text("follow", 158, 770);
  text("speed", 158, 790);
  fill(255, 255, 0);
  rect(200, 750, 50, 50);
  fill(255, 0, 0);
  text("not", 213, 770);
  text("follow", 206, 780);
  text("speed", 208, 790);
}

function draw() {
  //mouse press button
  if (mouseX >= 0 && mouseX <= 50 && mouseY >= 0 && mouseY <= 50) {
    if (mouseIsPressed) {
      colorChange();
      return;
    }
  }

  //opaque change button
  if (mouseX >= 700 && mouseX <= 800 && mouseY >= 50 && mouseY <= 100) {
    if (mouseIsPressed) {
      opaqueChange();
      return;
    }
  }

  //size change button
  if (mouseX >= 700 && mouseX <= 800 && mouseY >= 0 && mouseY <= 50) {
    if (mouseIsPressed) {
      sizeChange();
      return;
    }
  }

  //save button
  if (mouseX >= 0 && mouseX <= 50 && mouseY >= 750 && mouseY <= 800) {
    if (mouseIsPressed) {
      save(cnv, "example.jpg");
      return;
    }
  }

  //clear button
  if (mouseX >= 750 && mouseX <= 800 && mouseY >= 750 && mouseY <= 800) {
    if (mouseIsPressed) {
      fill(255);
      rect(0, 0, 800, 800);
      setup();
      return;
    }
  }

  //auto-scribbler
  if (mouseX >= 0 && mouseX <= 50 && mouseY >= 350 && mouseY <= 400) {
    if (mouseIsPressed) {
      randomPaint();
      return;
    }
  }

  //symmetry
  if (mouseX >= 750 && mouseX <= 800 && mouseY >= 350 && mouseY <= 400) {
    if (mouseIsPressed) {
      isDouble = !isDouble;
      return;
    }
  }

  //main drawing function
  if (mouseIsPressed) {
    if (followSpeed) {
      let nspeed = dist(mouseX, mouseY, pmouseX, pmouseY);
      let weight = map(nspeed, 0, 50, 1, 20);
      weight = constrain(weight, 1, 20);
      strokeWeight(weight);
      line(pmouseX, pmouseY, mouseX, mouseY);
      if (isDouble) {
        line(pmouseY, pmouseX, mouseY, mouseX);
      }
    } else {
      line(pmouseX, pmouseY, mouseX, mouseY);
      if (isDouble) {
        line(pmouseY, pmouseX, mouseY, mouseX);
      }
    }
  }

  //grid mode
  if (mouseX >= 50 && mouseX <= 100 && mouseY >= 750 && mouseY <= 800) {
    if (mouseIsPressed) {
      gridSet = true;
      setup();
      return;
    }
  }

  //no gird mode
  if (mouseX >= 100 && mouseX <= 150 && mouseY >= 750 && mouseY <= 800) {
    if (mouseIsPressed) {
      gridSet = false;
      setup();
      return;
    }
  }

  //follow speed
  if (mouseX >= 150 && mouseX <= 200 && mouseY >= 750 && mouseY <= 800) {
    if (mouseIsPressed) {
      followSpeed = true;
      return;
    }
  }

  //not follow speed
  if (mouseX >= 200 && mouseX <= 250 && mouseY >= 750 && mouseY <= 800) {
    if (mouseIsPressed) {
      followSpeed = false;
      return;
    }
  }
}

//color change
function colorChange() {
  fill(random(255), random(255), random(255));
  stroke(random(255), random(255), random(255));
}

//pen size change
function sizeChange() {
  var x;
  x = map(mouseX, 700, 800, 0, 100);
  strokeWeight(x);
}

//default pen style change, also some default colors
function keyPressed() {
  if (key == "c") {
    strokeWeight(1);
  }
  if (key == "r") {
    stroke(255, 0, 0);
  } else if (key == "g") {
    stroke(0, 255, 0);
  } else if (key == "b") {
    stroke(0, 0, 255);
  }
}

//eraser
function mousePressed() {
  if (mouseButton == RIGHT && isPressed == false) {
    isPressed = !isPressed;
    stroke(255);
  } else if (mouseButton == RIGHT && isPressed == true) {
    isPressed = !isPressed;
    stroke(0);
  }
}

//auto-scribbler function
function randomPaint() {
  var lclx = random(50, 750),
    lcly = random(50, 750);
  for (var times = 0; times <= random(200); times++) {
    let nudgeX = random(-3, 3);
    let nudgeY = random(-3, 3);
    lclx += nudgeX;
    lcly += nudgeY;
    point(lclx, lcly);
  }
}

//opaque change function
function opaqueChange() {
  var opaque = map(mouseX, 700, 800, 0, 255);
  stroke(0, 0, 0, opaque);
}

//grid function
function grid() {
  var m = 20;
  var n = 20;
  for (var col = 0; col < 40; col++) {
    line(m, 0, m, 800);
    m += 20;
  }
  for (var row = 0; row < 40; row++) {
    line(0, n, 800, n);
    n += 20;
  }
}
