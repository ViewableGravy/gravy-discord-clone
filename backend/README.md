# Discord Clone
The backend for the discord clone project. This project is a two part operation, aimed at applying some concepts and acting
as a POC for Tanstack Store, Websocket Cache invalidation as well as for teaching purposes.

## Getting started:

### Environment variables
**NODE_ENV**=development #Sets the environment to development for bun to recognize
**DATABASE_URL**="file:./dev.db" #Tells prisma where to store the database
**JWT_SECRET**="KEY HERE" # This can be generated using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
**SECRET_KEY**="STRING HERE" # Key for recaptcha, this one will be updated at some point

### Setting up the database
This project uses SQLite and prisma to operate. This should automatically be setup as part of the migrations.

Unfortunately bun doesn't seem to like running the migrations so for now we can use npx. This is bundled with npm so if you don't already have this, just install npm and then you can run the following command to get things setup. Note that this must be run in the backend folder.

```bash
npx prisma migrate dev
```

Once this has run, there should be a file called dev.db in your prisma directory.

### Run The application:

```bash
bun install
```

To run:

```bash
bun dev
```

