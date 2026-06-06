const Application = require("../models/Application");

const createApplication = async (req, res) => {
  try {
    const { companyName, role, status, notes } = req.body;

    const application = await Application.create({
      companyName,
      role,
      status,
      notes,
      userId: req.user.id,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.user.id,
    });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
};