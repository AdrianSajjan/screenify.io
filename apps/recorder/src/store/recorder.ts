import { makeAutoObservable } from "mobx";

class Recorder {
  status: "idle" | "active" | "pending" | "paused" | "error";

  private recorder: MediaRecorder | null;
  private chunks: Blob[];

  constructor() {
    this.status = "idle";
    this.recorder = null;
    this.chunks = [];
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Recorder();
  }

  private __recorderDataAvailable(event: BlobEvent) {
    if (event.data.size > 0) this.chunks.push(event.data);
  }

  private __recorderDataSaved() {
    const blob = new Blob(this.chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    this.chunks = [];
    window.open(url);
  }

  private __captureStreamSuccess(stream: MediaStream) {
    this.status = "active";
    this.recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9,opus" });
    this.recorder.addEventListener("dataavailable", this.__recorderDataAvailable);
    this.recorder.addEventListener("stop", this.__recorderDataSaved);
    this.recorder.start();
  }

  private __captureStreamError() {
    this.status = "error";
  }

  captureScreen() {
    this.status = "pending";
    navigator.mediaDevices.getDisplayMedia({ video: true }).then(this.__captureStreamSuccess).catch(this.__captureStreamError);
  }

  stopScreenCapture() {
    if (this.recorder?.state !== "inactive") this.recorder?.stop();
    this.status = "idle";
  }

  pauseScreenCapture() {
    if (this.recorder) {
      if (this.recorder.state === "recording") this.recorder.pause();
      this.status = "paused";
    }
  }

  resumeScreenCapture() {
    if (this.recorder) {
      if (this.recorder.state === "paused") this.recorder.resume();
      this.status = "active";
    }
  }
}

const recorder = Recorder.createInstance();

export { recorder, Recorder };
