import './DisableFundChoiceModal.css';

/**
 * Confirmation modal shown when the user toggles OFF "Allow donors to choose a specific fund".
 * Warns that this takes effect immediately on live campaigns and that all non-default funds
 * will be removed, retaining only the campaign default fund.
 */
function DisableFundChoiceModal({ defaultFundName, fundsToRemove, onCancel, onConfirm }) {
  const hasMultipleFunds = fundsToRemove.length > 0;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title">Disable fund selection?</h2>

        <div className="modal__warning">
          <div className="modal__warning-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8.5" stroke="#b45309" strokeWidth="1.5" />
              <path d="M10 6v5" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="14" r="0.75" fill="#b45309" />
            </svg>
          </div>
          <span className="modal__warning-text">
            This change will take effect immediately on any live donation forms using this campaign.
          </span>
        </div>

        <p className="modal__body">
          Donors will no longer be able to choose which fund their donation goes to.
          All donations will be routed to the default fund <strong>{defaultFundName}</strong>.
        </p>

        {hasMultipleFunds && (
          <div className="disable-modal__fund-removal">
            <p className="disable-modal__fund-removal-label">
              The following {fundsToRemove.length === 1 ? 'fund' : 'funds'} will be removed from this campaign:
            </p>
            <ul className="disable-modal__fund-list">
              {fundsToRemove.map((fund) => (
                <li key={fund.id} className="disable-modal__fund-item">
                  <span className="disable-modal__fund-name">{fund.name}</span>
                  <span className="disable-modal__fund-desc">{fund.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={onConfirm}>
            Disable fund selection
          </button>
        </div>
      </div>
    </div>
  );
}

export default DisableFundChoiceModal;
