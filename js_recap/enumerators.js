const numbers = [1,2,3,4,5];

/*
Each enumerator method can be recreated with forEach (or even a for loop), but the logic is more complicated
*/

// numbers.forEach((number) => {
//     console.log("next number is: " + number);
// })


/*
Mapping creates a new array of the same length as the original. Each element in the new array is the result of applying the callback to an element
*/
const mappedNumbers = numbers.map((number) => {
    return number * 2;
})

/*
Filtering also creates a new array, but this time the elements added are only those for which the condition in the callback is true
*/
const filteredNumbers = numbers.filter((number) => {
    return number % 2 == 0;
})

/*
Reduce will generate a single value based on all the elements in the array, in this example the sum of the numbers. The callback needs an additional argument representing the running total. We also need to add an argument after the callback representing the start point for the reduction. If we don't provide this then the first value in the array will be used.
*/
const reducedNumbers = numbers.reduce((runningTotal, number) => {
    return runningTotal + number
},0);

console.log("original array:", numbers);
console.log("mapped array:", mappedNumbers);
console.log("filtered array:", filteredNumbers);
console.log("reduced array:", reducedNumbers);