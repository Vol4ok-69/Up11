"use client"

import { useEffect, useState } from "react"
import {
    TournamentParticipantsService,
    TournamentParticipantReadDto
} from "@/lib/services/tournament-participants.service"
import {
    TournamentsService,
    TournamentReadDto
} from "@/lib/services/tournaments.service"
import {
    TeamsService,
    TeamReadDto
} from "@/lib/services/teams.service"

export default function TournamentParticipantsTab() {
    const [participants, setParticipants] = useState<TournamentParticipantReadDto[]>([])
    const [tournaments, setTournaments] = useState<TournamentReadDto[]>([])
    const [teams, setTeams] = useState<TeamReadDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [newParticipant, setNewParticipant] = useState({
        tournamentId: 0,
        teamId: 0,
        seed: 0
    })

    useEffect(() => {
        loadAll()
    }, [])

    async function loadAll() {
        try {
            setError(null)
            const [participantsData, tournamentsData, teamsData] = await Promise.all([
                TournamentParticipantsService.getAll(),
                TournamentsService.getAll(),
                TeamsService.getAll()
            ])
            setParticipants(participantsData)
            setTournaments(tournamentsData)
            setTeams(teamsData)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleCreate() {
        if (!newParticipant.tournamentId || !newParticipant.teamId) {
            alert("Выберите турнир и команду")
            return
        }

        try {
            await TournamentParticipantsService.create(newParticipant)
            setNewParticipant({ tournamentId: 0, teamId: 0, seed: 0 })
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleDelete(id: number) {
        try {
            await TournamentParticipantsService.delete(id)
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        }
    }

    if (loading) return <p>Загрузка...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-6">

            {/* CREATE */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-3">
                <h3 className="font-semibold">Добавить участника турнира</h3>

                <div className="grid md:grid-cols-4 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Турнир
                        </label>
                        <select
                            value={newParticipant.tournamentId}
                            onChange={(e) =>
                                setNewParticipant({ ...newParticipant, tournamentId: Number(e.target.value) })
                            }
                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                        >
                            <option value={0}>Выберите турнир</option>
                            {tournaments.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Команда
                        </label>
                        <select
                            value={newParticipant.teamId}
                            onChange={(e) =>
                                setNewParticipant({ ...newParticipant, teamId: Number(e.target.value) })
                            }
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

                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Посев (опционально)
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={newParticipant.seed}
                            onChange={(e) =>
                                setNewParticipant({ ...newParticipant, seed: Number(e.target.value) })
                            }
                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleCreate}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Добавить
                        </button>
                    </div>
                </div>
            </div>

            {/* LIST TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed text-sm">
                    <thead className="bg-slate-200 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-left w-16">ID</th>
                            <th className="p-3 text-left w-32">Турнир</th>
                            <th className="p-3 text-left w-32">Команда</th>
                            <th className="p-3 text-left w-20">Посев</th>
                            <th className="p-3 text-left w-20">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.map(p => (
                            <tr key={p.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="p-3">{p.id}</td>
                                <td className="p-3">{p.tournament}</td>
                                <td className="p-3">{p.team}</td>
                                <td className="p-3">{p.seed || "-"}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDelete(p.id)}
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
