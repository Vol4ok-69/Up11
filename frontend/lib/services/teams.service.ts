import { createCrudService } from "./crud.factory"

export interface TeamReadDto {
    id: number
    title: string | null
    discipline: string | null
    captain: string | null
}

export interface TeamCreateDto {
    title: string | null
    disciplineId: number
    captainId?: number | null
}

export interface TeamUpdateDto {
    title?: string | null
    disciplineId?: number | null
    captainId?: number | null
}

export const TeamsService = createCrudService<
    TeamReadDto,
    TeamCreateDto,
    TeamUpdateDto
>("/api/Teams")
