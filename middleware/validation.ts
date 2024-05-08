import Joi from "joi";

/// USER
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
  user_id: Joi.number(),
  userol: Joi.string().valid("CLIENT", "ADMIN"),
});
///DESIGNS
export const querySchemaCreateCollection = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});
export const querySchemaCreateRequestDesign = Joi.object({
  name: Joi.string().required(),
  collection_id: Joi.number().required(),
  format: Joi.string().valid(
    "FACTORY_3D",
    "MARKETING_3DAVATAR",
    "MARKETING_3D",
    "RENDER_360",
    "RENDER_RUNWAY",
    "OTRO",
    "INSTAGRAM",
    "TIKTOK",
    "SNAP",
    "ROBLOX",
    "ZEPETO"
  ),
  otro: Joi.string(),
  prenda: Joi.string().valid(
    "ABRIGOS_BLAZERS",
    "ACCESORIOS",
    "BANADORES_BIKINIS",
    "BOLSOS",
    "CAMISAS",
    "CAMISETAS_POLOS",
    "CARDIGANS_JERSEYS",
    "CHAQUETAS_CAZADORAS",
    "FALDAS",
    "JEANS_PANTALONES",
    "JOYAS_BISUTERIE",
    "SHORTS_BERMUDAS",
    "SPORT",
    "SUDADERAS",
    "TOPS_BODIES",
    "TRAJES_SMOKING",
    "VESTIDOS",
    "VESTIDO_INVITADAS"
  ),
  model_nft: Joi.string(),
  medialinkexternal: Joi.string(),
  SKU: Joi.string(),
  action: Joi.string().valid("VENTA", "GUARDAR"),
});

export const querySchemaAddUser = Joi.object({
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
  userol: Joi.string().required().valid("ADMIN", "CLIENT"),
});
export const queryDeleteUser = Joi.object({
  user_id: Joi.number().required(),
});
export const queryUpdateDesign = Joi.object({
  design_id: Joi.number().required(),
  status: Joi.string().valid(
    "BORRADOR",
    "PAGO_PENDIENTE",
    "ENVIADO",
    "EN_PROCESO",
    "ENTREGADO",
    "REVISION",
    "FINALIZADO"
  ),
});
export const queryConfirmChange = Joi.object({
  design_id: Joi.number().required(),
  changes: Joi.array(),
});
export const queryConfirmPaid = Joi.object({
  design_id: Joi.number().required(),
});
export const queryUpdatePrice = Joi.object({
  formato: Joi.string().valid(
    "FACTORY_3D",
    "MARKETING_3DAVATAR",
    "MARKETING_3D",
    "RENDER_360",
    "RENDER_RUNWAY",
    "OTRO",
    "INSTAGRAM",
    "TIKTOK",
    "SNAP",
    "ROBLOX",
    "ZEPETO"
  ),
  price: Joi.number(),
});

export const queryUpdatePriceProduct = Joi.object({
  producto: Joi.string().valid("A", "B", "C"),
  price: Joi.number(),
});
export const queryConfirmFalta = Joi.object({
  design_id: Joi.number().required(),
  delivery_date: Joi.string(),
  infoFaltante: Joi.array(),
});
export const querySendLink = Joi.object({
  design_id: Joi.number().required(),
  link: Joi.string().required(),
});
export const querySendThanks = Joi.object({
  design_id: Joi.number().required(),
  indicadores: Joi.array().required(),
});
export const queryConfirmLastArt = Joi.object({
  design_id: Joi.number().required(),
  delivery_date: Joi.string().required(),
});
export const querySendDraw = Joi.object({
  design_id: Joi.number().required(),
  action: Joi.string().valid("VENTA"),
});
