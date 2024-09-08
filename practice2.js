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
    Skriv kode som skriver ut settningen "Debuging er som å være en dektektiv i et krim drama hvor du også er morderen" 
    100 ganger. 
    Husk vi bruker console.log() til å skrive ting ut.
*/
console.log("Oppgave: A");
for(let index = 0; index < 100; index++){
    console.log('Debugging er som å være en detektiv i et krim drama hvor du også er morderen');
}

/*
    Oppgave: B
    Følgende kode er feil, kan du fikse feilene?
    Denne er ikke helt enkel, det er syntax feil her og logiske feil.
    Prøv å tenke på hva vi prøver å oppnå.
*/
console.log("Oppgave: B");

const max = 99;
for(let index = 0; index < max; index++) {
  console.log(max - index + " flasker med brus i kassa");
  console.log("Ta en ut, drikk den opp. " + (max - index - 1) + " flasker med brus i kassa");
  console.log("");
}
console.log("Ingen flere flasker med brus i kassa");

/*
    Oppgave: C
    Deklarere en variabel for tyngdekraft og en variabel for pi og en variabel for antall personer i et rom. 
*/
console.log("Oppgave: C");
let gravity = 9.81; // Gravity is different on other planets, so unsure if it should be a const
const pi = Math.PI;
let numOfPeopleInRoom = 2;
console.log(`The force of gravity is ${gravity} m/s^2.`);
console.log(pi);
console.log(`There are currently ${numOfPeopleInRoom} people in the room.`);

/*
    Oppgave: D
    Lag en funksjon som legger sammen to tall, funksjonen skal hete add
*/
console.log("Oppgave: D");

// lag funksjonen din her. 
function add(num1,num2){
    return num1+num2;
}
console.log("3 + 6 = " + add(3,6));
console.log("5673 + 234 = " + add(5673,234));

/*
    Oppgave: E
    Bruk variabelen people fra eksempelet og skriv navna ut i reversert rekke følge (bruk en løkke)
    NB du skal ikke endre på people, bare bruke det som den inneholder.
*/

console.log("Oppgave: E");
for(index=people.length-1; index>=0; index--){
    let person = people[index];
    console.log(person);
}


/*
    Oppgave: F
    Deklarere en variabel for en liste med telefon nummer. Listen din skal ha minst 3 nummer. 
*/

let phoneNumbers = ['12345678', '87654321', '11223344'];

/*
    Oppgave: G
    Skriv ut bare det siste telefon numeret i listen din. 
*/

console.log("Oppgave: G");
let lastPhoneNumber = phoneNumbers[phoneNumbers.length-1];
console.log(lastPhoneNumber);

/*
    Oppgave: H
    Skriv ut kunn etternavnene for personene i listen, bruk en løkke.
*/

console.log("Oppgave: H");
let personer = [["Christian", "Simonsen"], ["Tony", "Bergholtz"]]
for(index = 0; index < personer.length; index++){
    let lastNames = personer[index][personer.length-1];
    console.log(lastNames);
}