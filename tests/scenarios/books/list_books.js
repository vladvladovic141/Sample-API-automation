import { generateTestData } from '../../utils/helpers.js'
import {getBooks} from '../../steps/books/getBooks.js'

before(async () => {
    generateTestData()
})

it('List books', () => {
    describe('Read book data - list books', () => {
      getBooks();
    })
})