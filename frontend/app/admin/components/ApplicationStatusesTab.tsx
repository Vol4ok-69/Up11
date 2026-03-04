"use client"

import { useEffect, useState } from "react"
import {
    ApplicationStatusesService,
    ApplicationStatusReadDto
} from "@/lib/services/application-statuses.service"

export default function ApplicationStatusesTab() {
    const [statuses, setStatuses] = useState<ApplicationStatusReadDto[]>([])
    const [newTitle, setNewTitle] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        load()
    }, [])

    async function load() {
        try {
            setError(null)
            const data = await ApplicationStatusesService.getAll()
            setStatuses(data)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleCreate() {
        if (!newTitle.trim()) return

        try {
            await ApplicationStatusesService.create({ title: newTitle })
            setNewTitle("")
            await load()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleUpdate(id: number, title: string) {
        try {
            await ApplicationStatusesService.update(id, { title })
            await load()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleDelete(id: number) {
        try {
            await ApplicationStatusesService.delete(id)
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
                <h3 className="font-semibold">Создать статус приложения</h3>
                <div className="flex gap-2">
                    <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Введите название статуса"
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

            {statuses.map((status) => (
                <div
                    key={status.id}
                    className="flex justify-between items-center p-4 rounded-xl bg-slate-100 dark:bg-slate-800"
                >
                    <input
                        defaultValue={status.title || ""}
                        className="bg-transparent border-b border-slate-400 outline-none"
                        onBlur={(e) =>
                            handleUpdate(status.id, e.target.value)
                        }
                    />

                    <button
                        onClick={() => handleDelete(status.id)}
                        className="text-red-500"
                    >
                        Удалить
                    </button>
                </div>
            ))}

        </div>
    )
}
