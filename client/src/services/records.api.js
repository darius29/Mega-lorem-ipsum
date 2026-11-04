const BASE_URL = "http://localhost:3001";
const API_URL = `${BASE_URL}/api/records`;

export const getRecords = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch records");
  }

  return response.json();
};

export const createRecord = async (record) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Failed to create record");
  }

  return response.json();
};

export const updateRecord = async (id, record) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error("Failed to update record");
  }

  return response.json();
};

export const deleteRecord = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete record");
  }
};
