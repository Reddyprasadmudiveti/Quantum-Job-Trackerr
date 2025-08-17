export const randomTokenGen = () => {
    // return Math.floor(100000 + Math.random()*900000).toString()
    return Math.floor(Math.random()*900000+100000).toString()
}
console.log(randomTokenGen())