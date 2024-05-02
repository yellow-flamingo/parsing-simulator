const alphabet = Array.from(Array(26)).map((elem,i) => String.fromCharCode(i+65));

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

function removeSingleSymbol(productions, lambda) {
    let arrayToAdd = [];

    for (let item of productions) {
        if (!(item == lambda)) {
            arrayToAdd.push(item);
        }
    }

    return arrayToAdd
}

function removeStartSymbol(grammarToConvert) {
    var newGrammar = {...grammarToConvert};

    for (let elem of newGrammar['S']) {
        console.log(elem);
        if (elem.includes('S')) {
            newGrammar["S0"] = ["S"];
        }
    }

    console.log(newGrammar);

    return newGrammar;
}

function removeLambdaProductions(grammarToConvert) {
    var newGrammar = {...grammarToConvert};
    var lambdaList = [];
    
    for (let key in newGrammar) {
        if (newGrammar[key].includes('')) {
            if (newGrammar[key].length == 1) {
                delete newGrammar[key];
                lambdaList.push({'value': key, 'onlySymbol': true});
            } else {
                newGrammar[key].splice(newGrammar[key].indexOf(''),1);
                lambdaList.push({'value': key, 'onlySymbol': false});
            }
        }
    }
    
    let stringToAdd;
    for (let lambda of lambdaList) {
        for (let key in newGrammar) {
            for (let item of newGrammar[key]) {
                if (item == lambda.value) {
                    lambdaList.push({'value': key, 'onlySymbol': false});
                    if (lambda.onlySymbol) {
                        newGrammar[key] = removeSingleSymbol(newGrammar[key], item);
                    }
                } else {
                    if (item.includes(lambda.value)) {
                        for (let i=0; i<item.length; i++) {
                            if (item[i] == lambda.value) {
                                stringToAdd = removeCharacter(item,i);
                                if (!(newGrammar[key].includes(stringToAdd))) {
                                    newGrammar[key].push(stringToAdd);
                                }             
                            }
                        }
                        if (lambda.onlySymbol == true) {
                            newGrammar[key] = removeSingleSymbol(newGrammar[key], item);
                        }
                    }
                }
            }
        }
    }

    for (let key in newGrammar) {
        if (newGrammar[key].length == 0) {
            delete newGrammar[key];
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
                } else if (!(nonTerminals.includes(item[0])) && !(nonTerminals.includes(item[1]))) {
                    if (existsProduction(item[0], newGrammar)) {
                        newNonTerminal = findNonTerminal(item[0], newGrammar);
                    } else {
                        newNonTerminal = nextNonTerminal(nonTerminals);
                        newGrammar[newNonTerminal] = [item[0]];
                        nonTerminals.push(newNonTerminal);
                    }
                    let newItem = newNonTerminal;
                    
                    if (existsProduction(item[1], newGrammar)) {
                        newNonTerminal = findNonTerminal(item[1], newGrammar);
                    } else {
                        newNonTerminal = nextNonTerminal(nonTerminals);
                        newGrammar[newNonTerminal] = [item[1]];
                        nonTerminals.push(newNonTerminal);
                    }
                    newItem = newItem + newNonTerminal;
                    newGrammar[key][index] = newItem;              
                }
            }
        }
    }
    return newGrammar;
}

export function* convertToCNF(grammar) {
    let grammar1 = removeStartSymbol(grammar);
    yield grammar1;

    let grammar2 = removeLambdaProductions(grammar1);
    yield grammar2;

    let grammar3 = removeUnitProductions(grammar2);
    yield grammar3;

    let grammar4 = ensureTwoSymbols(grammar3);
    yield grammar4;

    let grammar5 = separateTerminals(grammar4);
    yield grammar5;
}


