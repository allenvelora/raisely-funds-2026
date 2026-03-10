import { useState, useRef, useEffect } from 'react';
import Toggle from './Toggle';
import FundMultiSelect from './FundMultiSelect';
import DisableFundChoiceModal from './DisableFundChoiceModal';
import Pagination, { PAGE_SIZE } from './Pagination';
import { HelpIcon, TrashIcon, ChevronDownIcon } from './Icons';
import './DonationFundSettings.css';

function useTerms(terminology) {
  const isDesignations = terminology === 'designations';
  return {
    fund: isDesignations ? 'designation' : 'fund',
    Fund: isDesignations ? 'Designation' : 'Fund',
    funds: isDesignations ? 'designations' : 'funds',
    Funds: isDesignations ? 'Designations' : 'Funds',
  };
}

function OptionA({
  campaignFunds,
  allowFundChoice,
  defaultFundId,
  fundSelectHeading,
  fundSelectLabel,
  availableFundsToAdd,
  orgFunds,
  terminology,
  paginationEnabled,
  onToggleFundChoice,
  onDisableFundChoice,
  onAddFunds,
  onRemoveFund,
  onDefaultFundChange,
  onReorderFunds,
  onFundSelectHeadingChange,
  onFundSelectLabelChange,
  onSave,
  onGoToOrgSettings,
}) {
  const t = useTerms(terminology);
  const canDrag = campaignFunds.length > 1;
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dragNode = useRef(null);

  const needsPagination = paginationEnabled && campaignFunds.length > PAGE_SIZE;
  const totalPages = Math.ceil(campaignFunds.length / PAGE_SIZE);
  const displayedFunds = needsPagination
    ? campaignFunds.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : campaignFunds;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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

  const defaultFund = campaignFunds.find((f) => f.id === defaultFundId);
  const fundsToRemove = campaignFunds.filter((f) => f.id !== defaultFundId);
  const noAdditionalOrgFunds = orgFunds.length <= 1;

  return (
    <div className="fund-settings">
      <div className="fund-settings__header">
        <h2 className="fund-settings__title">
          Donation {t.fund} settings
          <span className="badge badge--new">New</span>
        </h2>
        <p className="fund-settings__description">
          Set the default {t.fund} for your donations made to this campaign and allow donors to
          select a {t.fund} to designate their donation to.{' '}
          <a href="#" className="link">Learn more</a>
        </p>
      </div>

      {/* Always-visible default fund selector */}
      <div className="fund-settings__section">
        <div className="fund-settings__field">
          <div className="fund-settings__field-header">
            <label className="fund-settings__field-label">Default {t.fund}</label>
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
            All donations will be routed to this {t.fund} by default
          </p>
        </div>
      </div>

      {/* Allow donors toggle */}
      <div className="fund-settings__toggle-section">
        <div className="fund-settings__toggle-content">
          <div className="fund-settings__toggle-label">Allow donors to choose a specific {t.fund}</div>
          <div className="fund-settings__toggle-description">
            Allow your donors to select a {t.fund} to designate their donation to. When
            enabled, this will appear under donation amounts
          </div>
        </div>
        <Toggle checked={allowFundChoice} onChange={handleToggleChange} />
      </div>

      {/* Expanded settings when toggle is on */}
      {allowFundChoice && (
        <div className="fund-settings__expanded">
          {/* Funds available list */}
          {campaignFunds.length > 0 && (
            <div className="fund-settings__section">
              <div className="fund-settings__section-header">
                <span className="fund-settings__label">{t.Funds} available in this campaign</span>
                <button className="icon-btn icon-btn--help" title="Help">
                  <HelpIcon />
                </button>
              </div>

              <div className="fund-list">
                {displayedFunds.map((fund, localIndex) => {
                  const globalIndex = needsPagination
                    ? (currentPage - 1) * PAGE_SIZE + localIndex
                    : localIndex;
                  const isOver = overIndex === globalIndex && dragIndex !== globalIndex;
                  const isAbove = dragIndex !== null && overIndex !== null && dragIndex > globalIndex && isOver;
                  const isBelow = dragIndex !== null && overIndex !== null && dragIndex < globalIndex && isOver;
                  const canDragItem = canDrag && !needsPagination;

                  return (
                    <div
                      key={fund.id}
                      className={`fund-list__item${canDragItem ? ' fund-list__item--draggable' : ''}${isAbove ? ' fund-list__item--drop-above' : ''}${isBelow ? ' fund-list__item--drop-below' : ''}`}
                      draggable={canDragItem}
                      onDragStart={canDragItem ? (e) => handleDragStart(e, globalIndex) : undefined}
                      onDragOver={canDragItem ? (e) => handleDragOver(e, globalIndex) : undefined}
                      onDragEnd={canDragItem ? handleDragEnd : undefined}
                    >
                      {canDragItem && (
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
                          title={`Remove ${t.fund}`}
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              {needsPagination && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={campaignFunds.length}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          )}

          {noAdditionalOrgFunds && (
            <div className="no-funds-banner">
              <span className="no-funds-banner__icon">⚠</span>
              <div className="no-funds-banner__content">
                <strong className="no-funds-banner__title">No additional {t.funds} available</strong>
                <p className="no-funds-banner__description">
                  You need to create additional {t.funds} before donors can choose where their donation goes.
                </p>
                <a
                  href="#"
                  className="no-funds-banner__link"
                  onClick={(e) => { e.preventDefault(); onGoToOrgSettings?.(); }}
                >
                  Go to Organisation settings
                </a>
              </div>
            </div>
          )}

          <div className={`fund-settings__field${noAdditionalOrgFunds ? ' fund-settings__field--disabled' : ''}`}>
            <label className="fund-settings__field-label">Add more {t.funds} to campaign</label>
            <FundMultiSelect
              availableFunds={availableFundsToAdd}
              onAdd={onAddFunds}
              disabled={noAdditionalOrgFunds}
              terminology={terminology}
            />
            <p className="fund-settings__helper">
              {t.Funds} can be added from{' '}
              <a href="#" className="link" onClick={(e) => { e.preventDefault(); onGoToOrgSettings?.(); }}>
                Organisation settings &gt; Donation {t.funds}
              </a>
            </p>
          </div>

          <div className="fund-settings__form-labels">
            <span className="fund-settings__section-title">Donor facing labels (optional)</span>

            <div className="fund-settings__field">
              <label className="fund-settings__field-label">{t.Fund} select heading</label>
              <input
                type="text"
                className="text-input"
                value={fundSelectHeading}
                onChange={(e) => onFundSelectHeadingChange(e.target.value)}
              />
            </div>

            <div className="fund-settings__field">
              <label className="fund-settings__field-label">{t.Fund} select input label</label>
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
          terminology={terminology}
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
