import { request } from '../../utils/requests.js'

export async function getBooks() {
    it('Retrieve list of all books', async function () {
        await request(this, 'GET', `/books?`, undefined, true,
            {
                statusCode: 200,
                // expectedValues: [
                //     {path: '0.id', value: 10},
                //     {path: '6.id', value: 7},
                // ],
                // expectedFields: [
                //   '0.id',
                //   '99.id'
                // ]
            }
        )
    })
}