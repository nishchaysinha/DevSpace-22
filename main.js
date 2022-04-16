const APP_ID = "28ca26d9a7eb414690b98fba6f763a8a"
const TOKEN = "006e2d63a2920614237b228acbaae5eee24IACM7fGXu/GMkzbNj8g0VbFRqo9oMwiCr1a6ZuMLwb9Zt2TNKL8AAAAAEACDdLwQidJaYgEAAQCJ0lpi"
const CHANNEL = "main"

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {

    client.on('user-published', handleUserJoined)
    
    client.on('user-left', handleUserLeft)
    
    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks() 

    let player = `<div class="video-container" id="user-container-${UID}"  style="border-radius: 30px; overflow: hidden">
                        <div class="video-player" id="user-${UID}" style="border-radius: 30px; overflow: hidden"></div>
                  </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${UID}`)
    
    await client.publish([localTracks[0], localTracks[1]])
}

let joinStream = async () => {
    await joinAndDisplayLocalStream()
    document.getElementById('join-btn').style.display = 'none'
    document.getElementById('stream-controls').style.display = 'flex'
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user 
    await client.subscribe(user, mediaType)

    if (mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}" style="border-radius: 30px; overflow: hidden">
                        <div class="video-player" id="user-${user.uid}" style="border-radius: 30px; overflow: hidden"></div> 
                 </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () => {
    for(let i = 0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    document.getElementById('join-btn').style.display = 'block'
    document.getElementById('stream-controls').style.display = 'none'
    document.getElementById('video-streams').innerHTML = ''
}

let toggleMic = async (e) => {
    if (localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.innerText = 'Mic on'
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[0].setMuted(true)
        e.target.innerText = 'Mic off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

let toggleCamera = async (e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.innerText = 'Camera on'
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.innerText = 'Camera off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

function doc() {
    var x = document.getElementById("document");
    if (x.style.display === "none") {
      x.style.display = "block";
      var iframe = document.getElementById('gdocs');
      iframe.src = iframe.src;
    } else {
      x.style.display = "none";
    }
  }

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  

  function jamboard() {
    var x = document.getElementById("jamboard");
    if (x.style.display === "none") {
      x.style.display = "block";
      
    } else {
      x.style.display = "none";
    }
  }

  function vscode() {
    var x = document.getElementById("code");
    if (x.style.display === "none") {
      x.style.display = "block";
      
    } else {
      x.style.display = "none";
    }
  }

document.getElementById('join-btn').addEventListener('click', joinStream)
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
