import { createCrudService } from "./crud.factory"

export interface TournamentSystemReadDto {
    id: number
    title: string | null
}

export interface TournamentSystemCreateDto {
    title: string | null
}

export interface TournamentSystemUpdateDto {
    title: string | null
}

export const TournamentSystemsService = createCrudService<
    TournamentSystemReadDto,
    TournamentSystemCreateDto,
    TournamentSystemUpdateDto
>("/api/TournamentSystems")
