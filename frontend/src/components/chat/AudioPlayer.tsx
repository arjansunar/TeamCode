import { useEffect, useRef } from "react";

export const AudioPlayer: React.FC<{ stream?: MediaStream }> = ({ stream }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && stream) audioRef.current.srcObject = stream;
  }, [stream]);
  return (
    <audio style={{ width: "100%" }} ref={audioRef} autoPlay muted={false} />
  );
};
