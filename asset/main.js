/**
 * 1. Render songs
 * 2.Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scro;; active song inta view
 * 10. Play song when click
 */

const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);

const PLAYER_KEY = 'F8-player';
const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const cd = $('.cd');
const progress = $('#progress');
const btnPrev = $('.btn-prev');
const btnNext = $('.btn-next');
const btnRepeat = $('.btn-repeat');
const btnRandom = $('.btn-random');
const playlist = $('.playlist');

const app = {
  isRepeat: false,
  isRandom: false,
  isPlaying: false,
  currentIndex: 0, // Lấy ra chỉ mục đàu tiên gáng bằng 0 trong dnah sách bài hát

  config: JSON.parse(localStorage.getItem(PLAYER_KEY)) || {},

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_KEY, JSON.stringify(this.config));
  },

  songs: [
    {
      name: 'My Love',
      singer: 'Westlife',
      path: './asset/db/music/My-Love-Westlife.mp3',
      image: './asset/db/images/mylove.jpg',
    },
    {
      name: 'Nắng Ấm Xa Dần',
      singer: 'Sơn Tùng-MTP',
      path: './asset/db/music/NangAmXaDan.mp3',
      image: './asset/db/images/NangAmXaDan.jfif',
    },
    {
      name: 'Đáp Án Cuối Cùng',
      singer: 'Quân AP',
      path: './asset/db/music/DapAnCuoiCung.mp3',
      image: './asset/db/images/DapAnCuoiCung.jpg',
    },
    {
      name: 'Hello My Love',
      singer: 'Westlife',
      path: './asset/db/music/Hello My Love.mp3',
      image: './asset/db/images/HelloMyLove.jpg',
    },
    {
      name: 'If I You Go',
      singer: 'Westlife',
      path: './asset/db/music/If I Let You Go - Westlife.mp3',
      image: './asset/db/images/IfIYouGo.jpg',
    },
    {
      name: 'Attention',
      singer: 'Charlie Puth',
      path: './asset/db/music/Attention.mp3',
      image: './asset/db/images/Charlie_Puth_-_Attention_(Official_Single_Cover).png',
    },
    {
      name: 'Người Thương',
      singer: 'Hoàng Tôn',
      path: './asset/db/music/Người Thương.mp3',
      image: './asset/db/images/NguoiThuong.jpg',
    },
    {
      name: 'Mình Cùng Nhau Đóng Băng',
      singer: 'Thùy Chi',
      path: './asset/db/music/Mình Cùng Nhau Đóng Băng.mp3',
      image: './asset/db/images/MinhCungNhauDongBang.jpg',
    },
    {
      name: 'Em Đây Chẳng Phải Thúy Kiều',
      singer: 'Hoàng Thùy Linh',
      path: './asset/db/music/Em Đây Chẳng Phải Thúy Kiều.mp3',
      image: './asset/db/images/EmDayChangPhaiThuyKieu.jpg',
    },

    
  ],

  render: function(){
    const htmls = this.songs.map((song, index) => {
      return`
        <div data-index="${index}" class="song ${index === this.currentIndex ? 'active' : ''}">
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `
    })
    $('.playlist').innerHTML = htmls.join('');
  },

  defineProperties: function(){
    Object.defineProperty(this, 'currentSong', {
      get: function(){
          return this.songs[this.currentIndex]
      }
    })
  },

  handleEvents: function(){
    const cdWidth = cd.offsetWidth

    //Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      [
      
        {transform: 'rotate(360deg)',}
      ],
      {
        duration:10000,
        iterations: Infinity, //vo han
      });
    cdThumbAnimate.pause();

    //xử lý phóng to thu nhỏ
    document.onscroll = function(){
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCDwidth = cdWidth - scrollTop;
      
      cd.style.width = newCDwidth > 0 ? newCDwidth + 'px' : 0;
      cd.style.opacity = newCDwidth / cdWidth;
    }

    //Khi song duoc pause
    audio.onplay = function(){
      app.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play();

    }
    
    //Khi song duoc play
    audio.onpause = function(){
      app.isPlaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause();
    }
    
    //Khi tien do bai hat thay doi
    // Lấy thời gian hiện tại(currentTime) chia cho thời gian bài hát(duration) * 100
    audio.ontimeupdate = function(){
      if(audio.duration){
        const progressPercent = Math.floor(audio.currentTime/ audio.duration * 100)
        progress.value = progressPercent;
      }
    }
    
    //xử lý khi play
    playBtn.onclick= function(){
      // if (app.isPlaying){
      //   app.isPlaying = false;
      //   audio.pause()
      //   player.classList.remove('playing');
      // }else {
      //   app.isPlaying=true
      //   audio.play()
      //   player.classList.add('playing');
      // }

        if(app.isPlaying){
          audio.pause()
        }else {
          audio.play()
        }

    }

    // xu ly khi tua song 
    progress.onchange = function(e){
      const seekTime = (audio.duration / 100 ) * e.target.value;
      audio.currentTime = seekTime;
    }

    //xu ly next song
    btnNext.onclick = function(){
      if(app.isRandom){
        app.playRandomSong();
      }else{
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    }
    //Xu ly pre song
    btnPrev.onclick = function(){
      if(app.isRandom){
        app.playRandomSong();
      }else{
        app.preSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    }

    //Xu ly random bạt/ tat
    btnRandom.onclick = function () {
      app.isRandom = !app.isRandom;
      app.setConfig('isRandom', app.isRandom);
      btnRandom.classList.toggle('active', app.isRandom);
    };

    //Xu ly nut repeat lặp lại mot song
    btnRepeat.onclick= function(e){
      app.isRepeat = !app.isRepeat;
      app.setConfig('isRepeat', app.isRepeat);
      btnRepeat.classList.toggle('active', app.isRepeat);
    }

    // Xử lý next song khi audio ended random
    audio.onended = function(){
      if(app.isRepeat){
        audio.play()
      }else{
        btnNext.click()
      }
    }    

    //lắng nghe click vào playlist
    playlist.onclick = function(e){
      let songNode = e.target.closest('.song:not(.active)');
      //xu ly khi click vao song
      if(songNode || !e.target.closest('.option')){
        //Xu ly click vao song 
        if(songNode){
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          audio.play();
          app.render();
        }

        if (e.target.closest('.option')) {
        }
      }
    }
  },

  loadCurrentSong: function(){
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
    // console.log(heading, cdThumb, audio);
  },

  loadConfig: function(){
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  // keo tơi bai hat dang phat
  scrollToActiveSong: function(){
    setTimeout(() => {
      $('.song.active').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center',
      })
    }, 300);
  },

  nextSong: function(){
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0
    }
    this.loadCurrentSong();
  },

  preSong: function(){
    this.currentIndex--;
    if(this.currentIndex < 0 ){
      this.currentIndex = this.songs.length -1
    }
    this.loadCurrentSong();
  },

  playRandomSong: function(){
    let newIndex
    do{
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function(){
    //Gán cấu hình từ config vào object app vào ứng dựng
    this.loadConfig();

    // dinh nghia cac thuoc tinh cho oject
    this.defineProperties();

    //xu ly DOM Events
    this.handleEvents();

    //Tai thong tin bai hat dau tien vao UI khi chay ung dung
    this.loadCurrentSong();
  
    // Render playlist song
    this.render();

    //Hiện thị trạng thái ban đầu
    btnRandom.classList.toggle('active', app.isRandom);
    btnRepeat.classList.toggle('active', app.isRepeat);

  },
};

app.start();
