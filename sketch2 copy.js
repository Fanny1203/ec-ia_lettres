function setup() {
    noCanvas(); // Pas besoin de canvas ici, car tout est en HTML

    // Sélection des éléments HTML
    const inputText = select('#inputText');
    const submitButton = select('#submitButton');
    const lengthInput = select('#lengthInput');
    const generateButton = select('#generateButton');
    const freqTable = select('#freqTable');
    const generatedText = select('#generatedText');

    
    /*tableau des suites de caractères Par exemple: 
    Pour "bonjour"
    statsLettres = {
        "b": [1 , { "o": 1 }],
        "o": { "n": 0.5, "u": 0.5 },
        "n": { "j": 1 },
        "j": { "o": 1 },
        "u": { "r": 1 }
      }*/
    let statsLettres = {}; 
    let lettreLaPlusFrequente = "";
      

    // Fonction pour calculer les fréquences
    submitButton.mousePressed(stats);
    
    function calculFrequences(){
        const text = inputText.value();
        let freq = {};
        const totalChars = text.length;

        // Calcul des fréquences
        for (let char of text) {
            freq[char] = (freq[char] || 0) + 1;
        }

        // Conversion de l'objet freq en tableau de paires [caractère, fréquence]
        var freqArray = [];
        for (var char in freq) {
            freqArray.push([char, freq[char]]);
        }

        // Tri du tableau par fréquence décroissante
        freqArray.sort(function(a, b) {
            return b[1] - a[1];
        });

        return freqArray;
    }

    function stats() {
        var texte = inputText.value();

        //on en profite pour calculer la lettre la plus fréquente
        var freqArray = calculFrequences()
        lettreLaPlusFrequente = freqArray[0][0];
        
        // Parcours du texte pour compter les paires de caractères successives
        for (var i = 0; i < texte.length - 1; i++) {
            var currentChar = texte[i];
            var nextChar = texte[i + 1];
    
            // Si le caractère actuel n'existe pas encore dans l'objet, on l'ajoute
            if (!statsLettres[currentChar]) {
                statsLettres[currentChar] = {};
            }
    
            // On compte l'occurrence du caractère statsLettres
            if (statsLettres[currentChar][nextChar]) {
                statsLettres[currentChar][nextChar]++;
            } else {
                statsLettres[currentChar][nextChar] = 1;
            }
        }
    
        // Conversion des comptes en probabilités
        for (var char in statsLettres) {
            var total = 0;
            var chars = statsLettres[char];
    
            // Calcul du nombre total d'occurrences pour ce caractère
            for (var nextChar in chars) {
                total += chars[nextChar];
            }
    
            // Conversion des comptes en probabilités
            for (var nextChar in chars) {
                chars[nextChar] = chars[nextChar] / total;
            }
        }
    
         // Affichage du tableau des fréquences
         let tableHTML = '<table><tr><th>Caractère</th><th>Lettres qui suivent</th></tr>';
         for (var char in statsLettres) {
            var chars = statsLettres[char];
            var affichage_suivants=tableauCharVersString(chars);
            tableHTML += `<tr><td>${char}</td><td>${affichage_suivants}</td></tr>`;
         }
         tableHTML += '</table>';
         freqTable.html(tableHTML);
 
         // Afficher les options pour générer le texte
         lengthInput.show();
         generateButton.show();
         select("#lettreDepart").html("La lettre de départ sera un '"+lettreLaPlusFrequente+"'<br/>");
    }

    function tableauCharVersString(chars){
        var texte=""
        for (var nextChar in chars) {
            texte+=nextChar+" : "+(chars[nextChar]*100).toFixed(1)+"%<br>";
        }
        return texte;
    }
    
        

    // Fonctions pour générer le nouveau texte

    function generateText() {
        const length = int(lengthInput.value()); //
        var currentChar = lettreLaPlusFrequente; // Commence avec le caractère le plus probable
        var result = currentChar;
    
        for (var i = 1; i < length; i++) {
            var nextCharProb = statsLettres[currentChar];
            if (!nextCharProb) {
                currentChar = lettreLaPlusFrequente;
            }
            else {
                var r = Math.random(); // Tirage au sort
                var sum = 0;
        
                for (var nextChar in nextCharProb) {
                    sum += nextCharProb[nextChar];
                    if (r <= sum) {
                        currentChar = nextChar; // On choisit ce caractère
                        break;
                    }
                }
            }
            
    
            result += currentChar; // On ajoute le caractère au résultat
        }
    
         // Affichage du texte généré
         generatedText.html(`<strong>Texte Généré:</strong><br>${result}`);
    }
    


    generateButton.mousePressed(generateText);
}
