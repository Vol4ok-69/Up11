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

        if (!newTournament.title.trim() ||
            newTournament.disciplineId === 0 ||
            newTournament.statusId === 0
            ) {
            alert("Выберите дисциплину и статус")
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

    function handleEdit(t: TournamentReadDto) {

        setEditingId(t.id)

        setEditedTournament({
            title: t.title,
            disciplineId: t.disciplineId,
            startDate: t.startDate,
            endDate: t.endDate,
            prizePool: t.prizePool,
            minTeamSize: t.minTeamSize,
            statusId: t.statusId
        })
    }

    async function handleUpdate(id: number) {

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

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-3">

                <h3 className="font-semibold">Создать турнир</h3>

                <input
                    placeholder="Название"
                    value={newTournament.title}
                    onChange={(e) =>
                        setNewTournament({ ...newTournament, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                />

                <select
                    value={newTournament.disciplineId}
                    onChange={(e) =>
                        setNewTournament({
                            ...newTournament,
                            disciplineId: Number(e.target.value)
                        })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                >
                    <option value={0}>Дисциплина</option>

                    {disciplines.map(d => (
                        <option key={d.id} value={d.id}>
                            {d.title}
                        </option>
                    ))}
                </select>

                <select
                    value={newTournament.statusId}
                    onChange={(e) =>
                        setNewTournament({
                            ...newTournament,
                            statusId: Number(e.target.value)
                        })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                >
                    <option value={0}>Статус</option>

                    {statuses.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.title}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={newTournament.startDate}
                    onChange={(e) =>
                        setNewTournament({
                            ...newTournament,
                            startDate: e.target.value
                        })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                />

                <input
                    type="date"
                    value={newTournament.endDate}
                    onChange={(e) =>
                        setNewTournament({
                            ...newTournament,
                            endDate: e.target.value
                        })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                />

                <input
                    type="number"
                    placeholder="Призовой фонд"
                    value={newTournament.prizePool}
                    onChange={(e) =>
                        setNewTournament({
                            ...newTournament,
                            prizePool: Number(e.target.value)
                        })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                />

                <input
                    type="number"
                    placeholder="Мин размер команды"
                    value={newTournament.minTeamSize}
                    onChange={(e) =>
                        setNewTournament({
                            ...newTournament,
                            minTeamSize: Number(e.target.value)
                        })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                />

                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                    Создать
                </button>

            </div>

            {editingId !== null && (

                <div className="p-4 border rounded-xl">

                    <h3>Редактирование турнира</h3>

                    <input
                        value={editedTournament.title}
                        onChange={(e) =>
                            setEditedTournament({
                                ...editedTournament,
                                title: e.target.value
                            })
                        }
                    />

                    <select
                        value={editedTournament.disciplineId}
                        onChange={(e) =>
                            setEditedTournament({
                                ...editedTournament,
                                disciplineId: Number(e.target.value)
                            })
                        }
                    >
                        {disciplines.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.title}
                            </option>
                        ))}
                    </select>

                    <select
                        value={editedTournament.statusId}
                        onChange={(e) =>
                            setEditedTournament({
                                ...editedTournament,
                                statusId: Number(e.target.value)
                            })
                        }
                    >
                        {statuses.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.title}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => handleUpdate(editingId)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Сохранить
                    </button>

                    <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    >
                        Отмена
                    </button>

                </div>

            )}

            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed text-sm">
                    <thead className="bg-slate-200 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-left w-16">ID</th>
                            <th className="p-3 text-left w-48">
                            Название
                            </th>
                            <th className="p-3 text-left w-32">
                            Дисциплина
                            </th>
                            <th className="p-3 text-left w-32">
                            Статус
                            </th>
                            <th className="p-3 text-left w-32">
                            Начало
                            </th>
                            <th className="p-3 text-left w-32">
                            Конец
                            </th>
                            <th className="p-3 text-left w-32">
                            Призовой
                            </th>
                            <th className="p-3 text-left w-32">
                            Мин. команда
                            </th>
                            <th className="p-3 text-left w-40">
                            Действия
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {tournaments.map(t => (
                        <tr
                        key={t.id}
                        className="border-b hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <td className="p-3">{t.id}</td>
                            <td className="p-3 font-medium">
                            {t.title}
                            </td>
                            <td className="p-3 text-sm">
                            {t.discipline}
                            </td>
                            <td className="p-3 text-sm">
                            {t.status}
                            </td>
                            <td className="p-3 text-sm">
                            {t.startDate}
                            </td>
                            <td className="p-3 text-sm">
                            {t.endDate}
                            </td>
                            <td className="p-3 text-sm">
                            {t.prizePool} ₽
                            </td>
                            <td className="p-3 text-sm">
                            {t.minTeamSize}
                            </td>
                            <td className="p-3 flex gap-2">
                                <button
                                onClick={() => handleEdit(t)}
                                className="text-blue-500 hover:underline"
                                >
                                Редактировать
                                </button>
                                <button
                                onClick={() => handleDelete(t.id)}
                                className="text-red-500 hover:underline"
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