const playerInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.player-input');
const error: HTMLElement = document.querySelector('.error');
const info: HTMLElement = document.querySelector('.info');
const winInfoPopup: HTMLElement = document.querySelector('.winner-info-popup');
const startButton: HTMLButtonElement = document.querySelector('.start');
const replayButton: HTMLButtonElement = document.querySelector('.replay');

const getAllTickTaks = (): Array<Element> => {
    let all_tick_tack_boxes: Array<Element> = []
    document.querySelectorAll('.tto-box').forEach(tickTak => all_tick_tack_boxes.push(tickTak));
    return all_tick_tack_boxes;
}

const startGame = (el: HTMLButtonElement): void => {
    playerInputs.forEach(input => {input.disabled = false});
    el.innerText = 'Pause';
    el.removeEventListener('click', () => startGame(el));
    el.addEventListener('click', () => pauseGame(el));
}

const pauseGame = (el: HTMLButtonElement): void => {
    playerInputs.forEach(input => {input.disabled = true});
    el.innerText = 'Resume';
    el.addEventListener('click', () => startGame(el));
    el.removeEventListener('click', () => pauseGame(el));
}

replayButton.addEventListener('click', el => {
    getAllTickTaks().forEach(tickTak => tickTak.querySelector('span').className = '');
    playerInputs.forEach(input => {input.disabled = true; input.value = ''});
    const curTarget = el.currentTarget as HTMLButtonElement;
    curTarget.disabled = true;  
    pauseGame(startButton);  
    winInfoPopup.style.display = 'none';
    info.querySelector('span').innerHTML = '';
    const removeWinClass: string[] = document.querySelector('div[class*="win-"]').classList.toString().split(' ')
    removeWinClass.splice(-1, 1);
    document.querySelector('div[class*="win-"]').className = removeWinClass.join(' ');
})

startButton.addEventListener('click', e => startGame(e.currentTarget as HTMLButtonElement));

const checkWin = (): [boolean, number, string] => {
    const all_tick_tack_boxes: Array<Element> = getAllTickTaks();
    let win: boolean = false;
    let result: [boolean, number, string] = [false, -1, ''];
    for (let i = 0; i < 7; i++) {
        const checkRow: string[] = [];
        if (i === 0) {
            checkRow.push(all_tick_tack_boxes[0].querySelector('span').className);
            if (checkRow[0] === '') continue; 
            all_tick_tack_boxes.forEach((tickTak: Element, index: number): void => {
                if (index === 1 || (index === 2 && win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                break;
            }
        }else if (i === 1) {
            checkRow.push(all_tick_tack_boxes[3].querySelector('span').className);
            if (checkRow[0] === '') continue; 
            all_tick_tack_boxes.forEach((tickTak: Element, index: number): void => {
                if (index === 4 || (index === 5 &&  win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                break;
            }
        }else if (i === 2) {
            checkRow.push(all_tick_tack_boxes[6].querySelector('span').className);
            if (checkRow[0] === '') continue; 
            all_tick_tack_boxes.forEach((tickTak: Element, index: number): void => {
                if (index === 7 || (index === 8 &&  win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                break;
            }
        }else if (i === 3) {
            checkRow.push(all_tick_tack_boxes[2].querySelector('span').className);
            if (checkRow[0] === '') continue; 
            all_tick_tack_boxes.forEach((tickTak: Element, index: number): void => {
                if (index === 5 || (index === 8 &&  win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                break;
            }
        }else if (i === 4) {
            checkRow.push(all_tick_tack_boxes[6].querySelector('span').className);
            if (checkRow[0] === '') continue; 
            all_tick_tack_boxes.forEach((tickTak: Element, index: number): void => {
                if (index === 0 || (index === 4 &&  win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                break;
            }
        }else if (i === 5) {
            checkRow.push(all_tick_tack_boxes[0].querySelector('span').className);
            if (checkRow[0] === '') continue; 
            all_tick_tack_boxes.forEach((tickTak: Element, index: number): void => {
                if (index === 4 || (index === 8 &&  win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                break;
            }
        }else if (i === 6) {
            checkRow.push(all_tick_tack_boxes[2].querySelector('span').className);
            if (checkRow[0] === '') continue; 
            all_tick_tack_boxes.forEach((tickTak: Element, index: number): void => {
                if (index === 4 || (index === 6 &&  win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                break;
            }
        }
        
    }

    return result;
}

const attachPlayEvent = (e: HTMLInputElement): void => {

    e.addEventListener('keyup', function(e): void {
        const elemKeyEvent = e as KeyboardEvent;
        const targetEl = elemKeyEvent.currentTarget as HTMLInputElement;
    
        const regexp = /[\D]/ig
        if (regexp.test(targetEl.value)) {
            targetEl.value = targetEl.value.replace(regexp, '');
            error.querySelector('span').innerHTML = 'Only numbers are allowed';
            return
        }
    
        if (parseInt(targetEl.value) > 9 || parseInt(targetEl.value) < 1) {
            error.querySelector('span').innerHTML = 'Number must be between 1 and 9';
            return        
        }
    
        if (elemKeyEvent.ctrlKey && elemKeyEvent.key.toLowerCase() === 'enter') {
            error.querySelector('span').innerHTML = '';
            info.querySelector('span').innerHTML = ''
    
            getAllTickTaks().forEach((tickTak: Element, index: number) => {
                if (parseInt(targetEl.value) === index + 1) {
                    if (tickTak.querySelector('span').classList.contains('o') || tickTak.querySelector('span').classList.contains('x')) {
                        error.querySelector('span').innerHTML = 'Number ' + targetEl.value + ' already played';
                        return               
                    }
    
                    if (targetEl.classList.contains('p-1')) {
                        tickTak.querySelector('span').classList.add('o');
                    }else if (targetEl.classList.contains('p-2')) {
                        tickTak.querySelector('span').classList.add('x');                    
                    }
    
                    targetEl.classList.contains('p-1') ? info.querySelector('span').innerHTML = 'Player 2 turn' : 
                        info.querySelector('span').innerHTML = 'Player 1 turn';
                    
                    targetEl.value = '';

                    playerInputs.forEach(input => input.disabled = false);
                    targetEl.disabled = true;
                    playerInputs.forEach(input => input.focus());

                    const [win, row, player] = checkWin();
                    console.log(checkWin())
                    if (win) {
                        // info.querySelector('span').innerHTML = 'Player ' + player + ' wins';
                        playerInputs.forEach(input => input.disabled = true);
                        replayButton.disabled = false;

                        if (row === 0) {
                            document.querySelectorAll('.tto-inner')[0].classList.add('win-0');
                        }else if (row === 1) {
                            document.querySelectorAll('.tto-inner')[1].classList.add('win-1');
                        }else if (row === 2) {
                            document.querySelectorAll('.tto-inner')[2].classList.add('win-2');
                        }else if (row === 3) {
                            getAllTickTaks()[2].classList.add('win-3');
                        }else if (row === 4) {
                            getAllTickTaks()[6].classList.add('win-4');
                        }else if (row === 5) {
                            getAllTickTaks()[4].classList.add('win-5');
                        }

                        winInfoPopup.style.display = 'flex';
                        winInfoPopup.querySelector('.inner div:nth-child(2)').innerHTML = player == 'o' ? '1' : '2';
                    }                      

                }
            })       
        }
    })

}

playerInputs.forEach(attachPlayEvent);