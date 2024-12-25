import exportWebmBlob from "fix-webm-duration";
import { makeAutoObservable, runInAction } from "mobx";
import { RECORD_TIMEOUT } from "@screenify.io/recorder/constants/recorder";
import { microphone } from "@screenify.io/recorder/store/microphone";

class Recorder {
  audio: boolean;
  timestamp: number;
  status: "idle" | "active" | "pending" | "saving" | "paused" | "error";

  private stream: MediaStream | null;
  private recorder: MediaRecorder | null;
  private chunks: Blob[];

  private interval: number | null;
  private timeout: number | null;

  constructor() {
    this.status = "idle";
    this.timestamp = 0;
    this.audio = false;

    this.recorder = null;
    this.chunks = [];
    this.stream = null;

    this.interval = null;
    this.timeout = null;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Recorder();
  }

  get time() {
    const minutes = Math.floor(this.timestamp / 60);
    const seconds = this.timestamp % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  private __startTimer() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        runInAction(() => (this.timestamp += 1));
      }, 1000);
    }
  }

  private __stopTimer(reset?: boolean) {
    if (this.interval) clearInterval(this.interval);
    if (reset) this.timestamp = 0;
    this.interval = null;
  }

  private __recorderDataAvailable(event: BlobEvent) {
    if (event.data.size > 0) this.chunks.push(event.data);
  }

  private __exportWebmBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    window.open(url);
    this.status = "idle";
  }

  private __recorderDataSaved() {
    const blob = new Blob(this.chunks, { type: "video/webm" });
    exportWebmBlob(blob, this.timestamp, this.__exportWebmBlob, { logger: false });
    this.__stopTimer(true);
    this.chunks = [];
  }

  private __captureStreamSuccess([video, audio]: [MediaStream, MediaStream | null]) {
    this.status = "active";
    this.stream = video;

    const combined = new MediaStream([
      ...video.getVideoTracks(),
      ...(audio ? audio.getAudioTracks() : []),
      ...(this.audio ? video.getAudioTracks() : []),
    ]);

    this.recorder = new MediaRecorder(combined, { mimeType: "video/webm; codecs=vp9,opus" });
    this.recorder.addEventListener("dataavailable", this.__recorderDataAvailable);
    this.recorder.addEventListener("stop", this.__recorderDataSaved);

    this.recorder.start();
    this.__startTimer();
  }

  private __captureStreamError() {
    this.status = "error";
    this.__stopTimer(true);
  }

  private __createStream() {
    const constraints = { video: true, audio: true };
    return navigator.mediaDevices.getDisplayMedia(constraints);
  }

  startScreenCapture() {
    this.status = "pending";
    this.timeout = setTimeout(() => {
      const promise = [this.__createStream(), microphone.createStream()] as const;
      Promise.all(promise).then(this.__captureStreamSuccess).catch(this.__captureStreamError);
    }, RECORD_TIMEOUT * 1000);
  }

  stopScreenCapture() {
    if (!this.recorder || this.recorder.state === "inactive") {
      this.status = "idle";
      this.__stopTimer(true);
    } else {
      this.recorder.stop();
      this.status = "saving";
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  cancelScreenCapture() {
    if (this.timeout) clearTimeout(this.timeout);
    this.status = "idle";
  }

  pauseScreenCapture() {
    if (this.recorder) {
      if (this.recorder.state === "recording") this.recorder.pause();
      this.status = "paused";
      this.__stopTimer();
    }
  }

  resumeScreenCapture() {
    if (this.recorder) {
      if (this.recorder.state === "paused") this.recorder.resume();
      this.status = "active";
      this.__startTimer();
    }
  }
}

const recorder = Recorder.createInstance();

export { recorder, Recorder };
