let textArea;
let keyboard;
let capsLock=false;
let shift=false;

function startKeyboard(){
    textArea=document.querySelector("#textArea");
    keyboard=document.querySelector("#keyboard");
    addEventListeners();
    textArea.focus();
}

function addEventListeners(){
    keyboard.addEventListener('click', function(e){
        if(e.target.classList.contains('key')){
            handleVirtualKeyPress(e.target);
        }
    });

    document.addEventListener('keydown',function(e){
        handlePhysicalKeyPress(e);
    });

    document.addEventListener('keyup',function(e){
        handlePhysicalKeyRelease(e);
    });

    textArea.addEventListener('blur', function(){
        setTimeout(function(){
            textArea.focus();
        },0);
    });
}

function handleVirtualKeyPress(keyElement){
    let key=keyElement.getAttribute('data-key');

    keyElement.classList.add('active');
    setTimeout(function(){
            keyElement.classList.remove('active');
        }, 150);
        processKey(key);
}

function handlePhysicalKeyPress(e){
    e.preventDefault();

    let virtualKey=findVirtualKey(e.code || e.key);
    if(virtualKey){
        virtualKey.classList.add('active');
    }
    processKey(e.key)
}

function handlePhysicalKeyRelease(e){
    let virtualKey=findVirtualKey(e.code || e.key);
    if(virtualKey){
        virtualKey.classList.remove('active');
    }
}

function findVirtualKey(keyCode){
let keyMap = {
  'Backquote': '`',  '`': '`',
  'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5',
  'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0',
  'Minus': '-', 'Equal': '=',
  'KeyQ': 'q', 'KeyW': 'w', 'KeyE': 'e', 'KeyR': 'r', 'KeyT': 't',
  'KeyY': 'y', 'KeyU': 'u', 'KeyI': 'i', 'KeyO': 'o', 'KeyP': 'p',
  'BracketLeft': '[', 'BracketRight': ']', 'Backslash': '\\','IntlBackslash': '\\',
  'KeyA': 'a', 'KeyS': 's', 'KeyD': 'd', 'KeyF': 'f', 'KeyG': 'g',
  'KeyH': 'h', 'KeyJ': 'j', 'KeyK': 'k', 'KeyL': 'l',
  'Semicolon': ';', 'Quote': "'",
  'KeyZ': 'z', 'KeyX': 'x', 'KeyC': 'c', 'KeyV': 'v', 'KeyB': 'b',
  'KeyN': 'n', 'KeyM': 'm',
  'Comma': ',', 'Period': '.', 'Slash': '/',
  'Space': 'Space', 'Enter': 'Enter', 'Backspace': 'Backspace',
  'Tab': 'Tab', 'CapsLock': 'CapsLock',
  'ShiftLeft': 'ShiftLeft', 'ShiftRight': 'ShiftRight',
  'ControlLeft': 'ControlLeft', 'ControlRight': 'ControlRight',
  'AltLeft': 'AltLeft', 'AltRight': 'AltRight'
};

    let mappedKey=keyMap[keyCode] || keyCode;
    return document.querySelector('[data-key="'+ mappedKey +'"]');
}

function processKey(key){
    if(key==='Backspace'){
        handleBackspace();
    }
    else if(key==='Enter'){
        insertText('\n');
    }
    else if(key==='Tab'){
        insertText('\t');
    }
    else if(key==='CapsLock'){
        toggleCapsLock();
    }
    else if(key==='ShiftLeft' || key==='ShiftRight' || key === 'Shift'){
        toggleShift();
    }
    else if(key==='ControlLeft' || key==='ControlRight' || key==='AltLeft' || key==='AltRight'){

    }
    else if(key==='Space'){
        insertText(' ');
    }
    else if(key.length===1){
        insertCharacter(key);
    }
}

function insertCharacter(char){
    let finalChar=char;

    if(shift || capsLock){
        let shiftMap={
            '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
            '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
            '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|',
            ';': ':', "'": '"', ',': '<', '.': '>', '/': '?'
        };

        if(shift && shiftMap[char]){
            finalChar=shiftMap[char];
        }
        else if((shift && !capsLock) || (!shift && capsLock)){
            if(char.match(/[a-z]/)){
                finalChar=char.toUpperCase();
            }
        }
    }

    insertText(finalChar);
    if(shift){
        shift=false;
        updateShiftKeys();
    }
}

function insertText(text){
    let selection=window.getSelection();
    if(selection.rangeCount>0){
        let range=selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function handleBackspace(){
    let selection=window.getSelection();
    if(selection.rangeCount>0){
        let range=selection.getRangeAt(0);
        if(range.collapsed){
            range.setStart(range.startContainer, Math.max(0,range.startOffset-1));
        }
        range.deleteContents();
    }
}

function toggleCapsLock(){
    capsLock=!capsLock;
    let capsKey=document.querySelector('[data-key="CapsLock"]');
    if(capsLock){
        capsKey.style.background='rgba(255, 255, 255, 0.05)';
    }
    else{
        capsKey.style.background='rgba(255, 255, 255, 0.2)';
    }
}
function toggleShift(){
    shift=!shift;
    updateShiftKeys();
}

function updateShiftKeys(){
    let  shiftKeys=document.querySelectorAll('[data-key="ShiftLeft"], [data-key="ShiftRight"]');
    for(let i=0;i<shiftKeys.length;i++){
        if(shift){
            shiftKeys[i].style.background='rgba(255, 255, 255, 0.05)';
        }
        else{
            shiftKeys[i].style.background='rgba(255, 255, 255, 0.2)';
        }
    }
}

document.addEventListener('DOMContentLoaded',function(){
    startKeyboard();
});