export default function handleTextareaResize(e: any) {
    e.target.style.height = ''
    e.target.style.height = e.target.scrollHeight + 'px'
}