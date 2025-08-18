export function getSubstrings(stringToParse) {
    let n = stringToParse.length;
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

export function cartesianProduct(list1, list2) {
    var values = [];
    for (var val1 of list1) {
        for (var val2 of list2) {
            values.push(val1 + val2);
        }
    }
    return values;
}

export function getCombinations(string) {
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


