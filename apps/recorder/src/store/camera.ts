import "@tensorflow/tfjs-backend-webgpu";

import * as BodySegmentation from "@tensorflow-models/body-segmentation";
import { makeAutoObservable } from "mobx";
import { Autocomplete } from "@screenify.io/recorder/types/core";

type CameraEffects = "none" | "blur" | "image";

class Camera {
  flip: boolean;
  device: Autocomplete<"n/a">;
  effect: CameraEffects;
  status: "idle" | "pending" | "initialized" | "error" = "idle";

  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private preview: HTMLCanvasElement;

  private tick: number | null = null;
  private segmenter: BodySegmentation.BodySegmenter | null = null;

  constructor() {
    this.flip = true;
    this.effect = "none";
    this.video = document.createElement("video");
    this.canvas = document.createElement("canvas");
    this.preview = document.createElement("canvas");
    this.device = "n/a";
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

  private resizeCanvas() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.preview.width = this.video.videoWidth;
    this.preview.height = this.video.videoHeight;
  }

  private drawCanvas(source: CanvasImageSource) {
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

  private async renderWithoutEffects() {
    this.resizeCanvas();
    this.drawCanvas(this.video);
    this.tick = requestAnimationFrame(this.renderStream);
  }

  private async renderBlurBackground() {
    this.resizeCanvas();
    const segmenter = await this.createSelfieSegmentationModel();
    const segmentation = await segmenter.segmentPeople(this.video);
    await BodySegmentation.drawBokehEffect(this.preview, this.video, segmentation, 0.5, 5, 15, false);
    this.drawCanvas(this.preview);
    this.tick = requestAnimationFrame(this.renderStream);
  }

  private async renderImageBackground() {
    this.resizeCanvas();
    this.drawCanvas(this.video);
    this.tick = requestAnimationFrame(this.renderStream);
  }

  private async createSelfieSegmentationModel() {
    if (!this.segmenter) {
      this.segmenter = await BodySegmentation.createSegmenter(BodySegmentation.SupportedModels.MediaPipeSelfieSegmentation, {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
        modelType: "general",
      });
    }
    return this.segmenter;
  }

  private videoMetadataLoaded() {
    this.video.play();
    this.status = "initialized";
    this.renderStream();
  }

  private videoMetadataError() {
    this.status = "error";
  }

  private createStreamSuccess(stream: MediaStream) {
    this.video.addEventListener("loadedmetadata", this.videoMetadataLoaded, { once: true });
    this.video.addEventListener("error", this.videoMetadataError, { once: true });
    this.video.srcObject = stream;
  }

  private createSteamError() {
    this.status = "error";
  }

  private renderStream() {
    switch (this.effect) {
      case "none":
        this.renderWithoutEffects();
        break;
      case "blur":
        this.renderBlurBackground();
        break;
      case "image":
        this.renderImageBackground();
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
      this.renderStream();
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
      const options = { video: { deviceId: this.device } };
      navigator.mediaDevices.getUserMedia(options).then(this.createStreamSuccess).catch(this.createSteamError);
    }
    return this;
  }

  cancelStream() {
    if (this.tick) {
      cancelAnimationFrame(this.tick);
      this.tick = null;
    }
    return this;
  }
}

const camera = Camera.createInstance();

export { camera, Camera, type CameraEffects };
