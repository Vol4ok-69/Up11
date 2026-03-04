"use client"

import { useEffect, useState } from "react"
import {
    TournamentApplicationsService,
    TournamentApplicationReadDto
} from "@/lib/services/tournament-applications.service"
import {
    TournamentsService,
    TournamentReadDto
} from "@/lib/services/tournaments.service"
import {
    TeamsService,
    TeamReadDto
} from "@/lib/services/teams.service"
import {
    ApplicationStatusesService,
    ApplicationStatusReadDto
} from "@/lib/services/application-statuses.service"

export default function TournamentApplicationsTab() {
    const [applications, setApplications] = useState<TournamentApplicationReadDto[]>([])
    const [tournaments, setTournaments] = useState<TournamentReadDto[]>([])
    const [teams, setTeams] = useState<TeamReadDto[]>([])
    const [statuses, setStatuses] = useState<ApplicationStatusReadDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [newApplication, setNewApplication] = useState({
        tournamentId: 0,
        teamId: 0
    })

    useEffect(() => {
        loadAll()
    }, [])

    async function loadAll() {
        try {
            setError(null)
            const [applicationsData, tournamentsData, teamsData, statusesData] = await Promise.all([
                TournamentApplicationsService.getAll(),
                TournamentsService.getAll(),
                TeamsService.getAll(),
                ApplicationStatusesService.getAll()
            ])
            setApplications(applicationsData)
            setTournaments(tournamentsData)
            setTeams(teamsData)
            setStatuses(statusesData)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleCreate() {
        if (!newApplication.tournamentId || !newApplication.teamId) {
            alert("Выберите турнир и команду")
            return
        }

        try {
            await TournamentApplicationsService.create(newApplication)
            setNewApplication({ tournamentId: 0, teamId: 0 })
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleStatusChange(id: number, statusId: number) {
        try {
            await TournamentApplicationsService.update(id, { statusId })
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleDelete(id: number) {
        try {
            await TournamentApplicationsService.delete(id)
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        }
    }

    if (loading) return <p>Загрузка...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-6">

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-3">
                <h3 className="font-semibold">Создать заявку</h3>

                <div className="grid md:grid-cols-3 gap-3">
                    <select
                        value={newApplication.tournamentId}
                        onChange={(e) =>
                            setNewApplication({ ...newApplication, tournamentId: Number(e.target.value) })
                        }
                        className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                    >
                        <option value={0}>Выберите турнир</option>
                        {tournaments.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.title}
                            </option>
                        ))}
                    </select>

                    <select
                        value={newApplication.teamId}
                        onChange={(e) =>
                            setNewApplication({ ...newApplication, teamId: Number(e.target.value) })
                        }
                        className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                    >
                        <option value={0}>Выберите команду</option>
                        {teams.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.title}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                        Создать
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed text-sm">
                    <thead className="bg-slate-200 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-left w-16">ID</th>
                            <th className="p-3 text-left w-32">Турнир</th>
                            <th className="p-3 text-left w-32">Команда</th>
                            <th className="p-3 text-left w-32">Статус</th>
                            <th className="p-3 text-left w-32">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="p-3">{app.id}</td>
                                <td className="p-3">{app.tournament}</td>
                                <td className="p-3">{app.team}</td>
                                <td className="p-3">
                                    <select
                                        value={0}
                                        onChange={(e) => {
                                            const statusId = Number(e.target.value)
                                            if (statusId) handleStatusChange(app.id, statusId)
                                        }}
                                        className="px-2 py-1 border rounded text-sm bg-white dark:bg-slate-900"
                                    >
                                        <option value={0}>{app.status}</option>
                                        {statuses.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.title}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDelete(app.id)}
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}
