class StatLettre {
    constructor(lettre) {
        this.lettre = lettre;
        this.nombreUtilisation = 0; // Nombre total d'utilisations de la lettre
        this.lettresSuivantes = {}; // Objet des lettres suivantes et leurs nombres correspondants
        this.totalLettresSuivantes = 0;
    }

    incrementerUtilisation() {
        this.nombreUtilisation++;
    }

    ajouterLettreSuivante(lettre) {
        if (!this.lettresSuivantes[lettre]) {
            this.lettresSuivantes[lettre] = 0;
        }
        this.lettresSuivantes[lettre]++;
        this.totalLettresSuivantes++;
    }

    obtenirProbabilitesSuivantes() {
        let probabilites = {};
        for (let lettre in this.lettresSuivantes) {
            probabilites[lettre] = this.lettresSuivantes[lettre] / this.totalLettresSuivantes;
        }
        return probabilites;
    }

    trierLettresSuivantes() {
        // Convertir l'objet en tableau de paires [clé, valeur]
        let sortedEntries = Object.entries(this.lettresSuivantes).sort((a, b) => b[1] - a[1]);
        
        // Reconvertir en objet trié
        this.lettresSuivantes = {};
        for (let [lettre, count] of sortedEntries) {
            this.lettresSuivantes[lettre] = count;
        }
    }
}

let statsLettres = {};
let totalLettres = 0;
let lettreLaPlusProbable = '';


function setup() {
    noCanvas(); // Pas besoin de canvas ici, car tout est en HTML
    const submitButton = select('#submitButton'); 
    submitButton.mousePressed(afficherStats);
}

function afficherStats(){
    const inputText = select('#inputText');
    calculeStats(inputText.value());
    let tableHTML = '<table><tr><th>Caractère</th><th>Lettres qui suivent</th></tr>';
    for (let [char, lettre] of Object.entries(statsLettres)) {
       var affichage_suivants=tableauLettresSuivantesVersString(lettre);
       tableHTML += `<tr><td>${lettre.lettre} (${lettre.nombreUtilisation}/${totalLettres})</td><td>${affichage_suivants}</td></tr>`;
    }
    tableHTML += '</table>';
    const freqTable = select('#freqTable');
    freqTable.html(tableHTML);

    // Afficher les options pour générer le texte
    const lengthInput = select('#lengthInput');
    lengthInput.show();
    const generateButton = select('#generateButton');
    generateButton.show();
    generateButton.mousePressed(afficherTexteGenere);
    select("#lettreDepart").html("La lettre de départ sera un '"+"e"+"'<br/>");
}

function tableauLettresSuivantesVersString(lettre){
    var texte=""
    for (let [lettreSuivante, nombre] of Object.entries(lettre.lettresSuivantes)) {
        texte+=lettreSuivante+" : "+(nombre)+"/"+lettre.totalLettresSuivantes+"<br>";
    }
    return texte;
}

function calculeStats(texte) {
    totalLettres = texte.length;
    for (let i = 0; i < texte.length; i++) {
        let char = texte[i];
        if (!statsLettres[char]) {
            statsLettres[char] = new StatLettre(char); // Créer une nouvelle instance pour la lettre
        }
        statsLettres[char].incrementerUtilisation();
        if (i < texte.length - 1) {
            statsLettres[char].ajouterLettreSuivante(texte[i + 1]); // Correction : texte[i + 1] au lieu de text[i + 1]
        }
    }
    for(var lettre in statsLettres){
        let lettreO = statsLettres[lettre];
        lettreO.trierLettresSuivantes();
    }
    statsLettres = trierStatsLettresParUtilisation(statsLettres);
}

// Fonction pour trier statsLettres par nombre d'utilisations
function trierStatsLettresParUtilisation(statsLettres) {
    let statsArray = Object.entries(statsLettres).map(([lettre, statLettre]) => {
        return { lettre: lettre, stat: statLettre };
    });

    statsArray.sort((a, b) => b.stat.nombreUtilisation - a.stat.nombreUtilisation);

    let statsLettresTriees = {};
    statsArray.forEach(entry => {
        statsLettresTriees[entry.lettre] = entry.stat;
    });
    return statsLettresTriees;
}



function trouverLettrePlusProbable() {
    let lettreMax = null;
    let maxUtilisation = 0;

    for (let char in statsLettres) {
        if (statsLettres[char].nombreUtilisation > maxUtilisation) {
            maxUtilisation = statsLettres[char].nombreUtilisation;
            lettreMax = char;
        }
    }

    return lettreMax;
}

// Fonctions pour générer le nouveau texte
function afficherTexteGenere(){
    let texteGenere = generateText();
    const generatedTextHTML = select('#generatedText');
    generatedTextHTML.html(`<strong>Texte Généré:</strong><br>${texteGenere}`);
}

function generateText() {
    const lengthInput = select('#lengthInput');
    const length = int(lengthInput.value()); //
    var currentChar = trouverLettrePlusProbable(); // Commence avec le caractère le plus probable
    var result = currentChar;

    for (var i = 1; i < length; i++) {
        let nextChar=lettreAlea(currentChar)
        result += nextChar;
        currentChar=nextChar;
    }
    return result;
}

function lettreAlea(lettreEncours){
    var r = Math.random(); // Tirage au sort
    var sum = 0;
    tabprob = statsLettres[lettreEncours].obtenirProbabilitesSuivantes()
    for (var nextChar in tabprob) {
        sum += tabprob[nextChar];
        if (r <= sum) {
            return(nextChar); // On choisit ce caractère
        }
    }
}