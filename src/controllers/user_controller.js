const ApiResponse = require("../services/response_helper");
const uniqueValidator = require("../services/unique_validator");
const logging = require("../startup/logging");
const axios = require("axios");
const randomPassword = require("../services/random_password");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Joi = require("joi");

const userModel = require("./../models/user_model");

module.exports = {
  async createUser(req, res) {
    let request = req.body;

    const schema = Joi.object({
      firstName: Joi.string().required().label("First Name"),
      lastName: Joi.string().required().label("Last Name"),
      email: Joi.string()
        .required()
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "xxx@xx.xx"
        )
        .label("Email"),
      contactNo: Joi.string()
        .required()
        .regex(
          /^(070)\d{7}$|^(071)\d{7}$|^(072)\d{7}$|^(074)\d{7}$|^(075)\d{7}$|^(076)\d{7}$|^(077)\d{7}$|^(078)\d{7}$/,
          "07xxxxxxxx"
        )
        .label("Contact No"),

      password: Joi.string().required().label("Password"),
      location: Joi.string().required().label("Location"),
    });
    let validateResult = schema.validate(request);

    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    let uniqueValidatorResponse = await uniqueValidator.findUnique(userModel, [
      { email: request.email },
      { contactNo: request.contactNo },
    ]);
    if (uniqueValidatorResponse) {
      return res
        .status(409)
        .send(ApiResponse.getError(uniqueValidatorResponse));
    }

    const salt = await bcrypt.genSalt(10);
    request.password = await bcrypt.hash(request.password, salt);
    request.resetPassword = "0";

    if (req.files[0]) {
      console.log(req.files);
      request.imageUrl = req.files[0].path;
    }
    request.isAdmin = false;
    request.verificationState = "pending";
    let user = await userModel.create(request);

    user = user.toJSON();
    delete user.password;

    return res.status(201).send(
      ApiResponse.getSuccess({
        details: user,
        token: jwt.sign(
          {
            _id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.secretKey
        ),
      })
    );
  },

  async login(req, res) {
    let request = req.query;

    const schema = Joi.object({
      email: Joi.string().required().label("email"),
      password: Joi.string().required().label("password"),
    });
    let validateResult = schema.validate(request);

    if (validateResult.error) {
      return res
        .status(400)
        .send(ApiResponse.getError(validateResult.error.details[0].message));
    }

    let user = await userModel.findOne({
      $or: [{ email: request.email }],
    });

    if (user && bcrypt.compare(request.password, user.password)) {
      //   if (user.verificationState === "pending") {
      //     return res.status(400).send(ApiResponse.getError("Wait until verify"));
      //   }
      //   if (user.verificationState === "rejected") {
      //     return res
      //       .status(400)
      //       .send(ApiResponse.getError("Your account rejected"));
      //   }
      let returnObject = user.toJSON();
      delete returnObject.password;
      return res.status(200).send(
        ApiResponse.getSuccess({
          details: returnObject,
          token: jwt.sign(
            {
              _id: user._id,
              isAdmin: user.isAdmin,
            },
            process.env.secretKey
          ),
        })
      );
    } else {
      return res
        .status(401)
        .send(ApiResponse.getError("Invalid user name or password"));
    }
  },
};
