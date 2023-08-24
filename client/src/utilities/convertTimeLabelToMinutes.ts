export default function convertTimeLabelToMinutes(timeString: string) {
    const [minutesStr, secondsStr] = timeString.split(':')
    const minutes = parseInt(minutesStr, 10)
    const seconds = parseInt(secondsStr, 10)
    const fractionOfMinute = seconds / 60
    return minutes + fractionOfMinute
}