import { useState } from 'react';
import './ControlPanel.css';

function ControlPanel({ fundsEnabled, setFundsEnabled, createFrom, setCreateFrom, paginationEnabled, setPaginationEnabled }) {
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
    <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
      <path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" />
    </svg>
  );
}

export default ControlPanel;
