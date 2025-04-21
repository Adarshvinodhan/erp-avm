import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

function TimeButton() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })

  return (
    <Button variant="ghost" className="text-lg font-mono pointer-events-none">
      {formatTime(time)}
    </Button>
  )
}

export default TimeButton;