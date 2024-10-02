const verifyElements = (array, type) => {
    return array.every(element => typeof element === type);
}

const verifyEmail = (email, domain) => {
    let newEmail = email.split('@');
    if(newEmail[1] !== domain) {
        return false;
    }
    return true;
}

module.exports = { verifyElements, verifyEmail };