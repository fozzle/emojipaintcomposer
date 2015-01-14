(function() {
  var AudioContext = window.AudioContext || window.webkitAudioContext,
    audioContex,
    audioBuffer,
    soundFiles = ["clap.wav", "duck.wav", "fart.wav", "partyHorn.wav", "punch.wav", "wink.wav"],
    musicGrid = [],
    emojiDict,
    currentEmoji,
    toolBar = document.getElementById("toolbar"),
    composer = document.getElementById("composer");

    toolBar.addEventListener("click", toolBarClick);


    EmojiSound = {
      playSound: function() {
        // Play sound based on note and inherit sound file.
        this.source.mediaElement.play();
      },

      note: 0,

      createMediaSource: function() {
        var audio = new Audio(),
            source;
        audio.src = this.soundFile;
        source = audioContext.createMediaElementSource(audio);
        source.connect(audioContext.destination);
        this.mediaSource = source;
      }
    };


    function toolBarClick(event) {
      currentEmoji = emojiDict[event.target.id];
      currentEmoji.playSound();
    }

    function populateEmojiDict() {
      emojiDict = {};
      soundFiles.forEach(function(fileName) {
        key = fileName.split(".")[0];
        var emojiObj = Object.create(EmojiSound);
        emojiObj.soundFile = "sounds/" + fileName;
        emojiObj.createMediaSource();
        emojiDict[key] = emojiObj;
      });
    }

    function initAudioContext() {
      audioContext = new AudioContext();
      audioBuffer = audioContext.createBuffer(2, 22050, 44100);
    }

    initAudioContext();
    populateEmojiDict();

})();