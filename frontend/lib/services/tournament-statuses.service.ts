import { createCrudService } from "./crud.factory"

export interface TournamentStatusReadDto {
    id: number
    title: string | null
}

export interface TournamentStatusCreateDto {
    title: string | null
}

export interface TournamentStatusUpdateDto {
    title: string | null
}

export const TournamentStatusesService = createCrudService<
    TournamentStatusReadDto,
    TournamentStatusCreateDto,
    TournamentStatusUpdateDto
>("/api/TournamentStatuses")
