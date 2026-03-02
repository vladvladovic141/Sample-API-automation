import { faker } from "@faker-js/faker"

export function getCreateTodoRequestBody(status) {
    return {
        title: faker.book.title(),
        status: status
    }
}