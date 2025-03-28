const Joi = require("joi");

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required()  // This validates comment
    }).required()
});

module.exports = { reviewSchema };