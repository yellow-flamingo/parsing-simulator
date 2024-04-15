function getSubstrings(stringToParse, n) {
    let substrings = [];
    for (let i=0; i<n; i++) {
        for (let j=0; j<n-i; j++) {
            let stringToAdd = stringToParse[j];
            for (let k=1; k<i+1; k++) {
                stringToAdd += stringToParse[j+k];
            }
            substrings.push(stringToAdd)
        }
    }
    return substrings;
}

function cartesianProduct(list1, list2) {
    var values = [];
    for (var val1 of list1) {
        for (var val2 of list2) {
            values.push(val1 + val2);
        }
    }
    return values;
}

function getCombinations(string) {
    var combinations = [];
    if (string.length == 1) {
        combinations.push([string]);
    } else {
        for (let i=1; i<string.length; i++) {
            combinations.push([string.slice(0,i), string.slice(i,string.length)]);
        }
    }
    return combinations;
}

export function cykParse(stringToParse, items) {
    //var items = {'S': ['CE','CG','CH','CD'], 'A': ['DF','DA','DB','b'], 'B': ['BI','BC','AC','a','DF','DA','DB','b'], 'C': ['a'], 'D': ['b'], 'E': ['DF'], 'F': ['AB'], 'G': ['DA'], 'H': ['DB'], 'I': ['AC']};
    var n = stringToParse.length;
    var cykDict = {};
    var cykTable = [];
    var currentRow = n-1;
    var currentCell = 0;
    var currentLength = 1;
    var currentList = [];
    var addToDict = true;

    for (let i=0; i<n; i++) {
        cykTable.push([]);
        for (let j=0; j<n; j++) {
            cykTable[i].push([]);
        }
    }

    var substrings = getSubstrings(stringToParse, n);

    for (var sub of substrings) {
        cykDict[sub] = [];
    }

    for (var i=0; i<substrings.length; i++) {
        if (cykDict[substrings[i]].length !== 0) {
            addToDict = false;
        } else {
            addToDict = true;
        }
        if (substrings[i].length > currentLength) {
            currentLength = substrings[i].length;
            currentRow -= 1;
            currentCell = 0;
        }
        if (currentLength === 2) {
            for (var val of cartesianProduct(cykTable[n-1][currentCell], cykTable[n-1][currentCell+1])) {
                for (var key in items) {
                    if (items[key].includes(val)) {
                        currentList.push(key);
                    }
                }
            }

        } else if (currentLength > 2) {
            for (var combo of getCombinations(substrings[i])) {
                for (let val of cartesianProduct(cykDict[combo[0]], cykDict[combo[1]])) {
                    for (let key in items) {
                        if (items[key].includes(val)) {
                            currentList.push(key);
                        }
                    }
                }
            } 

        } else {
            for (let key in items) {
                if (items[key].includes(substrings[i])) {
                    currentList.push(key)
                }
            }
        }

        let currentListSet = new Set(currentList);
            for (let letter of currentListSet) {
                cykTable[currentRow][currentCell].push(letter);
                if (addToDict) {
                    cykDict[substrings[i]].push(letter);
                }
            }

        currentCell += 1;
        currentList = [];
    }

    return cykTable;
}

export function* getExplanations(stringToParse, items, table) {
    var info = {};
    var cykDict = {};
    var n = stringToParse.length;
    var currentRow = n-1;
    var currentCell = 0;
    var currentLength = 1
    
    var substrings = getSubstrings(stringToParse, n);
    
    for (let sub of substrings) {
        if (sub.length > currentLength) {
            currentLength = sub.length;
            currentRow -= 1;
            currentCell = 0;
        }
        
        cykDict[sub] = table[currentRow][currentCell]
        
        currentCell += 1
    }
    
    currentRow = n-1;
    currentCell = 0;
    currentLength = 1;
    for (let i=0; i<substrings.length; i++) {
        info.substring = substrings[i];
        var combos = getCombinations(substrings[i]);
        info.combinations = combos;
        info.nonterminals = [];
        info.products = [];
        info.productions = [];
        
        if (substrings[i].length > currentLength) {
            currentLength = substrings[i].length;
            currentRow -=1;
            currentCell = 0;
        }
        
        for (let i=0; i<combos.length; i++) {
            info.nonterminals.push([]);
            for (let j=0; j<combos[i].length; j++) {
                info.nonterminals[i].push(cykDict[combos[i][j]]);
            }
        }
        
        for (let i=0; i<info.nonterminals.length; i++) {
            if (info.nonterminals[i].length === 2) {
                info.products.push(cartesianProduct(info.nonterminals[i][0], info.nonterminals[i][1]));
            }
        }
        
        for (let i=0; i<info.products.length; i++) {
            info.productions.push([]);
            for (let product of info.products[i]) {
                for (let key in items) {
                    if (items[key].includes(product)) {
                        info.productions[i].push([key,product]);
                    } 
                }
            }
        }
        
        yield info;
    }
}