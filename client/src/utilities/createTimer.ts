export default function createTimer(minutes: number, intervalCallback: (label: string) => void, finalCallback: () => void) {
    let seconds = minutes * 60

    const interval = setInterval(() => {
        const minutesRemaining = Math.floor(seconds / 60)
        const secondsRemaining = seconds % 60

        const formattedMinutes = String(minutesRemaining).padStart(2, '0')
        const formattedSeconds = String(secondsRemaining).padStart(2, '0')

        intervalCallback(`${formattedMinutes}:${formattedSeconds}`)

        if (seconds === 0) {
            clearInterval(interval)
            finalCallback()
        }

        seconds--
    }, 1000)
}