const Joi = require("joi");

const reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    text: Joi.string().required()
});

module.exports = { reviewSchema };
