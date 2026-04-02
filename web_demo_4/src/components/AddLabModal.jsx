import './AddLabModal.css';

function AddLabModal({ isOpen, onClose, formData, onChange, errors, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add computer lab</h2>
        <form>
          <div>
            <label>Room Name:</label>
            <input
              type="text"
              name="roomName"
              value={formData.roomName}
              onChange={onChange}
            />
            {errors.roomName && <span className="error">{errors.roomName}</span>}
          </div>
          <div>
            <label>Room code:</label>
            <input
              type="text"
              name="roomCode"
              value={formData.roomCode}
              onChange={onChange}
            />
            {errors.roomCode && <span className="error">{errors.roomCode}</span>}
          </div>
          <div>
            <label>Computer:</label>
            <input
              type="text"
              name="computer"
              value={formData.computer}
              onChange={onChange}
            />
            {errors.computer && <span className="error">{errors.computer}</span>}
          </div>
          <div>
            <label>Manager:</label>
            <input
              type="text"
              name="manager"
              value={formData.manager}
              onChange={onChange}
            />
            {errors.manager && <span className="error">{errors.manager}</span>}
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="buttons">
            <button type="button" onClick={onSave}>Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLabModal;