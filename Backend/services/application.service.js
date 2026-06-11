const Application = require("../models/Application");

const createApplication = (data) => {
  return Application.create(data);
};

const getApplications = (userId) => {
  return Application.find({ userId });
};

const getApplicationById = (id, userId) => {
  return Application.findOne({
    _id: id,
    userId,
  });
};

const updateApplication = (
  id,
  userId,
  data
) => {
  return Application.findOneAndUpdate(
    {
      _id: id,
      userId,
    },
    data,
    {
      new: true,
    }
  );
};

const deleteApplication = (
  id,
  userId
) => {
  return Application.findOneAndDelete({
    _id: id,
    userId,
  });
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};