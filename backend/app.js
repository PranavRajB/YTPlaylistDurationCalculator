const express = require("express");
require("dotenv").config();
const app = express();
const axios = require("axios");
app.use(express.json());
const cors = require("cors");
const apiKey = process.env.API_KEY;
console.log("API Key:", apiKey); // Debugging line to check if API key is loaded
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the URL of your frontend server
  })
);

const extractPlaylistId = (link) => {
  let startIndex = link.indexOf("list=") + 5;
  let endIndex = link.indexOf("&", startIndex);
  endIndex = endIndex === -1 ? link.length : endIndex; // If there is no '&', use the whole remaining string
  return link.substring(startIndex, endIndex);
};
async function fetchPlaylistItems(playlistId) {
  let items = [];
  let pageToken = "";

  do {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems`,
      {
        params: {
          part: "contentDetails",
          playlistId: playlistId,
          maxResults: 50, // This is the maximum allowed by the API
          pageToken: pageToken,
          key: apiKey,
        },
      }
    );

    items = items.concat(response.data.items);
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return items;
}

async function fetchVideoDetails(videoId) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: "contentDetails",
          id: videoId,
          key: apiKey,
        },
      }
    );

    const video = response.data.items[0];

    if (!video || !video.contentDetails) {
      console.warn("Video not found or no contentDetails:", videoId);
      return { duration: "PT0S" }; // return 0 seconds for missing videos
    }

    return video.contentDetails;
  } catch (err) {
    console.error("Error fetching video details:", videoId, err.message);
    return { duration: "PT0S" };
  }
}

// Helper function to parse ISO 8601 duration format
function parseDuration(duration) {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

function secondsToHMS(duration) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}
app.post("/", async (req, res) => {
  const playlistLink = req.body.link;
  if (!playlistLink) {
    return res.status(400).json({ error: "No link provided" });
  }

  const playlistId = extractPlaylistId(playlistLink);
  try {
    const items = await fetchPlaylistItems(playlistId);
    const videoDetailsPromises = items
      .map((item) => item.contentDetails?.videoId) // optional chaining
      .filter(Boolean) // remove undefined IDs
      .map((videoId) => fetchVideoDetails(videoId));

    const videos = await Promise.all(videoDetailsPromises);

    // Calculate total duration and other statistics
    let totalDuration = 0;
    videos.forEach((video) => {
      const durationInSeconds = parseDuration(video.duration);
      totalDuration += durationInSeconds;
    });

    const numberOfVideos = videos.length;
    const averageDuration = Math.floor(totalDuration / numberOfVideos);

    // Convert totalDuration to a more readable format if necessary
    // ...
    const readableTotalDuration = secondsToHMS(totalDuration);
    const readableAverageDuration = secondsToHMS(averageDuration);

    res.json({
      numberOfVideos: numberOfVideos,
      averageDuration: readableAverageDuration,
      totalDuration: readableTotalDuration,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
