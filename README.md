# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/)

## Downloading

```
git clone https://github.com/SpiritForest/nodejs2023Q2-service.git
```

## Settin up
In the root project folder create .env file, you can use fot it a template that already exists in the root folder, it's name is  '.env.example'

## Running application inside docker containers

```
docker-compose up
```

## Running application locally (optional)

Open the file 'src\config\typeOrm.config.ts' and change host name from 'postgres' to 'localchost' so the new version will look like **host: 'localhost'**
If the postgres container does not exist run it using the following command:
```
npm install
```

```
docker run -d -p 5432:5432 postgres:15.3 --name postgres -v postgresql-data:/var/lib/postgresql/data
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
