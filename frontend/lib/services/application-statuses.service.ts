import { createCrudService } from "./crud.factory"

export interface ApplicationStatusReadDto {
    id: number
    title: string
}

export interface ApplicationStatusCreateDto {
    title: string
}

export interface ApplicationStatusUpdateDto {
    title?: string
}

export const ApplicationStatusesService = createCrudService<
    ApplicationStatusReadDto,
    ApplicationStatusCreateDto,
    ApplicationStatusUpdateDto
>("/api/ApplicationStatuses")
