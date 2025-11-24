import { Server } from "socket.io";

export function initUploadProgress(io: Server) {
  io.on("connection", (socket) => {
    socket.on("upload:progress", (payload) => {
      // broadcast progress to user room
      if (payload.userId) io.to(payload.userId).emit("upload:progress", payload);
    });
    socket.on("join", (userId) => socket.join(userId));
  });
}
