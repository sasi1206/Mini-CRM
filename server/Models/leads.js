const { Schema, model } = require("mongoose");

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enums: ["new", "contacted", "lost"],
      required: true,
    },
    assigned_to: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    company_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "companies",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const leads = model("leads", leadSchema);
module.exports = leads;
