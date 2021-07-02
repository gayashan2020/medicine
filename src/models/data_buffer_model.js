const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataBufferSchema = Schema({
  deviceId: { type: String, required: true },
  dataBuffer: { type: [Number], required: true },
  dateTime: { type: Date, required: true },
});

module.exports = mongoose.model("data_buffer", DataBufferSchema);
