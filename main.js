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
    composer.addEventListener("click", composerClick);


    EmojiSound = {

      playSound: function() {

        var playSound = context.createBufferSource();
        playSound.buffer = this.sound;
        playSound.connect(context.destination); playSound.start(0);

      },

      loadSound: function(filename) {
        var sound; // Create the Sound
        var getSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
        getSound.open("GET", "sounds/" + filename, true); // Path to Audio File
        getSound.responseType = "arraybuffer"; // Read as Binary Data
        getSound.onload = function() {
          audioContext.decodeAudioData(getSound.response, function(buffer){
            sound = buffer; // Decode the Audio Data and Store it in a Variable
          });
        };
        getSound.send();
      }
    };


    function toolBarClick(event) {
      currentEmoji = emojiDict[event.target.id];
    }

    function composerClick(event) {
        var newEmoji = Object.create(currentEmoji);
        var siblings = [].slice.call(event.target.parentNode.children);
        newEmoji.note = siblings.indexOf(event.target);
        newEmoji.image = document.createElement("img");
        newEmoji.image.className = "emojiNote";
        newEmoji.image.src = newEmoji.imageURL;
        event.target.appendChild(newEmoji.image);
        console.log(newEmoji.note);
        musicGrid.push(newEmoji);
        newEmoji.playSound();
    }

    function populateEmojiDict() {
      emojiDict = {};
      soundFiles.forEach(function(fileName) {
        key = fileName.split(".")[0];
        var emojiObj = Object.create(EmojiSound);
        emojiObj.imageURL = "emoji/poo.png";
        emojiObj.loadSound(fileName);
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
