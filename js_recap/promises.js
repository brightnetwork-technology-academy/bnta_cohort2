
const myFunction = (textToPrint, luckyNumber) => {
    /* By returning a promise we ensure that any function calling this one must handle the promise before being able to use the return value. We're engineering an asynchronous situation by using setTimeout here, but if we were eg. accessing a database the effect would be the same.
    */
    return new Promise((resolve, reject) => {
        /*
        We're engineering a situation where the promise might be rejected by adding an if-statement. If the number is incorrect the Promise will reject, if we pass the correct number it will resolve.
        */
        if (luckyNumber != 5){
            setTimeout(reject, 1000, "unlucky!")
        } else {
            setTimeout(resolve, 1000, textToPrint);
        }
    });
}

/*
Logging the function call will return a pending Promise as the timeouts will not be complete by the time we reach this log. 
*/

// console.log(myFunction("Hello World!", 5));

/*
On the other hand, if we use .then() to wait for the promise to resolve we can log the response after the timeout completes. We can also use .catch() for error handling.
*/

// myFunction("Hello World!", 50).then(
//     (response) => {console.log(response)}
// ).catch(
//     (error) => {console.log(error);}
// )


/*
This function doesn't explicitly return a promise, but calls a function which does. The user has no way of knowing that unless we use the async keyword to indicate that an asynchronous operation is happening *somewhere* in the function. await indicates which is the async call. We can't use await outside of an async function, but it's possible to use async without await
*/

const combineUserGuesses = async (textInput, numberInput) => {

    const result = await myFunction(textInput, numberInput);

    return result;

}

combineUserGuesses("hello cohort 2", 5).then(
    (response) => {
        console.log(response);
    }
).catch((error) => {console.log(error)})
