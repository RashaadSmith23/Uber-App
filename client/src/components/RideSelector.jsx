import { useState, useEffect } from 'react';
import API from '../services/api';

const rideTypes = ['UberX', 'UberBlack', 'Pool'];

export default function RideSelector({ onRequest }) {
  const [selected, setSelected] = useState('UberX');
  const [estimate, setEstimate] = useState(null);
  const [insight, setInsight] = useState('{insight && <p className="insight-text">✨ {insight}</p>}');

  useEffect(() => {
    API.post('/rides/estimate', { rideType: selected })
        .then(({ data }) => {
        setEstimate(data);
        setInsight(data.insight); // no extra API call
        })
        .catch(console.error);
    }, [selected]);

  return (
    <div className="ride-selector">
      {rideTypes.map(type => (
        <button key={type} onClick={() => setSelected(type)} className={selected === type ? 'active' : ''}>
          {type} {estimate && type === selected && `$${estimate.fare}`}
        </button>
      ))}
      <button onClick={() => onRequest(selected, estimate?.fare)} disabled={!estimate}>
        Request {selected}
      </button>
    </div>
  );
}