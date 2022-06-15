var playerInputs = document.querySelectorAll('.player-input');
var error = document.querySelector('.error');
var info = document.querySelector('.info');
var winInfoPopup = document.querySelector('.winner-info-popup');
var startButton = document.querySelector('.start');
var replayButton = document.querySelector('.replay');
var getAllTickTaks = function () {
    var all_tick_tack_boxes = [];
    document.querySelectorAll('.tto-box').forEach(function (tickTak) { return all_tick_tack_boxes.push(tickTak); });
    return all_tick_tack_boxes;
};
var startGame = function (el) {
    playerInputs.forEach(function (input) { input.disabled = false; });
    el.innerText = 'Pause';
    el.removeEventListener('click', function () { return startGame(el); });
    el.addEventListener('click', function () { return pauseGame(el); });
};
var pauseGame = function (el) {
    playerInputs.forEach(function (input) { input.disabled = true; });
    el.innerText = 'Resume';
    el.addEventListener('click', function () { return startGame(el); });
    el.removeEventListener('click', function () { return pauseGame(el); });
};
replayButton.addEventListener('click', function (el) {
    getAllTickTaks().forEach(function (tickTak) { return tickTak.querySelector('span').className = ''; });
    playerInputs.forEach(function (input) { input.disabled = true; input.value = ''; });
    var curTarget = el.currentTarget;
    curTarget.disabled = true;
    pauseGame(startButton);
    winInfoPopup.style.display = 'none';
    info.querySelector('span').innerHTML = '';
    var removeWinClass = document.querySelector('div[class*="win-"]').classList.toString().split(' ');
    removeWinClass.splice(-1, 1);
    document.querySelector('div[class*="win-"]').className = removeWinClass.join(' ');
});
startButton.addEventListener('click', function (e) { return startGame(e.currentTarget); });
var checkAllPlayed = function () {
    var allPlayed = true;
    getAllTickTaks().forEach(function (tickTak) {
        if (allPlayed == false)
            return;
        if (tickTak.querySelector('span').className === '') {
            allPlayed = false;
        }
    });
    return allPlayed;
};
var checkWin = function () {
    var all_tick_tack_boxes = getAllTickTaks();
    var win = false;
    var result = [false, -1, ''];
    var _loop_1 = function (i) {
        var checkRow = [];
        if (i === 0) {
            checkRow.push(all_tick_tack_boxes[0].querySelector('span').className);
            if (checkRow[0] === '')
                return "continue";
            all_tick_tack_boxes.forEach(function (tickTak, index) {
                if (index === 1 || (index === 2 && win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false;
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                return "break";
            }
        }
        else if (i === 1) {
            checkRow.push(all_tick_tack_boxes[3].querySelector('span').className);
            if (checkRow[0] === '')
                return "continue";
            all_tick_tack_boxes.forEach(function (tickTak, index) {
                if (index === 4 || (index === 5 && win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false;
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                return "break";
            }
        }
        else if (i === 2) {
            checkRow.push(all_tick_tack_boxes[6].querySelector('span').className);
            if (checkRow[0] === '')
                return "continue";
            all_tick_tack_boxes.forEach(function (tickTak, index) {
                if (index === 7 || (index === 8 && win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false;
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                return "break";
            }
        }
        else if (i === 3) {
            checkRow.push(all_tick_tack_boxes[2].querySelector('span').className);
            if (checkRow[0] === '')
                return "continue";
            all_tick_tack_boxes.forEach(function (tickTak, index) {
                if (index === 5 || (index === 8 && win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false;
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                return "break";
            }
        }
        else if (i === 4) {
            checkRow.push(all_tick_tack_boxes[6].querySelector('span').className);
            if (checkRow[0] === '')
                return "continue";
            all_tick_tack_boxes.forEach(function (tickTak, index) {
                if (index === 0 || (index === 4 && win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false;
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                return "break";
            }
        }
        else if (i === 5) {
            checkRow.push(all_tick_tack_boxes[0].querySelector('span').className);
            if (checkRow[0] === '')
                return "continue";
            all_tick_tack_boxes.forEach(function (tickTak, index) {
                if (index === 4 || (index === 8 && win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false;
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                return "break";
            }
        }
        else if (i === 6) {
            checkRow.push(all_tick_tack_boxes[2].querySelector('span').className);
            if (checkRow[0] === '')
                return "continue";
            all_tick_tack_boxes.forEach(function (tickTak, index) {
                if (index === 4 || (index === 6 && win != false)) {
                    win = checkRow.includes(tickTak.querySelector('span').className) ? true : false;
                }
            });
            if (win) {
                result = [win, i, checkRow[0]];
                return "break";
            }
        }
    };
    for (var i = 0; i < 7; i++) {
        var state_1 = _loop_1(i);
        if (state_1 === "break")
            break;
    }
    return result;
};
var attachPlayEvent = function (e) {
    e.addEventListener('keyup', function (e) {
        var elemKeyEvent = e;
        var targetEl = elemKeyEvent.currentTarget;
        var regexp = /[\D]/ig;
        if (regexp.test(targetEl.value)) {
            targetEl.value = targetEl.value.replace(regexp, '');
            error.querySelector('span').innerHTML = 'Only numbers are allowed';
            return;
        }
        if (parseInt(targetEl.value) > 9 || parseInt(targetEl.value) < 1) {
            error.querySelector('span').innerHTML = 'Number must be between 1 and 9';
            return;
        }
        if (elemKeyEvent.ctrlKey && elemKeyEvent.key.toLowerCase() === 'enter') {
            error.querySelector('span').innerHTML = '';
            info.querySelector('span').innerHTML = '';
            getAllTickTaks().forEach(function (tickTak, index) {
                if (parseInt(targetEl.value) === index + 1) {
                    if (tickTak.querySelector('span').classList.contains('o') || tickTak.querySelector('span').classList.contains('x')) {
                        error.querySelector('span').innerHTML = 'Number ' + targetEl.value + ' already played';
                        return;
                    }
                    if (targetEl.classList.contains('p-1')) {
                        tickTak.querySelector('span').classList.add('o');
                    }
                    else if (targetEl.classList.contains('p-2')) {
                        tickTak.querySelector('span').classList.add('x');
                    }
                    targetEl.classList.contains('p-1') ? info.querySelector('span').innerHTML = 'Player 2 turn' :
                        info.querySelector('span').innerHTML = 'Player 1 turn';
                    targetEl.value = '';
                    playerInputs.forEach(function (input) { return input.disabled = false; });
                    targetEl.disabled = true;
                    playerInputs.forEach(function (input) { return input.focus(); });
                    var _a = checkWin(), win = _a[0], row = _a[1], player_1 = _a[2];
                    console.log(checkWin());
                    if (win) {
                        playerInputs.forEach(function (input) { return input.disabled = true; });
                        replayButton.disabled = false;
                        if (row === 0) {
                            document.querySelectorAll('.tto-inner')[0].classList.add('win-0');
                        }
                        else if (row === 1) {
                            document.querySelectorAll('.tto-inner')[1].classList.add('win-1');
                        }
                        else if (row === 2) {
                            document.querySelectorAll('.tto-inner')[2].classList.add('win-2');
                        }
                        else if (row === 3) {
                            getAllTickTaks()[2].classList.add('win-3');
                        }
                        else if (row === 4) {
                            getAllTickTaks()[6].classList.add('win-4');
                        }
                        else if (row === 5) {
                            getAllTickTaks()[4].classList.add('win-5');
                        }
                        else if (row === 6) {
                            getAllTickTaks()[4].classList.add('win-6');
                        }
                        setTimeout(function () {
                            winInfoPopup.style.display = 'flex';
                            winInfoPopup.querySelector('.inner').innerHTML = "\n                                <div class=\"\">Player</div>\n                                <div class=\"\">".concat(player_1 == 'o' ? '1' : '2', "</div>\n                                <div class=\"\">Wins</div>\n                            ");
                        }, 1000);
                    }
                    else if (!win && checkAllPlayed()) {
                        playerInputs.forEach(function (input) { return input.disabled = true; });
                        replayButton.disabled = false;
                        setTimeout(function () {
                            winInfoPopup.style.display = 'flex';
                            winInfoPopup.querySelector('.inner').innerHTML = "\n                                <div class=\"\">Game Over</div>\n                                <div class=\"\">No one wins</div>\n                            ";
                        }, 500);
                    }
                }
            });
        }
    });
};
playerInputs.forEach(attachPlayEvent);
