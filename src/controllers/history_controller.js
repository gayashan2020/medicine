const ApiResponse = require("../services/response_helper");

const elephantDetectionResultModel = require("./../models/elephant_detection_result_model");

module.exports = {
  async getAllHistoryForTimeRange(req, res) {
    let request = req.body;
    console.log(new Date(request.startDate));
    console.log(new Date(request.endDate));

    let result = await elephantDetectionResultModel.aggregate([
      {
        $match: {
          $and: [
            { detectedDate: { $gte: new Date(request.startDate) } },
            { detectedDate: { $lt: new Date(request.endDate) } },
          ],
        },
      },
      {
        $project: {
          deviceId: 1,
          locationName: 1,
          latitude: 1,
          longitude: 1,
          detectedDate: 1,
        },
      },
      {
        $sort: { detectedDate: 1 },
      },
    ]);

    return res.status(200).send(ApiResponse.getSuccess(result));
  },
};
