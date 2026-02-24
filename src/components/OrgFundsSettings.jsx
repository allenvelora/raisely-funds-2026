import { useState, useEffect, useRef } from 'react';
import { HelpIcon, ChevronDownIcon } from './Icons';
import NewFundModal from './NewFundModal';
import './OrgFundsSettings.css';

function OrgFundsSettings({ orgFunds, orgDefaultFundId, onSetOrgDefault, onAddOrgFund, onEditOrgFund, onArchiveOrgFund }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [showNewFundModal, setShowNewFundModal] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (listRef.current && !listRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = orgFunds.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="org-funds">
      <div className="org-funds__main">
        <h2 className="org-funds__title">Donation funds</h2>
        <p className="org-funds__description">
          Create and manage your organisation's donation funds.{' '}
          <a href="#" className="link">Learn more about funds</a>
        </p>

        <div className="org-funds__toolbar">
          <div className="org-funds__count">
            Funds <span className="org-funds__badge">{orgFunds.length}</span>
          </div>
          <div className="org-funds__actions">
            <div className="org-funds__search">
              <SearchIcon />
              <input
                type="text"
                className="org-funds__search-input"
                placeholder="Search funds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn--primary btn--sm" onClick={() => setShowNewFundModal(true)}>
              + New fund
            </button>
          </div>
        </div>

        <div className="org-funds__list" ref={listRef}>
          {filtered.map((fund) => {
            const isDefault = fund.id === orgDefaultFundId;
            const isMenuOpen = menuOpenId === fund.id;
            return (
              <div key={fund.id} className="org-funds__item">
                <div className="org-funds__item-info">
                  <div className="org-funds__item-name">
                    {fund.name}
                    {isDefault && (
                      <span className="badge badge--default" style={{ marginLeft: 8 }}>Default</span>
                    )}
                  </div>
                  <div className="org-funds__item-meta">
                    <span className="org-funds__item-label">Public name</span>
                    <span className="org-funds__item-value">{fund.description}</span>
                  </div>
                </div>
                <div className="org-funds__item-actions">
                  <button
                    className="org-funds__item-menu"
                    onClick={() => setMenuOpenId(isMenuOpen ? null : fund.id)}
                  >
                    <MoreIcon />
                  </button>
                  {isMenuOpen && (
                    <div className="org-funds__dropdown">
                      <button
                        className="org-funds__dropdown-item"
                        onClick={() => { setEditingFund(fund); setMenuOpenId(null); }}
                      >
                        <EditIcon />
                        Edit
                      </button>
                      {!isDefault && (
                        <button
                          className="org-funds__dropdown-item org-funds__dropdown-item--danger"
                          onClick={() => { onArchiveOrgFund?.(fund.id); setMenuOpenId(null); }}
                        >
                          <ArchiveIcon />
                          Archive
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showNewFundModal && (
        <NewFundModal
          onCancel={() => setShowNewFundModal(false)}
          onSave={(fund) => {
            onAddOrgFund?.(fund);
            setShowNewFundModal(false);
          }}
        />
      )}

      {editingFund && (
        <NewFundModal
          fund={editingFund}
          isDefault={editingFund.id === orgDefaultFundId || editingFund._setDefault}
          onCancel={() => setEditingFund(null)}
          onSave={(data) => {
            onEditOrgFund?.(data);
            if (data.setAsDefault) {
              onSetOrgDefault(data.id);
            }
            setEditingFund(null);
          }}
        />
      )}
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <div className={`org-nav-item${active ? ' org-nav-item--active' : ''}`}>
      <span className="org-nav-item__icon">{icon}</span>
      <span className="org-nav-item__label">{label}</span>
    </div>
  );
}

/* ---- Inline SVG Icons for the sidebar ---- */

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 1.5a1.25 1.25 0 0 1 1.22 1l.17.75a7 7 0 0 1 1.72 1l.72-.25a1.25 1.25 0 0 1 1.53.58l1 1.73a1.25 1.25 0 0 1-.31 1.58l-.55.5a7 7 0 0 1 0 2l.55.5a1.25 1.25 0 0 1 .31 1.58l-1 1.73a1.25 1.25 0 0 1-1.53.58l-.72-.25a7 7 0 0 1-1.72 1l-.17.75a1.25 1.25 0 0 1-1.22 1h-2a1.25 1.25 0 0 1-1.22-1l-.17-.75a7 7 0 0 1-1.72-1l-.72.25a1.25 1.25 0 0 1-1.53-.58l-1-1.73a1.25 1.25 0 0 1 .31-1.58l.55-.5a7 7 0 0 1 0-2l-.55-.5a1.25 1.25 0 0 1-.31-1.58l1-1.73a1.25 1.25 0 0 1 1.53-.58l.72.25a7 7 0 0 1 1.72-1l.17-.75a1.25 1.25 0 0 1 1.22-1z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="8" r="1.5" fill="currentColor" /><circle cx="8" cy="12" r="1.5" fill="currentColor" /><circle cx="16" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function FieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

function FundIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22 7 12 13 2 7" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-5" /><path d="M9 8V1h6v7" /><path d="M9 8a6 6 0 0 0 6 0" /><path d="M9 12h6" /><path d="M12 12v5" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export default OrgFundsSettings;
