import mongoose from "mongoose";
import Grid from "gridfs-stream";

let gfs: Grid.Grid;
export function getGridFS() {
  if (!gfs) {
    const conn = mongoose.connection.db!;
    gfs = Grid(conn, mongoose.mongo);
    gfs.collection("uploads");
  }
  return gfs;
}
