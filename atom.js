class Atome {
  static debug = false;

  constructor(nom, nbProtons, nbNeutrons, nbElectrons, x_init = 0, y_init = 0) {
    this.nom = nom;
    this.nbProtons = nbProtons;
    this.nbNeutrons = nbNeutrons;
    this.nbElectrons = nbElectrons;

    this.maxParCouche = [2, 8, 18, 32];
    this.couches = [];
    this.distribuerElectrons();

    // Position et mouvement du noyau
    this.pos = createVector(x_init, y_init);
    this.vel = p5.Vector.random2D();
    this.vel.setMag(1);
    this.acc = createVector();
    this.maxSpeed = 1;
    this.maxForce = 0.05;

    // Orbites et électrons
    this.orbitePaths = [];
    this.creerOrbites();
    this.electrons = [];
    this.creerElectrons();

    // Wander
    this.distanceCercle = 50;
    this.wanderRadius = 30;
    this.wanderTheta = 0;
    this.displaceRange = 0.1;

    // Barrières
    this.boundariesX = 0;
    this.boundariesY = 0;
    this.boundariesWidth = width;
    this.boundariesHeight = height;
    this.boundariesDistance = 200;


     // Séparation
    this.perceptionRadius = 60; 

    this.selected = false
  
  }

  distribuerElectrons() {
    let reste = this.nbElectrons;
    for (let max of this.maxParCouche) {
      if (reste <= 0) break;
      let nb = min(reste, max);
      this.couches.push(nb);
      reste -= nb;
    }
  }

  creerOrbites() {
    let rayon = 60;
    for (let i = 0; i < this.couches.length; i++) {
      let path = [];
      for (let a = 0; a < TWO_PI; a += 0.1) {
        path.push(createVector(cos(a) * rayon, sin(a) * rayon));
      }
      this.orbitePaths.push(path);
      rayon += 40;
    }
  }

  creerElectrons() {
    for (let i = 0; i < this.couches.length; i++) {
      let nb = this.couches[i];
      let path = this.orbitePaths[i];
      for (let e = 0; e < nb; e++) {
        let offset = floor(map(e, 0, nb, 0, path.length));
        this.electrons.push(new Electron(path, 2, offset));
      }
    }
  }

  dessinerNoyau() {
    let total = this.nbProtons + this.nbNeutrons;
    let rayon = 20;
    for (let i = 0; i < total; i++) {
      let angle = map(i, 0, total, 0, TWO_PI);
      let r = random(0, rayon * 0.7);
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      fill(i < this.nbProtons ? color(255, 80, 80) : color(180));
      noStroke();
      ellipse(x, y, 12, 12);
    }
  }

  dessinerNotationScientifique() {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text(this.nom, 0, -60);
    textSize(16);
    text(this.nbProtons, -18, -78);
  }

  wander() {
    let centre = this.vel.copy();
    centre.setMag(this.distanceCercle);
    centre.add(this.pos);

    let wanderAngle = this.vel.heading() + this.wanderTheta;
    let point = createVector(this.wanderRadius * cos(wanderAngle), this.wanderRadius * sin(wanderAngle));
    point.add(centre);

    if (Atome.debug) {
      fill("green");
      noStroke();
      circle(point.x, point.y, 8);

      stroke("white");
      noFill();
      circle(centre.x, centre.y, this.wanderRadius * 2);

      line(this.pos.x, this.pos.y, point.x, point.y);
    }

    let force = p5.Vector.sub(point, this.pos);
    force.setMag(this.maxForce);
    this.wanderTheta += random(-this.displaceRange, this.displaceRange);
    return force;
  }

  boundaries() {
    const d = this.boundariesDistance;
    const left = this.boundariesX + d;
    const right = this.boundariesX + this.boundariesWidth - d;
    const top = this.boundariesY + d;
    const bottom = this.boundariesY + this.boundariesHeight - d;

    let desired = null;

    if (this.pos.x < left) desired = createVector(this.maxSpeed, this.vel.y);
    else if (this.pos.x > right) desired = createVector(-this.maxSpeed, this.vel.y);
    if (this.pos.y < top) desired = createVector(this.vel.x, this.maxSpeed);
    else if (this.pos.y > bottom) desired = createVector(this.vel.x, -this.maxSpeed);

    if (desired !== null) {
      desired.setMag(this.maxSpeed);
      const steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce*5);

      if (Atome.debug) {
        stroke("red");
        noFill();
        rect(this.boundariesX + d, this.boundariesY + d, this.boundariesWidth - 2*d, this.boundariesHeight - 2*d);
      }

      return steer;
    }

    if (Atome.debug) {
      stroke("white");
      noFill();
      rect(this.boundariesX, this.boundariesY, this.boundariesWidth, this.boundariesHeight);
    }

    return createVector(0, 0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  applyBehaviors() {
    this.applyForce(this.wander());
    this.applyForce(this.boundaries());
    this.applyForce(this.separation());

  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(this.maxSpeed);
    this.acc.mult(0);
  }

  afficher() {
    push();
    translate(this.pos.x, this.pos.y);

    this.dessinerNotationScientifique();
    this.dessinerNoyau();

    let rayon = 60;
    for (let i = 0; i < this.couches.length; i++) {
      noFill();
      stroke(50);
      ellipse(0, 0, rayon * 2);
      rayon += 40;
    }

    //// selectioner par sourie 
     if (this.selected) {
    noFill();
    stroke(0, 255, 255, 150);
    strokeWeight(4);
    ellipse(0, 0, 120); 
  }


    for (let e of this.electrons) {
      e.update();
      e.show();
    }

    pop();
  }







//separation 
    separation() {
  let steering = createVector(0, 0);
  let total = 0;

  // Rayon de la couche externe
  let r1 = 60 + 40 * (this.couches.length - 1);

  for (let other of atoms) {
    if (other !== this) {

      // Rayon de la couche externe de l'autre atome
      let r2 = 60 + 40 * (other.couches.length - 1);

      // Distance entre noyaux
      let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);

      // Distance limite pour collision = somme des rayons externes
      let separationDistance = r1 + r2;

      // Collision SEULEMENT si couches externes se touchent !
      if (d < separationDistance) {

        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.div(d * d); // Force plus forte si très proche
        steering.add(diff);
        total++;

        // Debug visuel
        if (Atome.debug) {
          stroke(255, 0, 0, 120);
          noFill();
          circle(this.pos.x, this.pos.y, r1 * 2);
          circle(other.pos.x, other.pos.y, r2 * 2);

          stroke(0, 255, 0);
          line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        }

      }
    }
  }

  // Finalisation de la force
  if (total > 0) {
    steering.div(total);
    steering.setMag(this.maxSpeed);
    steering.sub(this.vel);
    steering.limit(this.maxForce * 3); // Séparation forte mais contrôlée
  }

  return steering;
}












}
