/*
  Creates two walker objects.
  The first walker accelerates towards the position of the second walker.
  The second walker uses 1D Perlin Noise to generate both an x and y position.
*/

let walker;

function setup() {
  // create canvas the width and height of the window being drawn to
  createCanvas(window.innerWidth, window.innerHeight);
  walker = new AimedWalker(createVector(width / 2, height / 2));
}

function draw() {
  // each frame, redrawn background, then update walker, then draw walker
  background(80);
  walker.update();
  walker.draw();
}

function AimedWalker(position) {
  this._constructor = function(position) {
    // set initial position to vector that's passed in and initial velocity to zero
    this.pos = position;
    this.vel = createVector(0, 0);

    // create target that Walker will aim for, in this case, a PerlinWalker instance
    this.target = new PerlinWalker();
  }

  this.update = function() {
    // update the target first
    this.target.update();

    // acceleration equal to the targets position vector minus this position vector
    // acceleration magnitude set to 0.01 to prevent exessive acceleration
    this.acc = p5.Vector.sub(this.target.getPos(), this.pos);
    this.acc.setMag(0.01);

    this.vel.add(this.acc);
    this._normalizeVelocity(3);
    this.pos.add(this.vel);

    // create vector pointing directly up
    const vUp = createVector(0, -1);

    // find the angle between vUp and this velocity vector
    this.angle = vUp.angleBetween(this.vel);
  }

  this.draw = function() {
    // draw the target first
    this.target.draw();

    fill('#0084FF');
    strokeWeight(1);
    
    // translate canvas to this position and rotate by this angle
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    // draw triangle after this translation/rotation so that triangle  
    // is pointing along the same angle as this velocity vector
    triangle(0, -12, -5, 12, 5, 12);
  }

  this._normalizeVelocity = function(maxVelocity) {
    // limits the max velocity to given input to prevent excessive build up of speed
    // causing walker to leave canvas edges for extended periods of time
    if (this.vel.mag() >= maxVelocity) {
      this.vel.setMag(maxVelocity);
    }
  }

  this._constructor(position);
}

function PerlinWalker() {
  this._constructor = function() {
    // set initial offset along 1D Perlin Noise for both x and y position values
    // both xOff and yOff are using same Perlin Noise graph, however greatly seperated
    // from each other to remove correlation
    this.xOff = 0;
    this.yOff = 10000;
  }

  this.getPos = function() {
    return this.pos;
  }

  this.update = function() {
    // each update, this position is set to a new vector pointing towards the 
    // next value for both xOff and yOff, scaled by width and height respectively
    this.pos = createVector(noise(this.xOff) * width, noise(this.yOff) * height);

    this.xOff += 0.001;
    this.yOff += 0.001;
  }

  this.draw = function() {
    // this draw function creates a series of alternating white and red
    // circles of decreasing sizes to mimic a target

    fill(255);
    strokeWeight(1);
    ellipse(this.pos.x, this.pos.y, 20, 20);

    // only outer circle should have an outline
    strokeWeight(0);

    fill('red');
    ellipse(this.pos.x, this.pos.y, 15, 15);

    fill(255);
    ellipse(this.pos.x, this.pos.y, 10, 10);

    fill('red');
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }

  this._constructor();
}