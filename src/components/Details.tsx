import React from "react";

type Duration = {
  hours: number;
  minutes: number;
  seconds: number;
};

type DetailsProps = {
  data: {
    numberOfVideos: number;
    averageDuration: Duration;
    totalDuration: Duration;
  };
};

const formatDuration = (duration: Duration) => {
  return `${duration.hours} hours ${duration.minutes} minutes ${duration.seconds} seconds`;
};

const Details = ({ data }: DetailsProps) => {
  return (
    <div>
      <p>Number of Videos: {data.numberOfVideos}</p>
      <p>Total Duration: {formatDuration(data.totalDuration)}</p>
      <p>Average Duration: {formatDuration(data.averageDuration)}</p>
    </div>
  );
};

export default Details;
