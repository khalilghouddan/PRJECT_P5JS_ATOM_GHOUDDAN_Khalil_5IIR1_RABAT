# Simulation des Réactions Atomiques

**Nom :** GHOUDDAN
**Prénom :** Khalil
**Classe :** 5IIR1  
**École :** EMSI Rabat  

---

## Description du projet

Ce projet est une **simulation interactive des réactions atomiques** qui se produisent dans le Soleil. La grande masse du Soleil provoque la **fusion des atomes d'hydrogène** pour générer de l'hélium et d'autres éléments.  

C’est un **jeu éducatif** qui permet de visualiser la formation des éléments chimiques et de découvrir le **dernier élément du tableau périodique** en suivant les interactions entre atomes et électrons.

---

## But pédagogique

- Comprendre le concept de fusion nucléaire.  
- Observer le comportement des électrons et des atomes.  
- Découvrir les interactions atomiques dans un environnement simulé.  
- Jouer tout en apprenant les éléments du **tableau périodique**.

---

## Contenu du programme

Le projet contient :

1. **`atomData.js`** : Fichier contenant toutes les informations sur les éléments du tableau périodique.  
2. **Classe `Electron`** : Représente les électrons et leur mouvement autour des orbites atomiques.  
3. **Classe `Atome`** : Représente les atomes avec leur noyau, électrons et comportement.  
4. **Classe `Vehicle`** : Représente des icônes qui suivent un chemin et permettent de générer de nouveaux atomes.  

---

## Comportements implémentés

- **Wandering** : Les atomes se déplacent de manière autonome dans l’espace de l’écran.  
- **Separation** : Les atomes et les véhicules se maintiennent à distance pour éviter les collisions, grâce aux charges négatives des atomes.  
- **Boundaries** : Les atomes sont confinés dans une zone invisible ; cette zone peut être visualisée en mode debug.  
- **Follow** : Les véhicules suivent un chemin tracé en bas de l’écran.  
- **Seek** : Les véhicules calculent la force nécessaire pour atteindre une cible.  
- **Edges** : Si un véhicule sort de l’écran, il réapparaît de l’autre côté.  

---

## Instructions de jeu

1. **Démarrage** : Le programme démarre avec quelques atomes affichés, par exemple : 2 H, 1 He, 1 Zn, avec des icônes représentant d’autres atomes.  
2. **Ajouter un atome** : Cliquer sur les icônes pour créer un nouvel atome.  
3. **Fusionner des atomes** : Si un atome n’existe pas, il peut être créé par fusion. Sélectionner deux atomes et appuyer sur **‘f’** pour les fusionner.  
4. **Mode debug** : Appuyer sur **‘d’** pour activer/désactiver le debug et visualiser certaines zones et forces.  
5. **Condition de victoire** : Le joueur gagne lorsqu’il atteint **118 électrons**.  

---

## Notes historiques

Le tableau périodique des éléments a été développé et amélioré par plusieurs scientifiques au fil du temps. Les principaux noms associés à sa création et son développement :

- **Dmitri Mendeleïev** (1834‑1907)  
- **Lothar Meyer** (1830‑1895)  
- **John Newlands** (1837‑1898)  
- **Henry Moseley** (1887‑1915)  
- **Glenn T. Seaborg** (1912‑1999)  

---

## Auteur

GHOUDDAN Khalil – Classe 5IIR1 – EMSI Rabat
