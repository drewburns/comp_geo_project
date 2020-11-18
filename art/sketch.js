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
// var shapeArray = [
//   [-71, -11],
//   [32, -49],
//   [77, -53],
//   [-40, 16],
//   [-71, 11],
// ];
var shapeArray = [
  [-83, -9],
  [-76, -65],
  [-62, -37],
  [-22, -67],
  [-8, -70],
  [82, 25],
  [-16, 70],
  [-43, 69],
  [-83, -9],
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

function getAngle(x,y){
  var angle = Math.atan2(y, x);   //radians
  // you need to devide by PI, and MULTIPLY by 180:
  var degrees = 180*angle/Math.PI;  //degrees
  return (360+Math.round(degrees))%360; //round number, avoid decimal fragments
}
// function find_angle(A, B, C) {
//   var AB = Math.sqrt(Math.pow(B[0] - A[0], 2) + Math.pow(B[1] - A[1], 2));
//   var BC = Math.sqrt(Math.pow(B[0] - C[0], 2) + Math.pow(B[1] - C[1], 2));
//   var AC = Math.sqrt(Math.pow(C[0] - A[0], 2) + Math.pow(C[1] - A[1], 2));
//   return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
// }

function callAPI() {
  const sides = input.value();
  console.log(sides);
  // httpGet(url + `?sides=${sides}`, "json", false, function (res) {
  // console.log("http return: ", res);
  // shapeArray = res;

  shapeArray = shapeArray.map((cords) => [
    300 + 3 * (cords[0] + 75),
    100 + 3 * (cords[1] + 75),
  ]);

  particleList = [];
  // for (let i = 0; i < 2; i++) {
  
  point0 = shapeArray[0];
  point1 = shapeArray[1];
  point2 = shapeArray[2];

  line1 = {x: point0[0] - point1[0], y: point0[1] - point1[0] }
  line2 = {x: point2[0] - point1[0], y: point2[1] - point1[0] }
  // const startAngle = getAngle(line1.x,line1.y)
  // const stopAngle = getAngle(line2.x,line2.y)
  let ref = createVector(1, 0);
  let v1 = createVector(line1.x, line1.y);
  let v2 = createVector(line2.x, line2.y);
  const stopAngle = degrees(v2.angleBetween(ref));
  const startAngle = degrees(ref.angleBetween(v1));


  p = new Particle(startAngle, stopAngle);
  // console.log("ANGLE: ", find_angle(point0, point1, point2));

  p.update(shapeArray[1][0], shapeArray[1][1]);
  particleList.push(p);
  // }

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
  // });
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
