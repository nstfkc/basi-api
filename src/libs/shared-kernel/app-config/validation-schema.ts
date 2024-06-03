import * as Joi from 'joi';

export const validationSchema = Joi.object({
    // APP_NAME: Joi.string(),
    // APP_PORT: Joi.number().required(),
    // APP_ROOT_DOMAIN: Joi.string().required(),

    /**
     * Email
     */
    SMTP_HOST: Joi.string().required(),
    SMTP_USER: Joi.string().required(),
    SMTP_PORT: Joi.string().required(),
    SMTP_PASSWORD: Joi.string().required(),
    EMAIL_DEFAULT_FROM_EMAIL: Joi.string().required(),
});
