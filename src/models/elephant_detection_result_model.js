const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ElephantDetectionResultSchema = Schema({
  deviceId: { type: String, required: true },
  locationName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  dataBuffer: { type: [Number], required: true },
  detectedDate: { type: Date, required: true },
});

module.exports = mongoose.model(
  "elephant_detection_result",
  ElephantDetectionResultSchema
);
