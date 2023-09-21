var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var socket = null;
var error = document.querySelector('.error');
var info = document.querySelector('.info');
var modalInfo = document.querySelector('.modal-info');
var winInfoPopup = document.querySelector('.winner-info-popup');
var playerTypeSelect = document.querySelector('#player-type');
var roomIdInputEl = document.querySelector('#room-id');
var usernameInputEl = document.querySelector('#username');
var roomIdDisplayEl = document.querySelector('#room-id-display');
var connectedUsersCount = document.querySelectorAll('.connected-users');
var connectedUsersList = document.querySelector('#connected-users-list');
var connectedUserRoomIdEl = document.querySelector('#current-users-room-id');
var gameViewTypeEl = document.querySelector('#game-view-type');
var currentUserSocketId = '';
var gameViewPosition = '';
var lastPlayed = '';
// @ts-ignore
var userInfoModal = new mdb.Modal(document.getElementById('user-info-dialog'));
var settingsBtn = document.querySelector('#settings-btn');
userInfoModal.show();
var winWays = {
    0: [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8]
    ],
    1: [[1, 4, 7]],
    2: [
        [2, 4, 6],
        [2, 5, 8]
    ],
    3: [[3, 4, 5]],
    6: [[6, 7, 8]]
};
var winSlash = document.querySelector('.win-slash');
var joinSessionBtn = document.querySelector('#join-session-btn');
var roomLinkCopyBtn = document.querySelector('#room-link-copy-btn');
var sessionConnectBtn = document.querySelector('#session-connect-btn');
var connected_users = [];
var gameCount = {
    o: 0,
    x: 0
};
roomIdInputEl.value = "";
var getAllTickTaks = function () {
    var all_tick_tack_boxes = [];
    document.querySelectorAll('.tto-box').forEach(function (tickTak) { return all_tick_tack_boxes.push(tickTak); });
    return all_tick_tack_boxes;
};
playerTypeSelect.onchange = function (e) {
    updateCurrentPlayerBox(e.currentTarget.value);
};
var updateCurrentPlayerBox = function (player) {
    document.querySelectorAll('.score-items').forEach(function (item) { return item.classList.remove('current-player'); });
    document.querySelector("#".concat(player)).parentElement.classList.add('current-player');
};
var pauseGame = function (el) {
    el.innerText = 'Resume';
    el.removeEventListener('click', function () { return pauseGame(el); });
};
var reset = function () {
    winInfoPopup.querySelector('.inner').innerHTML = '';
    winInfoPopup.style.display = 'none';
    getAllTickTaks().forEach(function (tick) { return tick.querySelector('span').className = ''; });
    winSlash.className = 'win-slash';
    winSlash.style.display = 'none';
    winSlash.style.transform = 'none';
};
winInfoPopup.onclick = function () {
    if (gameViewPosition == 'spectator')
        return;
    reset();
    socket === null || socket === void 0 ? void 0 : socket.send(JSON.stringify({
        ev: 'reset-game',
        username: usernameInputEl.value,
        roomId: roomIdInputEl.value
    }));
};
var showInfo = function (msg) {
    info.querySelector('span').innerHTML = msg;
    setTimeout(function () {
        info.querySelector('span').innerHTML = "";
    }, 2000);
};
var showError = function (msg) {
    error.querySelector('span').innerHTML = msg;
    setTimeout(function () {
        error.querySelector('span').innerHTML = "";
    }, 2000);
};
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
var chekcWinV2 = function () {
    var win = [];
    var allTicks = getAllTickTaks();
    var _loop_1 = function (index) {
        if (Object.prototype.hasOwnProperty.call(winWays, index)) {
            var winDimension = winWays[index]; // like [[0,0,0]...]
            if (allTicks[index].querySelector('span').classList.length === 0)
                return "continue";
            winDimension.forEach(function (dimension) {
                if (win.length > 0)
                    return;
                console.log('dimension: ', dimension);
                var checksSet = new Set([
                    allTicks[index].querySelector('span').className,
                    allTicks[dimension[1]].querySelector('span').className,
                    allTicks[dimension[2]].querySelector('span').className,
                ]);
                if (checksSet.size === 1) {
                    win = [index, dimension, allTicks[index].querySelector('span').className];
                }
            });
            if (win.length > 0)
                return "break";
        }
    };
    for (var index in winWays) {
        var state_1 = _loop_1(index);
        if (state_1 === "break")
            break;
    }
    return win;
};
var tick = function (playedIndex, playerType) {
    var tickBoxes = getAllTickTaks();
    var playedIndexElm = tickBoxes[playedIndex];
    if (playedIndexElm.querySelector('span').classList.length > 0)
        return;
    playedIndexElm.querySelector('span').classList.add(playerType);
    playerType != playerTypeSelect.value ? showInfo('Your turn') : showInfo('the turn of player ' + (playerType == 'o' ? 'x' : 'o'));
    updateCurrentPlayerBox(playerType == 'o' ? 'x' : 'o');
    lastPlayed = playerType;
    var winData = chekcWinV2();
    if (winData.length > 0) {
        var winIndex = winData[0], winDimArr = winData[1], player_1 = winData[2];
        var firstElm = tickBoxes[winIndex];
        var lastElm = tickBoxes[winDimArr[2]];
        var firstElmHalfHeight = firstElm.clientHeight / 2;
        var lastElmHalfHeight = lastElm.clientHeight / 2;
        var firstElmOffsetTop = firstElm.parentElement.offsetTop;
        var lastElmOffsetTop = lastElm.parentElement.offsetTop;
        var firstElmOffsetLeft = firstElm.offsetLeft;
        var lastElmOffsetLeft = lastElm.offsetLeft;
        var firstElmCenter = firstElmOffsetLeft + firstElmHalfHeight;
        var lastElmCenter = lastElmOffsetLeft + lastElmHalfHeight;
        updateWinCount(player_1);
        winSlash.style.display = 'flex';
        if (lastElmOffsetLeft > firstElmOffsetLeft) {
            if (lastElmOffsetTop > firstElmOffsetTop) {
                winSlash.style.left = (firstElm.clientHeight + firstElmHalfHeight) + 'px';
                winSlash.style.top = (firstElmHalfHeight / 4) + 'px';
                winSlash.style.transform = "rotateZ(-45deg)";
            }
            else {
                winSlash.style.top = (firstElmOffsetTop + firstElmHalfHeight) + 'px';
                winSlash.style.left = 5 + 'px';
                winSlash.classList.add('horizontal');
            }
        }
        else if (firstElmOffsetLeft > lastElmOffsetLeft) {
            winSlash.style.left = (firstElm.clientHeight + firstElmHalfHeight) + 'px';
            winSlash.style.transform = "rotateZ(45deg)";
        }
        else {
            winSlash.style.left = firstElmCenter + 'px';
            winSlash.style.top = (5) + 'px';
        }
        setTimeout(function () {
            winInfoPopup.style.display = 'flex';
            winInfoPopup.querySelector('.inner').innerHTML = "\n                <div class=\"\">Player</div>\n                <div class=\"won-player-info\">".concat(player_1, "</div>\n                <div class=\"\">Wins</div>\n            ");
        }, 1000);
    }
    else if (winData.length == 0 && checkAllPlayed()) {
        setTimeout(function () {
            winInfoPopup.style.display = 'flex';
            winInfoPopup.querySelector('.inner').innerHTML = "\n                <div class=\"\">DRAW</div>\n            ";
        }, 500);
    }
};
document.querySelectorAll('.tto-box').forEach(function (box, index) {
    box.onclick = function (e) {
        e.stopPropagation();
        if (gameViewPosition == "" || connected_users.length < 2) {
            return showError('Please join a room or invite a friend to play with');
        }
        else if (gameViewPosition == "spectator") {
            return showError('You are a spectator, request to be a guest to play');
        }
        if (lastPlayed == playerTypeSelect.value)
            return showError('it is not your turn yet');
        if (playerTypeSelect.value == '') {
            userInfoModal.show();
            return modalInfo.innerHTML = 'You must select a player type';
        }
        console.log('box clicked', index, playerTypeSelect);
        tick(index, playerTypeSelect.value);
        sendMove(index, playerTypeSelect.value);
    };
});
var updateWinCount = function (player) {
    gameCount[player] += 1;
    document.querySelector(".score-count#".concat(player)).innerHTML = gameCount[player];
};
roomIdInputEl.onchange = function (e) {
    var socketId = roomIdInputEl.value;
    if (socketId != '' && socketId != currentUserSocketId && socketId.length == 6) {
        joinSessionBtn.disabled = false;
    }
    else {
        joinSessionBtn.disabled = true;
    }
};
settingsBtn.onclick = function () { return userInfoModal.show(); };
sessionConnectBtn.onclick = function (e) {
    e.stopPropagation();
    if (usernameInputEl.value == "")
        return;
    if (playerTypeSelect.value == "")
        return modalInfo.innerHTML = "Please select a Player type below";
    e.currentTarget.disabled = true;
    e.currentTarget.innerHTML = "Connecting...";
    socket = new WebSocket("ws://localhost:9800/tttg");
    // socket closed
    socket === null || socket === void 0 ? void 0 : socket.addEventListener("close", function (ev) { return handleSocketClose(ev); });
    // error handler
    socket === null || socket === void 0 ? void 0 : socket.addEventListener("error", function (ev) { return handleSocketError(ev); });
    // socket opened
    socket === null || socket === void 0 ? void 0 : socket.addEventListener("open", function (ev) { return handleSocketOpen(ev); });
    // message is received
    socket === null || socket === void 0 ? void 0 : socket.addEventListener("message", function (ev) { return handleSocketMessage(ev); });
};
var handleSocketMessage = function (event) {
    console.log('socket got message', event);
    if (!event.data)
        return;
    var data = JSON.parse(event.data);
    console.log('data', data);
    switch (data.ev) {
        case 'sess':
            var roomId = data.sessionId;
            currentUserSocketId = roomId;
            roomIdInputEl.disabled = false;
            roomIdInputEl.value = roomId;
            roomIdDisplayEl.innerHTML = roomId;
            connectedUserRoomIdEl.innerHTML = roomId;
            roomIdInputEl.placeholder = roomId;
            addConnectedUser(roomId, usernameInputEl.value);
            checkNdConnectToOtherRoom();
            gameViewTypeEl.innerHTML = "Host";
            gameViewPosition = "host";
            break;
        case 'user-joined':
            var userData = JSON.parse(data.data);
            addConnectedUser(userData.roomId, userData.username, connected_users.length >= 2 ? "spectator" : "guest");
            showInfo(userData.username + " joined room");
            if (!isUserInConnectedUsersList(roomId)) {
                sendHandShake(userData.roomId, userData.connectingTo);
            }
            break;
        case 'handshake':
            var handshakingUserData = JSON.parse(data.data);
            gameViewPosition = handshakingUserData.noOfConnectedPeople > 2 ? 'spectator' : 'guest';
            gameViewTypeEl.innerHTML = gameViewPosition;
            for (var key in handshakingUserData.gameCount) { // update score counts
                if (Object.prototype.hasOwnProperty.call(gameCount, key)) {
                    var count = handshakingUserData.gameCount[key];
                    document.querySelector(".score-count#".concat(key)).innerHTML = count;
                }
            }
            if (handshakingUserData.noOfConnectedPeople <= 2) {
                playerTypeSelect.value = handshakingUserData.playerType == 'o' ? 'x' : 'o';
                playerTypeSelect.disabled = true;
                updateCurrentPlayerBox(playerTypeSelect.value);
                showInfo('You are now playing as Player ' + playerTypeSelect.value);
            }
            addConnectedUser(handshakingUserData.roomId, handshakingUserData.username, handshakingUserData.position, handshakingUserData.noOfConnectedPeople);
            break;
        case 'player-move':
            tick(data.moveIndex, data.playerType);
            break;
        case 'reset-game':
            reset();
            showInfo(data.username + ' has reset the game board');
        default:
            break;
    }
};
var handleSocketOpen = function (event) {
    sessionConnectBtn.disabled = false;
    sessionConnectBtn.innerHTML = 'Connect';
    userInfoModal.hide();
    console.log('socket open', event);
};
var handleSocketClose = function (event) {
    console.log('socket closed', event);
};
var handleSocketError = function (event) {
    sessionConnectBtn.disabled = false;
    sessionConnectBtn.innerHTML = 'Connect';
};
var checkNdConnectToOtherRoom = function () {
    var urlQuery = window.location.search;
    if (urlQuery == "")
        return;
    var roomNameSplit = urlQuery.split("=");
    if (roomNameSplit.length == 0)
        return console.log('no url', urlQuery);
    var roomName = roomNameSplit[1];
    console.log('urlQuery', roomName);
    handleJoinRoom(roomName);
};
var handleJoinRoom = function (roomName) {
    socket === null || socket === void 0 ? void 0 : socket.send(JSON.stringify({ ev: 'join-room',
        newRoomId: roomName,
        username: usernameInputEl.value,
        mySessionId: currentUserSocketId
    }));
    roomIdInputEl.value = roomName;
    roomIdDisplayEl.innerHTML = roomName;
};
var addConnectedUser = function (roomId, username, position, noOfConnectedPeople) {
    if (isUserInConnectedUsersList(roomId))
        return;
    var uObj = {};
    uObj[roomId] = username;
    if (position != undefined) {
        uObj['position'] = position;
    }
    connected_users.push(uObj);
    updateConnectedUsersList(noOfConnectedPeople);
};
var isUserInConnectedUsersList = function (roomId) {
    var isInList = false;
    connected_users.forEach(function (user) {
        if (isInList == true)
            return;
        if (Object.keys(user).includes(roomId))
            isInList = true;
    });
    return isInList;
};
var updateConnectedUsersList = function (noOfConnectedPeople) {
    connectedUsersCount.forEach(function (el) { return el.innerHTML = connected_users.length.toString(); });
    connectedUsersList.innerHTML = "";
    connected_users.map(function (user) {
        var spanEl = document.createElement('div');
        if (Object.keys(user)[0] == currentUserSocketId) {
            console.log('noOfConnectedPeople noOfConnectedPeople', noOfConnectedPeople);
            spanEl.innerHTML = "You - " + (roomIdInputEl.value == currentUserSocketId ? "host" : gameViewPosition);
        }
        else {
            spanEl.innerHTML = Object.values(user)[0] + ' - ' + Object.values(user)[1];
        }
        connectedUsersList.append(spanEl);
    });
};
var sendHandShake = function (userSocketId, roomUserConnectedTo) {
    socket === null || socket === void 0 ? void 0 : socket.send(JSON.stringify({ ev: 'handshake',
        to: userSocketId,
        username: usernameInputEl.value,
        sessionId: currentUserSocketId,
        position: roomUserConnectedTo == currentUserSocketId ? "host" : gameViewPosition,
        playerType: playerTypeSelect.value,
        noOfConnectedPeople: connected_users.length, gameCount: gameCount
    }));
};
var sendMove = function (moveIndex, playerType) {
    socket === null || socket === void 0 ? void 0 : socket.send(JSON.stringify({
        ev: 'player-move',
        roomId: roomIdInputEl.value,
        moveIndex: moveIndex,
        playerType: playerType
    }));
};
joinSessionBtn.onclick = function (e) { return __awaiter(_this, void 0, void 0, function () {
    var newRoomId;
    return __generator(this, function (_a) {
        e.preventDefault();
        newRoomId = roomIdInputEl.value;
        handleJoinRoom(newRoomId);
        return [2 /*return*/];
    });
}); };
roomLinkCopyBtn.onclick = function (e) {
    e.stopPropagation();
    var thisBtn = e.currentTarget;
    if (currentUserSocketId == '') {
        thisBtn.innerHTML = "Not Connected";
        setTimeout(function () {
            thisBtn.innerHTML = "Click to copy room link";
        }, 1000);
        return;
    }
    var urlLink = window.location.href + '?room=' + roomIdInputEl.value;
    navigator.clipboard.writeText(urlLink);
    thisBtn.innerHTML = "Copied to Clipboard";
    setTimeout(function () {
        thisBtn.innerHTML = "Click to copy room link";
    }, 1000);
};
