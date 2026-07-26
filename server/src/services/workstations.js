const { prisma } = require('../lib/prisma');

/**
 * FetchWorkstations fetches all workstations requested by the client.
 *
 */
async function fetchWorkstations() {
  const workstations = await prisma.workstation.findMany({
    where: { isActive: true },
  });
  return workstations;
}

module.exports = {
  fetchWorkstations,
};
