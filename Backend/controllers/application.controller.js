const applicationService = require("../services/application.service");

const createApplication = async (req, res) => {
  try {
    const { companyName, role, status, notes } = req.body;

    const application = await applicationService.createApplication({
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
    const applications = await applicationService.getApplications(req.user.id);
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await applicationService.getApplicationById(
      req.params.id,
      req.user.id
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

const updateApplication = async (req, res) => {
  try {
    const application = await applicationService.updateApplication(
      req.params.id,
      req.user.id,
      req.body
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
    const application = await applicationService.deleteApplication(
      req.params.id,
      req.user.id
    );

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
  getApplicationById,
  updateApplication,
  deleteApplication,
};

