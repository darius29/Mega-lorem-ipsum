import { useEffect, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import "./DeleteConfirmModal.scss";

function DeleteConfirmModal({
  record,
  onClose,
  onConfirm,
  closeRequested = false,
}) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);

  const [deleting, setDeleting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState("");
  const shouldClose = isClosing || (closeRequested && !deleting);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    if (!dialog.open) {
      dialog.showModal();
    }

    cancelRef.current?.focus();

    return () => {
      if (dialog.open) {
        dialog.close();
      }

      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleClose = () => {
    if (deleting || shouldClose) return;

    setIsClosing(true);
  };

  const handleConfirm = async () => {
    if (deleting || shouldClose) return;

    setDeleting(true);
    setError("");

    try {
      await onConfirm();
      setIsClosing(true);
    } catch (err) {
      setError(err.message || "Failed to delete record.");
    } finally {
      setDeleting(false);
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
      className={`delete-modal ${shouldClose ? "delete-modal--closing" : ""}`}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
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
      <div className="delete-modal__header">
        <div className="delete-modal__icon">
          <AlertTriangle size={24} aria-hidden="true" />
        </div>

        <button
          type="button"
          className="delete-modal__close"
          aria-label="Close modal"
          onClick={handleClose}
          disabled={deleting || shouldClose}
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="delete-modal__body">
        <h2 id="delete-modal-title">Delete Record?</h2>

        <p id="delete-modal-description">
          Are you sure you want to delete <strong>{record.title}</strong>? This
          action cannot be undone.
        </p>

        {error && (
          <p className="delete-modal__error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="delete-modal__footer">
        <button
          ref={cancelRef}
          type="button"
          className="delete-modal__cancel"
          onClick={handleClose}
          disabled={deleting || shouldClose}
        >
          Cancel
        </button>

        <button
          type="button"
          className="delete-modal__confirm"
          onClick={handleConfirm}
          disabled={deleting || shouldClose}
        >
          {deleting ? "Deleting..." : "Delete Record"}
        </button>
      </div>
    </dialog>
  );
}

export default DeleteConfirmModal;
