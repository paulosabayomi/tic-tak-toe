const playerInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.player-input');
const error: HTMLElement = document.querySelector('.error');
const info: HTMLElement = document.querySelector('.info');

const getAllTickTaks = (): Array<Element> => {
    let all_tick_tack_boxes: Array<Element> = []
    document.querySelectorAll('.tto-box').forEach(tickTak => all_tick_tack_boxes.push(tickTak));
    return all_tick_tack_boxes;
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
                }
            })       
        }
    })

}

playerInputs.forEach(attachPlayEvent);