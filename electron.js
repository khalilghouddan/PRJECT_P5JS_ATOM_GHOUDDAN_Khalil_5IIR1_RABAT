// electron class
class Electron {
  constructor(path, speed=2, offset=0){
    this.path = path; // chemin points
    this.speed = speed;
    this.index = offset; // decalage electron
    this.pos = this.path[0].copy();

    this.image = image; // image electron ?
  }

  update(){
    let target = this.path[this.index]; // point a atteindre
    let dir = p5.Vector.sub(target,this.pos);
    let d = dir.mag();

    dir.normalize();
    dir.mult(this.speed);

    if(d < this.speed*1.1){ // si proche du point suivant
      this.index++;
      if(this.index >= this.path.length) this.index=0; // boucle
    }else{
      this.pos.add(dir); // avance
    }
  }

  show(){
    fill(80,150,255); // bleu electron
    noStroke();
    ellipse(this.pos.x,this.pos.y,10,10); // cercle electron
  }
}
