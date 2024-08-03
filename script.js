const videoInput = document.querySelector("#videoInput");
const videoBtn = document.querySelector("#videoBtn");

const videoPlayer = document.querySelector("#main")

const speedUp = document.querySelector("#speedUp")
const speedDown = document.querySelector("#speedDown")
const volumeUp = document.querySelector("#volumeUp")
const volumeDown = document.querySelector("#volumeDown")
const toast = document.querySelector(".toast")

const currentTimeElem = document.querySelector("#currentTime")
const totalTime = document.querySelector("#totalTime");
const slider = document.querySelector("#slider");


let video = ""
let isPlaying = false;
let duration;
let timerObj;
let currentPlayTime = 0;

/**********************************File add************************************************/
function browseFile(){
    videoInput.click()
}

function acceptFile(obj){
    console.log(obj)
    if(videoPlayer.children.length>0){
        videoPlayer.removeChild(videoPlayer.children[0])
    }
    let selectedVideo;
    if (obj.type == "drop") {
        selectedVideo = obj.dataTransfer.files[0]

    } else {
        selectedVideo = obj.target.files[0];

    }
    const link = URL.createObjectURL(selectedVideo)
    const videoElement = document.createElement("video")
    videoElement.src=link
    videoElement.setAttribute("class","video")
    videoPlayer.appendChild(videoElement)
    isPlaying = true
    video = videoElement
    setPlayPause();
    videoElement.play()
    videoElement.volume = 0.3;
    console.log(1,videoElement.duration)
    videoElement.addEventListener("loadedmetadata",()=>{
        duration = Math.round(videoElement.duration);
        console.log(2,duration);
        let time = formatTime(duration);
        totalTime.textContent = time
        slider.setAttribute("max",duration)
        startTimer()
    })
}

videoBtn.addEventListener("click",browseFile)
videoInput.addEventListener("change",acceptFile)
videoPlayer.addEventListener('drop', (e) => {
    e.preventDefault();
    acceptFile(e);
})
videoPlayer.addEventListener('dragover', (e) => {
    e.preventDefault();
})
/*************change video current time by slider*********************************/
slider.addEventListener("change",(e)=>{
    currentPlayTime = e.target.value
    video.currentTime = currentPlayTime
    
})
/**************************PlayPause*********************************************/
const playPauseBtn = document.querySelector("#playPause")
function setPlayPause(){
    if(isPlaying){
        playPauseBtn.innerHTML = `<i class="fas fa-pause state"></i>`;
        video.play()
    }else{
        playPauseBtn.innerHTML = `<i class="fas fa-play state"></i>`;
        video.pause()
    }
}

playPauseBtn.addEventListener("click",()=>{
    isPlaying = !isPlaying;
    setPlayPause();
})

/**********************fullScreen********************************************************/

const fullScreenBtn = document.querySelector("#fullScreenBtn")

fullScreenBtn.addEventListener("click",handleFullScreen)
function handleFullScreen(){
    videoPlayer.requestFullscreen();
}
/***************************Forward and backward***********************************/
const backwardBtn = document.querySelector("#backwardBtn")
const forwardBtn = document.querySelector("#forwardBtn")

function forwardFn(){
    currentPlayTime = Math.round(video.currentTime)+5
    video.currentTime = currentPlayTime
    slider.value = currentPlayTime
    showToast("forward 5sec")
}
function backwardFn(){
    currentPlayTime = Math.round(video.currentTime)-5
    video.currentTime = currentPlayTime
    slider.value = currentPlayTime
    showToast("backward 5sec")
}

forwardBtn.addEventListener("click",forwardFn)
backwardBtn.addEventListener("click",backwardFn)
/**************************************Stop Button*************************************/
const stopBtn = document.querySelector("#stopBtn")

function stopFn(){
    if(video){
        video.remove();
        isPlaying = false;
        currentPlayTime = 0;
        slider.value = 0;
        video = ""
        duration = ""
        totalTime.innerText="--/--/--"
        currentTimeElem.innerText="00:00:00"
        stopTimer();
        setPlayPause()
    }
}


stopBtn.addEventListener("click",stopFn)
/***************************Format Time*************************************************/
function formatTime(timeVal){
    let time = ''
    const sec = parseInt(timeVal,10)
    let hours = Math.floor(sec/3600)
    let minutes = Math.floor((sec-(hours*3600))/60)
    let seconds = sec - (minutes*60) - (hours*3600)
    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds
    time = `${hours}:${minutes}:${seconds}`;
    console.log(time)
    return time;
}

function startTimer(){
    timerObj = setInterval(function(){
        currentPlayTime = Math.round(video.currentTime);
        slider.value = currentPlayTime
        const time = formatTime(currentPlayTime)
        currentTimeElem.innerText = time
        
        if(currentPlayTime==duration){
            stopTimer();
            isPlaying=!isPlaying
            setPlayPause();
            video.remove()
            slider.value = 0;
            currentTimeElem.innerText = "00:00:00";
            totalTime.innerText = "--/--/--";
        }
        console.log(isPlaying)
    },1000)
}

function stopTimer(){
    clearInterval(timerObj);
}


/***************************************************************************************************/
function speedUpFn(){
    const videoElement = document.querySelector(".video");
    if(videoElement){
        if(videoElement.playbackRate<=1.75)
            videoElement.playbackRate += 0.25;     
    }
    showToast(videoElement.playbackRate+"X")
    console.log(videoElement.playbackRate)
}
function speedDownFn(){
    const videoElement = document.querySelector(".video");
    if(videoElement){
        if(videoElement.playbackRate>=0.25)
            videoElement.playbackRate -= 0.25;     
    }
    showToast(videoElement.playbackRate+"X")
    console.log(videoElement.playbackRate)
}
function volumeUpFn(){
    const videoElement = document.querySelector(".video");
    if(videoElement){
        if(videoElement.volume<=0.9)
            videoElement.volume += 0.1;     
    }
    showToast(Math.round(videoElement.volume*100)+"%")
    console.log(videoElement.volume)
}
function volumeDownFn(){
    const videoElement = document.querySelector(".video");
    if(videoElement){
        if(videoElement.volume>=0.1)
            videoElement.volume -= 0.1;     
    }
    showToast(Math.round(videoElement.volume*100)+"%")
    console.log(videoElement.volume)
}

function showToast(msg){
    toast.textContent=msg;
    toast.style.display = "block"
    setTimeout(()=>{
        toast.style.display = "none"
    },2000)
}


speedUp.addEventListener("click",speedUpFn)
speedDown.addEventListener("click",speedDownFn)
volumeUp.addEventListener("click",volumeUpFn)
volumeDown.addEventListener("click",volumeDownFn)
/********************************KeyBoard Shortcut**************************************/
const body = document.querySelector("body");

videoPlayer.addEventListener("click",function(e){
    console.log(e.key)
    if(!video)
        return
    isPlaying=!isPlaying
    setPlayPause();
})
body.addEventListener("keyup",function(e){
    console.log(e.key)
    if(!video)
        return
    else if(e.key==" "||e.key=="click "){
        isPlaying=!isPlaying
        setPlayPause();
    }else if(e.key=="ArrowUp"){
        volumeUpFn()
    }else if(e.key=="ArrowDown"){
        volumeDownFn()
    }else if(e.key=="ArrowLeft"){
        backwardFn()
    }else if(e.key=="ArrowRight"){
        forwardFn()
    }else if(e.key=="+"){
        speedUpFn()
    }else if(e.key=="-"){
        speedDownFn()
    }else if(e.key=="Escape"){
        stopFn()
    }
    else if(e.key=="f"){
        handleFullScreen()
    }
})

















/**********************************************************************************************************/
// function dropHandler(e) {
//   e.preventDefault();
//   const videoElementExist = document.querySelector(".video");
//     if(videoElementExist){
//         videoElementExist.remove()
//     }

//   if (e.dataTransfer.items) {
//     [...e.dataTransfer.items].forEach((item, i) => {
//       if (item.kind === "file") {
//         const selectedVideo = item.getAsFile();
//         const link = URL.createObjectURL(selectedVideo)
//         console.log("SelectedVideo",selectedVideo)
//         console.log(link)

//         const videoElement = document.createElement("video")
//         videoElement.src=link
//         videoElement.setAttribute("class","video")
//         videoPlayer.appendChild(videoElement)
//         videoElement.play()
//         videoElement.controls = true;
//       }
//     });
//   }
// }
// function dragOverHandler(e) {
//   console.log("File(s) in drop zone");
//   e.preventDefault();
// }



