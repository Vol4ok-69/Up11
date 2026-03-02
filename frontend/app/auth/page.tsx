"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiRequest } from "@/lib/api"
import { useRouter } from "next/navigation"


export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.target as HTMLFormElement)

    try {
      const result = await apiRequest("/api/Auth/login", "POST", {
        login: formData.get("login"),
        password: formData.get("password"),
      })

      localStorage.setItem("token", result.token)
      router.push("/")
    } catch (err: any) {
      if (err instanceof Error) {
        setMessage({ text: err.message, type: "error" })
      } else {
        setMessage({ text: "Произошла неизвестная ошибка", type: "error" })
      }
    } finally {
      setLoading(false)
    }
  }
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const login = formData.get("login")
    const password = formData.get("password")

    try {
      await apiRequest("/api/Auth/register", "POST", {
        login,
        email: formData.get("email"),
        nickname: formData.get("nickname") || null,
        password,
      })

      const result = await apiRequest("/api/Auth/login", "POST", {
        login,
        password,
      })

      localStorage.setItem("token", result.token)

      router.push("/")

    } catch (err: any) {
      if (err instanceof Error) {
        setMessage({ text: err.message, type: "error" })
      } else {
        setMessage({ text: "Произошла неизвестная ошибка", type: "error" })
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md backdrop-blur-sm 
           bg-white/80 dark:bg-slate-900/80 
           border border-white/20 dark:border-white/10
           shadow-xl transition-all duration-200">
        <CardContent className="p-8">

          <h1 className="text-2xl font-semibold text-center mb-2">
            Up11 Esports
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Система киберспортивной лиги
          </p>

          {message && (
            <div
              className={`mb-4 rounded-md p-3 text-sm ${message.type === "error"
                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}
            >
              {message.text}
            </div>
          )}
          <Tabs defaultValue="login" className="w-full">

            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  name="login"
                  placeholder="Логин"
                  className="focus-visible:ring-[var(--accent-purple)]"
                />
                <Input name="password" type="password" placeholder="Пароль" className="focus-visible:ring-[var(--accent-purple)]" />

                <Button
                  className="w-full bg-gradient-to-r
           from-[var(--accent-purple)]
           to-[var(--accent-cyan)]
           hover:opacity-90
           hover:shadow-[0_0_20px_rgba(218,112,214,0.4)]
           transition-all duration-200 shadow-md" type="submit" disabled={loading}
                >
                  {loading ? "Вход..." : "Войти"}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  name="login"
                  placeholder="Логин"
                  className="focus-visible:ring-[var(--accent-purple)]"
                />

                <Input
                  name="email"
                  placeholder="Email"
                  className="focus-visible:ring-[var(--accent-purple)]"
                />

                <Input
                  name="nickname"
                  placeholder="Игровой ник (необязательно)"
                  className="focus-visible:ring-[var(--accent-purple)]"
                />

                <Input
                  name="password"
                  type="password"
                  placeholder="Пароль"
                  className="focus-visible:ring-[var(--accent-purple)]"
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r
        from-[var(--accent-purple)]
        to-[var(--accent-cyan)]
        hover:opacity-90
        hover:shadow-[0_0_20px_rgba(218,112,214,0.4)]
        transition-all duration-200 shadow-md"
                >
                  {loading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </form>
            </TabsContent>

          </Tabs>

        </CardContent>
      </Card>
    </div>
  )
}
