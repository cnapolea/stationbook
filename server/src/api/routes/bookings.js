const {
  createBooking,
  getStudentBookings,
} = require('../../services/bookings');

const router = require('express').Router();

router.post('/bookings', async (req, res) => {
  const reqData = {
    ...req.body,
    userId: req.user.id,
  };

  const data = await createBooking(reqData);
  res.status(201).json({ ...data });
});

router.get('/bookings/me', async (req, res) => {
  const reqData = {
    userId: req.user.id,
  };

  const data = await getStudentBookings(reqData);
  res.status(200).json(data);
});

module.exports = router;
