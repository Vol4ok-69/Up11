import { apiRequest } from "../api"

export interface MatchReadDto {
    id: number
    tournament: string | null
    stage: string | null
    teamA: string | null
    teamB: string | null
    isFinished: boolean
}

export interface MatchCreateDto {
    tournamentId: number
    stageId: number
    teamAId: number
    teamBId: number
}

export interface MatchUpdateDto {
    stageId?: number
    teamAId?: number
    teamBId?: number
}

export const MatchesService = {

    getAll: async (): Promise<MatchReadDto[]> => {
        const { TournamentsService } = await import("./tournaments.service")
        const tournaments = await TournamentsService.getAll()

        const allMatches: MatchReadDto[] = []

        for (const tournament of tournaments) {
            try {
                const matches = await apiRequest<MatchReadDto[]>(
                    `/api/Matches/tournament/${tournament.id}`
                )
                allMatches.push(...matches)
            } catch {
            }
        }

        return allMatches
    },

    getById: (id: number) =>
        apiRequest<MatchReadDto>(`/api/Matches/${id}`),

    create: (data: MatchCreateDto) =>
        apiRequest<void>("/api/Matches", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: number, data: MatchUpdateDto) =>
        apiRequest<void>(`/api/Matches/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        apiRequest<void>(`/api/Matches/${id}`, {
            method: "DELETE",
        }),

    submitResult: (id: number, data: MatchResultCreateDto) =>
        apiRequest<void>(`/api/Matches/${id}/result`, {
            method: "POST",
            body: JSON.stringify(data),
        }),
}