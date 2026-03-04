import { apiRequest } from "../api"

export interface TeamMemberReadDto {
    id: number
    team: string | null
    user: string | null
    joinedAt: string
}

export interface TeamMemberCreateDto {
    teamId: number
}

export interface AdminTeamMemberCreateDto {
    teamId: number
    userId: number
}

export const TeamMembersService = {
    getByTeam: (teamId: number) =>
        apiRequest<TeamMemberReadDto[]>(`/api/TeamMembers/team/${teamId}`),

    join: (data: TeamMemberCreateDto) =>
        apiRequest<void>("/api/TeamMembers/join", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    adminAdd: (data: AdminTeamMemberCreateDto) =>
        apiRequest<void>("/api/TeamMembers/admin/add", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    remove: (id: number) =>
        apiRequest<void>(`/api/TeamMembers/${id}`, {
            method: "DELETE",
        }),
}
