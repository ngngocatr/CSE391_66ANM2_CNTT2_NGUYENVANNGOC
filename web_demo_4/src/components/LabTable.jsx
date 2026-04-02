import './LabTable.css';

function LabTable({ labs, filterValue, onFilterChange }) {
  return (
    <div className="lab-table">
      <h2>Computer labs</h2>
      <input
        type="text"
        placeholder="Filter labs..."
        value={filterValue}
        onChange={(e) => onFilterChange(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Room name</th>
            <th>Room code</th>
            <th>Computer</th>
            <th>Manager</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {labs.map((lab, index) => (
            <tr key={index}>
              <td>{lab.roomName}</td>
              <td>{lab.roomCode}</td>
              <td>{lab.computer}</td>
              <td>{lab.manager}</td>
              <td>{lab.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LabTable;
