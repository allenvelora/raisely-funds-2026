export function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
      <text x="9" y="13" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="600">?</text>
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 5h12M7 5V3.5a1 1 0 011-1h2a1 1 0 011 1V5m2 0v9.5a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 015 14.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
