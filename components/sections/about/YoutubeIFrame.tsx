const YoutubeIFrame = ({ video_id }: { video_id: string }) => {
  return (
    <iframe
      className="border-hidden"
      src={`https://www.youtube.com/embed/${video_id}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    ></iframe>
  );
};

export default YoutubeIFrame;
