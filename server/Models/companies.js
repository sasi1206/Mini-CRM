const { Schema, model } = require("mongoose");

const companySchema = new Schema(
  {
    company_name: {
      type: String,
      required: true,
      unique: true,
    },
    industry: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const companies = model("companies", companySchema);

module.exports = companies;
