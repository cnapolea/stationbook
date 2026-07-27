const router = require('express').Router();
const {
  fetchWorkstations,
  getWorkstationTimeSlots,
} = require('../../services/workstations');

router.get('/workstations', async (req, res) => {
  const workstations = await fetchWorkstations();
  res.status(200).json({ workstations });
});

router.get('/workstations/:workstationId/slots', async (req, res) => {
  const reqData = {
    workstationId: Number(req.params.workstationId),
    date: req.query.date,
  };
  const data = await getWorkstationTimeSlots(reqData);

  res.status(200).json({
    availableSlots: data,
  });
});

module.exports = router;
