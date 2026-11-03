const validateRecord = (data) => {
  const errors = {};

  for (const field of ["title", "category", "description", "status"]) {
    if (typeof data?.[field] !== "string" || !data[field].trim()) {
      errors[field] = `${field} is required`;
    }
  }

  return errors;
};

module.exports = { validateRecord };
