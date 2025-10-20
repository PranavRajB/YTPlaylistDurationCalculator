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
  if (duration.hours > 0 && duration.minutes > 0)
    return `${duration.hours} hours ${duration.minutes} minutes ${duration.seconds} seconds`;
  else if (duration.hours == 0 && duration.minutes > 0)
    return `${duration.minutes} minutes ${duration.seconds} seconds`;
  else if (duration.hours == 0 && duration.minutes == 0)
    return `${duration.seconds} seconds`;
};

const calculateCompletionTimes = (totalDuration: Duration) => {
  const totalSeconds =
    totalDuration.hours * 3600 +
    totalDuration.minutes * 60 +
    totalDuration.seconds;

  const completionTimes = {
    "1.25x": totalSeconds / 1.25,
    "1.5x": totalSeconds / 1.5,
    "2x": totalSeconds / 2,
  };

  return completionTimes;
};

const Details = ({ data }: DetailsProps) => {
  const completionTimes = calculateCompletionTimes(data.totalDuration);

  return (
    <div>
      <p>Number of Videos: {data.numberOfVideos}</p>
      <p>Total Duration: {formatDuration(data.totalDuration)}</p>
      <p>Average Duration: {formatDuration(data.averageDuration)}</p>
      <p>Total Time to Complete:</p>
      <ul>
        <li>
          At 1.25x speed:{" "}
          {formatDuration({
            hours: Math.floor(completionTimes["1.25x"] / 3600),
            minutes: Math.floor((completionTimes["1.25x"] % 3600) / 60),
            seconds: Math.floor(completionTimes["1.25x"] % 60),
          })}
        </li>
        <li>
          At 1.5x speed:{" "}
          {formatDuration({
            hours: Math.floor(completionTimes["1.5x"] / 3600),
            minutes: Math.floor((completionTimes["1.5x"] % 3600) / 60),
            seconds: Math.floor(completionTimes["1.5x"] % 60),
          })}
        </li>
        <li>
          At 2x speed:{" "}
          {formatDuration({
            hours: Math.floor(completionTimes["2x"] / 3600),
            minutes: Math.floor((completionTimes["2x"] % 3600) / 60),
            seconds: Math.floor(completionTimes["2x"] % 60),
          })}
        </li>
      </ul>
    </div>
  );
};

export default Details;
