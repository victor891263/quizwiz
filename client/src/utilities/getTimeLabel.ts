export default function getTimeLabel(time: number): string {
    let timeLabel = 's';
    let elapsedTime = Math.floor((new Date().getTime() - new Date(time).getTime()) / 1000);
    if (60 < elapsedTime && elapsedTime < 3600) {
        elapsedTime = Math.floor(elapsedTime / 60);
        timeLabel = 'min';
    }
    if (3600 < elapsedTime && elapsedTime < 86400) {
        elapsedTime = Math.floor(elapsedTime / 3600);
        timeLabel = 'h';
    }
    if (86400 < elapsedTime) {
        elapsedTime = Math.floor(elapsedTime / 86400);
        timeLabel = 'd';
    }
    return `${elapsedTime}${timeLabel}`
}