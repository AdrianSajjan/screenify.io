import { makeAutoObservable } from "mobx";

type RecorderStatus = "idle" | "active" | "pending" | "paused" | "error";

class Recorder {
  status: RecorderStatus;

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

  private recorderDataAvailable(event: BlobEvent) {
    if (event.data.size > 0) this.chunks.push(event.data);
  }

  private recorderDataSaved() {
    const blob = new Blob(this.chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    this.chunks = [];
    window.open(url);
  }

  private captureStreamSuccess(stream: MediaStream) {
    this.status = "active";
    this.recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    this.recorder.addEventListener("dataavailable", this.recorderDataAvailable);
    this.recorder.addEventListener("stop", this.recorderDataSaved);
    stream.getVideoTracks()[0].addEventListener("ended", this.stopScreenCapture);
    this.recorder.start();
  }

  private captureStreamError() {
    this.status = "error";
  }

  captureScreen() {
    this.status = "pending";
    navigator.mediaDevices.getDisplayMedia({ video: true }).then(this.captureStreamSuccess).catch(this.captureStreamError);
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
