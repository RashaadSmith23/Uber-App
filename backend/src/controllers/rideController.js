const pool = require('../config/db');

exports.estimateFare = (req, res) => {
  const { rideType } = req.body;
  let baseFare, perKm;
  switch (rideType) {
    case 'UberX': baseFare = 2.5; perKm = 1.2; break;
    case 'UberBlack': baseFare = 5.0; perKm = 2.0; break;
    case 'Pool': baseFare = 1.5; perKm = 0.9; break;
    default: baseFare = 2.5; perKm = 1.2;
  }
  const distanceKm = +(Math.random() * 20 + 1).toFixed(2);
  const fare = +(baseFare + distanceKm * perKm).toFixed(2);
  res.json({ distanceKm, fare, currency: 'USD', rideType });
};

exports.requestRide = async (req, res) => {
  const riderId = req.userId;
  const { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, ride_type, fare_estimate } = req.body;
  try {
    const tripResult = await pool.query(
      `INSERT INTO trips (rider_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, ride_type, fare_estimate, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'requested') RETURNING *`,
      [riderId, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, ride_type, fare_estimate]
    );
    const trip = tripResult.rows[0];

    const driverResult = await pool.query(
      `SELECT u.id, u.full_name, d.current_lat, d.current_lng 
       FROM drivers d JOIN users u ON u.id = d.user_id 
       WHERE d.is_online = true LIMIT 1`
    );

    if (driverResult.rows.length > 0) {
        const driver = driverResult.rows[0];
        const io = req.app.get('io');
        // Notify all online drivers about the new ride request
        io.to('drivers').emit('ride:request', {
            tripId: trip.id,
            pickup: { lat: pickup_lat, lng: pickup_lng },
            dropoff: { lat: dropoff_lat, lng: dropoff_lng },
            fare: fare_estimate,
            riderName: 'Jane Rider', // you can fetch the rider's name from DB
        });
        return res.json({ trip, driver });
    }
    res.json({ trip, message: 'Looking for nearby drivers...' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.acceptRide = async (req, res) => {
  const driverId = req.userId;
  const { tripId } = req.params;
  try {
    const tripResult = await pool.query(
      'SELECT * FROM trips WHERE id = $1 AND status = $2', [tripId, 'requested']
    );
    if (tripResult.rows.length === 0) {
      return res.status(400).json({ error: 'Trip no longer available' });
    }
    await pool.query(
      'UPDATE trips SET driver_id = $1, status = $2 WHERE id = $3',
      [driverId, 'accepted', tripId]
    );
    res.json({ message: 'Ride accepted', tripId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  const io = req.app.get('io');
    // Notify the rider that the driver has accepted
    io.to(`trip_${tripId}`).emit('ride:accepted', {
    tripId,
    driverId,
    driverName: 'John Driver' // fetch from DB if needed
    });
};

exports.completeRide = async (req, res) => {
  const driverId = req.userId;
  const { tripId } = req.params;
  try {
    const result = await pool.query(
      `UPDATE trips SET status = 'completed', completed_at = NOW() 
       WHERE id = $1 AND driver_id = $2 AND status = 'accepted'
       RETURNING *`,
      [tripId, driverId]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Could not complete trip' });
    }
    res.json({ message: 'Trip completed', trip: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};