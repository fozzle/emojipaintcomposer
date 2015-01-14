(function() {
  var AudioContext = window.AudioContext || window.webkitAudioContext,
    audioContex = new AudioContext(),
    musicGrid = [],
    emojiDict,
    currentEmoji,
    toolBar = document.getElementById("toolbar"),
    composer = document.getElementById("composer");

    toolBar.addEventListener("click", toolBarClick);



    function toolBarClick(event) {
      setEmoji(event.target.id);
    }

    function setEmoji(emojiId) {
      // Select from precreated emojisound objects
    }

    function populateEmojiDict {
      // Object.create(emojisound), modify sound property
    }


})();

var EmojiSound = function(note) {
  this.note = note;
};

EmojiSound.protoype.playSound = function() {
  // Play sound based on note and inherit sound file.
};