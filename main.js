var currentList = []
var listIndex = 0
var audio = new Audio()
var clock
audio.autoplay = true



function $(selector) {
    return document.querySelector(selector)
}
function $$(selector) {
    return document.querySelectorAll(selector)
}

function getMusicList(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./music.json", true)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            callback(JSON.parse(xhr.responseText))
        } else {
            console.log('获取数据失败')
        }
    }
    xhr.onerror = function () {
        console.log('网络异常')
    }
    xhr.send()
}

function loadMusic(musicObj) {
    audio.src = musicObj.src
    $(".title").innerText = musicObj.title
    $(".author").innerText = musicObj.author
}




getMusicList(function (list) {
    currentList = list
    list.forEach(function (eachList, index) {
        var li = document.createElement('li')
        li.innerText = index+1 + " "+eachList.title + "-" + eachList.author
        $('.list').appendChild(li)
    })
    loadMusic(list[listIndex])
})



audio.ontimeupdate = function () {
    $(".timeline-now").style.width = (this.currentTime/this.duration)*100 + '%'
}

audio.onplaying = function () {
    var min = Math.floor(this.duration / 60)
    var sec = Math.floor(this.duration % 60) + ''
    sec = sec.length === 2 ? sec : "0" + sec
    $(".time-total").innerText = min + ':' + sec
    clock = setInterval(function () {
        var min = Math.floor(audio.currentTime / 60)
        var sec = Math.floor(audio.currentTime % 60) + ''
        sec = sec.length === 2 ? sec : "0" + sec
        $(".time-now").innerText = min + ':' + sec
    }, 1000)
}

audio.onpause = function () {
    clearInterval(clock)
}
audio.onended = function () {
    listIndex++
    loadMusic(currentList[listIndex])
}



$('.play').onclick = function () {
    if (audio.paused) {
        audio.play()
        this.classList.remove('icon-play')
        this.classList.add('icon-pause')

    } else{
        audio.pause()
        this.classList.remove('icon-pause')
        this.classList.add('icon-play')
    }
}
$('.next').onclick = function () {
    listIndex = ++listIndex%currentList.length
    console.log(listIndex)
    loadMusic(currentList[listIndex])
}
$('.prev').onclick = function () {
    listIndex = (currentList.length + --listIndex) % currentList.length
    console.log(listIndex)
    loadMusic(currentList[listIndex])
}

$('.timeline-total').onclick = function (e) {
    var rate = e.offsetX/160
    audio.currentTime = audio.duration*rate
}

