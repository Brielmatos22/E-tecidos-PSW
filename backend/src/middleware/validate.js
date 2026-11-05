function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return next(result.error);

    req.validatedBody = result.data;
    return next();
  };
}

module.exports = validate;
