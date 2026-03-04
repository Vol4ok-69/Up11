import { createCrudService } from "./crud.factory"
import { apiRequest } from "../api"

export interface UserReadDto {
    id: number
    login: string
    nickname?: string | null
    role: string
}

export interface UserUpdateDto {
    nickname?: string | null
    roleId?: number
}

export interface ChangePasswordDto {
    oldPassword: string
    newPassword: string
}

export interface ChangeEmailDto {
    newEmail: string
}


const baseCrud = createCrudService<
    UserReadDto,
    never,
    UserUpdateDto
>("/api/Users")

export const UsersService = {

    ...baseCrud,

    changePassword: (id: number, data: ChangePasswordDto) =>
        apiRequest<void>(`/api/Users/${id}/change/password`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    changeEmail: (id: number, data: ChangeEmailDto) =>
        apiRequest<void>(`/api/Users/${id}/change/email`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    block: (id: number) =>
        apiRequest<void>(`/api/Users/${id}/block`, {
            method: "PATCH",
        }),

    unblock: (id: number) =>
        apiRequest<void>(`/api/Users/${id}/unblock`, {
            method: "PATCH",
        }),
}