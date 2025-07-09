# Stream Flow

Stream Flow is a cross-platform application designed for recording, managing, and sharing AI-powered video content. It integrates a native desktop recorder with a web-based dashboard, all connected by a real-time backend.

---

## Core Features

- **Screen & Audio Recording:** A native Electron application allows users to capture their screen and audio from various sources.
- **AI-Powered Content Generation:** Automatically generates video titles, descriptions, and summaries using Large Language Models (LLMs).
- **Cloud Storage:** All video recordings are securely uploaded to AWS S3 for storage and processing.
- **Workspace Collaboration:** Users can create workspaces, invite team members, manage permissions, and share video content.
- **Real-time Notifications:** Receive alerts when a user views a video for the first time.
- **Modern UI:** A responsive and accessible user interface for both web and desktop applications, featuring light and dark themes.

---

## Monorepo Structure

The project is organized as a monorepo with three distinct packages:

```
stream-flow/
│
├── frontend/   # Next.js web application (Dashboard, Video Management, AI Tools)
├── native/     # Electron desktop application (Screen/Audio Recording, Studio Controls)
├── server/     # Node.js backend (API, WebSocket Server, S3 Uploads, AI Processing)
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v20 or newer recommended)
- Yarn, npm or bun package manager
- PostgreSQL database (local or hosted)
- AWS Account with:
  - S3 bucket for video storage
  - IAM user with S3 access permissions
  - CloudFront distribution for video streaming
- Clerk account for authentication (https://clerk.com)
- OpenRouter API key for AI features (https://openrouter.ai)
- Gladia API key for transcription services (https://gladia.io)
- Optional: Wix developer account for integrations

### 1. Clone the Repository

```sh
git clone https://github.com/rit3sh-x/stream-flow.git
cd stream-flow
```

### 2. Install Dependencies

Install the dependencies for each package from the root directory.

```sh
# Frontend dependencies (Next.js)
cd frontend && bun install

# Native dependencies (Electron)
cd ../native && npm install

# Server dependencies (Node.js)
cd ../server && npm install
```

After installing frontend dependencies, Prisma will automatically generate the client via the postinstall script.

### 3. Environment Variables

Create a `.env` file in each package (`frontend`, `native`, `server`) using the provided `.env.example` files as templates.

### 3.1. Database Setup

The application uses PostgreSQL with Prisma ORM. After configuring your `DATABASE_URL` in the frontend `.env` file:

```sh
cd frontend

# Run migrations if you're setting up for production
npx prisma migrate dev

# If you want to explore your database
npx prisma studio
```

- **`frontend/.env`:**
  - `DATABASE_URL`: PostgreSQL database connection string
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
  - `CLERK_SECRET_KEY`: Your Clerk secret key
  - Clerk redirect URLs:
    - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: "/sign-in"
    - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: "/sign-up"
    - `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`: "/callback"
    - `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`: "/callback"
  - `MAILER_EMAIL`: Email address for sending notifications
  - `MAILER_PASSWORD`: Password for the email account
  - `NEXT_PUBLIC_HOST_URL`: Base URL for your frontend (e.g., "http://localhost:3000")
  - `WIX_OAUTH_KEY`: Wix OAuth key if using Wix integration
  - `NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL`: CloudFront URL for video streaming
  - `GLADIA_API_KEY`: API key for Gladia (used for transcription)
  - `OPENROUTER_API_KEY`: API key for OpenRouter (LLM access)
  - `INTERNAL_ELECTRON_APP_KEY`: Secret key for secure communication with the Electron app

- **`native/.env`:**
  - `VITE_APP_URL`: URL for the Vite development server (e.g., "http://localhost:5173")
  - `VITE_DEV_SERVER_URL`: URL for the development server (e.g., "http://localhost:5173")
  - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
  - `VITE_SOCKET_URL`: WebSocket URL for the backend server (e.g., "http://localhost:5000")
  - `VITE_HOST_URL`: Base URL for the frontend (e.g., "http://localhost:3000")
  - `INTERNAL_ELECTRON_APP_KEY`: Same secret key as defined in frontend's .env

- **`server/.env`:**
  - `OPENROUTER_API_KEY`: API key for OpenRouter
  - `AWS_ACCESS_KEY_ID`: Your AWS access key
  - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
  - `AWS_REGION`: AWS region for your S3 bucket (e.g., "us-east-1")
  - `AWS_BUCKET_NAME`: Name of your S3 bucket for video storage
  - `NEXT_API_HOST`: URL for the frontend's API (e.g., "http://localhost:3000")
  - `PORT`: Port for the server to run on (e.g., 4000)

> **Important**: Make sure the `INTERNAL_ELECTRON_APP_KEY` is identical in both frontend and native environments to allow secure communication between them.

### 4. Running the Applications

Each part of the application must be run in a separate terminal.

#### Backend (`server`)

```sh
cd server
npm run dev
```
This will start the Node.js server on port 5000 (or whatever port you specified in your .env file). The server handles WebSocket connections from the native app and manages uploads to AWS S3.

#### Frontend (`frontend`)

```sh
cd frontend
bun run dev
```
This will start the Next.js development server on port 3000. Access the web dashboard by navigating to http://localhost:3000 in your browser.

#### Native (`native`)

```sh
cd native
npm run dev
```
This will launch the Electron development environment with the recording application. The app includes the main widget, studio controls, and webcam view.

> **Note**: All three applications must be running simultaneously for the full functionality of Stream Flow to work properly.

---

## Architectural Flow

The application follows a specific flow for recording and processing video:

1.  **Initiate Recording:** The user starts a recording from the **Electron app (`native`)**.
2.  **Capture Media:** The app captures screen and audio, controlled via a multi-window setup (main widget, studio controls, and a floating webcam view).
3.  **Stream Chunks:** Video data is captured in chunks and streamed in real-time to the **Node.js backend (`server`)** via a Socket.io connection.
4.  **Assemble and Upload:** The backend server receives the chunks, assembles them into a single `.webm` video file, and uploads it directly to an **AWS S3 bucket**.
5.  **Trigger Processing:** After a successful upload, the server makes an API call to the **Next.js application's (`frontend`)** backend to notify it that a new video is ready for processing.
6.  **AI Enhancement:** The Next.js backend can then trigger AI jobs to transcribe the video and generate metadata like titles and summaries.
7.  **View and Manage:** The processed video and its metadata become available for viewing and management in the user's web dashboard.

---

## Codebase Overview

### `frontend/`

- **Framework:** Built with Next.js 15.3.5 and React 19.
- **Authentication:** Uses Clerk for user management and authentication.
- **Data Management:**
  - Prisma 6.11.1 for database ORM with PostgreSQL
  - @tanstack/react-query 5.81.5 for server state management
  - Redux Toolkit for client state management
- **UI Components:**
  - Shadcn UI component library
  - Tailwind CSS 4 for styling
  - Lucide React for icons
  - React Hook Form with Zod validation
- **AI Integration:**
  - OpenAI/OpenRouter for LLM capabilities
  - Gladia for audio transcription
- **Functionality:**
  - User dashboard and workspace management
  - Video playback and management
  - AI-powered content generation
  - Collaborative workspaces

### `native/`

- **Framework:** An Electron application powered by:
  - Vite as the build tool
  - React for UI components
  - Electron for desktop capabilities
- **Architecture:** Features a multi-window design:
  - `electron/main.ts`: The main Electron process, responsible for creating and managing windows
  - `index.html` with `main-app.tsx`: The main widget for initiating recordings
  - `studio.html` with `studio-app.tsx`: A separate window for recording controls
  - `webcam.html` with `webcam-app.tsx`: A floating, resizable window to display the webcam feed
- **System Interaction:**
  - Uses Electron's `ipcMain` and `desktopCapturer` APIs for screen/audio source capture
  - Custom hooks like `use-media-sources.ts` and `use-studio-settings.ts` to manage media configurations
  - Window state management for positioning and appearance
- **Real-time Communication:**
  - Socket.io client to stream video data to the server
  - Secure communication with the frontend using the shared `INTERNAL_ELECTRON_APP_KEY`

### `server/`

- **Framework:** A Node.js server built with:
  - Express for API endpoints
  - TypeScript for type safety
  - Socket.io for real-time communication
- **Media Processing:**
  - Handles video chunk assembly from the Electron client
  - Processes recordings in the `recordings/` directory
  - Manages video format conversion if needed
- **Cloud Integration:**
  - AWS SDK for S3 bucket integration
  - Secure file uploads with proper credentials
  - Organized storage structure for user videos
- **Workflow Orchestration:**
  - After upload completion, triggers frontend processing via API call to `NEXT_API_HOST`
  - Coordinates with AI services for video analysis and transcription
  - Handles cleanup of temporary files after processing

---

## Contributing

1. Fork the repo and create your branch.
2. Make your changes and add tests if needed.
3. Submit a pull request.

## License

MIT

---

## Development Best Practices

- **Code Organization:** Follow the established patterns in each package:
  - Frontend: Group by features in `src/modules/`, shared components in `src/components/`
  - Native: Keep window-specific logic separate between main widget, studio, and webcam
  - Server: Maintain clean separation between WebSocket handling and file processing

- **Environment Variables:** Never commit `.env` files to the repository. Use the provided `.env.example` files as templates.

- **Prisma Workflow:**
  - Make schema changes in `frontend/prisma/schema.prisma`
  - Run `npx prisma migrate dev --name your_change_description` to create migrations

## Troubleshooting

- **Database Connection Issues:**
  - Verify your PostgreSQL connection string in `DATABASE_URL`
  - Ensure the database exists and user has proper permissions
  - Run `npx prisma db push` to sync schema changes

- **Socket Connection Failures:**
  - Check that server is running on the expected port
  - Verify `VITE_SOCKET_URL` in native's .env points to the correct server URL
  - Inspect browser console and server logs for connection errors

- **AWS S3 Upload Issues:**
  - Verify AWS credentials are correct
  - Ensure the S3 bucket exists and has proper permissions
  - Check server logs for any AWS SDK error messages

- **Electron Development:**
  - If windows don't appear, check the Electron logs for startup errors
  - For webcam access issues, verify that proper permissions are granted to the app