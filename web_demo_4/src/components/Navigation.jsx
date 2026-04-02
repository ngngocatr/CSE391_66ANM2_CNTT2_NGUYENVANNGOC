import './Navigation.css';

function Navigation({ onAddNew }) {
  return (
    <nav className="navigation">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#list">List</a></li>
        <li><button onClick={onAddNew}>Add new</button></li>
        <li><a href="#about">About</a></li>
      </ul>
    </nav>
  );
}

export default Navigation;