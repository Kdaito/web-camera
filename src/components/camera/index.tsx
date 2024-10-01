"use client";

import { useEffect, useRef, useState } from "react";
import WebCamera, { WebCameraHandles } from "../web-camera";
import { mobileCheck } from "@/lib/device";

const Camera: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isIgnoreDevice, setIsIgnoreDevice] = useState(false);
  const [dataUrl, setDateUrl] = useState<string | undefined>(undefined);

  const cameraRef = useRef<WebCameraHandles>(null);

  const handleCapture = () => {
    if (cameraRef.current === null) return;
    const capturedUrl = cameraRef.current.capture();
    setDateUrl(capturedUrl);
    setStep(1);
  };

  useEffect(() => {
    const isMobile = mobileCheck();
    setIsIgnoreDevice(!isMobile);
  }, []);

  if (isIgnoreDevice) {
    return (
      <div className="h-screen flex items-center justify-center">
        モバイル端末でアクセスしてください
      </div>
    );
  }

  if (step === 0) {
    return (
      <div className="px-5 py-10 flex items-center flex-col">
        <WebCamera ref={cameraRef} width={200} height={200} />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleCapture();
          }}
          className="mt-5 text-white rounded bg-black px-3 py-1"
        >
          写真を撮る
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-10 flex items-center flex-col">
      <p className="pb-3">写真とったよ</p>
      <div className="w-[200px] h-[200px] object-contain">
        <img className="w-full h-full" src={dataUrl} alt="captured picture" />
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          setStep(0);
        }}
        className="mt-5 text-white rounded bg-black px-3 py-1"
      >
        もう一度写真を撮る
      </button>
      <a href={dataUrl} download="canvas-image.png" className="mt-5 text-white rounded bg-teal-500 px-3 py-1">
        ダウンロードする
      </a>
    </div>
  );
};

export default Camera;
