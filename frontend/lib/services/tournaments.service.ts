import { createCrudService } from "./crud.factory"

export interface TournamentReadDto {
    id: number
    title: string

    disciplineId: number
    discipline: string

    startDate: string
    endDate: string

    prizePool: number
    minTeamSize: number

    statusId: number
    status: string
}

export interface TournamentCreateDto {
    title: string
    disciplineId: number
    startDate: string
    endDate: string
    prizePool: number
    minTeamSize: number
    statusId: number
}

export interface TournamentUpdateDto {
    title?: string
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
