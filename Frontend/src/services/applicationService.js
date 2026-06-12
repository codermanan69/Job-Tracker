import API from "./api";

export const getApplications = async (isGuest) => {
  if (isGuest) {
    const apps = JSON.parse(localStorage.getItem("guest_applications") || "[]");
    return { data: apps };
  }
  return API.get("/applications");
};

export const createApplication = async (data, isGuest) => {
  if (isGuest) {
    const apps = JSON.parse(localStorage.getItem("guest_applications") || "[]");
    const newApp = {
      ...data,
      _id: Date.now().toString(), // local unique string ID
      createdAt: new Date().toISOString(),
      appliedDate: new Date().toISOString(),
    };
    apps.push(newApp);
    localStorage.setItem("guest_applications", JSON.stringify(apps));
    return { data: newApp };
  }
  return API.post("/applications", data);
};

export const updateApplication = async (id, data, isGuest) => {
  if (isGuest) {
    const apps = JSON.parse(localStorage.getItem("guest_applications") || "[]");
    const updatedApps = apps.map((app) => {
      if (app._id === id) {
        return { 
          ...app, 
          ...data, 
          updatedAt: new Date().toISOString() 
        };
      }
      return app;
    });
    localStorage.setItem("guest_applications", JSON.stringify(updatedApps));
    const updatedApp = updatedApps.find((app) => app._id === id);
    return { data: updatedApp };
  }
  return API.patch(`/applications/${id}`, data);
};

export const deleteApplication = async (id, isGuest) => {
  if (isGuest) {
    const apps = JSON.parse(localStorage.getItem("guest_applications") || "[]");
    const filteredApps = apps.filter((app) => app._id !== id);
    localStorage.setItem("guest_applications", JSON.stringify(filteredApps));
    return { data: { success: true } };
  }
  return API.delete(`/applications/${id}`);
};
