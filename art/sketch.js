// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/145-2d-ray-casting.html
// https://youtu.be/TOEi6T2mtHo

// 2D Ray Casting

let walls = [];
let ray;
let particle;
let particleList = [];
let xoff = 0;
let yoff = 10000;
let input, button, greeting;
var shapeArray = [
  [-71, -11],
  [32, -49],
  [77, -53],
  [-40, 16],
  [-71, 11],
];
// var shapeArray = [];
var rawData = null;
let url =
  "https://02jg1blwka.execute-api.us-east-1.amazonaws.com/default/geoScript";
function preload() {
  // rawData = loadJSON(url+`?sides=${6}`);
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

  button = createButton("submit");
  button.position(input.x + input.width, 65);
  button.mousePressed(callAPI);

  greeting = createElement("h2", "How many sides ya want?");
  greeting.style("color", "white");
  greeting.position(20, 5);

  textAlign(CENTER);
  textSize(50);
}

function callAPI() {
  const sides = input.value();
  console.log(sides);
  httpGet(url + `?sides=${sides}`, "json", false, function (res) {
    console.log("http return: ", res);
    shapeArray = res;

    shapeArray = shapeArray.map((cords) => [
      300 + 3 * (cords[0] + 75),
      100 + 3 * (cords[1] + 75),
    ]);

    particleList = [];
    for (let i = 0; i < 3; i++) {
      p = new Particle();
      p.update(shapeArray[i][0], shapeArray[i][1]);
      particleList.push(p);
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
  particle.show();
  particle.look(walls, [0, 0, 255]);

  particleList.forEach((p, index) => {
    const red = index % 3 === 0 ? 255 : 0;
    const blue = index % 3 === 1 ? 255 : 0;
    const green = index % 3 === 2 ? 255 : 0;
    p.show();
    p.look(walls, [red, blue, green]);
  });

  xoff += 0.01;
  yoff += 0.01;
}
