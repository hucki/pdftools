export const AudioPlayer = ({ src }: { src: string }) => {
  return (
    <audio controls className="col-span-2 w-full" preload="none">
      <track kind="captions" />
      <source src={src} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};
