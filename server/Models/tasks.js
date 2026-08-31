const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    task_title: {
      type: String,
      required: true,
    },
    lead_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref:"leads"
    },
    due_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enums: ["pending", "done"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const tasks = model("tasks", taskSchema);
module.exports = tasks;
