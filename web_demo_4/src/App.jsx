import { useState } from 'react';
import { labs as initialLabs } from './data.js';
import LabMap from './components/LabMap';
import Navigation from './components/Navigation';
import LabTable from './components/LabTable';
import AddLabModal from './components/AddLabModal';
import './App.css';

export default function App() {
  console.log('App rendering', initialLabs);
  const [labs, setLabs] = useState(initialLabs);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    roomName: '',
    roomCode: '',
    computer: '',
    manager: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const normalizedSearch = search.trim().toLowerCase();
  const filteredLabs = labs.filter((lab) => {
    if (!normalizedSearch) return true;
    const searchableFields = [
      lab.roomName,
      lab.roomCode,
      lab.computer,
      lab.manager,
      lab.email
    ]
      .filter(Boolean)
      .map((field) => field.toString().toLowerCase());

    return searchableFields.some((field) =>
      field.includes(normalizedSearch)
    );
  });

  const handleAddNew = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      roomName: '',
      roomCode: '',
      computer: '',
      manager: '',
      email: ''
    });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    const newErrors = {};

    if (!formData.roomName.trim()) {
      newErrors.roomName = 'Room name is required';
    }

    if (!formData.roomCode.trim()) {
      newErrors.roomCode = 'Room code is required';
    } else if (!/^PM\d{3}$/.test(formData.roomCode)) {
      newErrors.roomCode = 'Room code must be PM followed by 3 digits';
    }

    if (!formData.computer.trim()) {
      newErrors.computer = 'Computer is required';
    }

    if (!formData.manager.trim()) {
      newErrors.manager = 'Manager is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (Object.keys(newErrors).length === 0) {
      setLabs([...labs, formData]);
      handleClose();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="app">
      <LabMap />
      <div className="main-content">
        <Navigation onAddNew={handleAddNew} />
        <LabTable
          labs={filteredLabs}
          filterValue={search}
          onFilterChange={setSearch}
        />
      </div>
      <AddLabModal
        isOpen={showModal}
        onClose={handleClose}
        formData={formData}
        onChange={handleChange}
        errors={errors}
        onSave={handleSave}
      />
    </div>
  );
}

