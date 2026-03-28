export const config = {
    STG: {
        host: 'https://gorest.co.in/public/v2',
        token: 'fbe400288b08f9d39e827f5b5377f77732c78a442de06239eff1cc4de5ebaa72',
        username: 'Tenali Ramakrishna',
        gender: 'male',
        status: 'active',
    },
    BOOKS_DEV:{
        host: 'http://localhost:1010'
    },
    BOOKS_STG:{
        host: 'http://localhost:2020'
    },
    BOOKS_PROD:{
        host: 'http://localhost:3030'
    },
}

global.executionVariables = {}