"use client"

import { useEffect, useState } from "react"
import {
    MatchesService,
    MatchReadDto
} from "@/lib/services/matches.service"
import {
    TeamsService,
    TeamReadDto
} from "@/lib/services/teams.service"
import {
    MatchResultsService,
    MatchResultReadDto
} from "@/lib/services/match-results.service"

export default function MatchResultsTab() {
    const [matches, setMatches] = useState<MatchReadDto[]>([])
    const [teams, setTeams] = useState<TeamReadDto[]>([])
    const [results, setResults] = useState<MatchResultReadDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedMatchId, setSelectedMatchId] = useState<number>(0)
    const [selectedMatch, setSelectedMatch] = useState<MatchReadDto | null>(null)
    const [result, setResult] = useState({
        winnerId: 0,
        scoreTeamA: 0,
        scoreTeamB: 0
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadAll()
    }, [])

    async function loadAll() {
        try {
            setError(null)
            const [matchesData, teamsData, resultsData] = await Promise.all([
                MatchesService.getAll(),
                TeamsService.getAll(),
                MatchResultsService.getAll()
            ])
            const uniqueMatches = matchesData.filter((m, idx, arr) => 
                arr.findIndex(x => x.id === m.id) === idx
            )
            setMatches(uniqueMatches)
            setTeams(teamsData)
            setResults(resultsData)
            console.log('Загруженные результаты:', resultsData)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    function handleSelectMatch(matchId: number) {
        const match = matches.find(m => m.id === matchId)
        setSelectedMatchId(matchId)
        setSelectedMatch(match || null)
        setResult({ winnerId: 0, scoreTeamA: 0, scoreTeamB: 0 })
    }

    async function handleSubmitResult() {
        if (!selectedMatchId) {
            alert("Выберите матч")
            return
        }

        if (result.scoreTeamA < 0 || result.scoreTeamB < 0) {
            alert("Счет не может быть отрицательным")
            return
        }

        if (result.scoreTeamA === result.scoreTeamB) {
            alert("Счет не может быть ничьей")
            return
        }

        try {
            setSubmitting(true)
            await MatchResultsService.submitResult(selectedMatchId, {
                winnerId: result.winnerId || undefined,
                scoreTeamA: result.scoreTeamA,
                scoreTeamB: result.scoreTeamB
            })
            alert("Результат сохранен")
            setSelectedMatchId(0)
            setSelectedMatch(null)
            setResult({ winnerId: 0, scoreTeamA: 0, scoreTeamB: 0 })
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p>Загрузка...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-6">

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-3">
                <h3 className="font-semibold">Внести результат матча</h3>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Выберите матч
                        </label>
                        <select
                            value={selectedMatchId}
                            onChange={(e) => handleSelectMatch(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                        >
                            <option value={0}>Выберите матч</option>
                            {matches.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.teamA} vs {m.teamB} ({m.tournament})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedMatch && (
                        <>
                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-medium">
                                    <span className="font-bold">{selectedMatch.teamA}</span>
                                    {" vs "}
                                    <span className="font-bold">{selectedMatch.teamB}</span>
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    {selectedMatch.tournament} • {selectedMatch.stage}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Счет команды A ({selectedMatch.teamA})
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={result.scoreTeamA}
                                        onChange={(e) =>
                                            setResult({ ...result, scoreTeamA: Number(e.target.value) })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Счет команды B ({selectedMatch.teamB})
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={result.scoreTeamB}
                                        onChange={(e) =>
                                            setResult({ ...result, scoreTeamB: Number(e.target.value) })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Победитель (опционально)
                                </label>
                                <select
                                    value={result.winnerId}
                                    onChange={(e) =>
                                        setResult({ ...result, winnerId: Number(e.target.value) })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                                >
                                    <option value={0}>Автоматически (по счету)</option>
                                    <option value={1}>
                                        {selectedMatch.teamA}
                                    </option>
                                    <option value={2}>
                                        {selectedMatch.teamB}
                                    </option>
                                </select>
                            </div>

                            <button
                                onClick={handleSubmitResult}
                                disabled={submitting}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                            >
                                {submitting ? "Сохраняю..." : "Сохранить результат"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">ℹ️ Информация</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    Выберите матч из списка, введите счет обеих команд и нажмите "Сохранить результат". 
                    Система автоматически определит победителя по счету, либо вы можете указать его вручную.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed text-sm">
                    <thead className="bg-slate-200 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-left w-16">ID</th>
                            <th className="p-3 text-left w-32">Матч</th>
                            <th className="p-3 text-left w-20">Счет</th>
                            <th className="p-3 text-left w-24">Победитель</th>
                            <th className="p-3 text-left w-32">Дата</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.length > 0 ? (
                            results.map(result => {
                                const match = matches.find(m => m.id === Number(result.match?.split('#')[1]?.split(' ')[0]))
                                return (
                                    <tr key={result.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <td className="p-3">{result.id}</td>
                                        <td className="p-3 text-sm">{result.match}</td>
                                        <td className="p-3 text-sm font-semibold">
                                            {result.scoreTeamA} : {result.scoreTeamB}
                                        </td>
                                        <td className="p-3 text-sm">
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                                {result.winnerTeam || '-'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm">
                                            {new Date(result.resultedAt).toLocaleString('ru-RU')}
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-slate-500">
                                    Результаты не найдены
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}
