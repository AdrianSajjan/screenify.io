import { Autocomplete } from "@screenify.io/recorder/types/core";
import { makeAutoObservable } from "mobx";

class Microphone {
  enabled: boolean;
  pushToTalk: boolean;

  device: Autocomplete<"n/a">;
  stream: MediaStream | null;
  status: "idle" | "pending" | "initialized" | "error";

  constructor() {
    this.device = "n/a";
    this.status = "idle";
    this.stream = null;
    this.enabled = true;
    this.pushToTalk = false;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Microphone();
  }

  private __setupEvents() {
    document.addEventListener("keydown", this.__handleKeyDown);
    document.addEventListener("keyup", this.__handleKeyUp);
  }

  private __removeEvents() {
    document.removeEventListener("keydown", this.__handleKeyDown);
    document.removeEventListener("keyup", this.__handleKeyUp);
  }

  private __handleKeyDown(event: KeyboardEvent) {
    if (event.altKey && event.shiftKey && event.code === "KeyU") this.__enableAudioTracks();
  }

  private __handleKeyUp(event: KeyboardEvent) {
    if (event.altKey || event.shiftKey || event.code === "KeyU") this.__disableAudioTracks();
  }

  private __enableAudioTracks() {
    this.stream?.getAudioTracks().forEach((track) => (track.enabled = true));
  }

  private __disableAudioTracks() {
    this.stream?.getAudioTracks().forEach((track) => (track.enabled = false));
  }

  private __createStreamSuccess(stream: MediaStream) {
    this.status = "initialized";
    this.stream = stream;
    if (this.pushToTalk) this.__disableAudioTracks();
  }

  private __createStreamError() {
    this.status = "error";
  }

  changeDevice(value: Autocomplete<"n/a">) {
    this.device = value;
    return this;
  }

  updatePushToTalk(value: boolean) {
    this.pushToTalk = value;
    if (this.enabled) {
      if (this.pushToTalk) {
        this.__disableAudioTracks();
        this.__setupEvents();
      } else {
        this.__removeEvents();
        this.__enableAudioTracks();
      }
    }
    return this;
  }

  updateEnabled(value: boolean | "toggle") {
    this.enabled = value === "toggle" ? !this.enabled : value;
    if (this.enabled) {
      this.__enableAudioTracks();
    } else {
      this.__disableAudioTracks();
    }
    return this;
  }

  createStream() {
    return new Promise<MediaStream | null>((resolve, reject) => {
      if (this.device !== "n/a") {
        const constraints = { audio: { deviceId: this.device }, video: false };
        navigator.mediaDevices.getUserMedia(constraints).then(
          (stream) => {
            resolve(stream);
            this.__createStreamSuccess(stream);
          },
          (error) => {
            reject(error);
            this.__createStreamError();
          },
        );
      } else {
        resolve(null);
      }
    });
  }

  destroyStream() {
    this.status = "idle";
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    return this;
  }
}

const microphone = Microphone.createInstance();

export { microphone, Microphone };
