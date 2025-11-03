import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
import addKeywords from "ajv-keywords";


import { dslSchema } from "../modules/forms/dsl/dsl.schema.js";

export const ajv = (() => {
    const instance = new Ajv2020({
        strict: false,
        allErrors: true,
        coerceTypes: true,
        removeAdditional: false,
        messages: true
    });

    addFormats(instance);
    addErrors(instance);
    addKeywords(instance, ["uniqueItemProperties"]);
    instance.addKeyword({
        keyword: "repeatedFieldsCount",
        metaSchema: { type: "boolean" },
        errors: true,

        validate(_schema: any, data: any, ctx: any) {
            if (data.type !== "group_repeat") return true;

            const fields = Array.isArray(data.fields) ? data.fields : [];
            const max = data.max_repeat;
            const min = data.min_repeat;

            if (typeof max !== "number" || typeof min !== "number") return true;

            if (fields.length > max) {
                ctx.errors = [
                    {
                        instancePath: ctx.instancePath + "/fields",
                        keyword: "repeatedFieldsCount",
                        message: `Too many fields inside group_repeat: maximum is ${max}, found ${fields.length}`
                    }
                ];
                return false;
            }


            if (fields.length < min) {
                ctx.errors = [
                    {
                        instancePath: ctx.instancePath + "/fields",
                        keyword: "repeatedFieldsCount",
                        message: `Too many fields inside group_repeat: minimum is ${min}, found ${fields.length}`
                    }
                ];
                return false;
            }
            return true;
        }
    });


    instance.addSchema(dslSchema, dslSchema.$id);


    return instance;
})();
