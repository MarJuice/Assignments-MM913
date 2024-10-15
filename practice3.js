/*
    Hei.
    Dette er et oppgave sett i MM-912.
    Meningen er å trene på et fåtall ting av gangen. 
    Du gjør dette ved å skrive inn ditt svar etter at en oppgave er gitt (se på eksempelet)

    IKKE endre på kode som er gitt, med mindre oppgaven spesefikt sier at du skal det
*/

/*
    Oppgave: Eksempel
    Skriv koden for å skrive ut alle navnene i listen, et navn per linje
*/
console.log("Oppgave: Eksempel");
const people = ["Tony","Christian","Håkon"]

for(let index = 0; index < people.length; index++){
    let person = people[index];
    console.log(person);
}

/*
    Oppgave: A
    Lag variabler for:
    * Timer i døgnet
    * Minutter i en time
    * Sekunder i et minutt
    * forholdet mellom vann og saft når man blander saft.
    * dager til din bursdag
    * mmilimeter regn som faller 
*/
console.log("\nOppgave: A");
const hrsInDay = 24;
const minsInHour = 60;
const secsInMin = 60;
let waterJuiceRatio = 5;
let daysUntilBirthday = 157;
let rainfallDepth = 0;


/*
    Oppgave: B
    Bruk variablene dine fra oppgave A og kalkuler:
    * Hvor Mange sekunder er det i 2.5 timer?
    * Hvor mange minutter er det i 123 dager?
    Husk å sette svarene til sine egne variabler
    Eks:
    // Hvor mange dl er 4.5 coups?
    const dlInCoups = 2.36588;
    const antallDL = dlInCoups * 4.5;
*/
console.log("\nOppgave: B");
const secsIn2h30 = secsInMin * minsInHour * 2.5;
console.log(secsIn2h30);

const minsIn123d = minsInHour * hrsInDay * 123;
console.log(minsIn123d);

/*
    Oppgave: C
    Bruk en løkke (for) til å skrive ut tallene fra 1 til 10 
*/
console.log("\nOppgave: C");
for(i=1; i<=10; i++){
    console.log(i)
}


/*
    Oppgave: D
    Bruk en løkke (for) til å skrive ut tallene fra 10 til 1
*/
console.log("\nOppgave: D");
for(i=10; i>=1; i--){
    console.log(i)
}


/*
    Oppgave: E
    Denne er litt vanskligere, men du klarer den ;)
    Bruk en løkke (for) til å skrive ut partallene mellom 1 og 100
*/
console.log("\nOppgave: E");
for(i=1; i<=100; i++){
    if(i % 2 == 0){
        console.log(i);
    }
}

/*
    Oppgave: F
    Fyll inn koden som skal til for å få følgende kode til å skrive ut det som er forventet.
*/
console.log("\nOppgave: F");

const DICTIONARY = {
    hello:"Hei på deg",
    howAreYou:"hvordan står det til?",
    goodQuestionsLately: "Fått noen gode spørsmål i det siste?"
}

console.log(`${DICTIONARY.hello} Christian, ${DICTIONARY.howAreYou}`); //-> Hei på deg Christian, hvordan står det til?
console.log(`${DICTIONARY.goodQuestionsLately}`); //-> Fått noen gode spørsmål i det siste?


/*
    Oppgave: G
    Fyll inn koden som skal til for å få følgende kode til å skrive ut det som er forventet.
*/
console.log("\nOppgave: G");

const DICTIONARY_ML = {
    no:{
        hello:"Hei på deg",
        howAreYou:"hvordan står det til?"
    },
    en:{
        hello: "Hi",
        howAreYou: "how are you?",
        goodQuestionsLately: "Gotten any good questions lately?"
    }
}

console.log(`${DICTIONARY_ML.en.hello} Christian, ${DICTIONARY_ML.en.howAreYou}`); //-> Hi Christian, how are you?
console.log(`${DICTIONARY_ML.en.goodQuestionsLately}`); //-> Gotten any good questions lately?

