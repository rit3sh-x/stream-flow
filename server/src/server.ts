import express from "express";
import cors from "cors";
import { Server, Socket } from 'socket.io';
import fs from "fs";
import http from "http";
import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ProcessVideoData, VideoChunkData } from "./types"

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    },
});

const uploadDir = path.join(__dirname, '../recordings');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const recordedChunks = new Map<string, Buffer[]>();

io.on("connection", (socket: Socket) => {
    console.log("🟢 Socket connected:", socket.id);
    recordedChunks.set(socket.id, []);

    socket.emit("connected");

    socket.on("video-chunks", (data: VideoChunkData) => {
        const { chunks, userId } = data;
        if (!recordedChunks.has(userId)) {
            recordedChunks.set(userId, []);
        }
        const userChunks = recordedChunks.get(userId);
        if (userChunks) {
            userChunks.push(Buffer.from(chunks));
        }
        console.log(`🟢 Chunk received for ${userId}, total=${chunks?.byteLength}`);
    });

    socket.on("process-video", async (data: ProcessVideoData) => {
        const { filename, userId } = data;
        console.log("🟢 Processing video:", filename);
        const chunks = recordedChunks.get(socket.id) ?? [];

        if (!chunks.length) {
            console.warn("⚠️ No chunks for", socket.id);
            return;
        }

        const blob = new Blob(chunks, { type: "video/webm" });
        const buffer = Buffer.from(await blob.arrayBuffer());
        const tmpPath = path.join(uploadDir, filename);

        fs.writeFileSync(tmpPath, buffer);

        try {
            const Key = filename;
            const Bucket = process.env.AWS_BUCKET_NAME;
            const ContentType = "video/webm";
            const command = new PutObjectCommand({
                Key,
                Bucket,
                ContentType,
                Body: buffer,
            });
            const fileStatus = await s3.send(command);
            if (fileStatus.$metadata.httpStatusCode === 200) {
                console.log("✅ File uploaded to S3");
            }
        } catch (s3Error) {
            console.error("❌ S3 upload error:", s3Error);
        }

        const processing = await axios.post(
            `${process.env.NEXT_API_HOST}/recording/${userId}/processing`,
            { filename }
        );

        if (processing.data.status !== 200) {
            console.log("❌ Error initiating video processing");
            return;
        }

        const transcribe = await axios.post(
            `${process.env.NEXT_API_HOST}/recording/${userId}/transcribe`,
            { filename }
        );

        if (transcribe.data.status !== 200) {
            console.log("❌ Error initiating video processing");
            return;
        }

        recordedChunks.set(socket.id, []);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
        recordedChunks.delete(socket.id);
    });
});

process.on('unhandledRejection', (err) => console.error("🔴 Unhandled rejection:", err));

const PORT = parseInt(process.env.PORT || "5000", 10);
server.listen(PORT, () => console.log(`🟢 Listening on ${PORT}`));