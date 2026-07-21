const { Prisma } = require('../../lib/prisma');
const z = require('zod');

function errorHandler(error, req, res, next) {
  console.error(error);
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    const duplicateField =
      error.meta?.driverAdapterError?.cause?.constraint?.fields.join(', ');

    if (!duplicateField) {
      res.status(409).json({ message: 'Resouce already exists' });
    } else {
      res.status(409).json({ message: `${duplicateField} already exists` });
    }
  } else if (error instanceof z.ZodError) {
    const errorList = error.issues.map((e) => {
      return {
        fieldName: e.path[0],
        message: e.message,
      };
    });

    res.status(400).json({ errorList });
  } else {
    res.status(500).json({
      message: 'Internal server error.',
    });
  }
}

module.exports = errorHandler;
