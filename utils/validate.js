const Joi = require("@hapi/joi");

const releaseValidation = (body) => {
  const Schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    artist: Joi.string().required(),
    date: Joi.date().default(Date.now()).required(),
    tags: Joi.array().required(),
    artwork: Joi.link().required(),
    link: Joi.link().required(),
  });

  return Schema.validate(body);
};
const ArtistValidation = (body) => {
  const Schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string(),
    img: Joi.string(),
    hometown: Joi.string(),
    tags: Joi.array().required(),
    releases: Joi.array(),
    interviews: Joi.array(),
  });

  return Schema.validate(body);
};

module.exports = {
  Artist: ArtistValidation,
  Release: releaseValidation,
};
