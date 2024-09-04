function setup() {
    noCanvas(); // Pas besoin de canvas ici, car tout est en HTML

    // Sélection des éléments HTML
    const inputText = select('#inputText');
    const submitButton = select('#submitButton');
    const resetButton = select('#resetButton');
    const lengthInput = select('#lengthInput');
    const generateButton = select('#generateButton');
    const freqTable = select('#freqTable');
    const generatedText = select('#generatedText');
    let statsChars = []; //tableau des statsn chaque ligne contient: [caractère, effectif, frequence, frequence cumulée], variable globale qui sera mise à jour et ordonnée




    submitButton.mousePressed(afficheFrequences);
    resetButton.mousePressed(resetText);

    
    function afficheFrequences(){
        calculFrequences()
        let tableHTML = '<table><tr><th>Caractère</th><th>Effectif</th><th>Fréquence en %</th><th>Fréquence cumulée en %</th></tr>';
        for (var i = 0; i < statsChars.length; i++) {
            tableHTML += `<tr><td>${statsChars[i][0]}</td><td>${statsChars[i][1]}</td><td>${(statsChars[i][2]*100).toFixed(1)}%</td><td>${(statsChars[i][3]*100).toFixed(1)}%</td></tr>`;
        }
        tableHTML += '</table>';
        freqTable.html(tableHTML);

        // Afficher les options pour générer le texte
        lengthInput.show();
        generateButton.show();
    }

    function calculFrequences(){
        const text = inputText.value();
        totalChars = text.length;

        //premier passage, génération d'un dictionnaire qui compte les occurences
        let freq1 = [];
        for (let char of text) {
            if(!freq1[char]){freq1[char]=0}
            freq1[char] ++;
        }

        // Étape 2 : Convertir l'objet en tableau de paires [clé, valeur]
        let sortedFreq = Object.entries(freq1).sort(function(a, b) {
            return b[1] - a[1]; // Tri par fréquence décroissante
        });

        // Conversion de l'objet freq en tableau [caractère, effectif, frequence, frequence cumulée]
        fCumulee=0;
        for (var i = 0; i < sortedFreq.length; i++) {
            var char = sortedFreq[i][0]
            var f = sortedFreq[i][1]
            fCumulee += f/totalChars;
            statsChars.push([char, f, f/totalChars,fCumulee]);
        }
    }

    function resetText() {
        inputText.value(''); // Réinitialise le champ texte
      }

    // Fonctions pour générer le nouveau texte
    generateButton.mousePressed(afficheTexteGenere);

    function afficheTexteGenere(){
        let texteGenere  = generationTexte();
        generatedText.html(`<strong>Texte Généré:</strong><br>${texteGenere}`);
    }

    function generationTexte(){
        const text = inputText.value();
        let freq = {};
        const totalChars = text.length;

        // Calcul des fréquences
        for (let char of text) {
            freq[char] = (freq[char] || 0) + 1;
        }

        const longueurTexteGenere = int(lengthInput.value());
        let newText = '';

        // Génération du texte selon les fréquences
        for (let i = 0; i < longueurTexteGenere; i++) {
            newText += charAlea();
        }
        console.log(newText)
        return newText;
    }

    function charAlea(){
        const r = random();
        for (var j = 0; j < statsChars.length; j++) {
            if (statsChars[j][3]>=r) {
                return statsChars[j][0];
            }
        }
    }
}
