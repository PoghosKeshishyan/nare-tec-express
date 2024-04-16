/* Function to square numbers */

const squareNumbers = (num1, num2) => {
    if (num2 === 0) {
        return (num1 * 1).toFixed(2);
    }

    return (num1 * num2).toFixed(2);
}

module.exports = {
    squareNumbers,
}
