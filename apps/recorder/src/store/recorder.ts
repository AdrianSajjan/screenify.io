import exportWebmBlob from "fix-webm-duration";
import { makeAutoObservable, runInAction } from "mobx";

class Recorder {
  timestamp: number;
  status: "idle" | "active" | "pending" | "saving" | "paused" | "error";

  private timeout: number | null;
  private recorder: MediaRecorder | null;
  private chunks: Blob[];

  constructor() {
    this.status = "idle";
    this.recorder = null;
    this.timeout = null;
    this.timestamp = 0;
    this.chunks = [];
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
    if (!this.timeout) {
      this.timeout = setInterval(() => {
        runInAction(() => (this.timestamp += 1));
      }, 1000);
    }
  }

  private __stopTimer(reset?: boolean) {
    if (this.timeout) clearInterval(this.timeout);
    if (reset) this.timestamp = 0;
    this.timeout = null;
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

  private __captureStreamSuccess(stream: MediaStream) {
    this.status = "active";
    this.recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9,opus" });
    this.recorder.addEventListener("dataavailable", this.__recorderDataAvailable);
    this.recorder.addEventListener("stop", this.__recorderDataSaved);
    this.recorder.start();
    this.__startTimer();
  }

  private __captureStreamError() {
    this.status = "error";
    this.__stopTimer(true);
  }

  captureScreen() {
    this.status = "pending";
    navigator.mediaDevices.getDisplayMedia({ video: true }).then(this.__captureStreamSuccess).catch(this.__captureStreamError);
  }

  stopScreenCapture() {
    if (!this.recorder || this.recorder.state === "inactive") {
      this.status = "idle";
      this.__stopTimer(true);
    } else {
      this.recorder.stop();
      this.status = "saving";
    }
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
