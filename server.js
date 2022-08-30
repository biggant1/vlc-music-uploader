const express = require("express");
const app = express();
const port = process.env.PORT || 5080;
const multer = require("./Util/multer");
const {
  updateTags,
  uploadFile,
  getInfo,
  getAudioBuffer,
} = require("./Util/util");
const FormData = require("form-data");
const fs = require("fs");

app.use(express.static(__dirname + "/public"));

app.post("/api/upload", multer.array("file"), async (req, res) => {
  if (req.files.length !== 0) {
    await withFile(req.files, req.body.album);
  } else {
    await withoutFile(req.body.videos, req.body.album);
  }
  res.send("Success!");
});

async function withFile(files, album) {
  for (let file of files) {
    let bin = fs.readFileSync(file.path).buffer;
    let updatedBuffer = updateTags(bin, album);

    let formData = new FormData();
    formData.append("files[]", updatedBuffer, file.originalname);
    if (!(await uploadFile(formData))) {
      console.log(`File ${file.originalname} failed to upload`);
    }
  }
}

async function withoutFile(videos, album) {
  let videoArr = videos.trim().split("\n");
  for (let video of videoArr) {
    let buffer = await getAudioBuffer(video);
    let updatedBuffer = updateTags(buffer, album);

    let videoInfo = await getInfo(video);
    let formData = new FormData();
    let title = videoInfo.videoDetails.title + ".mp3";
    title = title.replace(/[^\x00-\x7F]|[\/\\]/g, "");
    formData.append("files[]", updatedBuffer, title);
    if (!(await uploadFile(formData))) {
      console.log(`File ${title} failed to upload`);
    }
  }
}

app.listen(port, () => console.log(`Running on http://localhost:${port}`));
