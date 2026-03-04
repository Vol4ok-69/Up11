import { createCrudService } from "./crud.factory"

export interface ApplicationStatusReadDto {
    id: number
    title: string | null
}

export interface ApplicationStatusCreateDto {
    title: string | null
}

export interface ApplicationStatusUpdateDto {
    title: string | null
}

export const ApplicationStatusesService = createCrudService<
    ApplicationStatusReadDto,
    ApplicationStatusCreateDto,
    ApplicationStatusUpdateDto
>("/api/ApplicationStatuses")
