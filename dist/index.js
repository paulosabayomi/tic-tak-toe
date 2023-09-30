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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
var chatTextInputEl = document.querySelector('#chat-input');
var roomIdDisplayEl = document.querySelector('#room-id-display');
var connectedUsersCount = document.querySelectorAll('.connected-users');
var connectedUsersList = document.querySelector('#connected-users-list');
var connectedUserRoomIdEl = document.querySelector('#current-users-room-id');
var gameViewTypeEl = document.querySelector('#game-view-type');
var closeRightPanel = document.querySelector('#close-right-panel');
var closeLeftPanel = document.querySelector('#close-left-panel');
var currentUserSocketId = '';
var gameViewPosition = '';
var lastPlayed = '';
// @ts-ignore
var userInfoModal = new mdb.Modal(document.getElementById('user-info-dialog'));
userInfoModal.show();
var settingsBtn = document.querySelector('#settings-btn');
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
var chatTextSendBtn = document.querySelector('#send-chat-input');
var connected_users = [];
var gameCount = {
    o: 0,
    x: 0
};
roomIdInputEl.value = "";
closeLeftPanel.onclick = function (e) {
    var thisEl = e.currentTarget;
    var leftPanel = document.querySelector('#left-panel');
    if (leftPanel.classList.contains('opened')) {
        leftPanel.classList.remove('opened');
        leftPanel.classList.add('closed');
        thisEl.querySelector('i').classList.remove('fa-angle-left');
        thisEl.querySelector('i').classList.add('fa-angle-right');
    }
    else {
        leftPanel.classList.remove('closed');
        leftPanel.classList.add('opened');
        thisEl.querySelector('i').classList.remove('fa-angle-right');
        thisEl.querySelector('i').classList.add('fa-angle-left');
    }
};
closeRightPanel.onclick = function (e) {
    var thisEl = e.currentTarget;
    var rightPanel = document.querySelector('#chat-box-wrapper');
    if (rightPanel.classList.contains('opened')) {
        rightPanel.classList.remove('opened');
        rightPanel.classList.add('closed');
        thisEl.querySelector('i').classList.remove('fa-angle-right');
        thisEl.querySelector('i').classList.add('fa-angle-left');
    }
    else {
        rightPanel.classList.remove('closed');
        rightPanel.classList.add('opened');
        thisEl.querySelector('i').classList.remove('fa-angle-left');
        thisEl.querySelector('i').classList.add('fa-angle-right');
    }
};
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
    socket === null || socket === void 0 ? void 0 : socket.emit('reset-game', {
        ev: 'reset-game',
        username: usernameInputEl.value,
        roomId: roomIdInputEl.value
    });
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
    if (socketId != '' && socketId != currentUserSocketId) {
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
    // @ts-ignore
    socket = window.io('66.29.145.150:9800', {
        transports: ['websocket']
    });
    socket.on("connect_error", function (e) {
        console.log('connect_error', e);
    });
    socket.on("connect", function () {
        console.log('connected');
        var roomId = socket.id;
        currentUserSocketId = roomId;
        roomIdInputEl.disabled = false;
        roomIdInputEl.value = roomId;
        roomIdDisplayEl.innerHTML = roomId;
        connectedUserRoomIdEl.innerHTML = roomId;
        roomIdInputEl.placeholder = roomId;
        gameViewPosition = "host";
        addConnectedUser(roomId, usernameInputEl.value);
        checkNdConnectToOtherRoom();
        gameViewTypeEl.innerHTML = "Host";
        handleSocketOpen();
    });
    socket.on("user-joined", function (data) {
        addConnectedUser(data.mySessionId, data.username, connected_users.length >= 2 ? "spectator" : "guest");
        sendHandShake(data.mySessionId, data.newRoomId);
        showInfo(data.username + " joined room");
    });
    socket.on("handshake", function (data) {
        gameViewPosition = data.noOfConnectedPeople > 2 ? 'spectator' : 'guest';
        gameViewTypeEl.innerHTML = gameViewPosition;
        for (var key in data.gameCount) { // update score counts
            if (Object.prototype.hasOwnProperty.call(gameCount, key)) {
                var count = data.gameCount[key];
                document.querySelector(".score-count#".concat(key)).innerHTML = count;
            }
        }
        if (data.noOfConnectedPeople <= 2) {
            playerTypeSelect.value = data.playerType == 'o' ? 'x' : 'o';
            playerTypeSelect.disabled = true;
            updateCurrentPlayerBox(playerTypeSelect.value);
            showInfo('You are now playing as Player ' + playerTypeSelect.value);
        }
        data.moves.forEach(function (move) { return tick(move[0], move[1]); });
        addConnectedUser(data.sessionId, data.username, data.position, data.noOfConnectedPeople);
    });
    socket.on("make-guest", function (data) {
        if (data.drop.room_id == currentUserSocketId) {
            gameViewPosition = 'spectator';
            updateUserPosition(currentUserSocketId, 'spectator');
            showInfo(data.by.username + ' made you a Spectator and you can no longer participate in the game');
        }
        else if (data.for.room_id == currentUserSocketId) {
            var playAs = data.by.playingAs == 'o' ? 'x' : 'o';
            gameViewPosition = 'guest';
            updateUserPosition(data.for.room_id, 'guest');
            playerTypeSelect.value = playAs;
            playerTypeSelect.disabled = true;
            showInfo(data.by.username + ' made you a guest and you can now participate in the game, and you are now playing as ' + playAs);
        }
        else {
            showInfo("".concat(data.by.username, " made ").concat(data.for.username, " a guest to replace ").concat(data.drop.username));
        }
        updateUserPosition(data.drop.room_id, 'spectator');
        updateUserPosition(data.for.room_id, 'guest');
    });
    socket.on("chat-msg", function (data) {
        addMessageToUI(data.username, data.msg);
    });
    socket.on("reset-game", function (data) {
        reset();
        showInfo(data.username + ' has reset the game board');
    });
    socket.on("player-move", function (data) {
        tick(data.moveIndex, data.playerType);
    });
};
var handleSocketOpen = function (event) {
    sessionConnectBtn.disabled = false;
    sessionConnectBtn.innerHTML = 'Connect';
    userInfoModal.hide();
};
var addMessageToUI = function (senderName, message) {
    var chatBoxWrapperCont = document.querySelector('#chat-box-wrapper');
    var messageBoxCont = document.querySelector('.message-box-cont');
    var messageBox = document.createElement('div');
    messageBox.className = 'message-box d-block px-2 mt-1 w-100';
    messageBox.innerHTML = "\n        <div class=\"sender-name\">".concat(senderName, "</div>\n        <small class=\"sender-msg\">").concat(message, "</small>\n    ");
    messageBoxCont.append(messageBox);
    chatBoxWrapperCont.scrollTop = chatBoxWrapperCont.scrollHeight;
};
var updateUserPosition = function (socketId, position) {
    var clonedConnectedUsers = __spreadArray([], connected_users, true);
    var removedUserDataIndex = clonedConnectedUsers.findIndex(function (user) { return user.room_id == socketId; });
    var filteredData = clonedConnectedUsers.filter(function (user) { return user.room_id != socketId; });
    var userToUpdate = clonedConnectedUsers[removedUserDataIndex];
    userToUpdate.position = position;
    filteredData.splice(removedUserDataIndex, 0, userToUpdate);
    connected_users = filteredData;
    updateConnectedUsersList();
};
/** @todo handle disconnect when user has disconnected */
var handleSocketClose = function (event) {
};
var getMoves = function () {
    var tickBoxes = getAllTickTaks();
    var playedIndex = [];
    tickBoxes.forEach(function (tick, index) {
        if (tick.querySelector('span').classList.length > 0) {
            playedIndex.push([index, tick.querySelector('span').className]);
        }
    });
    return playedIndex;
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
        return;
    var roomName = roomNameSplit[1];
    handleJoinRoom(roomName);
};
var handleJoinRoom = function (roomName) {
    socket.emit('join-room', { ev: 'join-room',
        newRoomId: roomName,
        username: usernameInputEl.value,
        mySessionId: currentUserSocketId
    });
    roomIdInputEl.value = roomName;
    roomIdDisplayEl.innerHTML = roomName;
};
var addConnectedUser = function (roomId, username, position, noOfConnectedPeople) {
    if (isUserInConnectedUsersList(roomId))
        return;
    var uObj = {};
    uObj.room_id = roomId;
    uObj.username = username;
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
        if (user.room_id == roomId)
            isInList = true;
    });
    return isInList;
};
var updateConnectedUsersList = function (noOfConnectedPeople) {
    connectedUsersCount.forEach(function (el) { return el.innerHTML = connected_users.length.toString(); });
    connectedUsersList.innerHTML = "";
    connected_users.map(function (user) {
        var userListContainer = document.createElement('div');
        userListContainer.className = "d-flex justify-content-between";
        var spanEl = document.createElement('div');
        if (user.room_id == currentUserSocketId) {
            spanEl.innerHTML = "You - " + gameViewPosition;
        }
        else {
            spanEl.innerHTML = user.username + ' - ' + user.position;
        }
        userListContainer.append(spanEl);
        if (((roomIdInputEl.value == currentUserSocketId || gameViewPosition.toLowerCase() == "guest")
            && user.room_id != currentUserSocketId)
            && (user.position != 'host' && user.position != 'guest')) {
            var makeUserGuestBtn = document.createElement('div');
            makeUserGuestBtn.className = "rounded bg-info px-2 py-1 mb-2";
            makeUserGuestBtn.innerHTML = "<small style=\"font-size: 70% !important;\">Make guest</small>";
            makeUserGuestBtn.onclick = function (e) {
                var whoToSetAsSpectator = connected_users.filter(function (user) { return (user.room_id != currentUserSocketId && (user.position == 'guest' || user.position == 'host')); });
                socket === null || socket === void 0 ? void 0 : socket.emit('make-guest', {
                    ev: "make-guest",
                    roomId: roomIdInputEl.value,
                    for: { room_id: user.room_id, username: user.username },
                    drop: { room_id: whoToSetAsSpectator[0].room_id, username: whoToSetAsSpectator[0].username },
                    by: { username: usernameInputEl.value, socket_id: currentUserSocketId, playingAs: playerTypeSelect.value }
                });
                updateUserPosition(user.room_id, 'guest');
                updateUserPosition(whoToSetAsSpectator[0].room_id, 'spectator');
            };
            userListContainer.append(makeUserGuestBtn);
        }
        connectedUsersList.append(userListContainer);
    });
};
var sendHandShake = function (userSocketId, roomUserConnectedTo) {
    socket.emit('handshake', { ev: 'handshake',
        sendTo: userSocketId,
        username: usernameInputEl.value,
        sessionId: currentUserSocketId,
        position: roomUserConnectedTo == currentUserSocketId ? "host" : gameViewPosition,
        playerType: playerTypeSelect.value,
        noOfConnectedPeople: connected_users.length, gameCount: gameCount, moves: getMoves() });
};
var sendMove = function (moveIndex, playerType) {
    socket === null || socket === void 0 ? void 0 : socket.emit('player-move', {
        ev: 'player-move',
        roomId: roomIdInputEl.value,
        moveIndex: moveIndex,
        playerType: playerType
    });
};
joinSessionBtn.onclick = function (e) { return __awaiter(_this, void 0, void 0, function () {
    var newRoomId;
    return __generator(this, function (_a) {
        e.preventDefault();
        newRoomId = roomIdInputEl.value;
        handleJoinRoom(newRoomId);
        window.history.pushState({}, '', window.location.origin);
        window.history.pushState({}, '', '?room=' + newRoomId);
        userInfoModal.hide();
        return [2 /*return*/];
    });
}); };
chatTextInputEl.onkeydown = function (e) {
    if (e.key.toLowerCase() == "enter") {
        sendMessage();
    }
};
chatTextSendBtn.onclick = function (e) {
    e.preventDefault();
    sendMessage();
};
var sendMessage = function () {
    if (chatTextInputEl.value == "" || socket == null)
        return;
    socket === null || socket === void 0 ? void 0 : socket.emit('chat-msg', {
        ev: 'chat-msg',
        username: usernameInputEl.value,
        roomId: roomIdInputEl.value,
        msg: chatTextInputEl.value
    });
    addMessageToUI("You", chatTextInputEl.value);
    chatTextInputEl.value = "";
};
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
