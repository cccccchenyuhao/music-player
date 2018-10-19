# 音乐播放器
静态页面
![需要fq](https://i.loli.net/2018/10/19/5bc9c1a54668f.png
)
功能分析
- 从music.json文件获取数据
- 播放、前进、后退、进度条、时间线
- 歌曲列表、标题

代码分析
1. 使用AJAX获取数据,封装成getMusicList()函数
```javascript
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
```

2. 封装loadMusic()函数，用来设置audio对象的src，audio设置为自动播放
```
function loadMusic(musicObj) {
    audio.src = musicObj.src
    $(".title").innerText = musicObj.title
    $(".author").innerText = musicObj.author
}
```
3. 监听timeupdate事件，设置进度条
4. 监听playing事件，设置定时器控制当前时间显示
5. 监听pause事件清除定时器
6. 监听ended事件切换下一首
```
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
```
7. 给控件绑定click事件,设置播放歌曲
```
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
    loadMusic(currentList[listIndex])
}
$('.prev').onclick = function () {
    listIndex = (currentList.length + --listIndex) % currentList.length
    console.log(listIndex)
    loadMusic(currentList[listIndex])
}
```
