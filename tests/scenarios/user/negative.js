import { createUser, 
    deleteNotExistingUser, 
    deleteUser, 
    createUserWithoutToken,
    updateUserWithoutToken } from '../../steps/user/user.js'
import { generateTestData } from '../../utils/helpers.js'


describe('CRUD User', () => {
    // izveidojam lietotāju pirms katra testa
    beforeEach(async () => {
        await generateTestData()
        createUser()
    })

    // izdzēšam lietotāju pēc katra testa
    afterEach(async () => {
        deleteUser()
    })

    describe('Delete already deleted user', () => {
        createUser()
        deleteUser()
        deleteNotExistingUser()
    })

    describe('Create user without authentication token', () => {
        createUserWithoutToken()
    })

    describe('Update user without authentication token', () => {
        createUser()
        updateUserWithoutToken()
        deleteUser()
    })
})
