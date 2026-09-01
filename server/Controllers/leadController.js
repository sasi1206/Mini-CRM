const leads = require("../Models/leads");
const companies = require("../Models/companies");

async function getLeads(req, res) {
  try {
    const { search, page, filter } = req.query;

    let filterOptions = [{ $eq: ["$isDeleted", false] }];

    if (search) {
      filterOptions.push({
        $regexMatch: {
          input: "$name",
          regex: search,
          options: "i",
        },
      });
    }

    if (filter) {
      filterOptions.push({
        $eq: [filter, "$status"],
      });
    }

    const totalDocuments = await leads.aggregate([
      {
        $match: {
          $expr: {
            $and: filterOptions,
          },
        },
      },
      {
        $count: "totalDocuments",
      },
    ]);

    const allLeads = await leads.aggregate([
      {
        $match: {
          $expr: {
            $and: filterOptions,
          },
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "company_id",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assigned_to",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $skip: parseInt(page, 10) * 10,
      },
      { $limit: 10 },
      {
        $unwind: {
          path: "$company",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          assigned_to: 1,
          assigned_user: "$user.username",
          phone: 1,
          status: 1,
          company_id: "$company._id",
          company_name: "$company.company_name",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved leads",
      leads: allLeads,
      totalDocuments: totalDocuments[0]?.totalDocuments || 0,
    });
  } catch (error) {
    console.log("Error while fetching leads", error);
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

async function createLead(req, res) {
  try {
    const { name, email, phone, status, assigned_to, company_id } = req.body;

    const company = await companies.findOne({ _id: company_id }, { _id: 1 });

    if (!company) {
      return res.status(403).json({ message: "Company doesn't exist" });
    }

    await leads.create({
      name,
      email,
      phone,
      status,
      assigned_to,
      company_id: company,
    });
    return res.status(200).json({ success: true, message: "Lead created" });
  } catch (error) {
    console.log("Error while creating lead", error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(409).json({ message: "Lead already exists" });
    }
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

async function editLead(req, res) {
  try {
    const { _id, name, email, phone, status, assigned_to, company_id } =
      req.body;

    const isLeadExist = await leads.findById(_id);

    if (!isLeadExist) {
      return res.status(404).json({ message: "lead doesn't exist" });
    }

    const company = await companies.findOne({ _id: company_id }, { _id: 1 });

    if (!company) {
      return res.status(403).json({ message: "Company doesn't exist" });
    }

    await leads.findByIdAndUpdate(_id, {
      name,
      email,
      phone,
      status,
      assigned_to,
      company_id: company._id,
    });

    return res.status(200).json({ success: true, message: "Lead updated" });
  } catch (error) {
    console.log("Error while editing lead", error);
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

async function deleteLead(req, res) {
  try {
    const { id } = req.query;

    const deleted = await leads.findByIdAndUpdate(id, { isDeleted: true });
    if (!deleted) {
      return res.status(404).json({ message: "Lead doesn't exist" });
    }

    return res.status(200).json({ success: true, message: "Lead deleted" });
  } catch (error) {
    console.log("Error while deleting lead", error);
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

module.exports = { getLeads, createLead, editLead, deleteLead };
