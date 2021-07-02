const ApiResponse = require("../services/response_helper");

const deviceModel = require("./../models/device_model");
const dataBufferModel = require("./../models/data_buffer_model");

module.exports = {
  async addDevice(req, res) {
    let request = req.body;
    let device = await deviceModel.create(request);

    return res.status(201).send(ApiResponse.getSuccess(device));
  },

  async collectIotData(req, res) {
    let request = req.body;

    request.dateTime = new Date(Date() + "UTC");
    let iotData = await dataBufferModel.create(request);

    return res.status(201).send(ApiResponse.getSuccess(iotData));
  },
};
