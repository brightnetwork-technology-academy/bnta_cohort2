const numbers = [1,2,3,4,5,6,7,8,9,10];

// for (const number of numbers) {
//     console.log(number);
// }

// for (let index = 0; index < numbers.length; index+=2) {
//     console.log(numbers[index]);
// }

const makeRangeIterator = (start, end, step) => {

    let nextIndex = start;
    let word = "";

    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

    const rangeIterator = {
        next: function() {
            let result;
            if (nextIndex < end) {
                result = { value: alphabet[nextIndex], done: false}
                nextIndex += step;
                word+= alphabet[nextIndex]
                return result;
            }
            return {value: word, done: true}
        }
    };
    return rangeIterator;
}

const iterator = makeRangeIterator(1, 10, 2);

let result = iterator.next();
while (!result.done){
    console.log(result.value);
    result = iterator.next();
}
