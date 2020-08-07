import * as Joi from "joi";

export function ArtistValidation(body) {
  const Schema = Joi.object({
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
}

export function ReleaseValidation(body) {
  const Schema = Joi.object({
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
}

export function UserValidation(body) {
  const Schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
  });

  return Schema.validate(body);
}

export function InterviewValidation(body) {
  const Schema = Joi.object({
    link: Joi.string().uri().required(),
    artists: Joi.array().required(),
    image: Joi.array(),
  });

  return Schema.validate(body);
}
