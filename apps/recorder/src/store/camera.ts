import "@tensorflow/tfjs-backend-webgpu";

import * as BodySegmentation from "@tensorflow-models/body-segmentation";
import { makeAutoObservable } from "mobx";
import { Autocomplete } from "@screenify.io/recorder/types/core";

type CameraEffects = "none" | "blur" | "image";

class Camera {
  flip: boolean;
  effect: CameraEffects;
  device: Autocomplete<"n/a">;

  stream: MediaStream | null;
  status: "idle" | "pending" | "initialized" | "error";

  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private preview: HTMLCanvasElement;

  private tick: number | null = null;
  private segmenter: BodySegmentation.BodySegmenter | null = null;

  constructor() {
    this.flip = true;
    this.stream = null;
    this.device = "n/a";
    this.effect = "none";
    this.status = "idle";
    this.video = document.createElement("video");
    this.canvas = document.createElement("canvas");
    this.preview = document.createElement("canvas");
    makeAutoObservable(this, {}, { autoBind: true });
  }

  static createInstance() {
    return new Camera();
  }

  private get dimensions() {
    let offsetWidth, offsetHeight, offsetX, offsetY;
    const videoAspect = this.video.videoWidth / this.video.videoHeight;
    const canvasAspect = this.canvas.width / this.canvas.height;

    if (videoAspect > canvasAspect) {
      offsetWidth = this.canvas.height * videoAspect;
      offsetHeight = this.canvas.height;
      offsetX = -(offsetWidth - this.canvas.width) / 2;
      offsetY = 0;
    } else {
      offsetWidth = this.canvas.width;
      offsetHeight = this.canvas.width / videoAspect;
      offsetX = 0;
      offsetY = -(offsetHeight - this.canvas.height) / 2;
    }

    return { offsetWidth, offsetHeight, offsetX, offsetY };
  }

  private __resizeCanvas() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.preview.width = this.video.videoWidth;
    this.preview.height = this.video.videoHeight;
  }

  private __drawCanvas(source: CanvasImageSource) {
    const context = this.canvas.getContext("2d")!;
    const { offsetHeight, offsetWidth, offsetX, offsetY } = this.dimensions;

    if (this.flip) {
      context.save();
      context.scale(-1, 1);
      context.drawImage(source, -offsetWidth - offsetX, offsetY, offsetWidth, offsetHeight);
      context.restore();
    } else {
      context.drawImage(source, offsetX, offsetY, offsetWidth, offsetHeight);
    }
  }

  private async __renderWithoutEffects() {
    this.__resizeCanvas();
    this.__drawCanvas(this.video);
    this.tick = requestAnimationFrame(this.__renderWithoutEffects);
  }

  private async __renderBlurBackground() {
    const segmenter = await this.__createSelfieSegmentationModel();
    const segmentation = await segmenter.segmentPeople(this.video);
    await BodySegmentation.drawBokehEffect(this.preview, this.video, segmentation, 0.5, 5, 15, false);

    this.__resizeCanvas();
    this.__drawCanvas(this.preview);
    this.tick = requestAnimationFrame(this.__renderBlurBackground);
  }

  private async __renderImageBackground() {
    this.__resizeCanvas();
    this.__drawCanvas(this.video);
    this.tick = requestAnimationFrame(this.__renderImageBackground);
  }

  private async __createSelfieSegmentationModel() {
    if (!this.segmenter) {
      this.segmenter = await BodySegmentation.createSegmenter(BodySegmentation.SupportedModels.MediaPipeSelfieSegmentation, {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
        modelType: "general",
      });
    }
    return this.segmenter;
  }

  private __videoMetadataLoaded() {
    this.video.play();
    this.status = "initialized";
    this.__renderStream();
  }

  private __videoMetadataError() {
    this.status = "error";
  }

  private __createStreamSuccess(stream: MediaStream) {
    this.video.addEventListener("loadedmetadata", this.__videoMetadataLoaded, { once: true });
    this.video.addEventListener("error", this.__videoMetadataError, { once: true });
    this.stream = stream;
    this.video.srcObject = stream;
  }

  private __createSteamError() {
    this.status = "error";
  }

  private __renderStream() {
    switch (this.effect) {
      case "none":
        this.__renderWithoutEffects();
        break;
      case "blur":
        this.__renderBlurBackground();
        break;
      case "image":
        this.__renderImageBackground();
        break;
    }
  }

  changeDevice(device: Autocomplete<"n/a">) {
    this.device = device;
    if (this.device === "n/a") this.cancelStream();
    else this.createStream();
    return this;
  }

  updateEffect(effect: CameraEffects) {
    this.effect = effect;
    if (this.status === "initialized") {
      this.cancelStream();
      this.__renderStream();
    }
    return this;
  }

  updateFlip(value: boolean | "toggle") {
    this.flip = value === "toggle" ? !this.flip : value;
    return this;
  }

  initializeElements(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.video = video;
    this.canvas = canvas;
    return this;
  }

  createStream() {
    if (this.device !== "n/a") {
      this.status = "pending";
      const options = { video: { deviceId: this.device }, audio: false };
      navigator.mediaDevices.getUserMedia(options).then(this.__createStreamSuccess).catch(this.__createSteamError);
    }
    return this;
  }

  cancelStream() {
    if (this.tick) cancelAnimationFrame(this.tick);
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());

    this.tick = null;
    this.stream = null;
    this.video.srcObject = null;

    return this;
  }
}

const camera = Camera.createInstance();

export { camera, Camera, type CameraEffects };
