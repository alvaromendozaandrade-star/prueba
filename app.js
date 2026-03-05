const GOOGLE_API_KEY = "PON_TU_API_KEY_AQUI";

const SHARED_FOLDERS = [
  { label: "Documentos", folderId: "FOLDER_ID_1" },
  { label: "Multimedia", folderId: "FOLDER_ID_2" },
  { label: "Descargas", folderId: "FOLDER_ID_3" }
];

const folderButtons = document.getElementById("folderButtons");
const fileList = document.getElementById("fileList");
const selectedFolderTitle = document.getElementById("selectedFolderTitle");
const statusText = document.getElementById("status");
const previewBtn = document.getElementById("previewBtn");
const downloadBtn = document.getElementById("downloadBtn");
const viewer = document.getElementById("viewer");

let currentFiles = [];

function setStatus(message) {
  statusText.textContent = message;
}

function formatBytes(bytes = 0) {
  const size = Number(bytes);
  if (!size) return "Tamaño no disponible";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / Math.pow(1024, index);
  return `${value.toFixed(1)} ${units[index]}`;
}

function renderFolderButtons() {
  SHARED_FOLDERS.forEach((folder, idx) => {
    const button = document.createElement("button");
    button.className = "folder-btn";
    button.textContent = `${idx + 1}. ${folder.label}`;
    button.addEventListener("click", async () => {
      document.querySelectorAll(".folder-btn").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      selectedFolderTitle.textContent = folder.label;
      await loadFolderFiles(folder.folderId);
    });
    folderButtons.appendChild(button);
  });
}

async function loadFolderFiles(folderId) {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes("PON_TU_API_KEY")) {
    setStatus("Agrega tu API key en app.js");
    fileList.innerHTML = "";
    return;
  }

  setStatus("Cargando archivos...");
  fileList.innerHTML = "";

  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent("files(id,name,mimeType,size,modifiedTime)");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    currentFiles = data.files || [];
    renderFileList(currentFiles);
    setStatus(`${currentFiles.length} archivo(s)`);
  } catch (error) {
    setStatus("Error al cargar. Verifica IDs, permisos y API key.");
    fileList.innerHTML = "<li class='file-item'>No fue posible cargar archivos.</li>";
  }
}

function renderFileList(files) {
  if (!files.length) {
    fileList.innerHTML = "<li class='file-item'>Carpeta vacía o sin permisos públicos.</li>";
    return;
  }

  const fragment = document.createDocumentFragment();

  files.forEach((file) => {
    const item = document.createElement("li");
    item.className = "file-item";

    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `
      <strong>${file.name}</strong>
      <small>${file.mimeType} · ${formatBytes(file.size)}</small>
    `;

    button.addEventListener("click", () => selectFile(file));
    item.appendChild(button);
    fragment.appendChild(item);
  });

  fileList.innerHTML = "";
  fileList.appendChild(fragment);
}

function selectFile(file) {
  const previewUrl = `https://drive.google.com/file/d/${file.id}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;

  previewBtn.href = previewUrl;
  downloadBtn.href = downloadUrl;
  viewer.src = previewUrl;
  setStatus(`Archivo seleccionado: ${file.name}`);
}

renderFolderButtons();
