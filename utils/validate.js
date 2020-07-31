const Joi = require("@hapi/joi");

const releaseValidation = (body) => {
  const Schema = Joi.object({
    user: Joi.any(),
    internal: Joi.string().required(),
    title: Joi.string().required(),
    desc: Joi.string().required(),
    artists: Joi.array().required(),
    date: Joi.string().required(),
    artwork: Joi.string().required(),
    link: Joi.string().required(),
    hidden: Joi.boolean().required(),
  });

  return Schema.validate(body);
};
const ArtistValidation = (body) => {
  const Schema = Joi.object({
    user: Joi.any(),
    name: Joi.string().required(),
    link: Joi.string().required(),
    desc: Joi.string(),
    img: Joi.string(),
    hometown: Joi.string(),
    releases: Joi.array(),
    interviews: Joi.array(),
  });

  return Schema.validate(body);
};

module.exports = {
  Artist: ArtistValidation,
  Release: releaseValidation,
};
