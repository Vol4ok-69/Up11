import { createCrudService } from "./crud.factory"

export interface DisciplineReadDto {
    id: number
    title: string | null
    description: string | null
}

export interface DisciplineCreateDto {
    title: string | null
    description: string | null
}

export interface DisciplineUpdateDto {
    title: string | null
    description: string | null
}

export const DisciplinesService = createCrudService<
    DisciplineReadDto,
    DisciplineCreateDto,
    DisciplineUpdateDto
>("/api/Disciplines")
