

let atoms = []; // Liste des atomes
let path;
let vehicles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Créer plusieurs atomes
  atoms.push(new Atome("H", 1, 0, 1, random(width), random(height))); // Hydrogène
  atoms.push(new Atome("He", 2, 2, 2, random(width), random(height))); // Hélium
  atoms.push(new Atome("H", 1, 0, 1, random(width), random(height))); // Hydrogène
  atoms.push(new Atome("He", 2, 2, 2, random(width), random(height))); // Hélium
  // Associer les données du fichier atomData.js à chaque Atome
  for (let atom of atoms) {
    let data = atomData.find(a => a.symbole === atom.nom);
    if (data) {
      atom.dataFromFile = data;
    }
  }


  newPath();


  newVehicle(200, 200, atomData.find(a => a.symbole === "O")); // Oxygène
  newVehicle(400, 200, atomData.find(a => a.symbole === "C")); // Carbone
  newVehicle(600, 200); // atome aléatoire
    newVehicle(200, 200, atomData.find(a => a.symbole === "H")); // Oxygène
  newVehicle(400, 200, atomData.find(a => a.symbole === "He")); // Carbone
    newVehicle(200, 200, atomData.find(a => a.symbole === "H")); // Oxygène
  newVehicle(400, 200, atomData.find(a => a.symbole === "He")); 
    newVehicle(200, 200, atomData.find(a => a.symbole === "Zn")); // Oxygène
  newVehicle(400, 200, atomData.find(a => a.symbole === "Cr")); 
}


function draw() {
  background(0);


  // --- Affichage du titre ---
  fill(255, 204, 0); // couleur jaune/or comme le Soleil
  stroke(255, 150, 0);
  strokeWeight(2);
  textSize(36);
  textAlign(CENTER, TOP);
  text("🔥 Ce qui se passe dans le Soleil 🔥", width / 2, 10);

  let selectedAtom = null;
  // Parcourir tous les atomes
  for (let atom of atoms) {
    atom.applyBehaviors();
    atom.update();
    atom.afficher();

    if (atom.selected) {
      selectedAtom = atom; // garder la référence pour le panneau info
    }
  }

  // Afficher les infos à droite
  displayInfo(selectedAtom);


  displayMenu();



  checkWinCondition();



  path.display();

  for (let v of vehicles) {
    // On applique les comportements pour suivre le chemin
    v.applyBehaviors(vehicles, path);
    // on a regroupé update, draw etc. dans une méthode run (update, borders, display, etc.)
    v.run();
  }
}

function newPath() {
  path = new Path();
  let offset = 50; // marge par rapport au bas de l'écran
  let y = height - offset; // position verticale du chemin (en bas)

  // Chemin horizontal qui dépasse à gauche et à droite
  path.addPoint(-200, y);       // point à gauche hors de l'écran
  path.addPoint(width + 200, y); // point à droite hors de l'écran
}


// Redimensionner le canvas si la fenêtre change
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function keyPressed() {
  if (key === 'd') {
    // Activer/désactiver le debug global
    Atome.debug = !Atome.debug;
    Vehicle.debug = !Vehicle.debug;
    Path.debug = !Path.debug;  // toggle Path debug mode


  }

  else if (key === 'f') {
    // Fusion de deux atomes sélectionnés
    let selectedAtoms = atoms.filter(a => a.selected);
    if (selectedAtoms.length === 2) {
      let a1 = selectedAtoms[0];
      let a2 = selectedAtoms[1];

      let totalProtons = a1.nbProtons + a2.nbProtons;

      // Chercher dans atomData l'élément avec ce nombre de protons
      let fusionElement = atomData.find(el => el.protons === totalProtons);

      if (fusionElement) {
        // Créer le nouvel atome
        let newX = (a1.pos.x + a2.pos.x) / 2;
        let newY = (a1.pos.y + a2.pos.y) / 2;

        let newAtom = new Atome(
          fusionElement.symbole,
          fusionElement.protons,
          Math.round((a1.nbNeutrons + a2.nbNeutrons)), // neutrons sum approximatif
          fusionElement.protons, // pour les éléments neutres, électrons = protons
          newX,
          newY
        );

        newAtom.dataFromFile = fusionElement;

        // Supprimer les anciens atomes
        atoms = atoms.filter(a => a !== a1 && a !== a2);

        // Ajouter le nouvel atome
        atoms.push(newAtom);
      } else {
        console.log("Pas d'élément connu pour cette fusion (protons =", totalProtons, ")");
      }
    }
  }



}
function newVehicle(x, y, atom = null) {
  let maxspeed = random(2, 4);
  let maxforce = 0.3;

  // Si aucun atome n'est précisé, on choisit un atome aléatoire
  if (!atom) {
    atom = random(atomData);
  }

  let v = new Vehicle(x, y, maxspeed, maxforce, atom);
  vehicles.push(v);
  return v;
}




function mousePressed() {
  for (let atom of atoms) {
    // Rayon externe pour la sélection
    let r = 60 + 40 * (atom.couches.length - 1);
    let d = dist(mouseX, mouseY, atom.pos.x, atom.pos.y);
    if (d < r) {
      atom.selected = !atom.selected;
    }
  }
  // 2️⃣ Vérifier les véhicules
  for (let v of vehicles) {
    let r = v.r; // rayon du véhicule
    let d = dist(mouseX, mouseY, v.position.x, v.position.y);
    if (d < r) {
      // Si le véhicule a un atome associé
      if (v.atom) {
        let data = v.atom;

        // Créer un nouvel atome du même type
        let newAtom = new Atome(
          data.symbole,
          data.protons,
          data.neutrons,    // nombre correct de neutrons
          data.electrons,
          mouseX + random(-20, 20),
          mouseY + random(-20, 20)
        );

        // Copier les infos de atomData
        newAtom.dataFromFile = data;

        atoms.push(newAtom);
      }
    }
  }
}



function displayInfo(atom) {
  if (!atom || !atom.dataFromFile) return;

  // Panneau à droite
  let panelX = width - 220;
  let panelY = 50;
  let panelW = 200;
  let panelH = 180;

  fill(30, 200); // fond semi-transparent
  stroke(255, 100);
  strokeWeight(1);
  rect(panelX, panelY, panelW, panelH, 10);

  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);

  let infoY = panelY + 10;
  let lineHeight = 24;
  // Afficher les infos depuis le fichier atomData.js
  text(`Symbole: ${atom.dataFromFile.symbole}`, panelX + 10, infoY);
  infoY += lineHeight;
  text(`Nom complet: ${atom.dataFromFile.nomComplet}`, panelX + 10, infoY);
  infoY += lineHeight;
  text(`Protons: ${atom.dataFromFile.protons}`, panelX + 10, infoY);
  infoY += lineHeight;
  // Pour neutrons et électrons, tu peux continuer à utiliser les valeurs de l'objet Atome
  text(`Neutrons: ${atom.nbNeutrons}`, panelX + 10, infoY);
  infoY += lineHeight;
  text(`Electrons: ${atom.nbElectrons}`, panelX + 10, infoY);
  infoY += lineHeight;
  text(`Couches: ${atom.couches.join(', ')}`, panelX + 10, infoY);
  infoY += lineHeight;
  text(`Couches totales: ${atom.couches.length}`, panelX + 10, infoY);
}


function displayMenu() {
  fill(255, 255);
  noStroke();
  rect(20, 20, 360, 120, 10); // fond semi-transparent

  fill(0);
  textSize(14);
  textAlign(LEFT, TOP);
  let instructions = [
    "Instructions :",
    "- Appuyer sur 'd' pour activer/désactiver le debug",
    "- Sélectionner un atome pour voir ses infos",
    "- Cliquer sur l'icône pour créer un nouvel atome",
    "- Sélectionner deux atomes et appuyer sur 'f' pour les fusionner"
  ];

  let y = 30;
  for (let line of instructions) {
    text(line, 30, y);
    y += 30;
  }
}







function checkWinCondition() {
  // Définir le nombre maximal d'électrons (Oganesson = 118)
  const maxElectrons = 118;

  for (let atom of atoms) {
    if (atom.nbElectrons >= maxElectrons) {
      fill(0, 255, 0, 200);
      stroke(255);
      strokeWeight(2);
      textSize(48);
      textAlign(CENTER, CENTER);
      text("🎉 Tu as gagné ! 🎉", width / 2, height / 2);
      noLoop(); // arrêter le jeu
      break;
    }
  }
}
