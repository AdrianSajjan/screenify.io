import { Autocomplete } from "@screenify.io/recorder/types/core";
import { makeAutoObservable } from "mobx";

class Microphone {
  pushToTalk: boolean;
  device: Autocomplete<"n/a">;
  stream: MediaStream | null;
  status: "idle" | "pending" | "initialized" | "error";

  constructor() {
    this.device = "n/a";
    this.status = "idle";
    this.stream = null;
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
    if (event.altKey && event.shiftKey && event.key === "u") this.__enableAudioTracks();
  }

  private __handleKeyUp(event: KeyboardEvent) {
    if (event.altKey && event.shiftKey && event.key === "u") this.__disableAudioTracks();
  }

  private __enableAudioTracks() {
    this.stream?.getAudioTracks().forEach((track) => (track.enabled = true));
  }

  private __disableAudioTracks() {
    this.stream?.getAudioTracks().forEach((track) => (track.enabled = false));
  }

  private __createStreamSuccess(stream: MediaStream) {
    this.stream = stream;
  }

  private __createStreamError() {
    this.status = "error";
  }

  changeDevice(value: Autocomplete<"n/a">) {
    this.device = value;
  }

  updatePushToTalk(value: boolean) {
    this.pushToTalk = value;
    if (this.pushToTalk) {
      this.__disableAudioTracks();
      this.__setupEvents();
    } else {
      this.__removeEvents();
      this.__enableAudioTracks();
    }
  }

  createStream() {
    if (this.device !== "n/a") {
      const constraints = { audio: { deviceId: this.device } };
      navigator.mediaDevices.getUserMedia(constraints).then(this.__createStreamSuccess).catch(this.__createStreamError);
    }
  }
}

const microphone = Microphone.createInstance();

export { microphone, Microphone };
