import joi from 'joi';

const RoleVali = joi.object({
    role: joi.string().valid('admin', 'moderator').required(),


})
export default RoleVali;