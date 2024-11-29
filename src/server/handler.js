const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");

async function postPredictHandler(request, h) {
  const { image } = request.payload; // Mengambil gambar dari payload
  const { model } = request.server.app; // Mengambil model dari server app

  // Melakukan prediksi
  const { confidenceScore, label, explanation, suggestion } =
    await predictClassification(model, image);

  // Membuat ID dan data setelah prediksi
  const id = crypto.randomUUID(); // Menghasilkan ID unik
  const createdAt = new Date().toISOString(); // Mendapatkan timestamp saat ini

  const data = {
    id: id,
    result: label,
    explanation: explanation,
    suggestion: suggestion,
    confidenceScore: confidenceScore,
    createdAt: createdAt,
  };

  // Menyimpan data
  await storeData(id, data); // Memanggil fungsi untuk menyimpan data

  // Membuat respons
  const response = h.response({
    status: "success",
    message:
      confidenceScore > 99
        ? "Model is predicted successfully."
        : "Model is predicted successfully but under threshold. Please use the correct picture",
    data,
  });
  response.code(201); // Mengatur kode status HTTP
  return response; // Mengembalikan respons
}

module.exports = postPredictHandler;
