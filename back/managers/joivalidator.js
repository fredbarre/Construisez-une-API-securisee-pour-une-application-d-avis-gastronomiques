const Joi = require("joi");

const joischema = Joi.object({
  email: Joi.string().pattern(
    new RegExp(
      "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
    )
  ),
  password: Joi.string().max(512),

  name: Joi.string().pattern(
    new RegExp(
      "^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ0123456789\"''`'-]+$"
    )
  ),
  manufacturer: Joi.string().pattern(
    new RegExp(
      "^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ0123456789\"''`'-]+$"
    )
  ),
  description: Joi.string().pattern(
    new RegExp(
      "^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ0123456789\"''`'-]+$"
    )
  ),
  mainPepper: Joi.string().pattern(
    new RegExp(
      "^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ0123456789\"''`'-]+$"
    )
  ),
});

module.exports = joischema;
