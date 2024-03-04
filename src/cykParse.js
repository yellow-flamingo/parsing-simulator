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
    for (var i=1; i<string.length; i++) {
        combinations.push([string.slice(0,i), string.slice(i,string.length)]);
    }
    return combinations;
}

export function cykParse(stringToParse) {
    var items = {'S': ['CE','CG','CH','CD'], 'A': ['DF','DA','DB','b'], 'B': ['BI','BC','AC','a','DF','DA','DB','b'], 'C': ['a'], 'D': ['b'], 'E': ['DF'], 'F': ['AB'], 'G': ['DA'], 'H': ['DB'], 'I': ['AC']};
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
            let currentListSet = new Set(currentList);
            for (var letter of currentListSet) {
                cykTable[currentRow][currentCell].push(letter);
                if (addToDict) {
                    cykDict[substrings[i]].push(letter);
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
            let currentListSet = new Set(currentList);
            for (let letter of currentListSet) {
                cykTable[currentRow][currentCell].push(letter);
                if (addToDict) {
                    cykDict[substrings[i]].push(letter);
                }
            }
        } else {
            for (let key in items) {
                if (items[key].includes(substrings[i])) {
                    currentList.push(key)
                }
            }
            let currentListSet = new Set(currentList);
            for (let letter of currentListSet) {
                cykTable[currentRow][currentCell].push(letter);
                if (addToDict) {
                    cykDict[substrings[i]].push(letter);
                }
            }
        }
        currentCell += 1;
        currentList = [];
    }

    // if (cykDict[stringToParse].includes('S')) {
    //     return "String accepted"
    // } else {
    //     return "String not accepted"
    // }

    return cykTable;
}