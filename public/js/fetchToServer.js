async function getUUID(){
    var send =await fetch('/identify')
    var  UUID = await send.json()
    sessionStorage.setItem('userID',UUID.userID)
    console.log(UUID.userID)
}
getUUID()