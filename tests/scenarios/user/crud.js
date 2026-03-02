import { createUser, 
    deleteUser, 
    getUser, 
    updateUser } from '../../steps/user/user.js'
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

    describe(`CRUD User - Create user`, () => {
        // what do we need here??
        getUser()
        updateUser()
    })

    describe("CRUD User - Delete user", () => {
        createUser()
        deleteUser()
    })

    describe("CRUD User - Get user", () => {
        getUser()
    })

    describe("CRUD User - Modify user", () => {
        updateUser()
    })
})
