const path = require("path");
  require("dotenv").config({
    path: path.resolve(__dirname, "info/.env"),
  });
  const { MongoClient, ServerApiVersion } = require("mongodb");
  
  const uri = process.env.MONGO_CONNECTION_STRING;
  const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
  console.log("Mongo URI from .env:", process.env.MONGO_CONNECTION_STRING);


  const databaseName = "MyPlayList";
  const collectionName = "Favorite Songs"

  async function connectDB() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
      }      
    // if (!client.isConnected && !client.topology?.isConnected()) {
    //   await client.connect();
    //}
    const db = client.db(databaseName);
    return db.collection(collectionName);
  }
  
  // Add an applicant
  async function addSong(song) {
    const collection = await connectDB();
    await collection.insertOne(song);
  }

  async function getAllSongs() {
    const collection = await connectDB();
    const songs = await collection.find({}).toArray();
    return songs;
  }

  async function getPlaylist() {
    const collection = await connectDB();
    const allSongs = await collection.find({}).toArray();
  
    let tableHTML = "<table border='1'>";
    tableHTML += "<tr><th>Song Name</th><th>Artist</th><th>Genre</th></tr>";
  
    allSongs.forEach(song => {
      tableHTML += `<tr><td>${song.songName}</td><td>${song.artist}</td><td>${song.Genre}</td></tr>`;
    });
  
    tableHTML += "</table>";
    console.log("All songs in DB:", allSongs);

    return tableHTML;
  }

  const axios = require("axios");

  async function getArtistImage(artistName) {
  const apiKey = process.env.LASTFM_API_KEY;
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`;

  try {
    const response = await axios.get(url);
    const imageList = response.data.artist?.image;
    console.log("Returned images for", artistName, imageList);

    const largeImage = imageList?.find(img => img.size === "extralarge")?.["#text"];

    return (!largeImage || largeImage.trim() === "")
      ? "/Default.png" // Local fallback from /public
      : largeImage;

  } catch (error) {
    console.error("Error fetching artist image:", error.message);
    return "/Default.png"; // fallback even if API call fails
  }
}



// async function getArtistImage(artistName) {
//   const apiKey = process.env.LASTFM_API_KEY;
//   const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`;

//   try {
//     const response = await axios.get(url);
//     const imageList = response.data.artist?.image;
//     const largeImage = imageList?.find(img => img.size === "extralarge")?.["#text"];
//     return largeImage || null;
//   } catch (error) {
//     console.error("Error fetching artist image:", error.message);
//     return null;
//   }
// }

  module.exports = { addSong,getPlaylist,getArtistImage};