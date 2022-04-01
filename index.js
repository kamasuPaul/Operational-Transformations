const assert = require('assert');

function isValid(stale, latest, operationJson) {
    let cursorPosition = 0;
    let illegalSkips = 0;
    //get operations
    operations = eval(operationJson);
    //appy each operatison on the stale string
    for (let i = 0; i < operations.length; i++) {
        let operation = operations[i];

        if (operation.op == "insert") {
            const chars = operation.chars;
            const output = [stale.slice(0, cursorPosition), chars, stale.slice(cursorPosition)].join('');
            stale = output;
            //move the cursor position to the insert position.
            cursorPosition = cursorPosition + chars.length;
        }
        if (operation.op == "skip") {
            const count = operation.count;
            if (cursorPosition + count <= stale.length) {
                cursorPosition = cursorPosition + count;
            } else {
                illegalSkips = illegalSkips + 1;
            }
        }
        if (operation.op == "delete") {
            const count = operation.count;
            if (cursorPosition + count < stale.length) {
                stale = stale.slice(0, cursorPosition) + stale.slice(cursorPosition + count);
            }

        }


    }
    //get output of stale string
    //compare it with latest string
    let isValid = latest.localeCompare(stale) == 0 ? true : false;
    //check for illegalSkips
    if (illegalSkips > 0) {
        isValid = false;
    }
    console.log(isValid)
    //return bolean response
    return isValid;
}
let output = isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations.',
    '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}]'
); // true
assert.equal(output, true);

output = isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations.',
    '[{"op": "skip", "count": 45}, {"op": "delete", "count": 47}]'
); // false, delete past end
assert.equal(output, false);


let valid = isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations.',
    '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}, {"op": "skip", "count": 2}]'
); // false, skip past end
assert.equal(valid, false);



valid = isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'We use operational transformations to keep everyone in a multiplayer repl in sync.',
    '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
); // true
assert.equal(valid, true);



valid = isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    '[]'
); // true
assert.equal(valid, true);