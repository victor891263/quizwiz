export default function handleAxiosError(error: any, callback: (msg: string) => void, timeout?: boolean) {
    if (error.response) {
        if (error.response.data && (typeof error.response.data === 'string') && error.response.data.includes('<pre>')) {
            callback(extractMsg(error.response.data))
        } else {
            callback(error.response.data)
        }
    } else if (error.request) {
        callback("Failed to connect to server")
    } else {
        callback(error.message)
    }
    if (timeout) {
        setTimeout(() => {
            callback('')
        }, 3000)
    }
}

function extractMsg(s: string) {
    const regex = /<pre>(.*?)<\/pre>/s
    const match = s.match(regex) as RegExpMatchArray
    return match[1]
}