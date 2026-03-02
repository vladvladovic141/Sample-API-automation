import { request } from '../../utils/requests.js'
import { getCreateUserRequestBody, getUpdateUserRequestBody } from '../../utils/requestBodyGenerator/customer.js'
import createUserSchema from '../../data/schema/createUserSchema.json' with { type: 'json' }

export async function createUser() {
    it('Create user account', async function () {
        const requestBody = await getCreateUserRequestBody()

        await request(this, 'POST', '/users', requestBody, true, 
            {
                statusCode : 201,
                expectedFields: ['email'],
                expectedValues: [
                                    {path: 'name', value: requestBody.name},
                                    {path: 'gender', value: requestBody.gender},
                                    {path: 'status', value: requestBody.status}
                                ],
                expectedTypes: [
                    {path: 'id', type: 'number'}
                ],
                executionVariables: [
                                        {path: 'id', name: 'userId'},
                                        {path: 'name', name: 'userName'},
                                        {path: 'surname', name: 'userSurname'},
                                        {path: 'gender', name: 'userGender'},
                                        {path: 'status', name: 'userStatus'},
                                        {path: 'email', name: 'userEmail'}
                                    ],
                schema: createUserSchema
            }
        )
    })
}

export async function createUserWithoutToken() {
    it('Create user account without authentication token', async function () {
        const requestBody = await getCreateUserRequestBody()
        await request(this, 'POST', '/users', requestBody, false, 
            {
                statusCode: 401,
                expectedValues: [
                    {path: 'message', value: 'Authentication failed'}
                ]
            }
        )
    })
}

export async function deleteUser() {
    it('Delete user account', async function () {
        const userId = global.executionVariables['userId'];
        await request(this, 'DELETE', `/users/${userId}`, undefined, true,
            {
              statusCode: 204
            }
        );
    })
}

export async function deleteNotExistingUser() {
    it('Delete already deleted account', async function() {
        const userId = global.executionVariables['userId'];
        await request(this, 'DELETE', `/users/${userId}`, undefined, true, {
            statusCode: 404,
            expectedValues: [
                {path: 'message', value: 'Resource not found'}
            ]
        })
    })
}

export async function getUser() {
    it('Get user account', async function () {
        const userId = global.executionVariables['userId'];
        // iegūšu iepriekš izveidotā lietotāja datus priekš salīdzināšanas
        const userName = global.executionVariables['userName'];
        const userSurname = global.executionVariables['userSurname'];
        const userGender = global.executionVariables['userGender'];
        const userStatus = global.executionVariables['userStatus'];
        const userEmail = global.executionVariables['userEmail'];

        await request(this, 'GET', `/users/${userId}`, undefined, true, {
            statusCode: 200,
            expectedValues: [
                // name
                {path: 'name', value: userName},
                // surname
                {path: 'surname', value: userSurname},
                // status
                {path: 'status', value: userStatus},
                // email
                {path: 'email', value: userEmail},
                // gender
                {path: 'gender', value: userGender},
                // id
                {path: 'id', value: userId}
            ]
        }

        )
    })
}

export async function updateUser() {
    it('Update user account', async function() {
        const requestBody = await getUpdateUserRequestBody()
        const userId = global.executionVariables['userId'];
        await request(this, 'PATCH', `/users/${userId}`, requestBody, true, {
            statusCode: 200,
            expectedValues: [
                {path: 'name', value: requestBody.name},
                {path: 'status', value: requestBody.status},
                {path: 'gender', value: requestBody.gender},
                {path: 'email', value: requestBody.email}
            ],
            executionVariables: [
                {path: 'email', name: 'userEmail'},
                {path: 'name', name: 'userName'},
                {path: 'status', name: 'userStatus'},
                {path: 'gender', name: 'userGender'},
            ]

        })
    })
}

export async function updateUserWithoutToken(){
    it('Update user account without token', async function() {
        const requestBody = await getUpdateUserRequestBody()
        const userId = global.executionVariables['userId'];
        await request(this, 'PATCH', `/users/${userId}`, requestBody, false, {
            statusCode: 404,
            expectedValues: [
                {path: 'message', value: 'Resource not found'}
            ]
        })
    })
}