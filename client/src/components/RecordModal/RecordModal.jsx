import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import "./RecordModal.scss";

const categories = ["Technology", "Business", "Sport", "E-commerce", "Travel"];

const statuses = ["Active", "Pending", "Archived", "Done"];

function RecordModal({
  mode = "create",
  record = null,
  onClose,
  onSave,
  closeRequested = false,
}) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);

  const [formData, setFormData] = useState(() => ({
    title: record?.title ?? "",
    category: record?.category ?? "",
    description: record?.description ?? "",
    status: record?.status ?? "",
  }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const isEditing = mode === "edit";
  const shouldClose = isClosing || (closeRequested && !saving);

  useEffect(() => {
    const dialog = dialogRef.current;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (!dialog.open) {
      dialog.showModal();
    }

    titleRef.current?.focus();

    return () => {
      if (dialog.open) {
        dialog.close();
      }

      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleClose = () => {
    if (saving || shouldClose) return;

    setIsClosing(true);
  };

  const validateForm = () => {
    const validateErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        validateErrors[key] = `${key} is required`;
      }
    });

    return validateErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstInvalidField = Object.keys(validationErrors)[0];

      dialogRef.current
        ?.querySelector(`[name="${firstInvalidField}"]`)
        ?.focus();

      return;
    }

    setSaving(true);
    setServerError("");

    try {
      const record = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value.trim()]),
      );
      await onSave(record);
      setIsClosing(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={`record-modal ${shouldClose ? "record-modal--closing" : ""}`}
      aria-labelledby="record-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      onClick={handleBackdropClick}
      onAnimationEnd={(event) => {
        if (
          shouldClose &&
          event.target === dialogRef.current &&
          event.animationName === "modal-exit"
        ) {
          onClose();
        }
      }}
    >
      <div className="record-modal__header">
        <div>
          <h2 id="record-modal-title">
            {isEditing ? "Edit Record" : "Add Record"}
          </h2>

          <p>
            {isEditing
              ? "Update the details of the selected record."
              : "Create a new record by filling in the details below."}
          </p>
        </div>

        <button
          type="button"
          className="record-modal__close"
          aria-label="Close modal"
          onClick={handleClose}
          disabled={saving || shouldClose}
        >
          <X size={25} aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="record-modal__body">
          <div className="record-modal__field">
            <label htmlFor="record-title">
              Title <span>*</span>
            </label>

            <input
              ref={titleRef}
              id="record-title"
              name="title"
              type="text"
              placeholder="Enter a title"
              value={formData.title}
              onChange={handleChange}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "record-title-error" : undefined}
            />

            {errors.title && (
              <p id="record-title-error" className="record-modal__error">
                {errors.title}
              </p>
            )}
          </div>

          <div className="record-modal__field">
            <label htmlFor="record-category">
              Category <span>*</span>
            </label>

            <select
              id="record-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={
                errors.category ? "record-category-error" : undefined
              }
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {errors.category && (
              <p id="record-category-error" className="record-modal__error">
                {errors.category}
              </p>
            )}
          </div>

          <div className="record-modal__field">
            <label htmlFor="record-description">
              Description <span>*</span>
            </label>

            <textarea
              id="record-description"
              name="description"
              rows={4}
              placeholder="Enter a description"
              value={formData.description}
              onChange={handleChange}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "record-description-error" : undefined
              }
            />

            {errors.description && (
              <p id="record-description-error" className="record-modal__error">
                {errors.description}
              </p>
            )}
          </div>

          <div className="record-modal__field">
            <label htmlFor="record-status">
              Status <span>*</span>
            </label>

            <select
              id="record-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              aria-invalid={Boolean(errors.status)}
              aria-describedby={
                errors.status ? "record-status-error" : undefined
              }
            >
              <option value="">Select a status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {errors.status && (
              <p id="record-status-error" className="record-modal__error">
                {errors.status}
              </p>
            )}
          </div>

          {serverError && (
            <p className="record-modal__error" role="alert">
              {serverError}
            </p>
          )}
        </div>

        <div className="record-modal__footer">
          <button
            type="button"
            className="record-modal__cancel"
            onClick={handleClose}
            disabled={saving || shouldClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="record-modal__submit"
            disabled={saving || shouldClose}
          >
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Record"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default RecordModal;
