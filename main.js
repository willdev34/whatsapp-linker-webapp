// main.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const outputDiv = document.getElementById("output");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    outputDiv.innerHTML = ""; // Limpa o conteúdo anterior

    const message = document.getElementById("message").value;
    const fileInput = document.getElementById("contact-file");
    const manualInput = document.getElementById("manual-input").value.trim();

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function (event) {
        const content = event.target.result;
        processContacts(content, message);
      };
      reader.readAsText(file);
    } else if (manualInput !== "") {
      processContacts(manualInput, message);
    } else {
      outputDiv.innerHTML = "<p>Por favor, envie um arquivo ou digite os contatos manualmente.</p>";
    }
  });

  function processContacts(rawData, message) {
    const lines = rawData.split("\n");
    const results = [];

    lines.forEach(line => {
      const [name, phone] = line.split(",").map(s => s.trim());

      if (name && phone) {
        const cleanPhone = phone.replace(/\D/g, ""); // Remove tudo que não é número
        const encodedMessage = encodeURIComponent(message.replace("{nome}", name));
        const link = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        results.push({ name, phone: cleanPhone, link });
      }
    });

    if (results.length === 0) {
      outputDiv.innerHTML = "<p>Nenhum contato válido encontrado.</p>";
      return;
    }

    results.forEach(item => {
      const div = document.createElement("div");
      div.className = "link-item";
      div.innerHTML = `<strong>${item.name}:</strong> <a href="${item.link}" target="_blank">${item.link}</a>`;
      outputDiv.appendChild(div);
    });
  }
});
