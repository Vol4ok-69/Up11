import { apiRequest } from "../api"

export interface TournamentBracketReadDto {
    id: number
    tournamentId: number
    stageId: number
    position: number
    matchId?: number
    parentBracketId?: number
    slotInParent?: number
    bracketType: string
}

export interface BracketNodeDto {
    id: number
    stage: string
    bracketType: string
    teamA?: string
    teamB?: string
    isFinished: boolean
    children: BracketNodeDto[]
}

export interface SwissTableDto {
    team: string
    wins: number
    losses: number
    played: number
}

export const TournamentBracketsService = {

    getByTournament: (tournamentId: number) =>
        apiRequest<TournamentBracketReadDto[]>(`/api/Brackets/${tournamentId}`),

    getTree: (tournamentId: number) =>
        apiRequest<BracketNodeDto[]>(`/api/Brackets/${tournamentId}/tree`),

    getSwissTable: (tournamentId: number) =>
        apiRequest<SwissTableDto[]>(`/api/Brackets/${tournamentId}/swiss/table`),

    generate: (tournamentId: number) =>
        apiRequest<void>(`/api/Brackets/${tournamentId}/generate`, {
            method: "POST",
        }),
}