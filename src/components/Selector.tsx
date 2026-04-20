import React from 'react';
import { AdoProject, AdoTeam } from '../services/fetchService';

// 1. Define a union type for the options to handle both Projects and Teams
type SelectorOption = AdoProject | AdoTeam;

interface SelectorProps {
  options: SelectorOption[];
  // setValue accepts a string (the ID/Value) or null
  setValue: (value: string | null) => void;
  title: string;
  value: string | null;
  loading?: boolean;
}

const Selector: React.FC<SelectorProps> = ({ options, setValue, title, value, loading = false }) => {

  if (loading) {
    return (
      <div className="filter-group">
        <h3>Select {title}:</h3>
        <select 
          className="select-dropdown" 
          disabled
          style={{ opacity: 0.6, cursor: 'not-allowed' }}
        >
          <option value="">Loading {title}...</option>
        </select>
      </div>
    );
  }

  if (!options || options.length === 0) {
    return (
      <div className="filter-group">
        <h3>Select {title}:</h3>
        <select 
          className="select-dropdown" 
          disabled
          style={{ opacity: 0.6, cursor: 'not-allowed' }}
        >
          <option value="">No {title} available</option>
        </select>
      </div>
    );
  }

  return (
    <div className="filter-group">
      <h3>Select {title}:</h3>
      <select 
        className="select-dropdown" 
        // Ensure we handle the empty selection case correctly
        onChange={e => setValue(e.target.value || null)}
        // Controlled component: keep the select in sync with context state
        value={value || ''}
      >
        <option value="">--Select {title}--</option>
        {options.map((option, idx) => {
          // Azure DevOps IDs are usually strings/GUIDs, fallback to index if missing
          const optionId = 'id' in option ? option.id : idx;
          const optionName = option.name;
          
          return (
            <option key={optionId} value={optionId}>
              {optionName}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Selector;