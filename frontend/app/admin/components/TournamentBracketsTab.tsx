"use client"

import { useEffect, useState } from "react"
import {
    TournamentBracketsService,
    TournamentBracketReadDto
} from "@/lib/services/tournament-brackets.service"

import {
    TournamentsService,
    TournamentReadDto
} from "@/lib/services/tournaments.service"

export default function TournamentBracketsTab() {

    const [brackets, setBrackets] = useState<TournamentBracketReadDto[]>([])
    const [tournaments, setTournaments] = useState<TournamentReadDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedTournamentId, setSelectedTournamentId] = useState<number>(0)
    const [generatingId, setGeneratingId] = useState<number | null>(null)

    useEffect(() => {
        loadTournaments()
    }, [])

    async function loadTournaments() {
        try {
            const tournamentsData = await TournamentsService.getAll()
            setTournaments(tournamentsData)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function loadBrackets(tournamentId: number) {
        try {
            const data = await TournamentBracketsService.getByTournament(tournamentId)
            setBrackets(data)
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleGenerateBracket(tournamentId: number) {

        if (!tournamentId) {
            alert("Выберите турнир")
            return
        }

        try {
            setGeneratingId(tournamentId)

            await TournamentBracketsService.generate(tournamentId)

            await loadBrackets(tournamentId)

            alert("Сетка сгенерирована")

        } catch (e: any) {
            alert(e.message)
        } finally {
            setGeneratingId(null)
        }
    }

    function handleTournamentChange(id: number) {
        setSelectedTournamentId(id)

        if (id !== 0)
            loadBrackets(id)
    }

    if (loading) return <p>Загрузка...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-6">

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-3">
                <h3 className="font-semibold">Сгенерировать сетку турнира</h3>

                <div className="flex gap-2">

                    <select
                        value={selectedTournamentId}
                        onChange={(e) => handleTournamentChange(Number(e.target.value))}
                        className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                    >
                        <option value={0}>Выберите турнир</option>

                        {tournaments.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.title}
                            </option>
                        ))}

                    </select>

                    <button
                        onClick={() => handleGenerateBracket(selectedTournamentId)}
                        disabled={generatingId !== null}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {generatingId ? "Генерирую..." : "Сгенерировать"}
                    </button>

                </div>
            </div>

            <div className="overflow-x-auto">

                <table className="min-w-full table-fixed text-sm">

                    <thead className="bg-slate-200 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Stage</th>
                            <th className="p-3 text-left">Position</th>
                            <th className="p-3 text-left">Match</th>
                            <th className="p-3 text-left">Parent</th>
                            <th className="p-3 text-left">Slot</th>
                            <th className="p-3 text-left">Type</th>
                        </tr>
                    </thead>

                    <tbody>

                        {brackets.map(b => (

                            <tr key={b.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">

                                <td className="p-3">{b.id}</td>

                                <td className="p-3">{b.stageId}</td>

                                <td className="p-3">{b.position}</td>

                                <td className="p-3">{b.matchId ?? "-"}</td>

                                <td className="p-3">{b.parentBracketId ?? "-"}</td>

                                <td className="p-3">{b.slotInParent ?? "-"}</td>

                                <td className="p-3">{b.bracketType}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    )
}