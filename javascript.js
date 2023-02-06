const btns = document.querySelectorAll('.btns-container input');
const answer = document.getElementById('answer');
const input = document.getElementById('input');


btns.forEach(el => el.addEventListener('click', calc));


function calc(e, btnValue = e.target.value){  
    let isOperator = ['+', '-', '/', '*'].includes(btnValue);
    

    if(btnValue === 'AC') 
        clearScreen();
    else if(btnValue === 'CE')
        deletePreviousValue();
    else if(btnValue === '()')
        chooseParenthesis();
    else if(btnValue === '+/-')
        negateValue();
    else if(btnValue === '.')
        displayDot();
    else if(btnValue === '='){
        if(!(/\d/.test(input.value.charAt(input.value.length-1))) 
        && input.value.charAt(input.value.length-1) != ')'){
            answer.value = 'ERROR';
        }else{
            if(openParenthesis){
                input.value += ')';
                openParenthesis = false;
            }
            answer.value = '=' + calculateExpression(input.value);
        }
    }
    else{
        if(input.value.length < 16){
            displayOnScreen(btnValue,isOperator);
        }
    }    
}

function displayOnScreen(btnValue,isOperator){
    let lastChar = input.value.charAt(input.value.length-1);
    if(isOperator && input.value.charAt(0) === ''){
        input.value += '0' + btnValue;
        isDotAvailable = true;
    }
    else if(isOperator && ['+', '-', '/', '*'].includes(lastChar)){
        input.value = input.value.slice(0, -1);
        input.value += btnValue;
    }
    else if(lastChar === '(' && isOperator || lastChar === '.' && isOperator){
        // do nothing
    }
    else{
        if(isOperator){
            isDotAvailable = true;
        }
        input.value += btnValue;
    }
}

function clearScreen(){
    input.value = '';
    answer.value = '';
    openParenthesis = false;
    isDotAvailable = true;
}

function deletePreviousValue(){
    if(input.value.charAt(input.value.length-1) === '(' || 
    input.value.charAt(input.value.length-1) === ')')
        openParenthesis = !openParenthesis;
    if(input.value.charAt(input.value.length-1) === '.'){
        isDotAvailable = true;
    }
    input.value = input.value.slice(0, -1);
    
}

let openParenthesis = false;
function chooseParenthesis(){
    let lastChar = input.value.charAt(input.value.length-1);
    if(!openParenthesis) {
        if(lastChar === ')' || /\d/.test(lastChar)){
            input.value += '*';
        }
        input.value += '(';
        openParenthesis = true;
    }else{
        if(['+', '-', '/', '*'].includes(lastChar) || lastChar === '('){
            // do nothing
        }else{
            input.value += ')';
            openParenthesis = false;
        }
    }
}

function calculateExpression(input){
    return Function('return ' + input)();
}


function negateValue(){
    let lastOperatorIndex = input.value.split('').findLastIndex(el => ['+', '-', '/', '*', '('].includes(el));

    if(lastOperatorIndex === -1){
        input.value = '-' + input.value;
    }
    else if(lastOperatorIndex === 0){
        if(input.value[0] === '('){
            input.value = '(-' + input.value.slice(1);
        }else{
            input.value = input.value.slice(1);
        }
    }else if(input.value[lastOperatorIndex] === '('){
        input.value = input.value.slice(0,lastOperatorIndex+1) + '-'+ input.value.slice(lastOperatorIndex+1);
    }
    else if(input.value[lastOperatorIndex] === '*' || input.value[lastOperatorIndex] === '/'){
        input.value = input.value.slice(0,lastOperatorIndex+1) + '(-' + input.value.slice(lastOperatorIndex+1);
        openParenthesis = true;
    }
    else if(input.value[lastOperatorIndex] === '+'){
        input.value = input.value.slice(0,lastOperatorIndex) + '-' + input.value.slice(lastOperatorIndex+1);
    }
    else if(input.value[lastOperatorIndex] === '-'){
        if(input.value[lastOperatorIndex-1] === '('){
            input.value = input.value.slice(0,lastOperatorIndex) + '' + input.value.slice(lastOperatorIndex+1);
        }
        else{
            input.value = input.value.slice(0,lastOperatorIndex) + '+' + input.value.slice(lastOperatorIndex+1);
        }
    }
}
let isDotAvailable = true;
function displayDot(){
    if(isDotAvailable){
        input.value += '.';
        isDotAvailable = false;
    }
}

window.addEventListener('keydown', e => {
    let isNumber = /\d/.test(e.key);
    let isOtherValidKey = ['Backspace', '.', '/', '*', '+', '-'].includes(e.key);
    if(isNumber || isOtherValidKey){
        calc(e, e.key)
    }
});