const app = {
  // Observer variables
  numStep: 20.0, // Nombre de palier désirer pour le threshold
  prevRatio: {}, // Objet dans lequel je vais stocker chaque ratio de chaque élément au moment ou il est observer
  incresingColor: 'rgba(202, 253, 255, ratio)', // Couleur quand l'élément entre dans la fenêtre
  decresingColor: 'rgba(203, 209, 241, ratio)', // Couleur quand l'élément sort de la fenêtre

  // Observer Options
  options: {
    root: null,
    rootMargin: '0px',
    threshold: null,
  },

  init: () => {
    /*
      Je ne peu pas utiliser une méthode avant l'init,
      j'initialise donc mon tableau de threshold en premier ici.
     */
    app.options.threshold = app.stepRatio()

    // J'initialise mon observer
    const observer = new IntersectionObserver(app.handlerObservable, app.options);

    // Je récupère les éléments que je veux observer
    app.imagesElems = document.querySelectorAll('img');
    app.textsElems = document.querySelectorAll('p');

    // Par défault, je leurs applique la classe -hidden et un attribut data-num-elem avec un nombre aléatoire
    // Cet ID unique me permetra d'observer et de manipuler chaque élément indépendament depuis le callback de l'obsever.
    // Je place aussi mon observer sur chaque élément que je désire observer

    app.imagesElems.forEach((img) => {
      img.classList.add('img-hidden');
      img.dataset.numElem = app.random();
      observer.observe(img);
    });

    app.textsElems.forEach((text) => {
      text.classList.add('text-hidden');
      text.dataset.numElem = app.random();
      observer.observe(text);
    });
  },

  /**
   * Return un nombre aléatoire
   * @returns {Nnumber}
   */
  random: () => {
    return Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
  },

  /**
   *  Méthode qui détermine chaque palier du threshold
   * @returns {Array} Value of stepRatio [0, 0.05, 0.1, etc...]
   */
  stepRatio: () => {
    const thresholds = [];

    thresholds.push(0); // Je pousse le palier 0 manuellement

    for (i = 1.0; i <= app.numStep; i++) {
      const step = i / app.numStep;
      thresholds.push(step);
    }
    return thresholds;
  },

  // Handler observable
  handlerObservable: (e) => {

    e.forEach((entry) => {
      // C'est dans ces méthodes que je manipule le DOM pour appliquer mes effets
      app.observaleEntranceElement(entry.intersectionRatio, entry.target);
      app.observableColorElement(entry.intersectionRatio, entry.target);

      /*
        Je stock le ratio de tous les élément observer dans un objet
        Cela me permetra de comparer son ancien ratio avec le nouveau afin
        de savoir si il rentre dans la fenêtre ou si il en sort
       */
      app.prevRatio = {
        ...app.prevRatio,
        [entry.target.dataset.numElem]: entry.intersectionRatio,
      };
    });
  },

  // Effet Entrance(opacity et translate) sur le texte et les images
  observaleEntranceElement: (ratio, target) => {
    if (ratio >= 0.5) {
      target.classList.remove('img-hidden', 'text-hidden');
    }
  },
  /*
    Effet de couleur entrée et sortie de la fenêtre
    Si le ratio précédent est supérieur au nouveau c'est que l'image rentre dans le fênetre
    Si il est inférieur c'est qu'il sort de la fênetre
   */
  observableColorElement: (ratio, target) => {
    if (target.className === 'text') {
      if (ratio > app.prevRatio[target.dataset.numElem]) {
        // le ratio étant un nombre compris entre 0 et 1, je peu l'utiliser pour jouer sur la transparance de la couleur
        target.style.backgroundColor = app.incresingColor.replace('ratio', ratio);
      } else {
        target.style.backgroundColor = app.decresingColor.replace('ratio', ratio);
      }
    }
  },
};

document.addEventListener('DOMContentLoaded', app.init);
