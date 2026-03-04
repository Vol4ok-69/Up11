import { apiRequest } from "../api"
import { TournamentsService } from "./tournaments.service"

export interface TournamentApplicationReadDto {
    id: number
    tournament: string | null
    team: string | null
    status: string | null
}

export interface TournamentApplicationCreateDto {
    tournamentId: number
    teamId: number
}

export interface TournamentApplicationUpdateDto {
    statusId: number
}

export const TournamentApplicationsService = {

    getAll: async (): Promise<TournamentApplicationReadDto[]> => {
        try {
            const tournaments = await TournamentsService.getAll()
            const allApplications: TournamentApplicationReadDto[] = []

            for (const tournament of tournaments) {
                try {
                    const apps = await apiRequest<TournamentApplicationReadDto[]>(
                        `/api/TournamentApplications/tournament/${tournament.id}`
                    )
                    allApplications.push(...apps)
                } catch (e) {
                }
            }

            return allApplications
        } catch (e) {
            return []
        }
    },

    getById: (id: number) =>
        apiRequest<TournamentApplicationReadDto>(`/api/TournamentApplications/${id}`),

    create: (data: TournamentApplicationCreateDto) =>
        apiRequest<TournamentApplicationReadDto>("/api/TournamentApplications", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: number, data: TournamentApplicationUpdateDto) =>
        apiRequest<void>(`/api/TournamentApplications/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        apiRequest<void>(`/api/TournamentApplications/${id}`, {
            method: "DELETE",
        }),
}
