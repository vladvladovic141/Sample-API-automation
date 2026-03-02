import { generateTestData } from '../../utils/helpers.js'
import { createUser, deleteUser } from '../../steps/user/user.js'
import { createTodo, deleteTodo, updateTodo, getAllUserTodos  } from '../../steps/todo/todo.js'

before(async () => {
    generateTestData()
    createUser()
})

after(async () => {
    deleteUser()
})

it('Todos', () => {
    describe('CRUD Todos', () => {
        createTodo('pending')
        deleteTodo()
    })

    describe('CRUD Todos - Update title', () => {
        createTodo('pending')
        updateTodo({title: "New Title", status: 'pending'})
        deleteTodo()
    })

    describe('CRUD Todos - get all user todos', () => {
        createTodo('pending')
        getAllUserTodos()
    })
})