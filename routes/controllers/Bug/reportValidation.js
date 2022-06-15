import joi from 'joi';

const reportValidation = joi.object({
    title: joi.string().min(4).max(30).required().messages({
        'string.empty': 'تکایە تایتڵێک لەسەر کێشەکەت  داخڵ  کە',
        'string.min': 'تایتڵ پێویستە لە چوار پیت کەمتر نەبێت',
        'string.max': 'تایتڵ پێویستە لە ٣٠ پیت زیاتر نەبێت',
        'any.required': 'تکایە تایتڵێک لەسەر کێشەکەت  داخڵ  کە'

    }),
    message: joi.string().min(10).max(1000).required().trim().messages({
        'string.empty': 'پێویستە پەیامێک لەسەر کێشەکەت  داخڵ  کە',
        'string.min': 'تکایە پەیامەکە بەشێوازێکی زیاتر باس بکە پێویستە لە ١٠ کەمتر نەبێت',
        'string.max': 'پەیامەکە لە ١٠٠٠ پیت زیاترە کەمتری کە گوڵم',
        'any.required': 'پێویستە پەیامێک لەسەر کێشەکەت  داخڵ  کە'

    }),
})
export default reportValidation;