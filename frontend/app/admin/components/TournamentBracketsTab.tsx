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
import {
    TournamentBracketTypesService,
    TournamentBracketTypeReadDto
} from "@/lib/services/tournament-bracket-types.service"

export default function TournamentBracketsTab() {
    const [brackets, setBrackets] = useState<TournamentBracketReadDto[]>([])
    const [tournaments, setTournaments] = useState<TournamentReadDto[]>([])
    const [bracketTypes, setBracketTypes] = useState<TournamentBracketTypeReadDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedTournamentId, setSelectedTournamentId] = useState<number>(0)
    const [generatingId, setGeneratingId] = useState<number | null>(null)

    useEffect(() => {
        loadAll()
    }, [])

    async function loadAll() {
        try {
            setError(null)
            const [bracketsData, tournamentsData, bracketTypesData] = await Promise.all([
                TournamentBracketsService.getAll(),
                TournamentsService.getAll(),
                TournamentBracketTypesService.getAll()
            ])
            setBrackets(bracketsData)
            setTournaments(tournamentsData)
            setBracketTypes(bracketTypesData)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
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
            alert("Скобка сгенерирована")
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        } finally {
            setGeneratingId(null)
        }
    }

    async function handleDelete(id: number) {
        try {
            await TournamentBracketsService.delete(id)
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        }
    }

    if (loading) return <p>Загрузка...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-6">

            {/* GENERATE */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-3">
                <h3 className="font-semibold">Сгенерировать скобку турнира</h3>

                <div className="flex gap-2">
                    <select
                        value={selectedTournamentId}
                        onChange={(e) => setSelectedTournamentId(Number(e.target.value))}
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

            {/* LIST TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed text-sm">
                    <thead className="bg-slate-200 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-left w-16">ID</th>
                            <th className="p-3 text-left w-40">Турнир</th>
                            <th className="p-3 text-left w-40">Тип скобки</th>
                            <th className="p-3 text-left w-32">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brackets.map(bracket => (
                            <tr key={bracket.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="p-3">{bracket.id}</td>
                                <td className="p-3">{bracket.tournament}</td>
                                <td className="p-3">{bracket.bracketType}</td>
                                <td className="p-3 space-x-1 flex">
                                    <button
                                        onClick={() => handleDelete(bracket.id)}
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
