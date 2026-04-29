const name = 'Tosin';   // value never changes
let age = 25;            // value may change later
age = 26;                // ✅ fine — let is re-assignable

// name = 'John';         ❌ TypeError: Assignment to constant variable

console.log(typeof 'hello')   // "string"
console.log(typeof 42)        // "number"
console.log(typeof true)      // "boolean"
console.log(typeof undefined) // "undefined"
console.log(typeof null)      // "object" ← famous JS bug, null is NOT an object
console.log(typeof {})        // "object"
console.log(typeof [])        // "object" ← arrays are objects too
console.log(typeof function(){} )// "function"

console.log(name)