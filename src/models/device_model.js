const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceSchema = Schema({
  deviceId: { type: String, required: true },
  locationName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String },
});

module.exports = mongoose.model("devices", DeviceSchema);
