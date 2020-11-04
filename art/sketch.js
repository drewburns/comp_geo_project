// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/145-2d-ray-casting.html
// https://youtu.be/TOEi6T2mtHo

// 2D Ray Casting

let walls = [];
let ray;
let particle;
let xoff = 0;
let yoff = 10000;
// var shapeArray = [
//   [-71, -11],
//   [32, -49],
//   [77, -53],
//   [-40, 16],
//   [-71, 11],
// ];
var shapeArray = [];
var rawData = null;
function preload() {
  let url =
    "https://02jg1blwka.execute-api.us-east-1.amazonaws.com/default/geoScript";
  rawData = loadJSON(url);
  // httpGet(url, "json", false, function (res) {
  //   console.log("http return: ", res);
  //   shapeArray = res;
  // });
}

function setup() {
  for (const [key, value] of Object.entries(temp)) {
    shapeArray.push(value);
  }

  createCanvas(400, 400);
  shapeArray = shapeArray.map((cords) => [
    2 * (cords[0] + 100),
    2 * (cords[1] + 100),
  ]);
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

  // for (let i = 0; i < 5; i++) {
  //   let x1 = random(width);
  //   let x2 = random(width);
  //   let y1 = random(height);
  //   let y2 = random(height);
  //   walls[i] = new Boundary(x1, y1, x2, y2);
  // }
  walls.push(new Boundary(-1, -1, width, -1));
  walls.push(new Boundary(width, -1, width, height));
  walls.push(new Boundary(width, height, -1, height));
  walls.push(new Boundary(-1, height, -1, -1));
  particle = new Particle();
}

function draw() {
  background(0);
  for (let wall of walls) {
    wall.show();
  }
  //particle.update(noise(xoff) * width, noise(yoff) * height);
  particle.update(mouseX, mouseY);
  particle.show();
  particle.look(walls);

  xoff += 0.01;
  yoff += 0.01;
}
