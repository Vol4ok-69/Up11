"use client"

import { useEffect, useState } from "react"
import {
    TeamsService,
    TeamReadDto
} from "@/lib/services/teams.service"
import {
    DisciplinesService,
    DisciplineReadDto
} from "@/lib/services/disciplines.service"
import {
    UsersService,
    UserReadDto
} from "@/lib/services/user.service"

export default function TeamsTab() {
    const [teams, setTeams] = useState<TeamReadDto[]>([])
    const [disciplines, setDisciplines] = useState<DisciplineReadDto[]>([])
    const [users, setUsers] = useState<UserReadDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [newTeam, setNewTeam] = useState({
        title: "",
        disciplineId: 0,
        captainId: 0
    })

    const [editingId, setEditingId] = useState<number | null>(null)
    const [editedTeam, setEditedTeam] = useState({
        title: "",
        disciplineId: 0,
        captainId: 0
    })

    useEffect(() => {
        loadAll()
    }, [])

    async function loadAll() {
        try {
            setError(null)
            const [teamsData, disciplinesData, usersData] = await Promise.all([
                TeamsService.getAll(),
                DisciplinesService.getAll(),
                UsersService.getAll()
            ])
            setTeams(teamsData)
            setDisciplines(disciplinesData)
            setUsers(usersData)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleCreate() {
        if (!newTeam.title.trim() || !newTeam.disciplineId) return

        try {
            await TeamsService.create({
                title: newTeam.title,
                disciplineId: newTeam.disciplineId,
                captainId: newTeam.captainId || undefined
            })
            setNewTeam({ title: "", disciplineId: 0, captainId: 0 })
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        }
    }

    async function handleDelete(id: number) {
        try {
            await TeamsService.delete(id)
            await loadAll()
        } catch (e: any) {
            alert(e.message)
        }
    }

    function handleEdit(team: TeamReadDto) {
        setEditingId(team.id)
        setEditedTeam({
            title: team.title || "",
            disciplineId: 0,
            captainId: 0
        })
    }

    async function handleUpdate(id: number) {
        if (!editedTeam.title.trim()) {
            alert("Название команды не может быть пустым")
            return
        }

        try {
            await TeamsService.update(id, {
                title: editedTeam.title,
                disciplineId: editedTeam.disciplineId || undefined,
                captainId: editedTeam.captainId || undefined
            })
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
                <h3 className="font-semibold">Создать команду</h3>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Название команды
                        </label>
                        <input
                            placeholder="Введите название команды"
                            value={newTeam.title}
                            onChange={(e) =>
                                setNewTeam({ ...newTeam, title: e.target.value })
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
                                value={newTeam.disciplineId}
                                onChange={(e) =>
                                    setNewTeam({ ...newTeam, disciplineId: Number(e.target.value) })
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
                                Капитан (опционально)
                            </label>
                            <select
                                value={newTeam.captainId}
                                onChange={(e) =>
                                    setNewTeam({ ...newTeam, captainId: Number(e.target.value) })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            >
                                <option value={0}>Выберите капитана</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.nickname || u.login}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleCreate}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Создать
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {editingId !== null && (
                <div className="p-4 rounded-xl bg-amber-100 dark:bg-amber-900 space-y-3 border-2 border-amber-400">
                    <h3 className="font-semibold">Редактировать команду (ID: {editingId})</h3>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Название команды
                            </label>
                            <input
                                placeholder="Введите название команды"
                                value={editedTeam.title}
                                onChange={(e) =>
                                    setEditedTeam({ ...editedTeam, title: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Дисциплина
                                </label>
                                <select
                                    value={editedTeam.disciplineId}
                                    onChange={(e) =>
                                        setEditedTeam({ ...editedTeam, disciplineId: Number(e.target.value) })
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
                                    Капитан (опционально)
                                </label>
                                <select
                                    value={editedTeam.captainId}
                                    onChange={(e) =>
                                        setEditedTeam({ ...editedTeam, captainId: Number(e.target.value) })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                                >
                                    <option value={0}>Выберите капитана</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.nickname || u.login}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                            <th className="p-3 text-left w-40">Название</th>
                            <th className="p-3 text-left w-40">Дисциплина</th>
                            <th className="p-3 text-left w-40">Капитан</th>
                            <th className="p-3 text-left w-32">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map(team => (
                            <tr key={team.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="p-3">{team.id}</td>
                                <td className="p-3">{team.title}</td>
                                <td className="p-3">{team.discipline}</td>
                                <td className="p-3">{team.captain || "-"}</td>
                                <td className="p-3 space-x-1 flex">
                                    <button
                                        onClick={() => handleEdit(team)}
                                        className="text-blue-500 text-sm hover:underline"
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDelete(team.id)}
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
