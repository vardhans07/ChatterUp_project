import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { messageModel } from "./message.schema.js";

const app = express();
app.use(express.static(path.resolve("./public")));

export const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store active users
let activeUsers = new Set();

io.on("connection", (socket) => {
    registerEvents(socket);
});

function registerEvents(socket) {

    // When a user joins
    socket.on("userJoined", async (payload) => {

        const user = {
            id: socket.id,
            name: payload.Username,
            avatar: payload.userImage
        };

        activeUsers.add(user);

        io.emit("online-users", [...activeUsers]);

        // Fetch last 24 hours of messages
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const messages = await messageModel
            .find({ dateTime: { $gte: since } })
            .sort({ timestamp: 1 })
            .select("-_id name userImage message dateTime");

        socket.emit("chat-history", messages);
    });

    // Save message to DB
    socket.on("storeMessage", async (msg) => {
        try {
            await messageModel(msg).save();
        } catch (err) {
            console.error("Failed to save message", err);
        }
    });

    // Broadcast chat
    socket.on("sendChat", (msg) => {
        socket.broadcast.emit("receiveChat", msg);
    });

    // Typing indicator
    socket.on("typingStatus", (status) => {
        socket.broadcast.emit("typingStatus", status);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        let toRemove = null;

        activeUsers.forEach((u) => {
            if (u.id === socket.id) toRemove = u;
        });

        if (toRemove) activeUsers.delete(toRemove);

        io.emit("online-users", [...activeUsers]);
    });
}
