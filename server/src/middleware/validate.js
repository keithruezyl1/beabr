const { ZodError } = require("zod");
const { httpError } = require("../utils/httpErrors");

function validateBody(schema) {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(
          httpError(400, "Invalid request body.", {
            issues: err.issues,
          })
        );
      }
      next(err);
    }
  };
}

module.exports = { validateBody };

