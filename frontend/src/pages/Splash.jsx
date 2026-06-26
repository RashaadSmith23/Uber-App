import { Link } from 'react-router-dom';

export default function Splash() {
  return (
    <div className="splash">
      <h1>Zippora</h1>
      <p>Your ride, your way</p>
      <div className="mode-select">
        <Link to="/register?role=rider">Ride with Zippora</Link>
        <Link to="/register?role=driver">Drive with Zippora</Link>
      </div>
    </div>
  );
}