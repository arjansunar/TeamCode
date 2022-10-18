import { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{ stream?: MediaStream }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);
  return (
    <video style={{ width: "400px" }} ref={videoRef} autoPlay muted={true} />
  );
};
