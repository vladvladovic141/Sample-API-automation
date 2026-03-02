import { generateTestData } from '../../utils/helpers.js'
import { createUser, deleteUser } from '../../steps/user/user.js'
import { createTodo, deleteTodo, updateTodoWithWrongStatus  } from '../../steps/todo/todo.js'

before(async () => {
    generateTestData()
    createUser()
})

after(async () => {
    deleteUser()
})

it('Todos - negative cases', () => {
    describe('CRUD Todos - update with invalid status', () => {
        createTodo('pending')
        updateTodoWithWrongStatus('notValid')
    })
})