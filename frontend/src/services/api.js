const request = async (url, options = {}) => {
  const response = await fetch(`/api${url}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const api = {
  getPlants: () => request("/plants"),
  getPlant: id => request(`/plants/${id}`),
  createPlant: data => request("/plants", { method:"POST", body:JSON.stringify(data) }),
  updatePlant: (id,data) => request(`/plants/${id}`, { method:"PUT", body:JSON.stringify(data) }),
  deletePlant: id => request(`/plants/${id}`, { method:"DELETE" }),
  waterPlant: (id,notes="") => request(`/plants/${id}/water`, { method:"POST", body:JSON.stringify({notes}) }),
  saveCare: (id,instructions) => request(`/plants/${id}/care`, { method:"PUT", body:JSON.stringify({instructions}) }),
  getHistory: id => request(`/plants/${id}/history`)
};
