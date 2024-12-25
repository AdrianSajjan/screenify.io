import { Autocomplete } from "@screenify.io/recorder/types/core";
import { makeAutoObservable } from "mobx";

class Microphone {
  device: Autocomplete<"n/a">;

  constructor() {
    this.device = "n/a";
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Microphone();
  }

  changeDevice(value: Autocomplete<"n/a">) {
    this.device = value;
  }
}

const microphone = Microphone.createInstance();

export { microphone, Microphone };
