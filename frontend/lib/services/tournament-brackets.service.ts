import { apiRequest } from "../api"

export interface TournamentBracketReadDto {
    id: number
    tournament: string | null
    bracketType: string | null
    data: string | null
}

export interface TournamentBracketCreateDto {
    tournamentId: number
    bracketTypeId: number
}

export interface TournamentBracketUpdateDto {
    bracketTypeId?: number
}

export const TournamentBracketsService = {
    
    getAll: async (): Promise<TournamentBracketReadDto[]> => {
        try {
            const { TournamentsService } = await import("./tournaments.service")
            const tournaments = await TournamentsService.getAll()
            const allBrackets: TournamentBracketReadDto[] = []
            
            for (const tournament of tournaments) {
                try {
                    const brackets = await apiRequest<TournamentBracketReadDto[]>(
                        `/api/Brackets/${tournament.id}`
                    )
                    allBrackets.push(...brackets)
                } catch (e) {
                    // Если ошибка, пропускаем
                }
            }
            
            return allBrackets
        } catch (e) {
            return []
        }
    },

    getById: (tournamentId: number) =>
        apiRequest<TournamentBracketReadDto>(`/api/Brackets/${tournamentId}`),

    create: (data: TournamentBracketCreateDto) =>
        apiRequest<TournamentBracketReadDto>("/api/Brackets", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (tournamentId: number, data: TournamentBracketUpdateDto) =>
        apiRequest<void>(`/api/Brackets/${tournamentId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    delete: (tournamentId: number) =>
        apiRequest<void>(`/api/Brackets/${tournamentId}`, {
            method: "DELETE",
        }),

    generate: (tournamentId: number) =>
        apiRequest<void>(`/api/Brackets/${tournamentId}/generate`, {
            method: "POST",
        }),
}
