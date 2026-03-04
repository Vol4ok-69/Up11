"use client"

import { useEffect, useState } from "react"
import {
    TournamentBracketTypesService,
    TournamentBracketTypeReadDto
} from "@/lib/services/tournament-bracket-types.service"

export default function TournamentBracketTypesTab() {
    const [types, setTypes] = useState<TournamentBracketTypeReadDto[]>([])
    const [newTitle, setNewTitle] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        load()
    }, [])

    async function load() {
        try {
            setError(null)
            const data = await TournamentBracketTypesService.getAll()
            setTypes(data)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleCreate() {
        if (!newTitle.trim()) return

        try {
            await TournamentBracketTypesService.create({ title: newTitle })
            setNewTitle("")
            await load()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleUpdate(id: number, title: string) {
        try {
            await TournamentBracketTypesService.update(id, { title })
            await load()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleDelete(id: number) {
        try {
            await TournamentBracketTypesService.delete(id)
            await load()
        } catch (e: any) {
            alert(e.message)
        }
    }

    if (loading) return <p>Загрузка...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-6">

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-3">
                <h3 className="font-semibold">Создать тип сетки турнира</h3>
                <div className="flex gap-2">
                    <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Введите название типа"
                        className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                    />
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Создать
                    </button>
                </div>
            </div>

            {types.map((type) => (
                <div
                    key={type.id}
                    className="flex justify-between items-center p-4 rounded-xl bg-slate-100 dark:bg-slate-800"
                >
                    <input
                        defaultValue={type.title || ""}
                        className="bg-transparent border-b border-slate-400 outline-none"
                        onBlur={(e) =>
                            handleUpdate(type.id, e.target.value)
                        }
                    />

                    <button
                        onClick={() => handleDelete(type.id)}
                        className="text-red-500"
                    >
                        Удалить
                    </button>
                </div>
            ))}

        </div>
    )
}
