import { useState, useRef } from 'react';
import Toggle from './Toggle';
import FundMultiSelect from './FundMultiSelect';
import DisableFundChoiceModal from './DisableFundChoiceModal';
import { HelpIcon, TrashIcon, ChevronDownIcon } from './Icons';
import './DonationFundSettings.css';

/**
 * Option A: Always-visible "Default fund" dropdown above the toggle.
 * The default fund selector is independent of the donor-choice toggle,
 * drawing from all org-level funds so admins can change it at any time.
 * Drag-and-drop reordering when multiple funds are available.
 */
function OptionA({
  campaignFunds,
  allowFundChoice,
  defaultFundId,
  fundSelectHeading,
  fundSelectLabel,
  availableFundsToAdd,
  orgFunds,
  onToggleFundChoice,
  onDisableFundChoice,
  onAddFunds,
  onRemoveFund,
  onDefaultFundChange,
  onReorderFunds,
  onFundSelectHeadingChange,
  onFundSelectLabelChange,
  onSave,
}) {
  const canDrag = campaignFunds.length > 1;
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const dragNode = useRef(null);

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    dragNode.current = e.currentTarget;
    e.currentTarget.classList.add('fund-list__item--dragging');
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (index !== overIndex) {
      setOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (dragNode.current) {
      dragNode.current.classList.remove('fund-list__item--dragging');
    }
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      onReorderFunds(dragIndex, overIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
    dragNode.current = null;
  };

  // Intercept toggle: when turning OFF, show confirmation modal
  const handleToggleChange = (enabled) => {
    if (enabled) {
      // Turning ON — no confirmation needed
      onToggleFundChoice(true);
    } else {
      // Turning OFF — show confirmation modal
      setShowDisableModal(true);
    }
  };

  const handleConfirmDisable = () => {
    setShowDisableModal(false);
    onDisableFundChoice();
  };

  const handleCancelDisable = () => {
    setShowDisableModal(false);
  };

  // Funds that will be removed (everything except the default)
  const defaultFund = campaignFunds.find((f) => f.id === defaultFundId);
  const fundsToRemove = campaignFunds.filter((f) => f.id !== defaultFundId);

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

      {/* Always-visible default fund selector */}
      <div className="fund-settings__section">
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
              {orgFunds.map((fund) => (
                <option key={fund.id} value={fund.id}>
                  {fund.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="select-icon" />
          </div>
          <p className="fund-settings__helper">
            All donations will be routed to this fund by default
          </p>
        </div>
      </div>

      {/* Funds available list */}
      {campaignFunds.length > 0 && (
        <div className="fund-settings__section">
          <div className="fund-settings__section-header">
            <span className="fund-settings__label">Funds available in this campaign</span>
            <button className="icon-btn icon-btn--help" title="Help">
              <HelpIcon />
            </button>
          </div>

          <div className="fund-list">
            {campaignFunds.map((fund, index) => {
              const isOver = overIndex === index && dragIndex !== index;
              const isAbove = dragIndex !== null && overIndex !== null && dragIndex > index && isOver;
              const isBelow = dragIndex !== null && overIndex !== null && dragIndex < index && isOver;

              return (
                <div
                  key={fund.id}
                  className={`fund-list__item${canDrag ? ' fund-list__item--draggable' : ''}${isAbove ? ' fund-list__item--drop-above' : ''}${isBelow ? ' fund-list__item--drop-below' : ''}`}
                  draggable={canDrag}
                  onDragStart={canDrag ? (e) => handleDragStart(e, index) : undefined}
                  onDragOver={canDrag ? (e) => handleDragOver(e, index) : undefined}
                  onDragEnd={canDrag ? handleDragEnd : undefined}
                >
                  {canDrag && (
                    <span className="fund-list__drag-handle" title="Drag to reorder">
                      <DragHandleIcon />
                    </span>
                  )}
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
              );
            })}
          </div>
        </div>
      )}

      {/* Allow donors toggle */}
      <div className="fund-settings__toggle-section">
        <div className="fund-settings__toggle-content">
          <div className="fund-settings__toggle-label">Allow donors to choose a specific fund</div>
          <div className="fund-settings__toggle-description">
            Allow your donors to select a fund to designate their donation to. When
            enabled, this will appear under donation amounts
          </div>
        </div>
        <Toggle checked={allowFundChoice} onChange={handleToggleChange} />
      </div>

      {/* Expanded settings when toggle is on */}
      {allowFundChoice && (
        <div className="fund-settings__expanded">
          {/* Add more funds */}
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

          {/* Form Settings — no default fund dropdown here, it's already above */}
          <div className="fund-settings__form-labels">
            <span className="fund-settings__section-title">Donor facing labels (optional)</span>

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

      {/* Save button inside the card */}
      <div className="fund-settings__save-bar">
        <button className="btn btn--primary" onClick={onSave}>
          Save Changes
        </button>
      </div>

      {/* Confirmation modal when disabling fund selection */}
      {showDisableModal && (
        <DisableFundChoiceModal
          defaultFundName={defaultFund?.name || 'General'}
          fundsToRemove={fundsToRemove}
          onCancel={handleCancelDisable}
          onConfirm={handleConfirmDisable}
        />
      )}
    </div>
  );
}

function DragHandleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="4" r="1" fill="currentColor" />
      <circle cx="10" cy="4" r="1" fill="currentColor" />
      <circle cx="6" cy="8" r="1" fill="currentColor" />
      <circle cx="10" cy="8" r="1" fill="currentColor" />
      <circle cx="6" cy="12" r="1" fill="currentColor" />
      <circle cx="10" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export default OptionA;
