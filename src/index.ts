let socket: null | WebSocket = null
const error: HTMLElement = document.querySelector('.error');
const info: HTMLElement = document.querySelector('.info');
const modalInfo: HTMLElement = document.querySelector('.modal-info');
const winInfoPopup: HTMLElement = document.querySelector('.winner-info-popup');
const playerTypeSelect = document.querySelector('#player-type') as HTMLInputElement
const roomIdInputEl = document.querySelector('#room-id') as HTMLInputElement
const usernameInputEl = document.querySelector('#username') as HTMLInputElement
const chatTextInputEl = document.querySelector('#chat-input') as HTMLInputElement
const roomIdDisplayEl = document.querySelector('#room-id-display') as HTMLSpanElement
const connectedUsersCount = document.querySelectorAll('.connected-users') as NodeListOf<HTMLSpanElement>
const connectedUsersList = document.querySelector('#connected-users-list') as HTMLSpanElement
const connectedUserRoomIdEl = document.querySelector('#current-users-room-id') as HTMLSpanElement
const gameViewTypeEl = document.querySelector('#game-view-type') as HTMLSpanElement
const closeRightPanel = document.querySelector('#close-right-panel') as HTMLDivElement
const closeLeftPanel = document.querySelector('#close-left-panel') as HTMLDivElement
let currentUserSocketId = ''
type TGameViewPosition = 'spectator' | 'guest' | 'host'
let gameViewPosition: TGameViewPosition | '' = ''
let lastPlayed: string = ''
// @ts-ignore
const userInfoModal = new mdb.Modal(document.getElementById('user-info-dialog'))
userInfoModal.show()
const settingsBtn = document.querySelector('#settings-btn') as HTMLDivElement
const winWays = {
    0: [
        [0,1,2], 
        [0,3,6], 
        [0,4,8]
    ],
    1: [[1,4,7]],
    2: [
        [2,4,6], 
        [2,5,8]
    ],
    3: [[3,4,5]],
    6: [[6,7,8]]
}
const winSlash = document.querySelector('.win-slash') as HTMLDivElement
const joinSessionBtn = document.querySelector('#join-session-btn') as HTMLButtonElement
const roomLinkCopyBtn = document.querySelector('#room-link-copy-btn') as HTMLButtonElement
const sessionConnectBtn = document.querySelector('#session-connect-btn') as HTMLButtonElement
const chatTextSendBtn = document.querySelector('#send-chat-input') as HTMLButtonElement
type TConnectedUsers = {username: string; room_id: string; position?: TGameViewPosition;}
let connected_users: Array<TConnectedUsers> = []
const gameCount = {
    o: 0,
    x: 0
}

roomIdInputEl.value = ""

closeLeftPanel.onclick = (e) => {
    const thisEl = e.currentTarget as HTMLDivElement
    const leftPanel = document.querySelector('#left-panel')
    if (leftPanel.classList.contains('opened')) {
        leftPanel.classList.remove('opened')
        leftPanel.classList.add('closed')
        thisEl.querySelector('i').classList.remove('fa-angle-left')
        thisEl.querySelector('i').classList.add('fa-angle-right')
    }else{
        leftPanel.classList.remove('closed')
        leftPanel.classList.add('opened')
        thisEl.querySelector('i').classList.remove('fa-angle-right')
        thisEl.querySelector('i').classList.add('fa-angle-left')
    }
}

closeRightPanel.onclick = (e) => {
    const thisEl = e.currentTarget as HTMLDivElement
    const rightPanel = document.querySelector('#chat-box-wrapper')
    if (rightPanel.classList.contains('opened')) {
        rightPanel.classList.remove('opened')
        rightPanel.classList.add('closed')
        thisEl.querySelector('i').classList.remove('fa-angle-right')
        thisEl.querySelector('i').classList.add('fa-angle-left')
    }else{
        rightPanel.classList.remove('closed')
        rightPanel.classList.add('opened')
        thisEl.querySelector('i').classList.remove('fa-angle-left')
        thisEl.querySelector('i').classList.add('fa-angle-right')
    }
}

const getAllTickTaks = (): Array<HTMLDivElement> => {
    let all_tick_tack_boxes: Array<HTMLDivElement> = []
    document.querySelectorAll('.tto-box').forEach((tickTak: HTMLDivElement) => all_tick_tack_boxes.push(tickTak));
    return all_tick_tack_boxes;
}

playerTypeSelect.onchange = (e) => {
    updateCurrentPlayerBox((e.currentTarget as HTMLSelectElement).value)
}

const updateCurrentPlayerBox = (player: string) => {
    document.querySelectorAll('.score-items').forEach(item => item.classList.remove('current-player'))
    document.querySelector(`#${player}`).parentElement.classList.add('current-player')
}

const pauseGame = (el: HTMLButtonElement): void => {
    el.innerText = 'Resume';
    el.removeEventListener('click', () => pauseGame(el));
}

const reset = () => {
    winInfoPopup.querySelector('.inner').innerHTML = ''
    winInfoPopup.style.display = 'none'
    getAllTickTaks().forEach(tick => tick.querySelector('span').className = '')
    winSlash.className = 'win-slash'
    winSlash.style.display = 'none'
    winSlash.style.transform = 'none'
}

winInfoPopup.onclick = () => {
    if (gameViewPosition == 'spectator') return;
    reset()
    socket?.send(JSON.stringify({
        ev: 'reset-game',
        username: usernameInputEl.value,
        roomId: roomIdInputEl.value
    }))
}

const showInfo = (msg: string) => {
    info.querySelector('span').innerHTML = msg;
    setTimeout(() => {
        info.querySelector('span').innerHTML = ""
    }, 2000);
}

const showError = (msg: string) => {
    error.querySelector('span').innerHTML = msg
    setTimeout(() => {
        error.querySelector('span').innerHTML = ""
    }, 2000);
}

const checkAllPlayed = (): boolean => {
    let allPlayed: boolean = true;
    getAllTickTaks().forEach(tickTak => {
        if (allPlayed == false) return;
        if (tickTak.querySelector('span').className === '') {
            allPlayed = false;
        }
    })
    return allPlayed;
}

const chekcWinV2 = () => {
    let win = []
    const allTicks = getAllTickTaks()
    for (const index in winWays) {
        if (Object.prototype.hasOwnProperty.call(winWays, index)) {
            const winDimension: [] = winWays[index]; // like [[0,0,0]...]
            if (allTicks[index].querySelector('span').classList.length === 0) continue
            winDimension.forEach((dimension: Array<number>) => { 
                if (win.length > 0) return
                console.log('dimension: ', dimension);
                const checksSet = new Set([
                    allTicks[index].querySelector('span').className, 
                    allTicks[dimension[1]].querySelector('span').className,
                    allTicks[dimension[2]].querySelector('span').className,
                ])

                if (checksSet.size === 1) {
                    win = [index, dimension, allTicks[index].querySelector('span').className]
                }
                
            })
            if (win.length > 0) break
        }
    }
    return win
}

const tick = (playedIndex: number, playerType: string): void => {
    const tickBoxes = getAllTickTaks()

    const playedIndexElm = tickBoxes[playedIndex]

    if (playedIndexElm.querySelector('span').classList.length > 0) return
    
    playedIndexElm.querySelector('span').classList.add(playerType);   
    
    playerType != playerTypeSelect.value ? showInfo('Your turn') : showInfo('the turn of player ' + (playerType == 'o' ? 'x' : 'o'));
    updateCurrentPlayerBox(playerType == 'o' ? 'x' : 'o')
    lastPlayed = playerType

    const winData = chekcWinV2()
    if (winData.length > 0) {
        const [winIndex, winDimArr, player] = winData
        const firstElm = tickBoxes[winIndex]
        const lastElm = tickBoxes[winDimArr[2]]

        const firstElmHalfHeight = firstElm.clientHeight / 2
        const lastElmHalfHeight = lastElm.clientHeight / 2

        const firstElmOffsetTop = firstElm.parentElement.offsetTop
        const lastElmOffsetTop = lastElm.parentElement.offsetTop

        const firstElmOffsetLeft = firstElm.offsetLeft
        const lastElmOffsetLeft = lastElm.offsetLeft

        const firstElmCenter = firstElmOffsetLeft + firstElmHalfHeight
        const lastElmCenter = lastElmOffsetLeft + lastElmHalfHeight

        updateWinCount(player)

        winSlash.style.display = 'flex'
        if (lastElmOffsetLeft > firstElmOffsetLeft) {
            if (lastElmOffsetTop > firstElmOffsetTop) {
                winSlash.style.left = (firstElm.clientHeight + firstElmHalfHeight) + 'px'
                winSlash.style.top = (firstElmHalfHeight / 4) + 'px'
                winSlash.style.transform = `rotateZ(-45deg)`                                
            }else{
                winSlash.style.top = (firstElmOffsetTop + firstElmHalfHeight) + 'px'
                winSlash.style.left = 5 + 'px'
                winSlash.classList.add('horizontal')
            }
            
        }else if (firstElmOffsetLeft > lastElmOffsetLeft){
            winSlash.style.left = (firstElm.clientHeight + firstElmHalfHeight) + 'px'
            winSlash.style.transform = `rotateZ(45deg)`                                
        }else{
            winSlash.style.left = firstElmCenter + 'px'
            winSlash.style.top = (5) + 'px'
        }
        
        setTimeout(() => {
            winInfoPopup.style.display = 'flex';
            winInfoPopup.querySelector('.inner').innerHTML = `
                <div class="">Player</div>
                <div class="won-player-info">${player}</div>
                <div class="">Wins</div>
            `;
        }, 1000);
    }else if (winData.length == 0 && checkAllPlayed()) {
        setTimeout(() => {
            winInfoPopup.style.display = 'flex';
            winInfoPopup.querySelector('.inner').innerHTML = `
                <div class="">DRAW</div>
            `;
        }, 500);

    } 
                        

}

document.querySelectorAll('.tto-box').forEach((box: HTMLDivElement, index: number) => {
    box.onclick = (e) => {
        e.stopPropagation()
        if (gameViewPosition == "" || connected_users.length < 2) {
            return showError('Please join a room or invite a friend to play with')
        }else if (gameViewPosition == "spectator") {
            return showError('You are a spectator, request to be a guest to play')
        }
        if (lastPlayed == playerTypeSelect.value) return showError('it is not your turn yet')
        if (playerTypeSelect.value == '') {
            userInfoModal.show();
            return modalInfo.innerHTML = 'You must select a player type';            
        }
        console.log('box clicked', index, playerTypeSelect);
        tick(index, playerTypeSelect.value)
        sendMove(index, playerTypeSelect.value)                 
    }
})

const updateWinCount = (player: string) => {
    gameCount[player] += 1;
    document.querySelector(`.score-count#${player}`).innerHTML = gameCount[player];
}


roomIdInputEl.onchange = (e) => {
    const socketId = roomIdInputEl.value
    if (socketId != '' && socketId != currentUserSocketId && socketId.length == 6) {
        joinSessionBtn.disabled = false
    }else{
        joinSessionBtn.disabled = true
    }
}

settingsBtn.onclick = () => userInfoModal.show()

sessionConnectBtn.onclick = (e) => {
    e.stopPropagation()
    if (usernameInputEl.value == "") return;
    if (playerTypeSelect.value == "") return modalInfo.innerHTML = "Please select a Player type below";
    (e.currentTarget as HTMLButtonElement).disabled = true;
    (e.currentTarget as HTMLButtonElement).innerHTML = "Connecting..."
    socket = new WebSocket("ws://localhost:9800/tttg");

    // socket closed
    socket?.addEventListener("close", (ev) => handleSocketClose(ev));

    // error handler
    socket?.addEventListener("error", (ev) => handleSocketError(ev));

    // socket opened
    socket?.addEventListener("open", (ev) => handleSocketOpen(ev));

    // message is received
    socket?.addEventListener("message", (ev) => handleSocketMessage(ev));
}

const handleSocketMessage = (event: any) => {
    console.log('socket got message', event);
    if (!event.data) return
    const data = JSON.parse(event.data)
    console.log('data', data);

    switch (data.ev) {
        case 'sess':
            const roomId = data.sessionId;
            currentUserSocketId = roomId
            roomIdInputEl.disabled = false;
            roomIdInputEl.value = roomId;
            roomIdDisplayEl.innerHTML = roomId
            connectedUserRoomIdEl.innerHTML = roomId;
            roomIdInputEl.placeholder = roomId;
            gameViewPosition = "host";
            addConnectedUser(roomId, usernameInputEl.value);
            checkNdConnectToOtherRoom();
            gameViewTypeEl.innerHTML = "Host";
            break;

        case 'user-joined':
            const userData = JSON.parse(data.data)
            addConnectedUser(userData.roomId, userData.username, connected_users.length >= 2 ? "spectator" : "guest")
            showInfo(userData.username + " joined room")
            if (!isUserInConnectedUsersList(roomId)) {
                sendHandShake(userData.roomId, userData.connectingTo)
            }
            break;

        case 'handshake':
            const handshakingUserData = JSON.parse(data.data);
            gameViewPosition = handshakingUserData.noOfConnectedPeople > 2 ? 'spectator' : 'guest'
            gameViewTypeEl.innerHTML = gameViewPosition;
            for (const key in handshakingUserData.gameCount) { // update score counts
                if (Object.prototype.hasOwnProperty.call(gameCount, key)) {
                    const count = handshakingUserData.gameCount[key];
                    document.querySelector(`.score-count#${key}`).innerHTML = count;
                }
            }
            if (handshakingUserData.noOfConnectedPeople <= 2) {
                playerTypeSelect.value = handshakingUserData.playerType == 'o' ? 'x' : 'o'
                playerTypeSelect.disabled = true
                updateCurrentPlayerBox(playerTypeSelect.value)
                showInfo('You are now playing as Player ' + playerTypeSelect.value)
            }
            handshakingUserData.moves.forEach(move => tick(move[0], move[1]))
            addConnectedUser(handshakingUserData.roomId, handshakingUserData.username, handshakingUserData.position, handshakingUserData.noOfConnectedPeople)
            break;

        case 'player-move':
            tick(data.moveIndex, data.playerType)
            break;
        
        case 'reset-game':
            reset();
            showInfo(data.username + ' has reset the game board');
            break;

        case 'chat-msg':
            console.log('got chat message', data);
            addMessageToUI(data.username, data.msg)
            break;

        case 'make-guest':
            console.log('got to make-guest', data);
            if (data.drop.room_id == currentUserSocketId) {
                gameViewPosition = 'spectator'
                updateUserPosition(currentUserSocketId, 'spectator')
                showInfo(data.by.username + ' made you a Spectator and you can no longer participate in the game')
            }else if (data.for.room_id == currentUserSocketId) {
                const playAs = data.by.playingAs == 'o' ? 'x' : 'o'
                gameViewPosition = 'guest'
                updateUserPosition(data.for.room_id, 'guest')
                playerTypeSelect.value = playAs
                playerTypeSelect.disabled = true
                showInfo(data.by.username + ' made you a guest and you can now participate in the game, and you are now playing as ' + playAs)
            }else{
                showInfo(`${data.by.username} made ${data.for.username} a guest to replace ${data.drop.username}`)
            }

            updateUserPosition(data.drop.room_id, 'spectator')
            updateUserPosition(data.for.room_id, 'guest')
            break;
    
        default:
            break;
    }

    

}

const handleSocketOpen = (event: any) => {
    sessionConnectBtn.disabled = false
    sessionConnectBtn.innerHTML = 'Connect'
    userInfoModal.hide()
    console.log('socket open', event);
}

const addMessageToUI = (senderName: string, message: string) => {
    const chatBoxWrapperCont = document.querySelector('#chat-box-wrapper')
    const messageBoxCont = document.querySelector('.message-box-cont')
    const messageBox = document.createElement('div')
    messageBox.className = 'message-box d-block px-2 mt-1 w-100'
    messageBox.innerHTML = `
        <div class="sender-name">${senderName}</div>
        <small class="sender-msg">${message}</small>
    `
    messageBoxCont.append(messageBox)
    chatBoxWrapperCont.scrollTop = chatBoxWrapperCont.scrollHeight
}

const updateUserPosition = (socketId: string, position: string) => {
    const clonedConnectedUsers = [...connected_users]
    const removedUserDataIndex = clonedConnectedUsers.findIndex(user => user.room_id == socketId)
    const filteredData = clonedConnectedUsers.filter(user => user.room_id != socketId)
    const userToUpdate = clonedConnectedUsers[removedUserDataIndex]
    console.log('userToUpdate', userToUpdate, 'position', position, 'socketId', socketId);
    
    userToUpdate.position = position as TGameViewPosition
    filteredData.splice(removedUserDataIndex, 0, userToUpdate)
    connected_users = filteredData
    updateConnectedUsersList()
}

const handleSocketClose = (event: any) => {
    console.log('socket closed', event);
    socket?.send(JSON.stringify({ev: 'user-left', username: usernameInputEl}))
}

const getMoves = (): Array<any> => {
    const tickBoxes = getAllTickTaks()
    const playedIndex: Array<any> = []
    tickBoxes.forEach((tick, index) => {
        if (tick.querySelector('span').classList.length > 0) {
            playedIndex.push([index, tick.querySelector('span').className])
        }
    })
    return playedIndex;
}

const handleSocketError = (event: any) => {
    sessionConnectBtn.disabled = false
    sessionConnectBtn.innerHTML = 'Connect'
}

const checkNdConnectToOtherRoom = () => {
    const urlQuery = window.location.search
    if (urlQuery == "") return
    const roomNameSplit = urlQuery.split("=")
    if (roomNameSplit.length == 0) return console.log('no url', urlQuery);
    const roomName = roomNameSplit[1]
    console.log('urlQuery', roomName);
    handleJoinRoom(roomName)
}

const handleJoinRoom = (roomName: string) => {
    socket?.send(JSON.stringify({ev: 'join-room', 
        newRoomId: roomName, 
        username: usernameInputEl.value,
        mySessionId: currentUserSocketId
    }));
    roomIdInputEl.value = roomName
    roomIdDisplayEl.innerHTML = roomName
}

const addConnectedUser = (roomId: string, username: string, position?: string, noOfConnectedPeople?: number) => {
    if (isUserInConnectedUsersList(roomId)) return;
    const uObj = {} as TConnectedUsers
    uObj.room_id = roomId;
    uObj.username = username;
    if (position != undefined) {
        uObj['position'] = position as TGameViewPosition;
    }
    connected_users.push(uObj)
    updateConnectedUsersList(noOfConnectedPeople)
}

const isUserInConnectedUsersList = (roomId: string) => {
    let isInList = false
    connected_users.forEach(user => {
        if (isInList == true) return;
        if (user.room_id == roomId) isInList = true;
    })
    return isInList
}

const updateConnectedUsersList = (noOfConnectedPeople?: number) => {
    connectedUsersCount.forEach(el => el.innerHTML = connected_users.length.toString())
    connectedUsersList.innerHTML = ""
    console.log('connected_users', connected_users);
    
    connected_users.map(user => {
        const userListContainer = document.createElement('div')
        userListContainer.className = "d-flex justify-content-between"
        const spanEl = document.createElement('div')
        if (user.room_id == currentUserSocketId) {
            console.log('noOfConnectedPeople noOfConnectedPeople', noOfConnectedPeople);
            // spanEl.innerHTML = "You - " + (roomIdInputEl.value == currentUserSocketId ? "host" : gameViewPosition)
            spanEl.innerHTML = "You - " + gameViewPosition
        }else{
            spanEl.innerHTML = user.username + ' - ' + user.position
        }
        userListContainer.append(spanEl)
        if (((roomIdInputEl.value == currentUserSocketId || gameViewPosition.toLowerCase() == "guest") 
            && user.room_id != currentUserSocketId) 
            && (user.position != 'host' && user.position != 'guest')) {
            const makeUserGuestBtn = document.createElement('div')
            makeUserGuestBtn.className = "rounded bg-info px-2 py-1 mb-2"
            makeUserGuestBtn.innerHTML = `<small style="font-size: 70% !important;">Make guest</small>`
            makeUserGuestBtn.onclick = (e) => {
                let whoToSetAsSpectator = connected_users.filter(user => (user.room_id != currentUserSocketId && (user.position == 'guest' || user.position == 'host')))
                console.log('whoToSetAsSpectator', whoToSetAsSpectator);
                
                socket?.send(JSON.stringify({
                    ev: "make-guest", 
                    roomId: roomIdInputEl.value,
                    for: {room_id: user.room_id, username: user.username}, 
                    drop: {room_id: whoToSetAsSpectator[0].room_id, username: whoToSetAsSpectator[0].username},
                    by: {username: usernameInputEl.value, socket_id: currentUserSocketId, playingAs: playerTypeSelect.value}
                }))

                updateUserPosition(user.room_id, 'guest')
                updateUserPosition(whoToSetAsSpectator[0].room_id, 'spectator')
            }
            userListContainer.append(makeUserGuestBtn)     

        }
        connectedUsersList.append(userListContainer)
    })
}

const sendHandShake = (userSocketId: string, roomUserConnectedTo: string) => {
    socket?.send(JSON.stringify({ev: 'handshake', 
        to: userSocketId, 
        username: usernameInputEl.value, 
        sessionId: currentUserSocketId,
        position: roomUserConnectedTo == currentUserSocketId ? "host" : gameViewPosition,
        playerType: playerTypeSelect.value,
        noOfConnectedPeople: connected_users.length,
        gameCount,
        moves: getMoves()
    }))
}

const sendMove = (moveIndex: number, playerType: string) => {
    socket?.send(JSON.stringify({
        ev: 'player-move',
        roomId: roomIdInputEl.value,
        moveIndex, playerType
    }));
}

joinSessionBtn.onclick = async (e) => {
    e.preventDefault();
    const newRoomId = roomIdInputEl.value;
    handleJoinRoom(newRoomId);
}

chatTextInputEl.onkeydown = (e) => {
    console.log(e);
    
    if (e.key.toLowerCase() == "enter") {
        console.log('enter');
        sendMessage()
    }
}

chatTextSendBtn.onclick = (e) => {
    e.preventDefault()
    sendMessage()
}

const sendMessage = () => {
    if (chatTextInputEl.value == "" || socket == null) return;
    socket?.send(JSON.stringify({ev: 'chat-msg', username: usernameInputEl.value, roomId: roomIdInputEl.value, msg: chatTextInputEl.value}))
    addMessageToUI("You", chatTextInputEl.value)
    chatTextInputEl.value = ""
}

roomLinkCopyBtn.onclick = (e) => {
    e.stopPropagation()
    const thisBtn = e.currentTarget as HTMLButtonElement
    if (currentUserSocketId == '') {
        thisBtn.innerHTML = "Not Connected"
        setTimeout(() => {
            thisBtn.innerHTML = "Click to copy room link"
        }, 1000);
        return
    }
    const urlLink = window.location.href + '?room=' + roomIdInputEl.value
    navigator.clipboard.writeText(urlLink)
    thisBtn.innerHTML = "Copied to Clipboard"
    setTimeout(() => {
        thisBtn.innerHTML = "Click to copy room link"
    }, 1000);
}
