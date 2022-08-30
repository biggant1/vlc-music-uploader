const NodeID3 = require("node-id3");
const fetch = require("node-fetch");
const { phoneIP } = require("../config.json");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const stream = require("stream");

function updateTags(bin, album) {
  let tags = {
    album: album,
  };
  return NodeID3.update(tags, Buffer.from(bin));
}

async function uploadFile(formData) {
  let response = await fetch("http://" + phoneIP + "/upload.json", {
    method: "POST",
    headers: {
      "content-type": `multipart/form-data; boundary=${formData.getBoundary()}`,
    },
    body: formData,
  });
  console.log(response.status);
  let text = await response.text();
  return text === `"OK"`;
}

function getAudioBuffer(video) {
  return new Promise((resolve, reject) => {
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
        resolve(outputBuffer);
      });

    let yt = ytdl(video, {
      quality: "highestaudio",
      filter: "audioonly",
    });

    ffmpeg(yt).audioBitrate(128).format("mp3").writeToStream(bufferStream);
  });
}

async function getInfo(url) {
  return await ytdl.getBasicInfo(url, {
    quality: "highestaudio",
    filter: "audioonly",
  });
}

module.exports.updateTags = updateTags;
module.exports.uploadFile = uploadFile;
module.exports.getAudioBuffer = getAudioBuffer;
module.exports.getInfo = getInfo;
