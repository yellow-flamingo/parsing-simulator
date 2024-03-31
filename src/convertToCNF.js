const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

function existsProduction(string, grammar) {
    var derivations = [];
    for (let key in grammar) {
        derivations.push(grammar[key]);
    }
    
    for (let i of derivations) {
        if ((i.length == 1) && (i.includes(string))) {
            return true;
        }
    }
    return false;
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
        if ((grammar[key].length == 1) && (grammar[key].includes(terminal))) {
            nonTerminal = key;
        }
    }
    
    return nonTerminal;
}

function removeCharacter(str, index) {
    let first = str.substring(0,index);
    let second = str.substring(index+1,str.length);
    
    return(first + second);
}

function removeLambdaProductions(grammarToConvert) {

    // need to re-write using recursion
    // also need to take into account if a lambda production is found and that's the only production from that non-terminal - would then need to remove any productions involving that non-terminal all together

    var newGrammar = {...grammarToConvert};
    
    var lambdaList = [];
    
    for (let key in newGrammar) {
        if (newGrammar[key].includes('')) {
            lambdaList.push(key);
            newGrammar[key].splice(newGrammar[key].indexOf(''),1);
        }
    }
    
    let stringToAdd;
    for (let lambda of lambdaList) {
        for (let key in newGrammar) {
            for (let item of newGrammar[key]) {
                if (item == lambda) {
                    lambdaList.push(key);
                } else {
                    for (let i=0; i<item.length; i++) {
                        if (item[i] == lambda) {
                            stringToAdd = removeCharacter(item,i);
                            if (!(newGrammar[key].includes(stringToAdd))) {
                                newGrammar[key].push(stringToAdd);
                            }
                        }
                    }                
                }
            }
        }
    }

    return newGrammar;
}

function removeUnitProductions(grammarToConvert) {
    var newGrammar = {...grammarToConvert};

    var nonTerminals = Object.keys(newGrammar);
    
    var allRemoved = false;
    
    while (allRemoved == false) {
        let unitProductionSeen = false
        for (let key in newGrammar) {
            for (let item of newGrammar[key]) {
                if (nonTerminals.includes(item)) {
                    unitProductionSeen = true;
                    newGrammar[key].splice(newGrammar[key].indexOf(item),1);
                    for (let key2 in newGrammar) {
                        if (key2 == item) {
                            newGrammar[key] = [...new Set([...newGrammar[key2], ...newGrammar[key]])];
                        }
                    }
                }
            }
        }
        if (unitProductionSeen == false) {
            allRemoved = true;
        }
    }

    return newGrammar;
}

function ensureTwoSymbols(grammarToConvert) {

    // should probably use recursion when decreasing the length of the string

    var newGrammar = {...grammarToConvert};
    var newNonTerminal;
    var subString = '';
    var nonTerminals = Object.keys(newGrammar);

    for (let key in newGrammar) {
        for (let item of newGrammar[key]) {
            if (item.length > 2) {
                while (item.length > 2) {
                    subString = item.substr(-2,2);
                    if (existsProduction(subString, newGrammar)) {
                        newNonTerminal = findNonTerminal(subString, newGrammar);
                    } else {
                        newNonTerminal = nextNonTerminal(nonTerminals);
                        newGrammar[newNonTerminal] = [subString];
                        nonTerminals.push(newNonTerminal);
                    }
                    let newItem = item.slice(0,-2) + newNonTerminal;
                    let index = newGrammar[key].indexOf(item);
                    newGrammar[key][index] = newItem;
                    item = newItem;
                }
            }
        }
    }

    return newGrammar;
}

function separateTerminals(grammarToConvert) {
    var newGrammar = {...grammarToConvert};

    var nonTerminals = Object.keys(newGrammar);
    var newNonTerminal;

    for (let key in newGrammar) {
        for (let item of newGrammar[key]) {
            if (item.length == 2) {
                let index = newGrammar[key].indexOf(item)
                if ((nonTerminals.includes(item[0]) && !(nonTerminals.includes(item[1])))) {
                    if (existsProduction(item[1], newGrammar)) {
                        newNonTerminal = findNonTerminal(item[1], newGrammar);
                    } else {
                        newNonTerminal = nextNonTerminal(nonTerminals);
                        newGrammar[newNonTerminal] = [item[1]];
                        nonTerminals.push(newNonTerminal);
                    }
                    let newItem = item[0] + newNonTerminal;
                    newGrammar[key][index] = newItem;
                } else if ((nonTerminals.includes(item[1]) && !(nonTerminals.includes(item[0])))) {
                    if (existsProduction(item[0], newGrammar)) {
                        newNonTerminal = findNonTerminal(item[0], newGrammar);
                    } else {
                        newNonTerminal = nextNonTerminal(nonTerminals);
                        newGrammar[newNonTerminal] = [item[0]];
                        nonTerminals.push(newNonTerminal);
                    }
                    let newItem = newNonTerminal + item[1];
                    newGrammar[key][index] = newItem;
                }
            }
        }
    }

    return newGrammar;
}

export function* convertToCNF() {

    var items = {'S': ['abAB'], 'A': ['bAB', ''], 'B': ['BAa', '']};

    let grammar1 = removeLambdaProductions(items);
    yield grammar1;

    let grammar2 = removeUnitProductions(grammar1);
    yield grammar2;

    let grammar3 = ensureTwoSymbols(grammar2);
    yield grammar3;

    let grammar4 = separateTerminals(grammar3);
    yield grammar4;
}