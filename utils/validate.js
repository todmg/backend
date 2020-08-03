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
const artistValidation = (body) => {
  const Schema = Joi.object({
    user: Joi.any(),
    pronouns: Joi.array().default(["they/them"]),
    name: Joi.string().required(),
    link: Joi.string().required(),
    desc: Joi.string(),
    img: Joi.string(),
    hometown: Joi.string(),
    releases: Joi.array(),
    booking: {
      eu: Joi.string(),
      na: Joi.string(),
      asia: Joi.string(),
    },
    interviews: Joi.array(),
    hidden: Joi.boolean().default(false),
  });

  return Schema.validate(body);
};
const userValidation = (body) => {
  const Schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    pronouns: Joi.array().default(["they/them"]),
  });

  return Schema.validate(body);
};

const interviewValidation = (body) => {
  const Schema = Joi.object({
    link: Joi.string().uri().required(),
    artists: Joi.array().required(),
    image: Joi.array(),
  });

  return Schema.validate(body);
};

module.exports = {
  Artist: artistValidation,
  Release: releaseValidation,
  User: userValidation,
  Interview: interviewValidation,
};
