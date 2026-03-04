import { apiRequest } from "../api"

export interface ApplicationStatusHistoryReadDto {
    oldStatus: string | null
    newStatus: string | null
    changedAt: string
    changedBy: string | null
}

export const ApplicationStatusHistoryService = {
    
    getHistoryByApplication: (applicationId: number) =>
        apiRequest<ApplicationStatusHistoryReadDto[]>(
            `/api/TournamentApplications/${applicationId}/history`
        ),

    getAll: async (): Promise<ApplicationStatusHistoryReadDto[]> => {
        try {
            const { TournamentApplicationsService } = await import("./tournament-applications.service")
            const applications = await TournamentApplicationsService.getAll()
            const allHistory: ApplicationStatusHistoryReadDto[] = []
            
            for (const app of applications) {
                try {
                    const history = await apiRequest<ApplicationStatusHistoryReadDto[]>(
                        `/api/TournamentApplications/${app.id}/history`
                    )
                    allHistory.push(...history)
                } catch (e) {
                }
            }
            
            return allHistory
        } catch (e) {
            return []
        }
    },
}
