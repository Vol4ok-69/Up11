"use client"

import { useEffect, useState } from "react"
import {
    TeamMembersService,
    TeamMemberReadDto
} from "@/lib/services/team-members.service"
import {
    TeamsService,
    TeamReadDto
} from "@/lib/services/teams.service"
import {
    UsersService,
    UserReadDto
} from "@/lib/services/user.service"

export default function TeamMembersTab() {
    const [teams, setTeams] = useState<TeamReadDto[]>([])
    const [users, setUsers] = useState<UserReadDto[]>([])
    const [members, setMembers] = useState<TeamMemberReadDto[]>([])
    const [selectedTeamId, setSelectedTeamId] = useState<number>(0)
    const [selectedUserId, setSelectedUserId] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        loadAll()
    }, [])

    async function loadAll() {
        try {
            setError(null)
            const [teamsData, usersData] = await Promise.all([
                TeamsService.getAll(),
                UsersService.getAll()
            ])
            setTeams(teamsData)
            setUsers(usersData)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleSelectTeam(teamId: number) {
        if (!teamId) {
            setSelectedTeamId(0)
            setMembers([])
            setSelectedUserId(0)
            return
        }

        try {
            setError(null)
            setSelectedTeamId(teamId)
            setSelectedUserId(0)
            const data = await TeamMembersService.getByTeam(teamId)
            setMembers(data)
        } catch (e: any) {
            setError(e.message)
            setMembers([])
        }
    }

    async function handleAddMember(userId: number) {
        if (!selectedTeamId || !userId) {
            alert("Выберите команду и пользователя")
            return
        }

        const userInTeam = members.some(m =>
            users.find(u => u.id === userId && (u.nickname === m.user || u.login === m.user))
        )

        if (userInTeam) {
            alert("Этот пользователь уже в команде")
            return
        }

        setAdding(true)
        setError(null)

        try {
            await TeamMembersService.adminAdd({ teamId: selectedTeamId, userId })
            await handleSelectTeam(selectedTeamId)
            setSelectedUserId(0)
        } catch (e: any) {
            setError(`Ошибка добавления: ${e.message}`)
        } finally {
            setAdding(false)
        }
    }

    async function handleRemove(id: number) {
        try {
            await TeamMembersService.remove(id)
            if (selectedTeamId) {
                await handleSelectTeam(selectedTeamId)
            }
        } catch (e: any) {
            alert(e.message)
        }
    }

    const availableUsers = users.filter(u =>
        !members.some(m =>
            u.nickname === m.user || u.login === m.user
        )
    )

    if (loading) return <p>Загрузка...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-6">

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-3">
                <h3 className="font-semibold">Выберите команду</h3>

                <select
                    value={selectedTeamId}
                    onChange={(e) => handleSelectTeam(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                >
                    <option value={0}>Выберите команду</option>
                    {teams.map(t => (
                        <option key={t.id} value={t.id}>
                            {t.title}
                        </option>
                    ))}
                </select>
            </div>

            {selectedTeamId > 0 && (
                <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-900 space-y-3">
                    <h3 className="font-semibold">Добавить игрока в команду</h3>
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <div className="grid md:grid-cols-3 gap-3">
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(Number(e.target.value))}
                            className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            disabled={adding}
                        >
                            <option value={0}>Выберите игрока</option>
                            {availableUsers.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.nickname || u.login}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => handleAddMember(selectedUserId)}
                            disabled={adding}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {adding ? "Добавляю..." : "Добавить в команду"}
                        </button>
                    </div>
                    {availableUsers.length === 0 && (
                        <p className="text-sm text-slate-600">Все пользователи уже в команде</p>
                    )}
                </div>
            )}

            {selectedTeamId > 0 && (
                <div className="overflow-x-auto">
                    <h3 className="font-semibold mb-3">Участники команды</h3>
                    <table className="min-w-full table-fixed text-sm">
                        <thead className="bg-slate-200 dark:bg-slate-800">
                            <tr>
                                <th className="p-3 text-left w-16">ID</th>
                                <th className="p-3 text-left w-40">Участник</th>
                                <th className="p-3 text-left w-40">Дата присоединения</th>
                                <th className="p-3 text-left w-32">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.length > 0 ? (
                                members.map(member => (
                                    <tr key={member.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <td className="p-3">{member.id}</td>
                                        <td className="p-3">{member.user}</td>
                                        <td className="p-3">{new Date(member.joinedAt).toLocaleDateString('ru-RU')}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleRemove(member.id)}
                                                className="text-red-500 text-sm hover:underline"
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-3 text-center text-slate-500">
                                        Нет участников в этой команде
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    )
}