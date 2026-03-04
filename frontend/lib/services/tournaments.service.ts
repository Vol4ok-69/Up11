import { createCrudService } from "./crud.factory"

export interface TournamentReadDto {
    id: number
    title: string | null
    discipline: string | null
    startDate: string
    endDate: string
    prizePool: number
    minTeamSize: number
    status: string | null
}

export interface TournamentCreateDto {
    title: string | null
    disciplineId: number
    startDate: string
    endDate: string
    prizePool: number
    minTeamSize: number
    statusId: number
}

export interface TournamentUpdateDto {
    title?: string | null
    startDate?: string
    endDate?: string
    prizePool?: number
    minTeamSize?: number
    statusId?: number
}

export const TournamentsService = createCrudService<
    TournamentReadDto,
    TournamentCreateDto,
    TournamentUpdateDto
>("/api/Tournaments")
