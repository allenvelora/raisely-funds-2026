import { useState } from 'react';
import DonationFundSettings from './components/OptionA';
import SaveConfirmationModal from './components/SaveConfirmationModal';
import './App.css';

// Mock data for available org-level funds
const ORG_FUNDS = [
  { id: 'general', name: 'General', description: 'General Fund' },
  { id: 'education', name: 'Education', description: 'Program Fund' },
  { id: 'building', name: 'Building', description: 'Facilities Fund' },
  { id: 'holidays', name: 'Holidays', description: 'Holiday Fund' },
  { id: 'seasonal', name: 'Seasonal', description: 'Seasonal Fund' },
  { id: '2026', name: '2026', description: 'Annual Fund 2026' },
];

function App() {
  const [showModal, setShowModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Campaign fund settings state
  const [campaignFunds, setCampaignFunds] = useState([
    { id: 'general', name: 'General', description: 'General Fund', isDefault: true },
  ]);
  const [allowFundChoice, setAllowFundChoice] = useState(false);
  const [defaultFundId, setDefaultFundId] = useState('general');
  const [fundSelectHeading, setFundSelectHeading] = useState('Choose where your donation goes');
  const [fundSelectLabel, setFundSelectLabel] = useState('Select a fund');

  const handleAddFunds = (fundIds) => {
    const newFunds = fundIds
      .filter((id) => !campaignFunds.find((f) => f.id === id))
      .map((id) => {
        const orgFund = ORG_FUNDS.find((f) => f.id === id);
        return { ...orgFund, isDefault: false };
      });
    setCampaignFunds([...campaignFunds, ...newFunds]);
    setHasChanges(true);
  };

  const handleRemoveFund = (fundId) => {
    if (fundId === defaultFundId) return;
    setCampaignFunds(campaignFunds.filter((f) => f.id !== fundId));
    setHasChanges(true);
  };

  const handleToggleFundChoice = (enabled) => {
    setAllowFundChoice(enabled);
    setHasChanges(true);
  };

  const handleReorderFunds = (fromIndex, toIndex) => {
    setCampaignFunds((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
    setHasChanges(true);
  };

  const handleDefaultFundChange = (fundId) => {
    setDefaultFundId(fundId);
    // In single fund mode, swap the campaign list to just the new default
    if (!allowFundChoice || campaignFunds.length <= 1) {
      const orgFund = ORG_FUNDS.find((f) => f.id === fundId);
      if (orgFund) {
        setCampaignFunds([{ ...orgFund, isDefault: true }]);
      }
    }
    setHasChanges(true);
  };

  const handleSaveClick = () => {
    setShowModal(true);
  };

  const handleConfirmSave = () => {
    setShowModal(false);
    setHasChanges(false);
  };

  const availableFundsToAdd = ORG_FUNDS.filter(
    (f) => !campaignFunds.find((cf) => cf.id === f.id)
  );

  return (
    <div className="app">
      <div className="page-content">
        <h1 className="page-title">Donation form</h1>
        <div className="tabs">
          <button className="tab">Amounts</button>
          <button className="tab">Fields</button>
          <button className="tab tab--active">Settings</button>
          <button className="tab">Regular Giving</button>
          <button className="tab">Embed</button>
        </div>

        <DonationFundSettings
          campaignFunds={campaignFunds}
          allowFundChoice={allowFundChoice}
          defaultFundId={defaultFundId}
          fundSelectHeading={fundSelectHeading}
          fundSelectLabel={fundSelectLabel}
          availableFundsToAdd={availableFundsToAdd}
          orgFunds={ORG_FUNDS}
          onToggleFundChoice={handleToggleFundChoice}
          onAddFunds={handleAddFunds}
          onRemoveFund={handleRemoveFund}
          onReorderFunds={handleReorderFunds}
          onDefaultFundChange={handleDefaultFundChange}
          onFundSelectHeadingChange={(v) => { setFundSelectHeading(v); setHasChanges(true); }}
          onFundSelectLabelChange={(v) => { setFundSelectLabel(v); setHasChanges(true); }}
        />

        <div className="save-bar">
          <button className="btn btn--primary" onClick={handleSaveClick}>
            Save Changes
          </button>
        </div>
      </div>

      {showModal && (
        <SaveConfirmationModal
          onCancel={() => setShowModal(false)}
          onSave={handleConfirmSave}
        />
      )}
    </div>
  );
}

export default App;
