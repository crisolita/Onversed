import Joi from "joi";
export const querySchemaRegistro = Joi.object({
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?])[A-Za-z0-9`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?]{8,}$/
      )
    )
    .messages({
      "string.base": `Contraseña debe ser de tipo texto`,
      "string.empty": `Contraseña no puede estar vacio`,
      "string.min": `Contraseña debe tener al menos 8 caracteres`,
      "string.required": `Contraseña es requerida`,
      "string.pattern.base": "No cumple las condiciones de contraseña",
    }),
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.default": "El email debe ser valido",
    "string.required": `Email es requerido`,
    "string.email": "Debe ser un email valido",
  }),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
});
export const querySchemaUGetAuth = Joi.object({
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?])[A-Za-z0-9`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?]{8,}$/
      )
    )
    .messages({
      "string.base": `Contraseña debe ser de tipo texto`,
      "string.empty": `Contraseña no puede estar vacio`,
      "string.min": `Contraseña debe tener al menos 8 caracteres`,
      "string.required": `Contraseña es requerida`,
      "string.pattern.base": "No cumple las condiciones de contraseña",
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .messages({ "string.default": "El email debe ser valido" }),
});

export const querySchemaLogin = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .messages({ "string.default": "El email debe ser valido" }),
  authCode: Joi.string().required(),
});
export const querySchemaGetRecoveryCode = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.default": "El email debe ser valido",
    "string.required": `Email es requerido`,
    "string.email": "Debe ser un email valido",
  }),
});

export const querySchemaChangePassword = Joi.object({
  newPassword: Joi.string()
    .required()
    .pattern(
      new RegExp(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?])[A-Za-z0-9`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?]{8,}$/
      )
    )
    .messages({
      "string.base": `Contraseña debe ser de tipo texto`,
      "string.empty": `Contraseña no puede estar vacio`,
      "string.min": `Contraseña debe tener al menos 8 caracteres`,
      "string.required": `Contraseña es requerida`,
      "string.pattern.base": "No cumple las condiciones de contraseña",
    }),
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.default": "El email debe ser valido",
    "string.required": `Email es requerido`,
    "string.email": "Debe ser un email valido",
  }),
  authCode: Joi.string().min(6).required(),
});

export const querySchemaEditProfile = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
  foto_de_perfil: Joi.string(),
  domicilio: Joi.string(),
  postal_code: Joi.string(),
  country: Joi.string(),
  cif: Joi.string(),
  nombre_empresa: Joi.string(),
  user_id: Joi.string(),
});
