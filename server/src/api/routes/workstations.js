const router = require('express').Router();
const { fetchWorkstations } = require('../../services/workstations');

router.get('/workstations', async (req, res) => {
  const workstations = await fetchWorkstations();
  res.status(200).json({ workstations });
});

module.exports = router;
