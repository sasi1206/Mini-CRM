const companies = require("../Models/companies");

async function fetchCompanies(req, res) {
  try {
    const allCompanies = await companies.aggregate([
      {
        $lookup: {
          from: "leads",

          let: { localId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$company_id", "$$localId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "companyLeads",
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: "Company and leads retrieved",
      companies: allCompanies,
    });
  } catch (error) {
    console.log("Error while fetching companies", error);
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

async function createCompany(req, res) {
  try {
    const { company_name, industry, location } = req.body;

    await companies.create({
      company_name,
      industry,
      location,
    });

    res.status(200).json({ success: true, message: "Company created" });
  } catch (error) {
    console.log("Error while creating company", error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(409).json({ message: "Company already exists" });
    }
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

module.exports = { fetchCompanies, createCompany };
