import { useState } from 'react';
import DonationFundSettings from './components/OptionA';
import SaveConfirmationModal from './components/SaveConfirmationModal';
import ControlPanel from './components/ControlPanel';
import OrgFundsSettings from './components/OrgFundsSettings';
import './App.css';

const DEFAULT_ORG_FUNDS = [
  { id: 'general', name: 'General', description: 'General Fund' },
  { id: 'education', name: 'Education', description: 'Program Fund' },
  { id: 'building', name: 'Building', description: 'Facilities Fund' },
  { id: 'holidays', name: 'Holidays', description: 'Holiday Fund' },
  { id: 'seasonal', name: 'Seasonal', description: 'Seasonal Fund' },
  { id: '2026', name: '2026', description: 'Annual Fund 2026' },
  { id: 'special', name: 'Special Projects', description: 'Special Projects Fund' },
  { id: 'emergencies', name: 'Emergencies', description: 'Emergency Fund' },
];

const GENERAL_ONLY = [
  { id: 'general', name: 'General', description: 'General Fund' },
];

function App() {
  const [showModal, setShowModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Prototype control states
  const [hasAdditionalFunds, setHasAdditionalFunds] = useState(true);
  const [createFrom, setCreateFrom] = useState('campaign');

  // Dynamic org funds (can grow when user creates new funds)
  const [allOrgFunds, setAllOrgFunds] = useState(DEFAULT_ORG_FUNDS);
  const [generalOnlyFunds, setGeneralOnlyFunds] = useState(GENERAL_ONLY);
  const [orgDefaultFundId, setOrgDefaultFundId] = useState('general');

  const orgFunds = hasAdditionalFunds ? allOrgFunds : generalOnlyFunds;

  // Campaign fund settings state
  const [campaignFunds, setCampaignFunds] = useState([
    { id: 'general', name: 'General', description: 'General Fund', isDefault: true },
  ]);
  const [allowFundChoice, setAllowFundChoice] = useState(false);
  const [defaultFundId, setDefaultFundId] = useState('general');
  const [fundSelectHeading, setFundSelectHeading] = useState('Choose where your donation goes');
  const [fundSelectLabel, setFundSelectLabel] = useState('Select a fund');

  const handleAddOrgFund = ({ internalName, publicName, setAsDefault }) => {
    const id = internalName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newFund = { id, name: internalName, description: publicName };
    if (hasAdditionalFunds) {
      setAllOrgFunds((prev) => [...prev, newFund]);
    } else {
      setGeneralOnlyFunds((prev) => [...prev, newFund]);
    }
    if (setAsDefault) {
      setOrgDefaultFundId(id);
    }
  };

  const handleEditOrgFund = ({ id, internalName, publicName, setAsDefault }) => {
    const updater = (prev) =>
      prev.map((f) => f.id === id ? { ...f, name: internalName, description: publicName } : f);
    setAllOrgFunds(updater);
    setGeneralOnlyFunds(updater);
    if (setAsDefault) {
      setOrgDefaultFundId(id);
    }
  };

  const handleArchiveOrgFund = (fundId) => {
    setAllOrgFunds((prev) => prev.filter((f) => f.id !== fundId));
    setGeneralOnlyFunds((prev) => prev.filter((f) => f.id !== fundId));
    setCampaignFunds((prev) => prev.filter((f) => f.id !== fundId));
  };

  const handleAddFunds = (fundIds) => {
    const newFunds = fundIds
      .filter((id) => !campaignFunds.find((f) => f.id === id))
      .map((id) => {
        const orgFund = orgFunds.find((f) => f.id === id);
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

  const handleDisableFundChoice = () => {
    setAllowFundChoice(false);
    setCampaignFunds((prev) => {
      const defaultFund = prev.find((f) => f.id === defaultFundId);
      return defaultFund ? [{ ...defaultFund, isDefault: true }] : prev;
    });
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
    if (!allowFundChoice || campaignFunds.length <= 1) {
      const orgFund = orgFunds.find((f) => f.id === fundId);
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

  const handleGoToOrgSettings = () => {
    setCreateFrom('org');
  };

  const availableFundsToAdd = orgFunds.filter(
    (f) => !campaignFunds.find((cf) => cf.id === f.id)
  );

  return (
    <div className="app">
      <div className="page-content">
        {/* Org Settings view */}
        {createFrom === 'org' && (
          <>
            <h1 className="page-title">Settings</h1>
            <OrgFundsSettings
              orgFunds={orgFunds}
              orgDefaultFundId={orgDefaultFundId}
              onSetOrgDefault={setOrgDefaultFundId}
              onAddOrgFund={handleAddOrgFund}
              onEditOrgFund={handleEditOrgFund}
              onArchiveOrgFund={handleArchiveOrgFund}
            />
          </>
        )}

        {/* Campaign settings view */}
        {createFrom === 'campaign' && (
          <>
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
              orgFunds={orgFunds}
              onToggleFundChoice={handleToggleFundChoice}
              onDisableFundChoice={handleDisableFundChoice}
              onAddFunds={handleAddFunds}
              onRemoveFund={handleRemoveFund}
              onReorderFunds={handleReorderFunds}
              onDefaultFundChange={handleDefaultFundChange}
              onFundSelectHeadingChange={(v) => { setFundSelectHeading(v); setHasChanges(true); }}
              onFundSelectLabelChange={(v) => { setFundSelectLabel(v); setHasChanges(true); }}
              onSave={handleSaveClick}
              onGoToOrgSettings={handleGoToOrgSettings}
            />
          </>
        )}
      </div>

      {showModal && (
        <SaveConfirmationModal
          onCancel={() => setShowModal(false)}
          onSave={handleConfirmSave}
        />
      )}

      <ControlPanel
        fundsEnabled={hasAdditionalFunds}
        setFundsEnabled={setHasAdditionalFunds}
        createFrom={createFrom}
        setCreateFrom={setCreateFrom}
      />
    </div>
  );
}

export default App;
