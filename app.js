const resultEl = document.querySelector('#result')
const lengthEl = document.querySelector('#length')
const uppercaseEl = document.querySelector('#uppercase')
const lowercaseEl = document.querySelector('#lowercase')
const numbersEl = document.querySelector('#numbers')
const symbolsEl = document.querySelector('#symbols')
const generateEl = document.querySelector('#generate')
const clipboardEl = document.querySelector('#clipboard')
const passwordsContainer = document.querySelector('.previous-results')
const passwordsDisplay = document.querySelector('#passwords')
const savedDisplayBtn = document.querySelector('.saved-control')
const savedDisplayI = document.querySelector('.saved-control i')

const localStoragePasswords = JSON.parse(localStorage
    .getItem('passwords'))
let passwords = localStorage
    .getItem('passwords') !== null ? localStoragePasswords : []


generateEl.onclick = () => {
    const length = parseInt(lengthEl.value) // ou +lengthEl.value
    const hasLower = lowercaseEl.checked    
    const hasUpper = uppercaseEl.checked    
    const hasNumber = numbersEl.checked    
    const hasSymbol = symbolsEl.checked

    const result = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length)
    resultEl.innerText = result
}

const generatePassword = (lower, upper, number, symbol, length) => {
    let generatedPassword = ''

    const typesCount = lower + upper + number + symbol
    const typesArr = [{ lower }, { upper }, { number }, { symbol }]
        .filter(item => Object.values(item)[0])

    if (typesCount === 0) return ''

    for (let i = 0; i < length; i++) {
        const rand = Math.floor(Math.random() * typesArr.length);
        generatedPassword += randomFunc[Object.keys(typesArr[rand])[0]]();
    }

    const finalPassword = generatedPassword.slice(0, length)    
    return finalPassword
}

clipboardEl.onclick = () => {
    const textarea = document.createElement('textarea')
    const password = resultEl.innerText

    if(!password) return

    textarea.value = password
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
    addToPasswordArr(password)
    updatePasswordsLocalStorage()
    init()
    alert('Senha copiada para a Área de transferência')
}

const getRandomLower = () => {
    const randomLowerCase = Math.floor(Math.random() * 26) + 97
    return String.fromCharCode(randomLowerCase)
}

const getRandomUpper = () => {
    const randomUpperCase = Math.floor(Math.random() * 26) + 65
    return String.fromCharCode(randomUpperCase)
}

const getRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 10)
    return randomNumber
}

const getRandomSymbol = () => {
    const symbols = '!@#$%^&*(){}[]=/,.'
    const randomSymbol = Math.floor(Math.random() * symbols.length)
    return symbols[randomSymbol]
}
const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

const addPasswordsIntoDOM = ({ id, pass }) => {
    const li = document.createElement('li')
    li.innerHTML = `${pass}<button class="delete-btn" onClick="deletePassword(${id})">x</button>`
    passwordsDisplay.prepend(li)
}

const deletePassword = ID => {    
    passwords = passwords.filter(password => password.id !== ID)
    init()
    updatePasswordsLocalStorage()
    if(!passwords) savedDisplayBtn.remove()
}

const updatePasswordsLocalStorage = () => {
    localStorage.setItem('passwords', JSON.stringify(passwords))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToPasswordArr = pass => {
    passwords.push({
        id: generateID(),
        pass: pass
    })
}

const init = () => {
    if(!passwords) savedDisplayBtn.remove()
    passwordsDisplay.innerHTML = ''
    passwords.forEach(addPasswordsIntoDOM)
    console.log(passwords);
}

savedDisplayBtn.onclick = () => {
    if(passwordsContainer.classList.contains('hidden')){
        passwordsContainer.classList.remove('hidden')
        savedDisplayI.classList.replace('fa-angle-down', 'fa-angle-up')
        init()
    }
    else {
        passwordsContainer.classList.add('hidden')
        savedDisplayI.classList.replace('fa-angle-up', 'fa-angle-down')
    }
}