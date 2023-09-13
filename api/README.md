# README

docker build -t me/demo-node .
docker run -it me/demo-node sh

When cloning this project, the UI is setup as a git submodule:

```bash
git clone <url>
cd <folder>
git submodule init
git pull --recurse-submodules
npm install
```

Then, you'll need to build the React app

```bash
cd react
cp .env.example .env
npm install --legacy-peer-deps
npm run build
```

If it complains about versions, make sure that `SKIP_PREFLIGHT_CHECK=true` is in the `.env` file inside of the React folder.

## Database Migration

This project comes with a Docker Compose file to run Postgres in a Docker container:

```bash
# from project root
docker-compose up -d
```

Once Docker starts the container, there is a shell script to populate the database:

```bash
chmod u+x populate.sh
./populate.sh
```

Connect to database locally:
psql -h localhost -p {DB_PORT} -d {DB_NAME} -U {DB_USER} --password

Enter {DB_PASSWORD}

It needs translated to PowerShell, but the commands are mostly the same.

## Running

Once it is all configured, just run the app:

```bash
npm run dev
```

Then browse to `http://localhost:3001` and it should show up!

## Getting the latest hspc-client build served
Start in the directory right outside hspc-api and hspc-client
```
rm -r hspc-api/react/build/*
cd hspc-client
npm run build
cd ..
mv hspc-client/build hspc-api/react
```

# .env File Example

SESSION_SECRET=randomtexthere
APP_URL=http://localhost:3000
DB_HOST=hspc-api-post_db-1
DB_PORT=58525
DB_PORTS=58525:5432
DB_NAME=postgres
DB_USER=hspc_admin
DB_PASSWORD=password
DEBUG=true
REACT_APP_ENABLED=true
