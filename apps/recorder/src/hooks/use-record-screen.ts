import { useCallback, useRef, useState } from "react";

export type RecordScreenStatus = "active" | "idle" | "paused" | "error";

export interface RecordScreenResponse {
  start: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  status: RecordScreenStatus;
  url: string | null;
}

export interface RecordScreenProps {
  displayMediaOptions?: DisplayMediaStreamOptions;
}

export function useRecordScreen({
  displayMediaOptions,
}: RecordScreenProps): RecordScreenResponse {
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<RecordScreenStatus>("active");

  const media = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const stop = useCallback(() => {
    if (media.current?.state !== "inactive") media.current?.stop();
    setStatus("idle");
  }, [media]);

  const start = useCallback(async () => {
    try {
      const stream =
        await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp8",
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setUrl(url);
        chunks.current = [];
      };

      stream.getVideoTracks()[0].addEventListener("ended", stop);
      recorder.start();
      media.current = recorder;

      setStatus("active");
    } catch {
      setStatus("error");
    }
  }, [stop, displayMediaOptions]);

  const pause = useCallback(() => {
    if (media.current) {
      if (media.current.state === "recording") media.current.pause();
      setStatus("paused");
    }
  }, []);

  const resume = useCallback(() => {
    if (media.current) {
      if (media.current.state === "paused") media.current.resume();
      setStatus("active");
    }
  }, []);

  return {
    start,
    stop,
    status,
    pause,
    resume,
    url,
  };
}
