import React, { useState } from "react";
import axios from "axios";
import Details from "./Details";

// Define the Duration type
type Duration = {
  hours: number;
  minutes: number;
  seconds: number;
};

// Define the Response type
type ResponseData = {
  numberOfVideos: number;
  averageDuration: Duration;
  totalDuration: Duration;
};

const Upload = () => {
  const [link, setLink] = useState<string>("");
  const [response, setResponse] = useState<ResponseData | null>(null); // Initialize as null
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const result = await axios.post("http://localhost:3000/", {
        link,
      });
      setResponse(result.data); // Assume result.data matches the ResponseData type
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err) && err.response) {
        setError("An error occurred: " + err.response.data.message);
      } else {
        setError("An error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter URL"
        onChange={(e) => setLink(e.target.value)}
      />
      <br />
      <button type="submit">Upload</button>
      {error && <p className="error">{error}</p>}
      {response && <Details data={response} />}
    </form>
  );
};

export default Upload;
