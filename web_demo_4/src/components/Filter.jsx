import { useState } from 'react';
import './Filter.css';

function Filter({ search, onSearchChange }) {
  const [localSearch, setLocalSearch] = useState(search);

  const handleFilter = () => {
    onSearchChange(localSearch);
  };

  return (
    <div className="filter">
      <input
        type="text"
        placeholder="Filter labs..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
      <button onClick={handleFilter}>Lọc</button>
    </div>
  );
}

export default Filter;