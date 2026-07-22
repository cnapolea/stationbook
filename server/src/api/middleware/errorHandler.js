const { InvalidCredentialsError } = require('../../lib/errors');
const { Prisma } = require('../../lib/prisma');
const z = require('zod');

function errorHandler(error, req, res, next) {
  console.error(error);
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    const duplicateField =
      // This shape comes from an Adapter internal which has no public contract. This means that in the future, if this adapter is updated, this line might not be useful.
      error.meta?.driverAdapterError?.cause?.constraint?.fields?.join(', ');

    if (!duplicateField) {
      res.status(409).json({ message: 'Resource already exists' });
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
  } else if (error instanceof InvalidCredentialsError) {
    res.status(401).json({ message: error.message });
  } else {
    res.status(500).json({
      message: 'Internal server error.',
    });
  }
}

module.exports = errorHandler;
