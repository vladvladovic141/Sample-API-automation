import addContext from 'mochawesome/addContext.js'
import supertest from 'supertest'
import { config } from '../../config.js'
import { expect, assert } from 'chai'
import getNestedValue from 'get-nested-value'
import { Validator } from 'jsonschema'

export async function request(context, method, path, body = undefined, auth = true, asserts = {statusCode : 200},  host = undefined, customHeaders = undefined) {
    const requestST = host ? supertest(host) : supertest(config[global.env].host)

    const headers = customHeaders ? customHeaders : {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(auth && {'Authorization': `Bearer ${config[global.env].token}`})
    }

    let response = null
    let responseBody

    switch (method) {
        case 'GET':
            response = await requestST.get(path).set(headers)
            responseBody = response.body
            console.log(response.body)

            await performAssertion(responseBody, asserts, context, method, path, headers, response)
        

            break
        case 'POST':
            response = await requestST.post(path).send(body).set(headers)
            responseBody = response.body

            await performAssertion(responseBody, asserts, context, method, path, headers, response, body)
     
            break
        case 'PATCH':
            response = await requestST.patch(path).send(body).set(headers)
            responseBody = response.body

            await performAssertion(responseBody, asserts, context, method, path, headers, response, body)

            break
        case 'DELETE':
            response = await requestST.delete(path).send(body).set(headers)
            responseBody = response.body

            await performAssertion(responseBody, asserts, context, method, path, headers, response, body)

            break
        case 'PUT':
            response = await requestST.put(path).send(body).set(headers)
            responseBody = response.body

            await performAssertion(responseBody, asserts, context, method, path, headers, response, body)

            break
        default:
            console.log('not valid request method provided')
    }

    return response
}

async function performAssertion(
    responseBody,
    asserts,
    context,
    method,
    path,
    headers,
    response,
    body = undefined
) {

    // pēc tam ir nepieciešams izsaukt kļūdu/feilu ja šis masīvs nav tukšs
    let errors = []

    // pārbaudām statusa kodu
    await validateStatusCode(response.statusCode, asserts.statusCode, context, method, path, headers, response, 
        body).catch(error => errors.push(error.message))

    
    if (asserts.expectedFields) {
        await validateFieldsExists(responseBody, asserts.expectedFields, context, method, path, headers, response, 
            body).catch(error => errors.push(error.message))
    }

    if (asserts.expectedValues) {
        const expectedValuesErrors = await validateExpectedValues(responseBody, asserts.expectedValues, context, method, path, headers, response, body)
        errors = [...errors, ...expectedValuesErrors]
    }

    if (asserts.executionVariables) {
        await setExecutionVariables(responseBody, asserts.executionVariables)
    }

    if (asserts.expectedTypes) {
        await validateExpectedTypes(responseBody, asserts.expectedTypes, context, method, path, headers, response, 
            body).catch(error => errors.push(error.message))

    }

    if (asserts.schema) {
        const schemaErrors = await validateSchema(responseBody, asserts.schema)
        // merge two array
        errors = [...errors, ...schemaErrors]
    }

    if (asserts.expectedTypesInArray) {
        // saglabāt vairākus errorus
        await validateExpectedTypesInArray(responseBody, asserts.expectedTypesInArray, context, method, path, headers, 
            response).catch(error => errors.push(error.message))
    }

    // jāizsauc errors/exceptions ja errors masīvs NAV tukšs
    if(errors.length > 0){
        throw new Error(`Assertation failures: ${errors.join('\n')}`)
    }
}



async function validateStatusCode(actual, expected, context, method, path, headers, response, requestBody) {
    try {
        expect(actual).to.be.equal(expected)
    } catch(error) {
        addRequestInfoToReport(context, method, path, headers, response, requestBody)
        assert.fail(error.actual, error.expected, `Actual is ${error.actual}, but expected was ${error.expected}`)
    }
}

async function validateFieldsExists(body, fields, context, method, path, headers, response, requestBody) {
    fields.every(field => {
        try {
            expect(getNestedValue(field, body), `${field} present in body`).not.to.be.undefined
        } catch (error) {
            addRequestInfoToReport(context, method, path, headers, response, requestBody)
            assert.fail(error.actual, error.expected, `${field} field is not present in body`)
        }
    })
}

async function validateExpectedValues(body, fields, context, method, path, headers, response, requestBody) {
    let errors = []
    fields.forEach(field => {
        try {
            if(field.value !== undefined) {
                expect(getNestedValue(field.path, body), `${field.path} not equal to ${field.value}`).to.be.equal(field.value)
            } else {
                expect(getNestedValue(field.path, body), `${field.path} not contains ${field.valueContains}`).to.contain(field.valueContains)
            }
        } catch (error) {
            addRequestInfoToReport(context, method, path, headers, response, requestBody)
            errors.push(error.message)
        }
    })

    return errors
}

async function validateExpectedTypes(body, fields, context, method, path, headers, response, requestBody) {
    fields.forEach(field => {
        try {
            switch(field.type) {
                case 'string':
                    expect(getNestedValue(field.path, body), `${field.path} data type is not ${field.type}`).to.be.a('string')
                    break
                case 'number':
                    expect(getNestedValue(field.path, body), `${field.path} data type is not ${field.type}`).to.be.a('number')
                    break
            }
        } catch (error) {
            addRequestInfoToReport(context, method, path, headers, response, requestBody)
            const actual = getNestedValue(field.path, body)
            assert.fail(actual, field.type, `${actual} data type is not ${field.type}`)
        }
    })
}

async function validateExpectedTypesInArray(body, fields, context, method, path, headers, response, requestBody) {
    body.forEach(async obj => {
        await validateExpectedTypes(obj, fields, context, method, path, headers, response, requestBody)
    })
}

// ja atbildes dati ir testa laikā iepriekš kontrolēti izveidoti
async function validateExpectedValuesInArray(body, fields, context, method, path, headers, response, requestBody) {
    body.forEach(async obj => {
        await validateExpectedValues(obj, fields, context, method, path, headers, response, requestBody)
    })
}

async function validateSchema(body, schema) {
    const validator = new Validator()
    const validationResults = validator.validate(body, schema)
    // vai vispār shēma ir pareiza - ternary operation
    const isSchemaValid = validationResults.errors.length === 0 ? true : false 
    
    let schemaErrors = []
    if(!isSchemaValid){
        validationResults.errors.forEach(validationError => {
            try {
                assert.fail(validationError.stack)
            } catch (error) {
                schemaErrors.push(error.message)
            }
        })

    }

    return schemaErrors
}


async function setExecutionVariables(body, variables) {
    variables.forEach(variable => {
        global.executionVariables[variable.name] = getNestedValue(variable.path, body)
    })
}

function addRequestInfoToReport(context, method, path, headers, response, body) {
    addContext(context, `${method} ${path}`)
    addContext(context, {
        title: 'REQUEST HEADERS',
        value: headers
    })
    if (body) {
        addContext(context, {
            title: 'REQUEST BODY',
            value: body
        })
    }
    addContext(context, {
        title: 'RESPONSE HEADERS',
        value: response.headers
    })
    addContext(context, {
        title: 'RESPONSE BODY',
        value: response.body
    })
}