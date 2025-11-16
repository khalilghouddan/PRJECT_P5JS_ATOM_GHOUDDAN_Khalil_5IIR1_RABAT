class Electron {
  constructor(path, speed = 2, offset = 0) {
    this.path = path;       // tableau de p5.Vectors
    this.speed = speed;
    this.index = offset;    // décalage pour répartir les électrons
    this.pos = this.path[0].copy();

        this.image = image;









    
  }

  update() {
    let target = this.path[this.index];
    let dir = p5.Vector.sub(target, this.pos);
    let d = dir.mag();

    dir.normalize();
    dir.mult(this.speed);

    if (d < this.speed * 1.1) {
      this.index++;
      if (this.index >= this.path.length) this.index = 0;
    } else {
      this.pos.add(dir);
    }
  }

  show() {
    fill(80, 150, 255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }
}
