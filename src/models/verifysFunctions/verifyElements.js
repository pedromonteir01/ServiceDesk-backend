const verifyElements = (array, type) => {
    return array.every(element => typeof element === type);
}

module.exports = verifyElements;