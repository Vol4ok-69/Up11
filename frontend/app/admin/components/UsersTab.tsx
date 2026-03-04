"use client"

import { useEffect, useState } from "react"
import { UsersService, UserReadDto } from "@/lib/services/user.service"
import { RolesService, RoleReadDto } from "@/lib/services/roles.service"
import { register } from "@/lib/services/auth.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UsersTab() {
    const [message, setMessage] = useState<string | null>(null)
    const [users, setUsers] = useState<UserReadDto[]>([])
    const [roles, setRoles] = useState<RoleReadDto[]>([])
    const [loading, setLoading] = useState(true)

    const [newUser, setNewUser] = useState({
        login: "",
        email: "",
        password: "",
        nickname: "",
        roleId: 0
    })

    async function loadAll() {
        setLoading(true)
        const [usersData, rolesData] = await Promise.all([
            UsersService.getAll(),
            RolesService.getAll()
        ])
        setUsers(usersData)
        setRoles(rolesData)
        setLoading(false)
    }

    useEffect(() => {
        loadAll()
    }, [])

    async function handleCreate() {
        if (!newUser.login || !newUser.email || !newUser.password) return

        await register(newUser)

        setMessage("Пользователь создан")
        setTimeout(() => setMessage(null), 3000)
        setNewUser({
            login: "",
            email: "",
            password: "",
            nickname: "",
            roleId: 0
        })

        await loadAll()
    }

    async function handleRoleChange(userId: number, roleId: number) {
        await UsersService.update(userId, { roleId })
        await loadAll()
    }

    async function handleDelete(id: number) {
        await UsersService.delete(id)
        await loadAll()
    }

    if (loading) return <p>Загрузка...</p>

    return (
        <div className="space-y-8">

            {/* CREATE USER */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-3">
                <h3 className="font-semibold">Создать пользователя</h3>

                <div className="grid md:grid-cols-5 gap-3">

                    <Input
                        placeholder="Login"
                        value={newUser.login}
                        onChange={(e) =>
                            setNewUser({ ...newUser, login: e.target.value })
                        }
                    />

                    <Input
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                        }
                    />

                    <Input
                        placeholder="Password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                        }
                    />

                    <Input
                        placeholder="Nickname"
                        value={newUser.nickname}
                        onChange={(e) =>
                            setNewUser({ ...newUser, nickname: e.target.value })
                        }
                    />

                    <select
                        value={newUser.roleId}
                        onChange={(e) =>
                            setNewUser({ ...newUser, roleId: Number(e.target.value) })
                        }
                        className="
                            w-full
                            rounded-md
                            px-2 py-1
                            bg-white dark:bg-slate-900
                            text-slate-900 dark:text-slate-100
                            border border-slate-300 dark:border-slate-700
                        "
                    >
                        <option value={0}>Выберите роль</option>
                        {roles.map(r => (
                            <option key={r.id} value={r.id}>
                                {r.title}
                            </option>
                        ))}
                    </select>

                </div>

                <Button onClick={handleCreate}>
                    Создать
                </Button>
            </div>
            {message && (
                <div className="p-3 bg-green-100 text-green-700 rounded-md">
                    {message}
                </div>
            )}
            {/* USERS TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed text-sm">

                    <thead className="bg-slate-200 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-left w-16">ID</th>
                            <th className="p-3 text-left w-40">Login</th>
                            <th className="p-3 text-left w-40">Nickname</th>
                            <th className="p-3 text-left w-40">Role</th>
                            <th className="p-3 text-left w-32">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(user => (
                            <tr
                                key={user.id}
                                className="border-b border-slate-200 dark:border-slate-700"
                            >
                                <td className="p-3">{user.id}</td>

                                <td className="p-3">
                                    {user.login}
                                </td>

                                <td className="p-3">
                                    <Input
                                        defaultValue={user.nickname ?? ""}
                                        className="w-full"
                                        onBlur={(e) =>
                                            UsersService.update(user.id, {
                                                nickname: e.target.value
                                            }).then(loadAll)
                                        }
                                    />
                                </td>

                                <td className="p-3">
                                    <select
                                        className="
                                w-full
                                rounded-md
                                px-2 py-1
                                bg-white dark:bg-slate-900
                                text-slate-900 dark:text-slate-100
                                border border-slate-300 dark:border-slate-700
                            "
                                        defaultValue={
                                            roles.find(r => r.title === user.role)?.id
                                        }
                                        onChange={(e) =>
                                            handleRoleChange(user.id, Number(e.target.value))
                                        }
                                    >
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.title}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td className="p-3">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    )
}