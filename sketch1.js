// globaux
let atoms = []; // liste atomes
let path;       // chemin
let vehicles = []; // vehicules

// setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  // creer qques atomes
  atoms.push(new Atome("H", 1,0,1, random(width), random(height))); // hydrogene
  atoms.push(new Atome("He",2,2,2, random(width), random(height))); // helium
  atoms.push(new Atome("H", 1,0,1, random(width), random(height))); // hydrogene
  atoms.push(new Atome("Zn",30,35,30, random(width), random(height))); // zinc

  // associer data atomData.js
  for (let atom of atoms){
    let data = atomData.find(a=>a.symbole===atom.nom);
    if(data) atom.dataFromFile = data;
  }

  // chemin
  newPath();

  // vehicules
  newVehicle(200,200, atomData.find(a=>a.symbole==="O")); // oxy
  newVehicle(400,200, atomData.find(a=>a.symbole==="C")); // carb
  newVehicle(600,200); // aleatoire
  newVehicle(200,200, atomData.find(a=>a.symbole==="H"));
  newVehicle(400,200, atomData.find(a=>a.symbole==="He"));
  newVehicle(200,200, atomData.find(a=>a.symbole==="H"));
  newVehicle(400,200, atomData.find(a=>a.symbole==="He"));
  newVehicle(200,200, atomData.find(a=>a.symbole==="Zn"));
  newVehicle(400,200, atomData.find(a=>a.symbole==="Cr"));
}

// draw boucle
function draw(){
  background(0);

  // titre
  fill(255,204,0);
  stroke(255,150,0);
  strokeWeight(2);
  textSize(36);
  textAlign(CENTER,TOP);
  text("🔥 Ce qui se passe dans le Soleil 🔥", width/2, 10);

  let selectedAtom = null;

  // atoms loop
  for(let atom of atoms){
    atom.applyBehaviors(); // flocking
    atom.update(); // maj pos
    atom.afficher(); // draw

    if(atom.selected) selectedAtom = atom; // selection
  }

  // info panel
  displayInfo(selectedAtom);

  // menu
  displayMenu();

  // win check
  checkWinCondition();

  // path display
  path.display();

  // vehicules loop
  for(let v of vehicles){
    v.applyBehaviors(vehicles, path); // suivre path
    v.run(); // maj+draw
  }
}

// path simple
function newPath(){
  path = new Path();
  let offset = 50;
  let y = height - offset;
  path.addPoint(-200,y);
  path.addPoint(width+200,y);
}

// resize canvas
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

// key press
function keyPressed(){
  if(key==='d'){
    // debug toggle
    Atome.debug = !Atome.debug;
    Vehicle.debug = !Vehicle.debug;
    Path.debug = !Path.debug;
  }
  else if(key==='f'){
    // fusion
    let sel = atoms.filter(a=>a.selected);
    if(sel.length==2){
      let a1 = sel[0];
      let a2 = sel[1];
      let totalProtons = a1.nbProtons + a2.nbProtons;
      let fusion = atomData.find(e=>e.protons==totalProtons);
      if(fusion){
        let newX = (a1.pos.x + a2.pos.x)/2;
        let newY = (a1.pos.y + a2.pos.y)/2;
        let newAtom = new Atome(fusion.symbole, fusion.protons, Math.round(a1.nbNeutrons+a2.nbNeutrons), fusion.protons, newX, newY);
        newAtom.dataFromFile = fusion;
        atoms = atoms.filter(a=>a!==a1 && a!==a2);
        atoms.push(newAtom);
      }else console.log("pas d'elem connu pour fusion", totalProtons);
    }
  }
}

// new vehicle
function newVehicle(x,y,atom=null){
  let maxspeed = random(2,4);
  let maxforce = 0.3;
  if(!atom) atom=random(atomData);
  let v = new Vehicle(x,y,maxspeed,maxforce,atom);
  vehicles.push(v);
  return v;
}

// mouse click
function mousePressed(){
  // atom select
  for(let atom of atoms){
    let r = 60 + 40*(atom.couches.length-1);
    if(dist(mouseX,mouseY,atom.pos.x,atom.pos.y)<r) atom.selected=!atom.selected;
  }
  // vehicule click
  for(let v of vehicles){
    let r=v.r;
    if(dist(mouseX,mouseY,v.position.x,v.position.y)<r && v.atom){
      let d=v.atom;
      let newAtom = new Atome(d.symbole,d.protons,d.neutrons,d.electrons, mouseX+random(-20,20), mouseY+random(-20,20));
      newAtom.dataFromFile=d;
      atoms.push(newAtom);
    }
  }
}

// display info
function displayInfo(atom){
  if(!atom || !atom.dataFromFile) return;
  let px=width-220, py=50, w=200,h=180;
  fill(30,200); stroke(255,100); strokeWeight(1); rect(px,py,w,h,10);
  fill(255); noStroke(); textSize(16); textAlign(LEFT,TOP);
  let y = py+10; let lh=24;
  text(`Symbole: ${atom.dataFromFile.symbole}`, px+10,y); y+=lh;
  text(`Nom: ${atom.dataFromFile.nomComplet}`, px+10,y); y+=lh;
  text(`Protons: ${atom.dataFromFile.protons}`, px+10,y); y+=lh;
  text(`Neutrons: ${atom.nbNeutrons}`, px+10,y); y+=lh;
  text(`Electrons: ${atom.nbElectrons}`, px+10,y); y+=lh;
  text(`Couches: ${atom.couches.join(',')}`, px+10,y); y+=lh;
  text(`Couches totales: ${atom.couches.length}`, px+10,y);
}

// menu
function displayMenu(){
  fill(0,100); noStroke(); rect(20,20,400,180,15);
  fill(255,204,0); textSize(18); textAlign(LEFT,TOP);
  let instr=[
    "📜 Instructions :",
    "- Appuyer sur 'd' debug",
    "- Selectionner atome",
    "- Cliquer icone creer atome",
    "- Deux atomes f pour fusion",
    "- 118 electrons = win !"
  ];
  let y=30;
  for(let l of instr){ text(l,30,y); y+=28; }
}

// win check
function checkWinCondition(){
  let maxE=118;
  for(let a of atoms){
    if(a.nbElectrons>=maxE){
      fill(0,255,0,200); stroke(255); strokeWeight(2); textSize(48); textAlign(CENTER,CENTER);
      text("🎉 Tu as gagne ! 🎉", width/2, height/2);
      noLoop();
      break;
    }
  }
}
