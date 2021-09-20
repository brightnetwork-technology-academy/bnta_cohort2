/*
Example of a recursive function, ie. one which calls itself
*/

const fibonacci = (n) => {
    if (n == 1) {
        return 0
    }
    if (n ==2) {
        return 1
    }
    if (n > 2) {
        return fibonacci(n - 1) + fibonacci ( n - 2)
    }
}