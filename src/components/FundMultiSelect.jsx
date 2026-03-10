import { useState, useRef, useEffect } from 'react';
import './FundMultiSelect.css';

function FundMultiSelect({ availableFunds, onAdd, disabled, terminology }) {
  const isDesignations = terminology === 'designations';
  const t = {
    funds: isDesignations ? 'designations' : 'funds',
  };
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSelected([]);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSelection = (fundId) => {
    setSelected((prev) =>
      prev.includes(fundId) ? prev.filter((id) => id !== fundId) : [...prev, fundId]
    );
  };

  const removeChip = (fundId) => {
    setSelected((prev) => prev.filter((id) => id !== fundId));
  };

  const handleAdd = () => {
    if (selected.length > 0) {
      onAdd(selected);
      setSelected([]);
      setIsOpen(false);
      setSearch('');
    }
  };

  const filteredFunds = availableFunds.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleContainerClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
    inputRef.current?.focus();
  };

  if (disabled) {
    return (
      <div className="multi-select">
        <div className="multi-select__control multi-select__control--disabled">
          <span className="multi-select__placeholder">Select from a dropdown</span>
          <svg className="multi-select__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    );
  }

  if (availableFunds.length === 0 && !isOpen) {
    return (
      <div className="multi-select">
        <div className="multi-select__control multi-select__control--disabled">
          <span className="multi-select__placeholder">No more {t.funds} available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="multi-select" ref={containerRef}>
      <div
        className={`multi-select__control ${isOpen ? 'multi-select__control--open' : ''}`}
        onClick={handleContainerClick}
      >
        {isOpen && selected.length > 0 ? (
          <div className="multi-select__chips-row">
            <svg className="multi-select__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#9ca3af" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {selected.map((id) => {
              const fund = availableFunds.find((f) => f.id === id);
              return fund ? (
                <span key={id} className="multi-select__chip">
                  {fund.name}
                  <button
                    className="multi-select__chip-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChip(id);
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              ) : null;
            })}
            <input
              ref={inputRef}
              className="multi-select__input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder=""
            />
          </div>
        ) : (
          <>
            <span className="multi-select__placeholder">Select from a dropdown</span>
            <svg className="multi-select__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
        {isOpen && (
          <svg className="multi-select__chevron multi-select__chevron--up" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {isOpen && (
        <div className="multi-select__dropdown">
          <div className="multi-select__options">
            {filteredFunds.map((fund) => {
              const isChecked = selected.includes(fund.id);
              return (
                <label
                  key={fund.id}
                  className={`multi-select__option ${isChecked ? 'multi-select__option--selected' : ''}`}
                >
                  <span className={`multi-select__checkbox ${isChecked ? 'multi-select__checkbox--checked' : ''}`}>
                    {isChecked && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6l2.5 2.5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    className="multi-select__hidden-input"
                    checked={isChecked}
                    onChange={() => toggleSelection(fund.id)}
                  />
                  <span className="multi-select__option-name">{fund.name}</span>
                </label>
              );
            })}
            {filteredFunds.length === 0 && (
              <div className="multi-select__empty">No matching {t.funds}</div>
            )}
          </div>
          <div className="multi-select__footer">
            <span className="multi-select__count">
              {selected.length} selected
            </span>
            <button
              className="btn btn--primary btn--sm"
              onClick={handleAdd}
              disabled={selected.length === 0}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FundMultiSelect;
