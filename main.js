function get(url, options, callback) {
    var xml = new XMLHttpRequest();
    xml.open("GET", url, true);
    if (options) {
        xml.responseType = options.responseType;
    }
    xml.onload = callback;
    xml.send();
}

(function() {

  var AudioContext = window.AudioContext || window.webkitAudioContext,
    audioContex,
    audioBuffer,
    musicGrid = [],
    emojiDict,
    emojiData,
    currentEmoji,
    toolBar = document.getElementById("toolbar"),
    composer = document.getElementById("composer");
    toolBar.addEventListener("click", toolBarClick);
    composer.addEventListener("click", composerClick);


    EmojiSound = {
      playSound: function() {
        var soundPlay = audioContext.createBufferSource(); // Declare a New Sound
        soundPlay.buffer = this.sound; // Attatch our Audio Data as it's Buffer
        soundPlay.connect(audioContext.destination); // Link the Sound to the Output
        var semitoneRatio = Math.pow(2, 1/12);
        soundPlay.playbackRate.value = Math.pow(semitoneRatio, this.note*2);
        soundPlay.start(0); // Play the Sound Immediately break;
      },

      loadSound: function(filename) {
        var self = this;
        var getSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
        get("sounds/" + filename, {
          responseType: "arraybuffer"
        }, function() {
            audioContext.decodeAudioData(this.response, function(buffer) {
                self.sound = buffer;
            });
        });
      }
    };


    function toolBarClick(event) {
      currentEmoji = emojiDict[event.target.id];
    }

    function composerClick(event) {
        if (event.target.tagName != "LI") {
            return;
        }
        var newEmoji = Object.create(currentEmoji),
            siblings = [].slice.call(event.target.parentNode.children);
        newEmoji.note = siblings.indexOf(event.target);
        newEmoji.image = document.createElement("img");
        newEmoji.image.className = "emojiNote";
        newEmoji.image.src = newEmoji.imageURL;
        event.target.appendChild(newEmoji.image);
        console.log(newEmoji.note);
        musicGrid.push(newEmoji);
        newEmoji.playSound();
    }

    function populateEmojis() {
        emojiDict = {};
        emojiData.sounds.forEach(function(emojiSoundObj) {
            key = emojiSoundObj.filename.split(".")[0];
            var emojiTool = document.createElement("li"),
                emojiIcon = document.createElement("img");
            emojiIcon.src = "emoji/" + emojiSoundObj.imagename;
            emojiIcon.id = key;
            emojiTool.appendChild(emojiIcon);
            toolBar.appendChild(emojiTool);

            var emojiObj = Object.create(EmojiSound);
            emojiObj.imageURL = "emoji/" + emojiSoundObj.imagename;
            emojiObj.loadSound(emojiSoundObj.filename);
            emojiDict[key] = emojiObj;
        });
    }

    function loadEmojiData() {
        get("sounds/sounds.json", {}, function() {
            emojiData = JSON.parse(this.responseText);
            populateEmojis();
        });
    }

    function initAudioContext() {
      audioContext = new AudioContext();
      audioBuffer = audioContext.createBuffer(2, 22050, 44100);
    }

    initAudioContext();
    loadEmojiData();
})();
