// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/145-2d-ray-casting.html
// https://youtu.be/TOEi6T2mtHo

// 2D Ray Casting

let walls = [];
let overlay = [];
let showOverlay = false;
let showGuardButtons = true;
let showMouseGuard = true;
let ray;
let particle;
let particleList = [];
let xoff = 0;
let yoff = 10000;
let input, button, greeting;
let showGuards = true;
var shapeArray = [
  [-71, -11],
  [32, -79],
  [77, -53],
  [-40, 16],
  [-71, 11],
];
var buttonList = [];
var rawData = null;
let url =
  "https://02jg1blwka.execute-api.us-east-1.amazonaws.com/default/geoScript";
function preload() {
  // rawData = loadJSON(url+`?sides=${6}`);
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function setup() {
  // for (const [key, value] of Object.entries(rawData)) {
  //   shapeArray.push(value);
  // }

  createCanvas(windowWidth, windowHeight);

  // for (let i = 0; i < 5; i++) {
  //   let x1 = random(width);
  //   let x2 = random(width);
  //   let y1 = random(height);
  //   let y2 = random(height);
  //   walls[i] = new Boundary(x1, y1, x2, y2);
  // }
  particle = new Particle();

  input = createInput();
  input.position(20, 65);

  button = createButton("Submit");
  button.position(input.x + input.width, 65);
  button.mousePressed(callAPI);

  greeting = createElement("h2", "Sides:");
  greeting.style("color", "white");
  greeting.position(20, 5);

  textAlign(CENTER);
  textSize(50);

  button = createButton("Toggle triangulation overlay");
  button.position(input.x + input.width, height);
  button.mousePressed(toggleOverlay);

  button = createButton("Toggle mouse guard");
  button.position(input.x + input.width*3, height);
  button.mousePressed(toggleMouseGuard);

  button = createButton("Toggle guard buttons");
  button.position(input.x, height);
  button.mousePressed(toggleGuardButtons);

  textAlign(CENTER);
  textSize(50);
  button = createButton("Turn guards OFF");
  button.position(input.x + input.width + 100, 65);
  button.mousePressed(toggleGuards);


}

function toggleMouseGuard() {
	showMouseGuard = !showMouseGuard;
}

function toggleGuardButtons() {
	showGuardButtons = !showGuardButtons;
	if(!showGuardButtons) {
		for(let b of buttonList) {
			b.hide();
		}
	}
	if(showGuardButtons) {
		for(let b of buttonList) {
			b.show();
		}
	}
}

function toggleOverlay() {
  showOverlay = !showOverlay;
}

function toggleGuards() {
  showGuards = !showGuards;
  button.html(`Turn guards ${showGuards ? "OFF" : "ON"}`);
}

function callAPI() {
  const sides = input.value();
  // console.log(sides);
  httpGet(url + `?sides=${sides}`, "json", false, function (res) {
    console.log("http return: ", res);
    buttonList.forEach((button) => {
      button.remove();
    });
    shapeArray = res;

    shapeArray = shapeArray.map((cords) => [
      300 + 3 * (cords[0] + 75),
      100 + 3 * (cords[1] + 75),
    ]);

    particleList = [];
    for (let i = 0; i < shapeArray.length - 1; i++) {
      let v1 = createVector(shapeArray[i][0], shapeArray[i][1]);

      let len = shapeArray.length - 1;
      let p2 = (i + 1) % len;
      let p3 = (i + len - 1) % len;

      //print(p3);
      //print(i);
      //print(p2);

      let v2 = createVector(shapeArray[p2][0], shapeArray[p2][1]);

      let v3 = createVector(shapeArray[p3][0], shapeArray[p3][1]);

      let diff1 = p5.Vector.sub(v2, v1);
      let diff2 = p5.Vector.sub(v3, v1);

      ref = p5.Vector.fromAngle(radians(0));

      let startAngle = degrees(ref.angleBetween(diff1));
      let stopAngle = degrees(ref.angleBetween(diff2));

      //print((i + shapeArray.length - 1) % shapeArray.length)
      //print(i)
      //print((i + 1) % shapeArray.length)

      //if(startAngle < 0) {
      //startAngle = startAngle + 360*Math.ceil(Math.abs(startAngle)/360)
      //}

      if (stopAngle < startAngle) {
        if (startAngle != 0) {
          stopAngle =
            stopAngle + 360 * Math.ceil(Math.abs(stopAngle) / startAngle);
        }
      }

      // print(startAngle);
      // print(stopAngle);

      p = new Particle(startAngle, stopAngle);
      newButton = createButton("X");
      newButton.position(shapeArray[i][0], shapeArray[i][1]);
      p.update(shapeArray[i][0], shapeArray[i][1]);
      particleList.push(p);
      newButton.mousePressed(() => {
        particleList[i].isShown = !particleList[i].isShown;
      });
      buttonList.push(newButton);
    }

    walls = [];
    walls.push(new Boundary(-1, -1, width, -1));
    walls.push(new Boundary(width, -1, width, height));
    walls.push(new Boundary(width, height, -1, height));
    walls.push(new Boundary(-1, height, -1, -1));
    for (let i = 0; i < shapeArray.length - 1; i++) {
      walls[i] = new Boundary(
        shapeArray[i][0],
        shapeArray[i][1],
        shapeArray[i + 1][0],
        shapeArray[i + 1][1]
      );
    }
    walls.push(
      new Boundary(
        shapeArray[shapeArray.length - 1][0],
        shapeArray[shapeArray.length - 1][1],
        shapeArray[0][0],
        shapeArray[0][1]
      )
    );
  });
}

function draw() {
  background(0);
  for (let wall of walls) {
    wall.show();
  }

  //particle.update(noise(xoff) * width, noise(yoff) * height);
  particle.update(mouseX, mouseY);
  if(showMouseGuard) {
	  particle.show();
	  particle.look(walls, [0, 0, 255]);
  }

  particleList.forEach((p, index) => {
    // const red = index % 3 === 0 ? 255 : 0;
    // const blue = index % 3 === 1 ? 255 : 0;
    // const green = index % 3 === 2 ? 255 : 0;
    const color1 = [138, 43, 226];
    const color2 = [0, 191, 255];
    const color3 = [176, 224, 230];

    var theColor = null;
    if (index % 3 === 0) {
      theColor = color1;
    }
    if (index % 3 === 1) {
      theColor = color2;
    }
    if (index % 3 === 2) {
      theColor = color3;
    }

    // console.log(theColor);
    if (showGuards) {
      p.show();
      p.look(walls, theColor);
    }
  });

  xoff += 0.01;
  yoff += 0.01;

  if (showOverlay) {
	  for (let pair of overlay) {
		pairOne = pair[0];
		pairTwo = pair[1];
		line(pairOne[0], pairOne[1], pairTwo[0], pairTwo[1]);
	  }
  }
}
