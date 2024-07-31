const encodeBase64 = word => {
    let encodedStringBtoA = undefined;
    if (word !== null && word !== undefined && word.length > 0) {
        encodedStringBtoA = btoa(word);
    }
    return encodedStringBtoA;
};

const wordToCapitalize = words => {
    if (words !== null && words !== undefined && words.length > 0) {
        return words.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
    return words;
};


module.exports = {
    encodeBase64,
    wordToCapitalize
};