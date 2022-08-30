const readline = require("readline");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const { createWriteStream, writeFileSync } = require("fs");
const stream = require("stream");

let id = "7wNb0pHyGuI";

const buffers = [];
const bufferStream = new stream.PassThrough();

bufferStream
  .on("start", () => {
    console.log("Pass-through stream has started");
  })
  .on("data", (buf) => {
    buffers.push(buf);
  })
  .on("end", function () {
    const outputBuffer = Buffer.concat(buffers);
    console.log(outputBuffer);
    writeFileSync("test.mp3", outputBuffer);
  });

let yt = ytdl(id, {
  quality: "highestaudio",
  filter: "audioonly",
});

ffmpeg(yt).audioBitrate(128).format("mp3").writeToStream(bufferStream);
