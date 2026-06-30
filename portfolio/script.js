// const name = 'Tosin'; 
// const msg = `Hello, ${name}!`; 

// console.log(name)
// console.log(msg)

// let age = 25;            // value may change later
// age = 26;
// console.log(age)

// const a = 10, b = 3;

// console.log(a + b)   // 13  — addition
// console.log(a - b)   // 7   — subtraction
// console.log(a * b)   // 30  — multiplication
// console.log(a / b)   // 3.333... — division
// console.log(a % b)   // 1   — remainder (modulo)
// console.log(a ** b)  // 1000 — exponentiation (10³)

// // Increment / Decrement
// let count = 5;
// // count++;  // 6 (post-increment)
// // ++count;  // 7 (pre-increment)
// // count--;  // 6 (post-decrement)

// console.log(count)

// let x = 10;
// x += 5;  // x = x + 5
// console.log(x)  // 15

// x -= 3;  // x = x - 3
// console.log(x)  // 12

// console.log(5 <= 4)  // false
// console.log(5 >= 4)  // true

// console.log(5=='5')  // true (loose equality, type coercion)
// console.log(5==='5') // false (strict equality, no type coercion)

// console.log(5 + '5')  // '55' (string concatenation)55
// console.log('5' + 5)  // '55' (string concatenation)55

// // console.log(true && true)
// // console.log(true && false)
// // console.log(false && true)

// console.log(true || true)
// console.log(true || false)
// console.log(false || true)
// console.log(false || false)


// const score = 72;

// // if/else statement
// if (score >= 90) {
//   console.log('A');
// } else {
//   console.log('F');
// }





// // tenary operator
// const grade = score >= 90 ? 'Excellent' : 'Failure';
// console.log(grade);

// ============Class on Array ====================

const colors = ['red', 'green', 'blue'];

// console.log(colors.shift());     // 'red'     — zero-indexed
// console.log(colors);     // 'red'     — zero-indexed
colors[2]     // 'blue'
colors.length // 3
colors.at(-1) // 'blue'   — last element (ES2022)

// Modifying
colors.push('yellow');   // add to end   → ['red','green','blue','yellow']
colors.pop();            // remove last  → ['red','green','blue']
colors.unshift('pink'); // add to front
colors.shift(); 

// const ages = [1, 2, 3, 4, 5];
// ages.forEach(age => console.log(age * 2));

// const prices = [10, 20, 30];
// const withTax = prices.map(p => p * 2);
// console.log(withTax) // [20, 40, 60]

// Spread — copy / merge arrays
// const a = [1, 2];
// const b = [3, 4];
// const combined = [...a, ...b]; // [1, 2, 3, 4]

// console.log(combined)

// Object literal (most common)
const person = {
  fullname: 'Tosin Adewale',
  age: 25,
  city: 'Lagos',
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};

// // Accessing properties
// console.log(person.name);        // 'Tosin'   — dot notation
// console.log(person['name']);      // 25         — bracket notation
// console.log(person.greet());     // "Hi, I'm Tosin"

const {fullname, age} = person; // destructuring
console.log(fullname) // 'Tosin'
console.log(age)  // 25




const getMyTitle = document.getElementById('hero-title');  

getMyTitle.textContent = 'John Doe';

document.querySelectorAll('li').forEach(li => {
    li.style.color = 'blue';
})