import { createCrudService } from "./crud.factory"

export interface RoleReadDto {
    id: number
    title: string
}

export interface RoleCreateDto {
    title: string
}

export interface RoleUpdateDto {
    title: string
}

export const RolesService = createCrudService<
    RoleReadDto,
    RoleCreateDto,
    RoleUpdateDto
>("/api/Roles")