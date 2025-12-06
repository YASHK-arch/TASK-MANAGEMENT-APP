//setItem
//getItem
//removeItem
const obj ={
    name: "Surya",
    phone: 9755045490,
    hasACar: true,
    hobbies: ['Reading', 'Eat Food']
}
localStorage.setItem('name', 'Surya')
const data = localStorage.setItem('Person', JSON.stringify(obj))
const datafromLS = JSON.parse(localStorage.getItem('Person'))
console.log(datafromLS)
