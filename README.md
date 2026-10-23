# MyPlaylistApp

#MyPlaylistApp

A full-stack music playlist web application, built as a small-scale take on a music streaming service. Users can add songs to a personal playlist, view the saved collection in a table, and see an artist image pulled live from a third-party music API when a song is added. Data is persisted in MongoDB, served through Express/Node.js routes, and rendered with EJS templates styled with HTML/CSS.

Features
Add songs through a form capturing song name, artist, and genre

View the full playlist as a dynamically generated table backed by the database

Artist imagery: on each successful add, the app queries the Last.fm API and displays the artist's image on a confirmation page, with a local fallback image if the artist or image can't be found

Graceful error handling: database and API failures return clear HTTP 500 responses instead of crashing the server

Runtime-configurable port and a console command (stop) to shut the server down cleanly

Tech Stack
Layer	Technology

Database	MongoDB (official mongodb Node driver, hosted connection via URI)

Server	Node.js, Express

Templating	EJS (server-side rendered HTML)

Frontend	HTML, CSS (static assets served from /public)

External API	Last.fm artist.getinfo (via axios)

Config	dotenv for secrets (connection string, API key)

Architecture
MyPlaylistApp/
├── MyPlaylist.js      # Entry point: Express setup, middleware, view engine, port + shutdown handling
├── routes.js          # Express Router: GET/POST route definitions
├── MongoOpsPL.js      # Data-access layer: MongoDB connection and operations, Last.fm lookup
├── templates/         # EJS views (Home, addToPL, viewPlaylist, justAdded)
├── public/            # Static assets (CSS, default fallback image)
└── info/.env          # Environment variables (not committed)

The project separates concerns into three layers: the server bootstrap (MyPlaylist.js), the routing layer (routes.js), and a data-access module (MongoOpsPL.js) that owns all database and external API logic. Routes never talk to MongoDB directly; they call exported functions (addSong, getPlaylist, getArtistImage), which keeps the code easy to test and modify.

Data Model
Database: MyPlayList
Collection: Favorite Songs
Document shape:
json
{
  "songName": "string",
  "artist": "string",
  "Genre": "string"
}
Routes
Method	Path	Description
GET	/ and /home	Renders the home page
GET	/addToPL	Renders the add-song form
GET	/viewPlayList	Queries all songs from MongoDB and renders them as a table
POST	/justAdded	Inserts the submitted song into MongoDB, fetches the artist image, and renders a confirmation page

Key Implementation Details
Connection reuse: connectDB() checks whether the MongoClient is already connected before opening a new connection, avoiding redundant connections across requests.

Async/await with try/catch: All database and API calls are asynchronous and wrapped in error handling so a failed insert or API call returns a 500 response rather than an unhandled rejection.

Resilient third-party integration: The Last.fm lookup uses optional chaining to safely navigate the response, selects the extralarge image, and falls back to a bundled default image if the response is empty or the request fails.
Secrets kept out of source: The MongoDB connection string and Last.fm API key are loaded from an environment file via dotenv.
Server-side rendering: Express renders EJS templates with data passed in as view models, and serves CSS and images statically from /public.

Getting Started
Prerequisites
Node.js (v16+ recommended)
A MongoDB database (e.g., a free MongoDB Atlas cluster)
A Last.fm API key
Installation
bash
git clone https://github.com/tngwafor/MyPlaylistApp.git
cd MyPlaylistApp
npm install express ejs body-parser mongodb dotenv axios
Configuration

Create info/.env with:

MONGO_CONNECTION_STRING=your_mongodb_connection_string
LASTFM_API_KEY=your_lastfm_api_key
Run

The port is passed as a command-line argument:

bash
node MyPlaylist.js 3000

Then open http://localhost:3000. Type stop in the terminal to shut the server down.

What I Learned : 

Designing a small but layered Node/Express application with a clear separation between routing and data access
Modeling and querying a document database with the MongoDB Node driver (insert and find operations)
Integrating and defensively handling a third-party REST API
Managing configuration and secrets with environment variables
Building server-rendered pages with EJS templates and static asset serving

Future Improvements : 

Escape or sanitize user-submitted values before rendering them into HTML, and build the table in the EJS template instead of as an HTML string
Add edit and delete functionality to complete full CRUD
Add input validation and duplicate-song detection
Add user accounts so each user has their own playlists
Add search and filter by artist or genre
Add automated tests for the data-access layer and routes

Author
tngwafor-University of Maryland
