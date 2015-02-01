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
    emojiDict,
    emojiData,
    currentEmoji,
    toolBar = document.getElementById("toolbar"),
    composer;

    function init() {
        composer = Object.create(Composer);
        composer.el = document.getElementById("composer");
        composer.ctx = composer.el.getContext("2d");
        composer.resize();
        composer.draw();

        toolBar.addEventListener("click", toolBarClick);
        composer.el.addEventListener("click", composer.onClick.bind(composer));
        document.getElementById("clear").addEventListener("click", composer.clear.bind(composer));
        document.getElementById("play").addEventListener("click", composer.play.bind(composer));
    }

    var Composer = {
        lines: 17,
        emojiSize: 20,
        musicGrid: [],
        resize: function() {
            composer.el.width = window.innerWidth;
        },
        draw: function() {
            // Clear drawing.
            this.ctx.fillStyle = "#fff";
            this.ctx.fillRect(0, 0, this.el.width, this.el.height);

            // Draw staff lines
            var staffSpacing = Math.floor(this.el.height / this.lines),
                verticalPos,
                i,
                j,
                column,
                storedEmoji;

            for (i = 1; i < this.lines; i++) {
                if (!(i%2)) {
                    verticalPos = staffSpacing * (i-1) + (staffSpacing/2);
                    this.ctx.fillStyle = "#f0f0f0";
                    this.ctx.fillRect(0, staffSpacing * (i-1), this.el.width, 20);
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, verticalPos);
                    this.ctx.lineTo(this.el.width, verticalPos);
                    this.ctx.stroke();
                }
            }

            // Draw any emojis
            for (i = 0; i < this.musicGrid.length; i++) {
                column = this.musicGrid[i];
                if (!column) continue;
                for (j = 0; j < column.length; j++) {
                    storedEmoji = column[j];
                    this.ctx.drawImage(storedEmoji.image, i * this.emojiSize, storedEmoji.note * this.emojiSize, this.emojiSize, this.emojiSize);
                }
            }
        },
        clear: function() {
            this.musicGrid = [];
            this.draw();
        },
        onClick: function(event) {
            // Determine location of click based on vertical denominator and horizontal denominator
            var coords = {
                x: event.clientX - this.el.offsetLeft,
                y: event.clientY - this.el.offsetTop
            };
            var yNote = Math.floor(coords.y / this.emojiSize);
            var xPos = Math.floor(coords.x / this.emojiSize);

            // Special: current Emoji is deletion tool wipe out last emoji at index and redraw
            if (!currentEmoji.filename) {
                this.musicGrid[xPos] = this.musicGrid[xPos].slice(0, this.musicGrid[xPos].length - 1);
                this.draw();
                return;
            }

            var newEmoji = Object.create(currentEmoji);
            newEmoji.note = yNote;
            console.log(newEmoji.note, xPos);
            this.musicGrid[xPos] = this.musicGrid[xPos] ? this.musicGrid[xPos].concat(newEmoji) : [newEmoji];
            newEmoji.playSound();
            this.ctx.drawImage(newEmoji.image, xPos * this.emojiSize, yNote * this.emojiSize, this.emojiSize, this.emojiSize);
        },
        play: function() {
            this.recursivePlay(0);
        },
        recursivePlay: function(gridIndex) {
            setTimeout((function() {
                if (gridIndex < this.musicGrid.length) {
                    var emojiArray = this.musicGrid[gridIndex];
                    for (var i in emojiArray) {
                        emojiArray[i].playSound();
                    }
                    this.recursivePlay(gridIndex+1);
                }
            }).bind(this), 250);
        }
    };

    var EmojiSound = {
      playSound: function() {
        var soundPlay = audioContext.createBufferSource(); // Declare a New Sound
        soundPlay.buffer = this.sound; // Attach our Audio Data as it's Buffer
        soundPlay.connect(audioContext.destination); // Link the Sound to the Output
        var semitoneRatio = Math.pow(2, 1/12);
        soundPlay.playbackRate.value = Math.pow(semitoneRatio, 6*2 - this.note*2);
        soundPlay.start(0); // Play the Sound Immediately break;
      },

      loadSound: function(filename) {
        var self = this;
        this.filename = filename;
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
        var targetEl;
        if (event.target.nodeName === "LI") {
            targetEl = event.target;
       } else {
           targetEl = event.target.parentNode;
       }
        currentEmoji = emojiDict[targetEl.id];
        composer.el.style.cursor = 'url(' + currentEmoji.imageURL + ') 10 10, default';
        [].slice.call(targetEl.parentNode.children).forEach(function(node) { node.className = ""; });
        targetEl.className = "active";
    }

    function populateEmojis() {
        emojiDict = {};
        emojiData.sounds.forEach(function(emojiSoundObj) {
            key = emojiSoundObj.key;
            var emojiTool = document.createElement("li"),
                emojiIcon = document.createElement("img");
            emojiIcon.src = "emoji/" + emojiSoundObj.imagename;
            emojiTool.id = key;
            emojiTool.appendChild(emojiIcon);
            toolBar.appendChild(emojiTool);

            var emojiObj = Object.create(EmojiSound);
            emojiObj.imageURL = "emoji/" + emojiSoundObj.imagename;
            emojiObj.image = new Image();
            emojiObj.image.src = emojiObj.imageURL;
            if (emojiSoundObj.filename) emojiObj.loadSound(emojiSoundObj.filename);
            emojiDict[key] = emojiObj;
        });
    }

    function loadEmojiData() {
        get("sounds.json", {}, function() {
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
    init();
})();


