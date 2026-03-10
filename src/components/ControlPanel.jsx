import { useState } from 'react';
import './ControlPanel.css';

function ControlPanel({ fundsEnabled, setFundsEnabled, createFrom, setCreateFrom, terminology, setTerminology, paginationEnabled, setPaginationEnabled }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`control-panel${collapsed ? ' control-panel--collapsed' : ''}`}>
      <button
        className="control-panel__toggle"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand panel' : 'Collapse panel'}
      >
        <SettingsGearIcon />
        {collapsed && <span className="control-panel__toggle-label">Prototype</span>}
      </button>

      {!collapsed && (
        <div className="control-panel__body">
          <div className="control-panel__heading">Prototype Controls</div>

          <div className="control-panel__group">
            <div className="control-panel__label">Org-level funds</div>
            <div className="control-panel__options">
              <button
                className={`control-panel__pill${!fundsEnabled ? ' control-panel__pill--active' : ''}`}
                onClick={() => setFundsEnabled(false)}
              >
                General only
              </button>
              <button
                className={`control-panel__pill${fundsEnabled ? ' control-panel__pill--active' : ''}`}
                onClick={() => setFundsEnabled(true)}
              >
                Multiple
              </button>
            </div>
          </div>

          <div className="control-panel__group">
            <div className="control-panel__label">Terminology</div>
            <div className="control-panel__options">
              <button
                className={`control-panel__pill${terminology === 'funds' ? ' control-panel__pill--active' : ''}`}
                onClick={() => setTerminology('funds')}
              >
                Funds
              </button>
              <button
                className={`control-panel__pill${terminology === 'designations' ? ' control-panel__pill--active' : ''}`}
                onClick={() => setTerminology('designations')}
              >
                Designations
              </button>
            </div>
          </div>

          <div className="control-panel__group">
            <div className="control-panel__label">Pagination</div>
            <div className="control-panel__options">
              <button
                className={`control-panel__pill${!paginationEnabled ? ' control-panel__pill--active' : ''}`}
                onClick={() => setPaginationEnabled(false)}
              >
                Off
              </button>
              <button
                className={`control-panel__pill${paginationEnabled ? ' control-panel__pill--active' : ''}`}
                onClick={() => setPaginationEnabled(true)}
              >
                On
              </button>
            </div>
          </div>

          <div className="control-panel__group">
            <div className="control-panel__label">Create funds from</div>
            <div className="control-panel__options control-panel__options--stacked">
              <button
                className={`control-panel__pill control-panel__pill--wide${createFrom === 'campaign' ? ' control-panel__pill--active' : ''}`}
                onClick={() => setCreateFrom('campaign')}
              >
                Campaign settings
              </button>
              <button
                className={`control-panel__pill control-panel__pill--wide${createFrom === 'org' ? ' control-panel__pill--active' : ''}`}
                onClick={() => setCreateFrom('org')}
              >
                Org settings page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsGearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 1.5a1.25 1.25 0 0 1 1.22 1l.17.75a7 7 0 0 1 1.72 1l.72-.25a1.25 1.25 0 0 1 1.53.58l1 1.73a1.25 1.25 0 0 1-.31 1.58l-.55.5a7 7 0 0 1 0 2l.55.5a1.25 1.25 0 0 1 .31 1.58l-1 1.73a1.25 1.25 0 0 1-1.53.58l-.72-.25a7 7 0 0 1-1.72 1l-.17.75a1.25 1.25 0 0 1-1.22 1h-2a1.25 1.25 0 0 1-1.22-1l-.17-.75a7 7 0 0 1-1.72-1l-.72.25a1.25 1.25 0 0 1-1.53-.58l-1-1.73a1.25 1.25 0 0 1 .31-1.58l.55-.5a7 7 0 0 1 0-2l-.55-.5a1.25 1.25 0 0 1-.31-1.58l1-1.73a1.25 1.25 0 0 1 1.53-.58l.72.25a7 7 0 0 1 1.72-1l.17-.75a1.25 1.25 0 0 1 1.22-1z" />
    </svg>
  );
}

export default ControlPanel;
