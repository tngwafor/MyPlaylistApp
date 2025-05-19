const http = require('http');
const express = require("express"); /* Accessing express module */
const path = require('path');
const httpSuccessStatus = 200;
const app = express(); /* app7 is a request handler function */
const bodyParser = require("body-parser");
const fs = require('fs');
const routes = require("./routes");
app.use(bodyParser.urlencoded({ extended: true }));


/* Get portnumber that user provides */
let userPort= parseInt(process.argv[2], 10);
app.listen(userPort);

console.log(`Web server started and running at http://localhost:${userPort}`);
const prompt = "Stop to shutdown the server: ";
console.log(prompt);
process.stdin.setEncoding("utf8"); /* encoding */
process.stdin.on('readable', () => {  /* on equivalent to addEventListener */
	const dataInput = process.stdin.read();
	if (dataInput !== null) {
		const command = dataInput.trim();
    /*const json = JSON.parse(command); */

		if (command === "stop") {
			// Not using console.log as it adds a newline by default
			process.stdout.write("Shutting down the server"); 
            process.exit(0);  /* exiting */
        }
    }
    process.stdout.write(prompt);
    process.stdin.resume(); // Allows the code to process next request
  }
);

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(express.static(path.join(__dirname, 'public')));
process.stdin.setEncoding("utf-8")
app.use("/", routes);


  // app.post("/justAdded", async (request, response) => {
  //   const song = {
  //     songName : request.body.songName,
  //     artist : request.body.artist,
  //     Genre : request.body.Genre,
  //   };
  
  //   try {
  //     await addSong(song); //  INSERT into MongoDB
  //     response.render("justAdded.ejs", song);
  //   } catch (err) {
  //     console.error("Failed to insert song:", err);
  //     response.status(500).send("Failed to add song.");
  //   }
  // });

  
  app.get("/viewPlayList", async (req, res) => {
    try {
      const playlistHTML = await getPlaylist();
      const obj = {
        playList : playlistHTML,
      }

      res.render("viewPlaylist", obj);
    } catch (err) {
      console.error("Error generating playlist table:", err);
      res.status(500).send("Error loading playlist");
    }
  });
  
  

