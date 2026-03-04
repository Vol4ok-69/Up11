"use client"

import { useEffect, useState } from "react"
import {
    ApplicationStatusHistoryService,
    ApplicationStatusHistoryReadDto
} from "@/lib/services/application-status-history.service"
import {
    TournamentApplicationsService
} from "@/lib/services/tournament-applications.service"

export default function TournamentApplicationStatusHistoryTab() {
    const [history, setHistory] = useState<ApplicationStatusHistoryReadDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filterApplicationId, setFilterApplicationId] = useState<number>(0)
    const [allApplications, setAllApplications] = useState<any[]>([])

    useEffect(() => {
        loadAll()
    }, [])

    async function loadAll() {
        try {
            setError(null)
            const [historyData, applicationsData] = await Promise.all([
                ApplicationStatusHistoryService.getAll(),
                TournamentApplicationsService.getAll()
            ])
            console.log('История статусов заявок:', historyData)
            console.log('Заявки:', applicationsData)
            setHistory(historyData)
            setAllApplications(applicationsData)
        } catch (e: any) {
            setError(e.message)
            console.error('Ошибка при загрузке:', e)
        } finally {
            setLoading(false)
        }
    }

    const enrichedHistory = history.map((h, idx) => {
        const app = allApplications[idx]
        return {
            ...h,
            tournament: app?.tournament || '-',
            team: app?.team || '-',
            applicationId: app?.id || 0,
            index: idx
        }
    })

    const filteredHistory = filterApplicationId === 0 
        ? enrichedHistory 
        : enrichedHistory.filter(h => h.applicationId === filterApplicationId)

    if (loading) return <p>Загрузка...</p>
    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div className="space-y-6">

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-3">
                <h3 className="font-semibold">Фильтр по заявке</h3>

                <select
                    value={filterApplicationId}
                    onChange={(e) => setFilterApplicationId(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900"
                >
                    <option value={0}>Показать всю историю</option>
                    {allApplications.map(app => (
                        <option key={app.id} value={app.id}>
                            #{app.id} - {app.tournament} ({app.team})
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed text-sm">
                    <thead className="bg-slate-200 dark:bg-slate-800">
                        <tr>
                            <th className="p-3 text-left w-16">ID</th>
                            <th className="p-3 text-left w-20">Заявка</th>
                            <th className="p-3 text-left w-28">Турнир</th>
                            <th className="p-3 text-left w-28">Команда</th>
                            <th className="p-3 text-left w-40">Переход статуса</th>
                            <th className="p-3 text-left w-32">Дата изменения</th>
                            <th className="p-3 text-left w-24">Изменил</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((record) => (
                                <tr key={`${record.index}`} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                                    <td className="p-3 text-sm">{record.applicationId}</td>
                                    <td className="p-3 text-sm">#{record.applicationId}</td>
                                    <td className="p-3 text-sm">{record.tournament}</td>
                                    <td className="p-3 text-sm">{record.team}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                                                {record.oldStatus}
                                            </span>
                                            <span className="text-xs">→</span>
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                                {record.newStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-sm">
                                        {new Date(record.changedAt).toLocaleString('ru-RU')}
                                    </td>
                                    <td className="p-3 text-sm">{record.changedBy || "-"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-6 text-center text-slate-500">
                                    История не найдена
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
}
