export default class ChangelogAudio {
  constructor() {
    if (typeof Audio === "undefined") {
      this.hasAudio = false;
      return
    } else {
      this.hasAudio = true;
    }

    this.audio = new Audio();
  }

  load(file, callback) {
    if (callback) {
      this.runOnce("canplaythrough", callback);
    }

    this.audio.type = "audio/mpeg";
    this.audio.src = file;
    this.audio.load();
  }

  onEnd(callback) {
    this.runOnce("ended", callback);
  }

  canPlay() {
    return this.hasAudio;
  }

  play() {
    this.audio.play();
  }

  pause() {
    if (!this.playing()) return;
    this.audio.pause();
  }

  playing() {
    return this.audio.duration > 0 && !this.audio.paused;
  }

  willLoop() {
    return this.audio.loop;
  }

  loop() {
    this.audio.loop = true;
  }

  volume() {
    return this.audio.volume;
  }

  setVolume(value) {
    if (value < 0) return false;

    if (value > 1) {
      this.audio.volume = value / 100;
    } else {
      this.audio.volume = value;
    }
  }

  isMuted() {
    return this.audio.muted;
  }

  mute() {
    this.audio.muted = true;
  }

  unmute() {
    this.audio.muted = false;
  }

  currentSeek() {
    return this.audio.currentTime;
  }

  seek(to, before, after) {
    to = parseInt(to, 10);
    if (to < 0) to = 0;

    if (before) {
      this.runOnce("seeking", before);
    }

    if (after) {
      this.runOnce("seeked", after);
    }

    this.audio.currentTime = to;
  }

  runOnce(eventName, fn) {
    let listener = () => {
      fn.call();
      this.audio.removeEventListener(eventName, listener);
    }

    this.audio.addEventListener(eventName, listener);
  }
}
