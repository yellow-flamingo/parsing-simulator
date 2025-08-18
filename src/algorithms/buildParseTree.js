import { getSubstrings, cartesianProduct, getCombinations } from "./cykHelpers";

class Node {
    constructor(value, left, right) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

export function cykParseBackpointers(stringToParse, items) {
    var n = stringToParse.length;
    var cykDict = {};
    var backpointers = {};
    var currentLength = 1;
    var currentList = [];
    var addToDict = true;
    var addToBackpointers = true;

    var substrings = getSubstrings(stringToParse, n);

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
            if (addToDict) {
                cykDict[substrings[i]].push(letter);
            }
        }

        currentList = [];
    }

    return backpointers;
}

export function buildParseTree(node) {
    if (node.right == null) {
        if (node.left == null) {
            return '{"name": ' + '"' + node.value + '"}';
        } else {
            return '{"name": ' + '"' + node.value + '"' + ', ' + '"children": [' + buildParseTree(node.left) + "]},";
        }
    }

    return '{"name":' + '"' + node.value + '"' + ', ' + '"children": [' + buildParseTree(node.left)  + buildParseTree(node.right) + ']},';
}