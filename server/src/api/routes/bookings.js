const {
  createBooking,
  getStudentBookings,
  editStudentBooking,
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

router.patch('/bookings/:id', async (req, res) => {
  const reqData = {
    userId: req.user.id,
    bookingId: req.params.id,
    data: req.body,
  };

  await editStudentBooking(reqData);
  res.status(204).end();
});

module.exports = router;
