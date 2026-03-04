"use client"

import { useEffect, useState } from "react"
import {
    DisciplinesService,
    DisciplineReadDto
} from "@/lib/services/disciplines.service"

export default function DisciplinesTab() {
    const [disciplines, setDisciplines] = useState<DisciplineReadDto[]>([])
    const [newTitle, setNewTitle] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        load()
    }, [])

    async function load() {
        try {
            setError(null)
            const data = await DisciplinesService.getAll()
            setDisciplines(data)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleCreate() {
        if (!newTitle.trim()) return

        try {
            await DisciplinesService.create({
                title: newTitle,
                description: newDescription
            })
            setNewTitle("")
            setNewDescription("")
            await load()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleUpdate(id: number, title: string, description: string) {
        try {
            await DisciplinesService.update(id, { title, description })
            await load()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleDelete(id: number) {
        try {
            await DisciplinesService.delete(id)
            await load()
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
                <h3 className="font-semibold">Создать дисциплину</h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Название дисциплины
                        </label>
                        <input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Введите название дисциплины"
                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Описание (опционально)
                        </label>
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Введите описание дисциплины"
                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            rows={3}
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Создать
                    </button>
                </div>
            </div>

            {/* LIST */}
            {disciplines.map((discipline) => (
                <div
                    key={discipline.id}
                    className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-2"
                >
                    <input
                        defaultValue={discipline.title || ""}
                        className="w-full bg-transparent border-b border-slate-400 outline-none"
                        onBlur={(e) =>
                            handleUpdate(discipline.id, e.target.value, discipline.description || "")
                        }
                    />
                    <textarea
                        defaultValue={discipline.description || ""}
                        className="w-full bg-transparent border-b border-slate-400 outline-none"
                        rows={2}
                        onBlur={(e) =>
                            handleUpdate(discipline.id, discipline.title || "", e.target.value)
                        }
                    />
                    <button
                        onClick={() => handleDelete(discipline.id)}
                        className="text-red-500 text-sm"
                    >
                        Удалить
                    </button>
                </div>
            ))}

        </div>
    )
}
