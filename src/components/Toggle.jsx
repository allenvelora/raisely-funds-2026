import './Toggle.css';

function Toggle({ checked, onChange }) {
  return (
    <button
      className={`toggle ${checked ? 'toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className="toggle__thumb" />
    </button>
  );
}

export default Toggle;
