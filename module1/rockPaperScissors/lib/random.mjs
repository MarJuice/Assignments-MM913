function getRandomItemFromArray(array) {
    let max = array.length - 1;
    let rndIndex = Math.round(Math.random() * max);
    return array[rndIndex];
}


export { getRandomItemFromArray }