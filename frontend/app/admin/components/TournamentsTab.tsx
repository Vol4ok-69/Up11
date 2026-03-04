"use client"

import { useEffect, useState } from "react"
import {
    TournamentsService,
    TournamentReadDto
} from "@/lib/services/tournaments.service"
import {
    DisciplinesService,
    DisciplineReadDto
} from "@/lib/services/disciplines.service"
import {
    TournamentStatusesService,
    TournamentStatusReadDto
} from "@/lib/services/tournament-statuses.service"

export default function TournamentsTab() {
    const [tournaments, setTournaments] = useState<TournamentReadDto[]>([])
    const [disciplines, setDisciplines] = useState<DisciplineReadDto[]>([])
    const [statuses, setStatuses] = useState<TournamentStatusReadDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [newTournament, setNewTournament] = useState({
        title: "",
        disciplineId: 0,
        startDate: "",
        endDate: "",
        prizePool: 0,
        minTeamSize: 0,
        statusId: 0
    })

    const [editingId, setEditingId] = useState<number | null>(null)
    const [editedTournament, setEditedTournament] = useState({
        title: "",
        disciplineId: 0,
        startDate: "",
        endDate: "",
        prizePool: 0,
        minTeamSize: 0,
        statusId: 0
    })

    useEffect(() => {
        loadAll()
    }, [])

    async function loadAll() {
        try {
            setError(null)
            const [tournamentsData, disciplinesData, statusesData] = await Promise.all([
                TournamentsService.getAll(),
                DisciplinesService.getAll(),
                TournamentStatusesService.getAll()
            ])
            setTournaments(tournamentsData)
            setDisciplines(disciplinesData)
            setStatuses(statusesData)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleCreate() {
        if (!newTournament.title.trim() || !newTournament.disciplineId || !newTournament.statusId) {
            alert("Заполните обязательные поля")
            return
        }

        try {
            await TournamentsService.create(newTournament)
            setNewTournament({
                title: "",
                disciplineId: 0,
                startDate: "",
                endDate: "",
                prizePool: 0,
                minTeamSize: 0,
                statusId: 0
            })
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Вы уверены?")) return

        try {
            await TournamentsService.delete(id)
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        }
    }

    function handleEdit(tournament: TournamentReadDto) {
        setEditingId(tournament.id)
        setEditedTournament({
            title: tournament.title || "",
            disciplineId: 0,
            startDate: tournament.startDate,
            endDate: tournament.endDate,
            prizePool: tournament.prizePool,
            minTeamSize: tournament.minTeamSize,
            statusId: 0
        })
    }

    async function handleUpdate(id: number) {
        if (!editedTournament.title.trim()) {
            alert("Название не может быть пустым")
            return
        }

        try {
            await TournamentsService.update(id, editedTournament)
            setEditingId(null)
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
                <h3 className="font-semibold">Создать турнир</h3>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Название турнира
                        </label>
                        <input
                            placeholder="Введите название турнира"
                            value={newTournament.title}
                            onChange={(e) =>
                                setNewTournament({ ...newTournament, title: e.target.value })
                            }
                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Дисциплина
                            </label>
                            <select
                                value={newTournament.disciplineId}
                                onChange={(e) =>
                                    setNewTournament({ ...newTournament, disciplineId: Number(e.target.value) })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            >
                                <option value={0}>Выберите дисциплину</option>
                                {disciplines.map(d => (
                                    <option key={d.id} value={d.id}>
                                        {d.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Статус турнира
                            </label>
                            <select
                                value={newTournament.statusId}
                                onChange={(e) =>
                                    setNewTournament({ ...newTournament, statusId: Number(e.target.value) })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            >
                                <option value={0}>Выберите статус</option>
                                {statuses.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Призовой фонд ($)
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={newTournament.prizePool}
                                onChange={(e) =>
                                    setNewTournament({ ...newTournament, prizePool: Number(e.target.value) })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Дата начала
                            </label>
                            <input
                                type="date"
                                value={newTournament.startDate}
                                onChange={(e) =>
                                    setNewTournament({ ...newTournament, startDate: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Дата окончания
                            </label>
                            <input
                                type="date"
                                value={newTournament.endDate}
                                onChange={(e) =>
                                    setNewTournament({ ...newTournament, endDate: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Мин. размер команды
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={newTournament.minTeamSize}
                                onChange={(e) =>
                                    setNewTournament({ ...newTournament, minTeamSize: Number(e.target.value) })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* EDIT */}
            {editingId !== null && (
                <div className="p-4 rounded-xl bg-amber-100 dark:bg-amber-900 space-y-3 border-2 border-amber-400">
                    <h3 className="font-semibold">Редактировать турнир (ID: {editingId})</h3>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Название турнира
                            </label>
                            <input
                                placeholder="Введите название турнира"
                                value={editedTournament.title}
                                onChange={(e) =>
                                    setEditedTournament({ ...editedTournament, title: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Дата начала
                                </label>
                                <input
                                    type="date"
                                    value={editedTournament.startDate}
                                    onChange={(e) =>
                                        setEditedTournament({ ...editedTournament, startDate: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Дата окончания
                                </label>
                                <input
                                    type="date"
                                    value={editedTournament.endDate}
                                    onChange={(e) =>
                                        setEditedTournament({ ...editedTournament, endDate: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Призовой фонд (Руб.)
                                </label>
                                <input
                                    type="number"
                                    value={editedTournament.prizePool}
                                    onChange={(e) =>
                                        setEditedTournament({ ...editedTournament, prizePool: Number(e.target.value) })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Мин. размер команды
                            </label>
                            <input
                                type="number"
                                value={editedTournament.minTeamSize}
                                onChange={(e) =>
                                    setEditedTournament({ ...editedTournament, minTeamSize: Number(e.target.value) })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleUpdate(editingId)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Сохранить
                            </button>
                            <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500"
                            >
                                Отменить
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed text-sm">
                    <thead className="bg-slate-200 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-left w-16">ID</th>
                            <th className="p-3 text-left w-32">Название</th>
                            <th className="p-3 text-left w-24">Дисциплина</th>
                            <th className="p-3 text-left w-24">Статус</th>
                            <th className="p-3 text-left w-20">Начало</th>
                            <th className="p-3 text-left w-20">Конец</th>
                            <th className="p-3 text-left w-24">Призовой</th>
                            <th className="p-3 text-left w-24">Мин. размер</th>
                            <th className="p-3 text-left w-20">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tournaments.map(t => (
                            <tr key={t.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="p-3">{t.id}</td>
                                <td className="p-3">{t.title}</td>
                                <td className="p-3 text-sm">{t.discipline}</td>
                                <td className="p-3 text-sm">{t.status}</td>
                                <td className="p-3 text-sm">{new Date(t.startDate).toLocaleDateString('ru-RU')}</td>
                                <td className="p-3 text-sm">{new Date(t.endDate).toLocaleDateString('ru-RU')}</td>
                                <td className="p-3 text-sm">${t.prizePool}</td>
                                <td className="p-3 text-sm">{t.minTeamSize}</td>
                                <td className="p-3 space-x-1 flex">
                                    <button
                                        onClick={() => handleEdit(t)}
                                        className="text-blue-500 text-sm hover:underline"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t.id)}
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
