let phoneIP = "192.168.7.43";

let savedAlbum = localStorage.getItem("album");
if (savedAlbum) {
  document.querySelector("input[type=text]").value = savedAlbum;
}

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  let files = document.querySelector("input[type=file]").files;
  let album = document.querySelector("input[type=text]").value;

  localStorage.setItem("album", album);

  try {
    for (let file of files) {
      let formData = new FormData();
      let buffer = await arrayBufferAsync(file);
      let correctedBuffer = editTags(buffer, album);
      let blob = new Blob([correctedBuffer], { type: file.type });
      formData.append("files[]", blob, file.name);
      await uploadFile(formData);
    }
  } catch (e) {
    alert("Failed");
  }
});

async function uploadFile(formData) {
  await fetch("http://" + phoneIP + "/upload.json", {
    method: "POST",
    mode: "no-cors",
    body: formData,
  });
}

function editTags(buffer, album) {
  const mp3tag = new MP3Tag(buffer);
  mp3tag.read(buffer);
  mp3tag.tags.album = album;
  return mp3tag.save();
}

function arrayBufferAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}
