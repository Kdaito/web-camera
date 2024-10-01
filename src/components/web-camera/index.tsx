"use client";

import {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";

export type WebCameraHandles = {
  capture: () => string | undefined;
};

type Props = {
  width: number;
  height: number;
};

const WebCamera: ForwardRefRenderFunction<WebCameraHandles, Props> = (
  { width, height },
  ref
) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      capture: () => {
        const canvas = document.createElement("canvas");
        if (videoRef.current === null) return;
        const { videoWidth, videoHeight } = videoRef.current;
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        const context = canvas.getContext("2d");
        if (context === null) return;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/png");
      },
    }),
    []
  );

  const getStream = useCallback(async () => {
    const aspectRatio = width / height;
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: width },
        aspectRatio,
      },
      audio: false,
    });
  }, [width, height]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const video = videoRef.current;

    const setVideo = async () => {
      stream = await getStream();
      if (video === null) return;
      video.srcObject = stream;
      video.play();
    };

    setVideo();

    const cleanupVideo = () => {
      if (!stream) return;
      stream.getTracks().forEach((track) => track.stop());
      if (video === null) return;
      video.srcObject = null;
    };

    return cleanupVideo;
  }, [getStream]);

  return <video ref={videoRef} playsInline width={width} height={height} />;
};

export default forwardRef(WebCamera);
