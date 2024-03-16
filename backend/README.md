# Discord Clone
The backend for the discord clone project. This project is a two part operation, aimed at applying some concepts and acting
as a POC for Tanstack Store, Websocket Cache invalidation as well as for teaching purposes.

## Getting started:

### Setting up the database
This project relies on a mongodb database to be accessible. To facilitate this, the docker compose file for this project is located in the /docker directory.

To run this, ensure that docker is installed and run `docker compose up -d`.

Once this is running, you can use Mongo Compass or any other extension to ensure that the database is running and accessible from your environment.

### Run The application:

```bash
bun install
```

To run:

```bash
bun dev
```

