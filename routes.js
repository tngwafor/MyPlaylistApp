const express = require("express");
const router = express.Router();
const { addSong, getPlaylist, getArtistImage } = require('./MongoOpsPL');

// GET routes
router.get("/", (req, res) => res.render("Home.ejs"));
router.get("/home", (req, res) => res.render("Home.ejs"));
router.get("/addToPL", (req, res) => res.render("addToPL"));

router.get("/viewPlayList", async (req, res) => {
  try {
    const playlistHTML = await getPlaylist();
    res.render("viewPlaylist", { playList: playlistHTML });
  } catch (err) {
    console.error("Error generating playlist:", err);
    res.status(500).send("Error loading playlist");
  }
});

router.post("/justAdded", async (req, res) => {
  const song = {
    songName: req.body.songName,
    artist: req.body.artist,
    Genre: req.body.Genre,
  };

  try {
    await addSong(song);
    const artistImage = await getArtistImage(song.artist);
    res.render("justAdded", { ...song, artistImage });
  } catch (err) {
    console.error("Failed to insert song or fetch image:", err);
    res.status(500).send("Failed to add song.");
  }
});

module.exports = router;

