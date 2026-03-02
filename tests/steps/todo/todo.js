import { getCreateTodoRequestBody } from '../../utils/requestBodyGenerator/todo.js'
import { request } from '../../utils/requests.js'


export async function createTodo(status) {
    it('Create todo list', async function () {
        const userId = global.executionVariables['userId'];
        const requestBody = getCreateTodoRequestBody(status);
        await request(this, 'POST', `/users/${userId}/todos`, requestBody, true,
            {
                statusCode: 201,
                expectedValues: [
                    {path: 'title', value: requestBody.title},
                    {path: 'status', value: requestBody.status},
                    {path: 'user_id', value: userId},
                    {path: 'due_on', value: null}
                ],
                executionVariables: [
                    {path: 'id', name: 'todoId'},
                    {path: 'title', name: 'todoTitle'},
                    {path: 'status', name: 'todoStatus'},
                ]
            }
        )
    })
}

export async function deleteTodo() {
    it('Delete todo', async function () {
        const todoId = global.executionVariables['todoId'];
        await request(this, 'DELETE', `/todos/${todoId}`, undefined, true,
            {
                statusCode: 204
            }
        )
    })
}

export async function updateTodo(requestBody) {
    it('Update todo information', async function () {
        const todoId = global.executionVariables['todoId'];
        const userId = global.executionVariables['userId'];
        await request(this, 'PATCH', `/todos/${todoId}`, requestBody, true, {
            statusCode: 200,
            expectedValues: [
                {path: 'title', value: requestBody.title},
                {path: 'status', value: requestBody.status},
                {path: 'user_id', value: userId}
            ],
            expectedTypes: [
                {path: 'id', type: 'number'}
            ],
            executionVariables: [
                {path: 'title', name: 'todoTitle'},
                {path: 'status', name: 'todoStatus'}
            ]
        })
    })
}

export async function updateTodoWithWrongStatus(status) {
    it('Update todo with invalid status', async function () {
        const todoId = global.executionVariables['todoId'];
        const todoTitle = global.executionVariables['todoTitle'];
        await request(this, 'PATCH', `/todos/${todoId}`, 
            {title: todoTitle, status: status},
            true, {
            statusCode: 422,
            expectedValues: [
                {path: '0.field', value: 'status'},
                {path: '0.message', value: "can't be blank, can be pending or completed"}            ]
        })
    })
}

export async function getAllUserTodos() {
    it('Get all user todos', async function () {
        const userId = global.executionVariables['userId'];
        await request(this, 'GET', `/users/${userId}/todos`, undefined, true,
            {
                statusCode: 200,
                expectedTypesInArray: [
                    {path: 'id', type: 'number'},
                    {path: 'title', type: 'string'},
                    {path: 'status', type: 'string'}
                ]
            }
        )
    })
}