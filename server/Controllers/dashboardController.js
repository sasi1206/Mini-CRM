const leads = require("../Models/leads");
const tasks = require("../Models/tasks");
const companies = require("../Models/companies");
const users = require("../Models/users");

async function getDropDownOptions(req, res) {
  try {
    const companyOptions = await companies.find(
      {},
      { _id: 1, company_name: 1 },
    );

    const leadOptions = await leads.find(
      { isDeleted: false },
      { _id: 1, name: 1 },
    );

    const userOptions = await users.find({}, { _id: 1, username: 1 });

    res.status(200).json({
      success: true,
      message: "options retrieved",
      options: { companyOptions, leadOptions, userOptions },
    });
  } catch (error) {
    console.log("Error while fetching options", error);
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

async function getData(req, res) {
  try {
    const [leadData] = await leads.aggregate([
      {
        $facet: {
          totalLeads: [
            {
              $match: {
                isDeleted: false,
              },
            },
            { $count: "TotalLeads" },
          ],
          qualifiedLeads: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$status", "contacted"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            {
              $count: "TotalQualifiedLeads",
            },
          ],
        },
      },
    ]);

    const [taskData] = await tasks.aggregate([
      {
        $facet: {
          due_today: [
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
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$due_date",
                        {
                          $dateTrunc: {
                            date: "$$NOW",
                            unit: "day",
                          },
                        },
                      ],
                    },
                    {
                      $eq: ["$status", "pending"],
                    },
                  ],
                },
              },
            },
            {
              $count: "todayDueDate",
            },
          ],
          completed_tasks: [
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
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$status", "done"] },
                    { $eq: ["$lead.isDeleted", false] },
                  ],
                },
              },
            },
            {
              $count: "totalCompletedTasks",
            },
          ],
        },
      },
    ]);

    const data = {
      totalLeads: leadData?.totalLeads[0]?.TotalLeads || 0,
      totalQualifiedLeads:
        leadData?.qualifiedLeads[0]?.TotalQualifiedLeads || 0,
      dueToday: taskData?.due_today[0]?.todayDueDate || 0,
      completed_tasks: taskData?.completed_tasks[0]?.totalCompletedTasks || 0,
    };

    res
      .status(200)
      .json({ success: true, message: "Dashboard data retrieved", data });
  } catch (error) {
    console.log("Error while fetching leads", error);
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

module.exports = { getDropDownOptions, getData };
