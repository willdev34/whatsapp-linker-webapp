// main.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const outputDiv = document.getElementById("output");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    outputDiv.innerHTML = "";

    const message = document.getElementById("message").value;
    const fileInput = document.getElementById("contact-file");
    const manualInput = document.getElementById("manual-input").value.trim();

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const ext = file.name.split('.').pop().toLowerCase();

      if (ext === "xlsx" || ext === "xls") {
        handleExcel(file, message);
      } else {
        alert("Formato de arquivo não suportado.");
      }

    } else if (manualInput !== "") {
      processManual(manualInput, message);
    } else {
      outputDiv.innerHTML = "<p>Por favor, envie um arquivo ou digite os contatos manualmente.</p>";
    }
  });
});

function processManual(rawData, message) {
  const lines = rawData.split("\n");
  const results = [];

  lines.forEach(line => {
    const [name, phone] = line.split(",").map(s => s.trim());
    if (name && phone) {
      const link = gerarLink(name, phone, message);
      results.push({ name, link });
    }
  });

  renderLinks(results);
}

function handleExcel(file, message) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    const results = json.map(row => {
      const name = row["Nome"] || row["nome"];
      const phone = String(row["Telefone"] || row["telefone"]);
      return { name, link: gerarLink(name, phone, message) };
    });

    renderLinks(results);
  };
  reader.readAsArrayBuffer(file);
}

function gerarLink(name, phone, message) {
  const cleanPhone = phone.replace(/\D/g, "");
  const personalized = message.replace("{nome}", name);
  const encoded = encodeURIComponent(personalized);
  return `https://wa.me/55${cleanPhone}?text=${encoded}`;
}

function renderLinks(results) {
  const outputDiv = document.getElementById("output");
  if (results.length === 0) {
    outputDiv.innerHTML = "<p>Nenhum contato válido encontrado.</p>";
    return;
  }

  results.forEach(item => {
    const div = document.createElement("div");
    div.className = "link-item";
    div.innerHTML = `<span class="link-name">${item.name}</span><button class="form-button" onclick="window.open('${item.link}', '_blank')">Abrir link</button>`;
    outputDiv.appendChild(div);
  });
}
