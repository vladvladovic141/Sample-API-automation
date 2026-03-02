import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { config } from '../../../config.js'
import { generateRandomEmail } from '../helpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const accountRequestBody = JSON.parse(readFileSync(path.resolve(__dirname, '../../data/user/create_account.json'), 'utf8'))

export async function getCreateUserRequestBody() {
    const accountName = config[global.env].username.split(' ')[0]
    const accountSurname = config[global.env].username.split(' ')[1]

    accountRequestBody.name = accountName
    accountRequestBody.surname = accountSurname
    accountRequestBody.email = await generateRandomEmail()
    accountRequestBody.status = config[global.env].status
    accountRequestBody.gender = config[global.env].gender
    
    return accountRequestBody
}

export async function getUpdateUserRequestBody() {
    accountRequestBody.name = `${config[global.env].username}Updated`
    accountRequestBody.status = config[global.env].status
    accountRequestBody.gender = config[global.env].gender
    accountRequestBody.email = await generateRandomEmail()
    
    return accountRequestBody
}