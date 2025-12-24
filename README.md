# Notes REST API

A Full stack project for DanAds REST API for managing notes built with Node.js, Express, and TypeScript.

## Project Structure

```
notes-api/
├── client/                 # Frontend Project
|
├── src/
│   ├── controllers/        # Request handlers
│   │   └── noteController.ts
│   ├── middlewares/        # Custom middleware
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/            # Route definitions
│   │   └── noteRoutes.ts
│   ├── services/          # Business logic
│   │   └── noteService.ts
│   ├── types/             # TypeScript types & schemas
│   │   └── note.types.ts
│   ├── utils/             # Helper functions
│   │   └── asyncHandler.ts
│   └── app.ts             # App entry point
├── data/
│   └── notes.json         # Persistent storage
├── package.json
├── tsconfig.json
└── .env
```

### Installation

1. **Create project directory and initialize**

```bash
mkdir notes-api
cd notes-api
```

2. **Create package.json**

Copy the package.json content from the artifact and save it.

3. **Install dependencies**

```bash
npm install
```

5. **Create environment file**

```bash
# Create .env file
echo "PORT=3000" > .env
echo "NODE_ENV=development" >> .env
```