const socket = io()
const $msgForm = document.querySelector("#user")
const $msgForInput = $msgForm.querySelector('input')
const $msgFormButton = $msgForm.querySelector('button')
// const $msgForInput = $msgForm.querySelector('input')
const $geoLocationButton = document.querySelector("#getLocation")
const $messages = document.querySelector("#messages")
const $locations = document.querySelector("#locations")
const $disconnect = document.querySelector("#disconnect")
const $connect = document.querySelector("#connect")

const msgtemplate = document.querySelector("#msg-template").innerHTML
const loctemplate = document.querySelector("#location-template").innerHTML
const sidebartemplate = document.querySelector('#user-rooms').innerHTML


const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
const autoscroll = () => {
    const $newmsg = $messages.lastElementChild
    const newmsgStyles = getComputedStyle($newmsg)

    const newMsgMargin = parseInt(newmsgStyles.marginBottom)
    const newmsgheight = $newmsg.offsetHeight + newMsgMargin



    const visibleHeight = $messages.offsetHeight

    const containerHeght = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeght - newmsgheight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight

    }
}


socket.on('connect', () => {
    const SOCKET_ID = socket.id
    const USER_ID = (sessionStorage.getItem('userID'))
    const ROOM_TYPE = (sessionStorage.getItem('room_type'))
    $connect.addEventListener('click', function () {
        var eventPromise = new Promise(function (resolve, reject) {
            socket.emit('leave')
            resolve(true)
        })
        eventPromise.then((res) => {
            socket.emit('join', { userID: USER_ID, socketID: SOCKET_ID, room: ROOM_TYPE }, (error) => {
                if (error) {
                    alert(error)
                    location.href = '/'
                }
            })
            return true
        })
    })


    socket.on("message", (msg) => {
        const html = Mustache.render(msgtemplate, {
            username: msg.username,
            msg: msg.text,
            createdAt: moment(msg.createdAt).format('h:m A, DD MMM,YYYY')
        })

        $messages.insertAdjacentHTML("beforeend", html)
        autoscroll()
    })


    socket.on("locationurl", (loc) => {
        console.log(loc)
        const html = Mustache.render(loctemplate, {
            username: loc.username,
            loc: loc.url,
            createdAt: moment(loc.createdAt).format('h:m A, DD MMM,YYYY')
        })
        $messages.insertAdjacentHTML("beforeend", html)
        autoscroll()
    })

    socket.on("roomData", ({ room, users }) => {
        const html = Mustache.render(sidebartemplate, {
            room,
            users
        })
        document.querySelector('#sidebar').innerHTML = html
    })
    socket.emit('join', { userID: USER_ID, socketID: SOCKET_ID, room: ROOM_TYPE }, (error) => {
        if (error) {
            alert(error)
            location.href = '/'
        }
    })
})
// socket.on('connect',()=>{
//     const SOCKET_ID=socket.id
//     const USER_ID=(sessionStorage.getItem('userID'))
//     const ROOM_TYPE=(sessionStorage.getItem('room_type'))
//     socket.on("message", (msg) => {
//         const html = Mustache.render(msgtemplate, {
//             username: msg.username,
//             msg: msg.text,
//             createdAt: moment(msg.createdAt).format('h:m A, DD MMM,YYYY')
//         })

//         $messages.insertAdjacentHTML("beforeend", html)
//         autoscroll()
//     })


//     socket.on("locationurl", (loc) => {
//         console.log(loc)
//         const html = Mustache.render(loctemplate, {
//             username: loc.username,
//             loc: loc.url,
//             createdAt: moment(loc.createdAt).format('h:m A, DD MMM,YYYY')

//         })

//         $messages.insertAdjacentHTML("beforeend", html)
//         autoscroll()
//     })

//     socket.on("roomData", ({ room, users }) => {
//         const html = Mustache.render(sidebartemplate, {
//             room,
//             users
//         })
//         document.querySelector('#sidebar').innerHTML = html
//     })
//     socket.emit('join', { userID:USER_ID,socketID:SOCKET_ID,room:ROOM_TYPE }, (error) => {
//         if (error) {
//             alert(error)
//             location.href = '/'
//         }
//     })
// })

$msgForm.addEventListener("submit", (e) => {
    e.preventDefault()

    $msgFormButton.setAttribute('disabled', 'disabled')
    let msg = document.querySelector("input").value

    const html = Mustache.render(msgtemplate, {
        username: "You",
        msg: msg,
        createdAt: moment(msg.createdAt).format('h:m A, DD MMM,YYYY')
    })

    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()

    socket.emit("sendMessage", msg, (error) => {
        $msgFormButton.removeAttribute('disabled')
        $msgForInput.value = ''
        $msgForInput.focus()
        if (error) {
            return console.log(error)
        }


        console.log('Message delivered!')
    })
})



$geoLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("no browser supoport")
    }

    $geoLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        const html = Mustache.render(loctemplate, {
            username: 'Your location',
            loc: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
            createdAt: moment().format('h:m A, DD MMM,YYYY')
        })
        $messages.insertAdjacentHTML("beforeend", html)
        autoscroll()
        socket.emit("sendLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, () => {
            $msgForInput.focus()
            $geoLocationButton.removeAttribute('disabled')
            console.log("location shared", position)
        })
    })
})


$disconnect.addEventListener("click", () => {
    if (confirm("Do you want to leave?")) {
        const html = Mustache.render(msgtemplate, {
            username: "You has left the room",
            createdAt: moment().format('h:m A, DD MMM,YYYY')
        })
        $messages.insertAdjacentHTML("beforeend", html)
        autoscroll()
        socket.emit("leave")

    }
})

