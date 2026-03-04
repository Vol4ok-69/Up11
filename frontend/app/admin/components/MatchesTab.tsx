"use client"

import { useEffect, useState } from "react"
import {
    MatchesService,
    MatchReadDto
} from "@/lib/services/matches.service"
import {
    TournamentsService,
    TournamentReadDto
} from "@/lib/services/tournaments.service"
import {
    MatchStagesService,
    MatchStageReadDto
} from "@/lib/services/match-stages.service"
import {
    TeamsService,
    TeamReadDto
} from "@/lib/services/teams.service"

export default function MatchesTab() {
    const [matches, setMatches] = useState<MatchReadDto[]>([])
    const [tournaments, setTournaments] = useState<TournamentReadDto[]>([])
    const [stages, setStages] = useState<MatchStageReadDto[]>([])
    const [teams, setTeams] = useState<TeamReadDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [newMatch, setNewMatch] = useState({
        tournamentId: 0,
        stageId: 0,
        teamAId: 0,
        teamBId: 0
    })

    useEffect(() => {
        loadAll()
    }, [])

    async function loadAll() {
        try {
            setError(null)
            const [matchesData, tournamentsData, stagesData, teamsData] = await Promise.all([
                MatchesService.getAll(),
                TournamentsService.getAll(),
                MatchStagesService.getAll(),
                TeamsService.getAll()
            ])
            setMatches(matchesData)
            setTournaments(tournamentsData)
            setStages(stagesData)
            setTeams(teamsData)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleCreate() {
        if (!newMatch.tournamentId || !newMatch.stageId || !newMatch.teamAId || !newMatch.teamBId) {
            alert("Заполните все обязательные поля")
            return
        }

        if (newMatch.teamAId === newMatch.teamBId) {
            alert("Команды должны быть разными")
            return
        }

        try {
            await MatchesService.create(newMatch)
            setNewMatch({ tournamentId: 0, stageId: 0, teamAId: 0, teamBId: 0 })
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleDelete(id: number) {
        try {
            await MatchesService.delete(id)
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
                <h3 className="font-semibold">Создать матч</h3>

                <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Турнир
                            </label>
                            <select
                                value={newMatch.tournamentId}
                                onChange={(e) =>
                                    setNewMatch({ ...newMatch, tournamentId: Number(e.target.value) })
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
                                Этап матча
                            </label>
                            <select
                                value={newMatch.stageId}
                                onChange={(e) =>
                                    setNewMatch({ ...newMatch, stageId: Number(e.target.value) })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            >
                                <option value={0}>Выберите этап</option>
                                {stages.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Команда 1
                            </label>
                            <select
                                value={newMatch.teamAId}
                                onChange={(e) =>
                                    setNewMatch({ ...newMatch, teamAId: Number(e.target.value) })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            >
                                <option value={0}>Выберите команду 1</option>
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Команда 2
                            </label>
                            <select
                                value={newMatch.teamBId}
                                onChange={(e) =>
                                    setNewMatch({ ...newMatch, teamBId: Number(e.target.value) })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            >
                                <option value={0}>Выберите команду 2</option>
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleCreate}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Создать матч
                    </button>
                </div>
            </div>

            {/* LIST TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed text-sm">
                    <thead className="bg-slate-200 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-left w-16">ID</th>
                            <th className="p-3 text-left w-28">Турнир</th>
                            <th className="p-3 text-left w-24">Этап</th>
                            <th className="p-3 text-left w-28">Команда 1</th>
                            <th className="p-3 text-left w-20">VS</th>
                            <th className="p-3 text-left w-28">Команда 2</th>
                            <th className="p-3 text-left w-20">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map(match => (
                            <tr key={match.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="p-3">{match.id}</td>
                                <td className="p-3 text-sm">{match.tournament}</td>
                                <td className="p-3 text-sm">{match.stage}</td>
                                <td className="p-3 text-sm">{match.teamA}</td>
                                <td className="p-3 text-center text-xs font-bold">VS</td>
                                <td className="p-3 text-sm">{match.teamB}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDelete(match.id)}
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
