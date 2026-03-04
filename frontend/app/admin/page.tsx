"use client"

import { useState } from "react"
import UsersTab from "@/app/admin/components/UsersTab"
import RolesTab from "@/app/admin/components/RolesTab"
import ApplicationStatusesTab from "@/app/admin/components/ApplicationStatusesTab"
import TournamentStatusesTab from "@/app/admin/components/TournamentStatusesTab"
import TournamentSystemsTab from "@/app/admin/components/TournamentSystemsTab"
import MatchStagesTab from "@/app/admin/components/MatchStagesTab"
import TournamentBracketTypesTab from "@/app/admin/components/TournamentBracketTypesTab"
import DisciplinesTab from "@/app/admin/components/DisciplinesTab"
import TeamsTab from "@/app/admin/components/TeamsTab"
import TeamMembersTab from "@/app/admin/components/TeamMembersTab"
import TournamentsTab from "@/app/admin/components/TournamentsTab"
import TournamentApplicationsTab from "@/app/admin/components/TournamentApplicationsTab"
import TournamentParticipantsTab from "@/app/admin/components/TournamentParticipantsTab"
import MatchesTab from "@/app/admin/components/MatchesTab"
import MatchResultsTab from "@/app/admin/components/MatchResultsTab"
import TournamentBracketsTab from "@/app/admin/components/TournamentBracketsTab"
import TournamentApplicationStatusHistoryTab from "@/app/admin/components/TournamentApplicationStatusHistoryTab"
export default function AdminPage() {
    const tables = [
        "Roles",
        "Users",
        "Disciplines",
        "Teams",
        "TeamMembers",
        "TournamentStatuses",
        "TournamentSystems",
        "Tournaments",
        "ApplicationStatuses",
        "TournamentApplications",
        "TournamentParticipants",
        "MatchStages",
        "Matches",
        "MatchResults",
        "TournamentApplicationStatusHistory",
        "TournamentBracketTypes",
        "TournamentBrackets",
    ]

    const [activeTable, setActiveTable] = useState("Roles")

    return (
        <div className="min-h-screen p-6 bg-linear-to-br
            from-slate-100 via-white to-slate-200
            dark:from-slate-950 dark:via-slate-900 dark:to-black">

            <h1 className="text-2xl font-bold mb-6
                text-slate-800 dark:text-slate-100">
                Админ панель
            </h1>

            <div className="max-w-md mb-6">
                <select
                    value={activeTable}
                    onChange={(e) => setActiveTable(e.target.value)}
                    className="w-full rounded-xl bg-white dark:bg-slate-900
                        border border-slate-300 dark:border-slate-700
                        px-4 py-3 text-slate-800 dark:text-slate-100
                        shadow-sm focus:outline-none focus:ring-2
                        focus:ring-purple-500 transition"
                >
                    {tables.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-md">

                {activeTable === "Users" && <UsersTab />}
                {activeTable === "Roles" && <RolesTab />}
                {activeTable === "Disciplines" && <DisciplinesTab />}
                {activeTable === "Teams" && <TeamsTab />}
                {activeTable === "TeamMembers" && <TeamMembersTab />}
                {activeTable === "Tournaments" && <TournamentsTab />}
                {activeTable === "TournamentApplications" && <TournamentApplicationsTab />}
                {activeTable === "ApplicationStatuses" && <ApplicationStatusesTab />}
                {activeTable === "TournamentStatuses" && <TournamentStatusesTab />}
                {activeTable === "TournamentSystems" && <TournamentSystemsTab />}
                {activeTable === "MatchStages" && <MatchStagesTab />}
                {activeTable === "TournamentBracketTypes" && <TournamentBracketTypesTab />}
                {activeTable === "TournamentParticipants" && <TournamentParticipantsTab />}
                {activeTable === "Matches" && <MatchesTab />}
                {activeTable === "MatchResults" && <MatchResultsTab />}
                {activeTable === "TournamentBrackets" && <TournamentBracketsTab />}
                {activeTable === "TournamentApplicationStatusHistory" && <TournamentApplicationStatusHistoryTab />}
            </div>
        </div>
    )
}