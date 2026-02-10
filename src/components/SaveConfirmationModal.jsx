import './SaveConfirmationModal.css';

function SaveConfirmationModal({ onCancel, onSave }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title">Save changes to donation form?</h2>

        <div className="modal__warning">
          <div className="modal__warning-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8.5" stroke="#b45309" strokeWidth="1.5" />
              <path d="M10 6v5" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="14" r="0.75" fill="#b45309" />
            </svg>
          </div>
          <span className="modal__warning-text">
            These updates will apply to any live donation forms using this campaign.
          </span>
        </div>

        <p className="modal__body">
          Saving your changes may affect how donors see and interact with your donation form. If
          this campaign is currently live, the updates will take effect immediately.
        </p>
        <p className="modal__body">
          You can continue, or review your changes before saving.
        </p>

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveConfirmationModal;
