const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb =$('.cd-thumb')
const audio = $('#audio')
const cd =$('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    configs: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Hãy Trao Cho Anh',
            singer: 'Sơn Tùng M-TP',
            path: './assets/music/song1.mp3',
            img: './assets/img/img1.jpg'
        },
        {
            name: 'Waiting For You',
            singer: 'MONO',
            path: './assets/music/song2.mp3',
            img: './assets/img/img2.jpg'
        },
        {
            name: 'Muộn Rồi Mà Sao Còn',
            singer: 'Sơn Tùng M-TP',
            path: './assets/music/song3.mp3',
            img: './assets/img/img3.jpg'
        },
        {
            name: 'Ngôi Sao Cô Đơn',
            singer: 'J97',
            path: './assets/music/song4.mp3',
            img: './assets/img/img4.jpg'
        },
        {
            name: 'Pink Vernom',
            singer: 'BlackPink',
            path: './assets/music/song5.mp3',
            img: './assets/img/img5.jpg'
        },   
        {
            name: 'ON',
            singer: 'BTS',
            path: './assets/music/song6.mp3',
            img: './assets/img/img6.jpg'
        },  
        {
            name: 'Độ Tộc 2',
            singer: 'Độ Mixi',
            path: './assets/music/song7.mp3',
            img: './assets/img/img7.jpg'
        }, 
        {
            name: 'Permisission To Dance',
            singer: 'BTS',
            path: './assets/music/song8.mp3',
            img: './assets/img/img8.jpg'
        }, 
        {
            name: 'God Menu',
            singer: 'Stray Kids',
            path: './assets/music/song9.mp3',
            img: './assets/img/img9.jpg'
        }, 
        {
            name: 'Kick It',
            singer: 'NCT 127',
            path: './assets/music/song10.mp3',
            img: './assets/img/img10.jpg'
        }, 
    ],
    setConfig: function(key, value){
        this.configs[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.configs))
    },
    render: function() {
        const htmls = this.songs.map((songs, index) => {
            return `
            <div class="song ${index === this.currentIndex ? `active` : ``}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${songs.img}')">
                </div>
                <div class="body"> 
                    <h3 class="title">${songs.name}</h3>
                    <p class="author">${songs.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>`
        })
        playList.innerHTML = htmls.join('')

    },
    definePorperties: function() {
        Object.defineProperty(this,'currentSong',{
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleVents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        //xử lý cd quay và dừng
        const cdTumbAnimate = cdThumb.animate([{transform:'rotate(360deg)'}],{
            duration: 10000, //10s
            iteration: Infinity
        })

        cdTumbAnimate.pause()

        //xử lý phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop



            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()               
            }
        }

        //khi song được play 
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdTumbAnimate.play()
        }
        //khi song bị pause 
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdTumbAnimate.pause()
        }

        //khi tiến độ bài hát thay đổi 
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //xử lý khi tua bài hát
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //Khi next bài hát 
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong()
            }
            else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Khi prev bài hát 
        preBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong()
            }
            else {
                _this.preSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Xứ lý bật tắt random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }
        // xử lý phát lại 1 bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)

            repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play()
            }
            else{
                nextBtn.click()
            }
        }
        // lắng nghe click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if(
                songNode || e.target.closest('.option') ){
                    //xử lý khi click vào bài hát
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong()
                        _this.render()
                        audio.play()
                    }
            }
            //xử lý khi click vào song option
            if(e.target.closest('.option') ){}
        } 
    },
    scrollToActiveSong: function() {
        setTimeout(() =>{
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })     
        },300)
    },
    loadCurrentSong: function() {
        

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path


    },
    loadConfig: function() {
        this.isRandom = this.configs.isRandom
        this.isRepeat = this.configs.isRepeat
    },
    nextSong : function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    preSong : function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex 
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        //định nghĩa các thuộc tính cho object
        this.definePorperties()

        //lắng nghe và xử lý các sự kiện
        this.handleVents()

        //tải thông tin bài hát đầu tiên khi vào ứng dụng
        this.loadCurrentSong()

        //Render playlist
        this.render()

        //hiển thị trạng thái ban đầu của btn repeat và random
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)


    }
}

app.start()




