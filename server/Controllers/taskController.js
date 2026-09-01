const tasks = require("../Models/tasks");
const leads = require("../Models/leads");

async function fetchTasks(req, res) {
  try {
    const allTasks = await tasks.aggregate([
      {
        $lookup: {
          from: "leads",
          let: { localId: "$lead_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$localId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "lead",
        },
      },
      {
        $unwind: {
          path: "$lead",
        },
      },
      {
        $project: {
          task_title: 1,
          due_date: 1,
          status: 1,
          lead_id: 1,
          lead: "$lead.name",
        },
      },
    ]);
    res
      .status(200)
      .json({ success: true, message: "Tasks retrieved", tasks: allTasks });
  } catch (error) {
    console.log("Error while fetching leads", error);
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

async function createTask(req, res) {
  try {
    const { task_title, lead_id, due_date, status } = req.body;

    const isLeadExist = await leads.findById(lead_id);

    if (!isLeadExist) {
      return res.status(404).json({ message: "Lead doesn't exist" });
    }

    const isTaskAlreadyExistForClient = await tasks.findOne({
      task_title: task_title.toLowerCase(),
      lead_id,
    });

    if (isTaskAlreadyExistForClient) {
      return res
        .status(409)
        .json({ message: "This task already exist for this client" });
    }

    await tasks.create({
      task_title: task_title.toLowerCase(),
      lead_id,
      due_date,
      status,
    });

    res.status(200).json({ success: true, message: "Task created" });
  } catch (error) {
    console.log("Error while creating task", error);
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

async function updateStatus(req, res) {
  try {
    const { task_id, lead_id } = req.body;
    const user_id = req.user;

    console.log(user_id);

    const isAssignedUser = await leads.findOne({
      _id: lead_id,
      assigned_to: user_id,
    });

    if (!isAssignedUser) {
      return res.status(409).json({ message: "Not assigned user" });
    }

    const task = await tasks.findByIdAndUpdate(task_id, {
      status: "done",
    });

    if (!task) {
      return res.status(404).json({ message: "Task doesn't exist" });
    }

    res.status(200).json({ success: true, message: "Task updated" });
  } catch (error) {
    console.log("Error while updating task", error);
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

module.exports = { fetchTasks, createTask, updateStatus };
