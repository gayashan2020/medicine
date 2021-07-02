const { get } = require("../routes/test_route");
const ApiResponse = require("../services/response_helper");
// const Service = require("./../services/service");

const TestModel = require("./../models/test-model");

module.exports = {
  async get(req, res) {
    // throw new Error("test ex");
    return res.status(200).send(ApiResponse.getSuccess("Test result"));
  },
};
