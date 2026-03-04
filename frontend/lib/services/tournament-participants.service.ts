import { apiRequest } from "../api"

export interface TournamentParticipantReadDto {
    id: number
    tournament: string | null
    team: string | null
    seed: number | null
}

export interface TournamentParticipantCreateDto {
    tournamentId: number
    teamId: number
    seed?: number
}

export interface TournamentParticipantUpdateDto {
    seed?: number
}

export const TournamentParticipantsService = {
    
    getAll: async (): Promise<TournamentParticipantReadDto[]> => {
        try {
            const { TournamentsService } = await import("./tournaments.service")
            const tournaments = await TournamentsService.getAll()
            const allParticipants: TournamentParticipantReadDto[] = []
            
            for (const tournament of tournaments) {
                try {
                    const participants = await apiRequest<TournamentParticipantReadDto[]>(
                        `/api/TournamentParticipants/tournament/${tournament.id}`
                    )
                    allParticipants.push(...participants)
                } catch (e) {
                }
            }
            
            return allParticipants
        } catch (e) {
            return []
        }
    },

    getById: (id: number) =>
        apiRequest<TournamentParticipantReadDto>(`/api/TournamentParticipants/${id}`),

    create: (data: TournamentParticipantCreateDto) =>
        apiRequest<TournamentParticipantReadDto>("/api/TournamentParticipants", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: number, data: TournamentParticipantUpdateDto) =>
        apiRequest<void>(`/api/TournamentParticipants/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        apiRequest<void>(`/api/TournamentParticipants/${id}`, {
            method: "DELETE",
        }),
}
