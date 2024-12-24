import "@tensorflow/tfjs-backend-webgpu";
import * as BodySegmentation from "@tensorflow-models/body-segmentation";

import Draggable from "react-draggable";
import { MoveDiagonal2Icon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useWindowDimensions } from "@screenify.io/recorder/hooks/use-window-dimensions";
import {
  CAMERA_DIMENTIONS,
  SAFE_AREA_PADDING,
} from "@screenify.io/recorder/constants/layout";
import { canvasFixedAspectRatioBounds } from "@screenify.io/recorder/lib/utils";

export function CameraStream() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null!);

  const [cameraSize, setCameraSize] = useState(200);

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const setupCamera = useCallback(() => {
    const video = videoRef.current;
    return new Promise<boolean>((resolve) => {
      if (video) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          video.srcObject = stream;
          video.onloadeddata = () => resolve(true);
          video.onerror = () => resolve(false);
        });
      } else {
        resolve(false);
      }
    });
  }, [videoRef]);

  const renderCameraStream = useCallback(async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const preview = document.createElement("canvas");
    const context = canvas.getContext("2d")!;

    preview.width = video.videoWidth;
    preview.height = video.videoHeight;
    canvas.width = video.videoWidth;
    canvas.height = video.videoWidth;

    const segmenter = await BodySegmentation.createSegmenter(
      BodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
      {
        runtime: "mediapipe",
        solutionPath:
          "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
        modelType: "general",
      },
    );

    const foregroundThreshold = 0;
    const blurAmount = 0;
    const edgeBlurAmount = 0;
    const flipHorizontal = true;

    const renderFrame = async () => {
      const segmentation = await segmenter.segmentPeople(video);
      await BodySegmentation.drawBokehEffect(
        preview,
        video,
        segmentation,
        foregroundThreshold,
        blurAmount,
        edgeBlurAmount,
        flipHorizontal,
      );

      const dimensions = canvasFixedAspectRatioBounds(video, canvas);
      context.drawImage(
        preview,
        dimensions.offsetX,
        dimensions.offsetY,
        dimensions.offsetWidth,
        dimensions.offsetHeight,
      );
      requestAnimationFrame(renderFrame);
    };

    video.play();
    renderFrame();
  }, [canvasRef, videoRef]);

  useEffect(() => {
    setupCamera().then(() => renderCameraStream());
  }, [setupCamera, renderCameraStream]);

  const defaultPosition = {
    x: SAFE_AREA_PADDING,
    y: SAFE_AREA_PADDING,
  };

  const bounds = {
    left: SAFE_AREA_PADDING,
    top: SAFE_AREA_PADDING,
    right: windowWidth - cameraSize - SAFE_AREA_PADDING,
    bottom: windowHeight - cameraSize - SAFE_AREA_PADDING,
  };

  const styles = {
    width: cameraSize,
    height: cameraSize,
  };

  return (
    <Draggable
      handle="#camera-handle"
      nodeRef={containerRef}
      defaultPosition={defaultPosition}
      bounds={bounds}
    >
      <div ref={containerRef} className="absolute group">
        <button className="absolute top-3.5 left-3.5 bg-blank hover:bg-secondary-black h-8 w-8 rounded-full grid place-items-center transition-opacity opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
          <XIcon size={16} className="text-light" />
        </button>
        <div
          id="camera-handle"
          className="rounded-full overflow-hidden border-2 border-border shadow-shadow cursor-move"
          style={styles}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-blank rounded-full"
          />
          <video
            ref={videoRef}
            height={CAMERA_DIMENTIONS}
            width={CAMERA_DIMENTIONS}
            className="object-cover hidden"
            playsInline
            muted
          />
        </div>
        <button
          className="absolute bottom-3 right-3 bg-blank hover:bg-secondary-black h-8 w-8 rounded-full grid place-items-center transition-opacity opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
          onClick={() => setCameraSize(cameraSize === 200 ? 400 : 200)}
        >
          <MoveDiagonal2Icon size={16} className="text-light" />
        </button>
      </div>
    </Draggable>
  );
}
