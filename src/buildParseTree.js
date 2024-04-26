import { getSubstrings, cartesianProduct, getCombinations } from "./cykHelpers";

class Node {
    constructor(value, left, right) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

function cykParse(stringToParse) {
    var items = {'S': ['HD','HE','HF','HI'], 'A': ['IC','IB','IA','b'], 'B': ['BG','BH','AH','a'], 'C': ['AB'], 'D': ['IC'], 'E': ['IB'], 'F': ['IA'], 'G': ['AH'], 'H': ['a'], 'I': ['b']};
    var n = stringToParse.length;
    var cykDict = {};
    var cykTable = [];
    var backpointers = {};
    var currentRow = n-1;
    var currentCell = 0;
    var currentLength = 1;
    var currentList = [];
    var addToDict = true;
    var addToBackpointers = true;

    for (let i=0; i<n; i++) {
        cykTable.push([]);
        for (let j=0; j<n; j++) {
            cykTable[i].push([]);
        }
    }

    var substrings = getSubstrings(stringToParse);

    for (var sub of substrings) {
        cykDict[sub] = [];
        backpointers[sub] = {};
    }

    for (var i=0; i<substrings.length; i++) {
        if (cykDict[substrings[i]].length !== 0) {
            addToDict = false;
            addToBackpointers = false;
        } else {
            addToDict = true;
            addToBackpointers = true;
        }
        
        if (substrings[i].length > currentLength) {
            currentLength = substrings[i].length;
            currentRow -= 1;
            currentCell = 0;
        }
        
        if (currentLength === 1) {
            for (let key in items) {
                if (items[key].includes(substrings[i])) {
                    currentList.push(key);
                    if (addToBackpointers) {
                        backpointers[substrings[i]][key] = new Node(key, new Node(substrings[i], null, null), null);
                    }
                }
            }
        } else {
            for (let combo of getCombinations(substrings[i])) {
                for (let val of cartesianProduct(cykDict[combo[0]], cykDict[combo[1]])) {
                    for (let key in items) {
                        if (items[key].includes(val)) {
                            currentList.push(key);
                            if (addToBackpointers) {
                                // need to update this:
                                // currently if the same non-terminal can be found from 2 different pairs
                                // aka if there are multiple parse trees for the given string
                                // they will override each other when adding to backpointers
                                let left_sub = combo[0];
                                let right_sub = combo[1];
                                let left_nonterminal = val[0];
                                let right_nonterminal = val[1];
                                backpointers[substrings[i]][key] = new Node(key, backpointers[left_sub][left_nonterminal], backpointers[right_sub][right_nonterminal]);
                            }
                        }
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

        currentCell += 1;
        currentList = [];
    }

    return backpointers;
}

export function buildParseTree(node) {
    if (node.right == null) {
        if (node.left == null) {
            return node.value;
        } else {
            return "[" + node.value + " " + buildParseTree(node.left) + "]";
        }
    }

    return "[" + node.value + " " + buildParseTree(node.left) + " " + buildParseTree(node.right) + "]";
}