import { apiRequest } from "../api"

export interface MatchResultReadDto {
    id: number
    match: string | null
    scoreTeamA: number
    scoreTeamB: number
    winnerTeam: string | null
    resultedAt: string
}

export interface MatchResultCreateDto {
    scoreTeamA: number
    scoreTeamB: number
    winnerId?: number
}

export const MatchResultsService = {

    getAll: async (): Promise<MatchResultReadDto[]> => {
        const { MatchesService } = await import("./matches.service")
        const matches = await MatchesService.getAll()

        const results: MatchResultReadDto[] = []

        for (const match of matches) {
            try {
                const result = await apiRequest<MatchResultReadDto>(
                    `/api/Matches/${match.id}/result`
                )
                results.push(result)
            } catch {   
            }
        }

        return results
    },

    submitResult: (matchId: number, data: MatchResultCreateDto) =>
        apiRequest<void>(`/api/Matches/${matchId}/result`, {
            method: "POST",
            body: JSON.stringify(data),
        }),
}