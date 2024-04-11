/* Function to generate a random INT */

const getRandomInt = () => {
    return Math.floor(Math.random() * (9959516516 - 1 + 1)) + 1;
}

module.exports = {
    getRandomInt,
}
