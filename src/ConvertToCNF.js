const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

function removeLambdaProductions(grammarToConvert) {
    var newGrammar = {...grammarToConvert};

    var lambdas = true;
    var lambdaCount = 0;
    while (lambdas) {
        for (var key in newGrammar) {
            if (newGrammar[key].includes('')) {
                newGrammar[key].splice(newGrammar[key].indexOf(''),1);
                lambdaCount += 1;
                for (var key2 in items) {
                    if (newGrammar[key2].includes(key)) {
                        newGrammar[key2].push('');
                    }
                }
            }
        }

        if (lambdaCount == 0) {
            lambdas = False
        } else {
            lambdaCount = 0;
        }
    }

    return newGrammar;
}

function removeUnitProductions(grammarToConvert) {
    var newGrammar = {...grammarToConvert};

    var nonTerminals = Object.keys(newGrammar);

    for (var key in newGrammar) {
        for (var item in newGrammar[key]) {
            if (nonTerminals.includes(item)) {
                newGrammar[key].splice(newGrammar[key].indexOf(item),1);
                for (var key2 in newGrammar) {
                    if (key2 == item) {
                        newGrammar[key] = [...new Set([...newGrammar[key2], ...newGrammar[key]])];
                    }
                }
            }
        }
    }

    return newGrammar;
}

function existsProduction(string, grammar) {

    var derivations = [];
    for (let key in grammar) {
        for (let item of grammar[key]) {
            derivations.push(item);
        }
    }
    
    if (derivations.includes(string)) {
        return true;
    } else {
        return false;
    }

}

function nextNonTerminal(nonTerminals) {
    var nonTerminal = '';

    var alphaIndex = 0;
    while (nonTerminal == '') {
        if (!(nonTerminals.includes(alphabet[alphaIndex]))) {
            nonTerminal = alphabet[alphaIndex];
        } else {
            alphaIndex++;
        }

    }

    return nonTerminal;
}

function findNonTerminal(terminal, grammar) {
    var nonTerminal = '';

    for (let key in grammar) {
        for (let item of grammar[key]) {
            if (item == terminal) {
                nonTerminal = key;
            }
        }
    }

    return nonTerminal;
}

function ensureTwoSymbols(grammarToConvert) {
    var newGrammar = {...grammarToConvert};
    var newNonTerminal;
    var subString = '';
    var nonTerminals = Object.keys(newGrammar);

    for (let key in newGrammar) {
        for (let item of grammar[key]) {
            if (item.length > 2) {
                while (item.length > 2) {
                    subString = string.substr(-2,2);
                    if (existsProduction(subString, newGrammar)) {
                        newNonTerminal = findNonTerminal(subString, newGrammar);
                    } else {
                        newNonTerminal = nextNonTerminal(nonTerminals);
                        newGrammar[newNonTerminal] = [subString];
                    }
                    item = item.slice(0,-2) + newNonTerminal;
                }
            }
        }
    }

    return newGrammar;
}

function separateTerminals(grammarToConvert) {
    var newGrammar = {...grammarToConvert};

    var derivations = [];
    for (let key in newGrammar) {
        for (let item of newGrammar[key]) {
            derivations.push(item);
        }
    }

    var nonTerminals = Object.keys(newGrammar);
    var newNonTerminal;

    for (var key in newGrammar) {
        for (var item of newGrammar[key]) {
            if (item.length == 2) {
                if ((nonTerminals.includes(item[0]) && !(nonTerminals.includes(item[1])))) {
                    if (derivations.includes(item[1])) {
                        newNonTerminal = findNonTerminal(item[1], newGrammar);
                    } else {
                        newNonTerminal = nextNonTerminal(nonTerminals);
                        newGrammar[newNonTerminal] = [item[1]];
                    }
                    item[1] = newNonTerminal;
                } else if ((nonTerminals.includes(item[1]) && !(nonTerminals.includes(item[0])))) {
                    newNonTerminal = nextNonTerminal(nonTerminals);
                    newGrammar[newNonTerminal] = [item[0]];
                    item[0] = newNonTerminal;
                }
            }
        }
    }

    return newGrammar;
}

export function convertToCNF(grammarToConvert) {
    var items = {'S': ['abAB'], 'A': ['bAB', ''], 'B': ['BAa', '']};
    var newGrammar = {};

    return newGrammar;
}