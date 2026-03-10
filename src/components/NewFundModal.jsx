import { useState } from 'react';
import './NewFundModal.css';

function NewFundModal({ fund, isDefault, terminology, onCancel, onSave }) {
  const isDesignations = terminology === 'designations';
  const t = {
    fund: isDesignations ? 'designation' : 'fund',
    Fund: isDesignations ? 'Designation' : 'Fund',
  };
  const isEditing = !!fund;
  const [internalName, setInternalName] = useState(fund?.name || '');
  const [publicName, setPublicName] = useState(fund?.description || '');
  const [setAsDefault, setSetAsDefault] = useState(isDefault || false);

  const canSave = internalName.trim() && publicName.trim();

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: fund?.id,
      internalName: internalName.trim(),
      publicName: publicName.trim(),
      setAsDefault,
    });
  };

  return (
    <div className="new-fund-overlay" onClick={onCancel}>
      <div className="new-fund-modal" onClick={(e) => e.stopPropagation()}>
        <div className="new-fund-modal__header">
          <h2 className="new-fund-modal__title">{isEditing ? `Edit ${t.fund}` : `New ${t.fund}`}</h2>
          <button className="new-fund-modal__close" onClick={onCancel}>
            <CloseIcon />
          </button>
        </div>

        <div className="new-fund-modal__body">
          <div className="new-fund-modal__field">
            <label className="new-fund-modal__label">
              Internal name <span className="new-fund-modal__required">*</span>
            </label>
            <input
              type="text"
              className="text-input"
              value={internalName}
              onChange={(e) => setInternalName(e.target.value)}
              autoFocus
            />
            <p className="new-fund-modal__helper">
              This is used for internal referencing, like in reports or donation details.
            </p>
          </div>

          <div className="new-fund-modal__field">
            <label className="new-fund-modal__label">
              Public name <span className="new-fund-modal__required">*</span>
            </label>
            <input
              type="text"
              className="text-input"
              value={publicName}
              onChange={(e) => setPublicName(e.target.value)}
            />
            <p className="new-fund-modal__helper">
              This is the name shown on your donation forms
            </p>
          </div>

          <label className="new-fund-modal__checkbox-row">
            <input
              type="checkbox"
              className="new-fund-modal__checkbox"
              checked={setAsDefault}
              onChange={(e) => setSetAsDefault(e.target.checked)}
            />
            <div className="new-fund-modal__checkbox-content">
              <span className="new-fund-modal__checkbox-label">Set as default {t.fund}</span>
              <span className="new-fund-modal__checkbox-description">
                Donations made to all new campaigns will be designated to this {t.fund}. You can customise this for each campaign in Campaign &gt; Settings.
              </span>
            </div>
          </label>
        </div>

        <div className="new-fund-modal__footer">
          <button
            className="btn btn--primary"
            onClick={handleSave}
            disabled={!canSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default NewFundModal;
