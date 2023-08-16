export type User = {
    email: {
        address: string
    }
    new_email: {
        address?: string
    }
    username: string
    name?: string
    about?: string
    img?: string
    link?: string
    recovery_token?: string
    created_on: number
    updated_on: number
}