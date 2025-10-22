import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";

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

    instance.addSchema(dslSchema, dslSchema.$id);

    return instance;
})();
