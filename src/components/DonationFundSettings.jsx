import Toggle from './Toggle';
import FundMultiSelect from './FundMultiSelect';
import { HelpIcon, TrashIcon, ChevronDownIcon } from './Icons';
import './DonationFundSettings.css';

/**
 * Original design — default fund selector is inside the toggle-gated section.
 * Kept as a reference but no longer rendered by App (replaced by Option A/B/C).
 */
function DonationFundSettings({
  campaignFunds,
  allowFundChoice,
  defaultFundId,
  fundSelectHeading,
  fundSelectLabel,
  availableFundsToAdd,
  onToggleFundChoice,
  onAddFunds,
  onRemoveFund,
  onDefaultFundChange,
  onFundSelectHeadingChange,
  onFundSelectLabelChange,
}) {
  return (
    <div className="fund-settings">
      <div className="fund-settings__header">
        <h2 className="fund-settings__title">
          Donation fund settings
          <span className="badge badge--new">New</span>
        </h2>
        <p className="fund-settings__description">
          Set the default fund for your donations made to this campaign and allow donors to
          select a fund to designate their donation to.{' '}
          <a href="#" className="link">Learn more</a>
        </p>
      </div>

      <div className="fund-settings__section">
        <div className="fund-settings__section-header">
          <span className="fund-settings__label">Funds available in this campaign</span>
          <button className="icon-btn icon-btn--help" title="Help">
            <HelpIcon />
          </button>
        </div>

        <div className="fund-list">
          {campaignFunds.map((fund) => (
            <div key={fund.id} className="fund-list__item">
              <div className="fund-list__info">
                <span className="fund-list__name">{fund.name}</span>
                <span className="fund-list__description">{fund.description}</span>
                {fund.id === defaultFundId && (
                  <span className="badge badge--default">Campaign Default</span>
                )}
              </div>
              {fund.id !== defaultFundId && campaignFunds.length > 1 && (
                <button
                  className="icon-btn icon-btn--delete"
                  onClick={() => onRemoveFund(fund.id)}
                  title="Remove fund"
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="fund-settings__toggle-section">
        <div className="fund-settings__toggle-content">
          <div className="fund-settings__toggle-label">Allow donors to choose a specific fund</div>
          <div className="fund-settings__toggle-description">
            Allow your donors to select a fund to designate their donation to. When
            enabled, this will appear under donation amounts
          </div>
        </div>
        <Toggle checked={allowFundChoice} onChange={onToggleFundChoice} />
      </div>

      {allowFundChoice && (
        <div className="fund-settings__expanded">
          <div className="fund-settings__field">
            <label className="fund-settings__field-label">Add more funds to campaign</label>
            <FundMultiSelect
              availableFunds={availableFundsToAdd}
              onAdd={onAddFunds}
            />
            <p className="fund-settings__helper">
              Funds can be added from{' '}
              <a href="#" className="link">Organisation settings &gt; Donation funds</a>
            </p>
          </div>

          <div className="fund-settings__field">
            <div className="fund-settings__field-header">
              <label className="fund-settings__field-label">Default fund</label>
              <button className="icon-btn icon-btn--help" title="Help">
                <HelpIcon />
              </button>
            </div>
            <div className="select-wrapper">
              <select
                className="select-input"
                value={defaultFundId}
                onChange={(e) => onDefaultFundChange(e.target.value)}
              >
                {campaignFunds.map((fund) => (
                  <option key={fund.id} value={fund.id}>
                    {fund.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="select-icon" />
            </div>
          </div>

          <div className="fund-settings__form-labels">
            <span className="fund-settings__section-title">
              {campaignFunds.length > 1 ? 'Form Settings' : 'Donor facing labels (optional)'}
            </span>

            <div className="fund-settings__field">
              <label className="fund-settings__field-label">Fund select heading</label>
              <input
                type="text"
                className="text-input"
                value={fundSelectHeading}
                onChange={(e) => onFundSelectHeadingChange(e.target.value)}
              />
            </div>

            <div className="fund-settings__field">
              <label className="fund-settings__field-label">Fund select input label</label>
              <input
                type="text"
                className="text-input"
                value={fundSelectLabel}
                onChange={(e) => onFundSelectLabelChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonationFundSettings;
