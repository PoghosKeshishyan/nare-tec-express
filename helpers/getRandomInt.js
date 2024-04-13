/* Function to generate a random INT */

const getRandomInt = () => {
    return Math.floor(Math.random() * (1000000000 - 1 + 1)) + 1;
}

module.exports = {
    getRandomInt,
}
