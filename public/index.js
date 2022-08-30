let phoneIP = "192.168.7.43";

let savedAlbum = localStorage.getItem("album");
if (savedAlbum) {
  document.querySelector("input[type=text]").value = savedAlbum;
}

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  let files = document.querySelector("form");
  let album = document.querySelector("input[type=text]").value;

  localStorage.setItem("album", album);

  try {
    let response = await fetch("/api/upload", {
      method: "POST",
      body: new FormData(files),
    });
    if (response.status !== 200) throw Error();
    alert("Successfully uploaded file!");
  } catch (e) {
    alert("Failed");
  }
});
