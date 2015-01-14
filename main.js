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
        var playSound = context.createBufferSource(); 
        playSound.buffer = this.sound; 
        playSound.connect(context.destination); playSound.start(0);
      },

      loadSound: function(filename) {
        var sound; // Create the Sound  
        var getSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest 
        getSound.open("GET", "sounds/".concat(filename), true); // Path to Audio File 
        getSound.responseType = "arraybuffer"; // Read as Binary Data 
        getSound.onload = function() { 
          audioContext.decodeAudioData(getSound.response, function(buffer){ 
            sound = buffer; // Decode the Audio Data and Store it in a Variable 
          }); 
        }
        getSound.send();
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
        emojiObj.loadSound(fileName);
      });
    }

    function initAudioContext() {
      audioContext = new AudioContext();
      audioBuffer = audioContext.createBuffer(2, 22050, 44100);
    }

    initAudioContext();
    populateEmojiDict();

})();