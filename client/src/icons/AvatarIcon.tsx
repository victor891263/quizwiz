export default function AvatarIcon({ className }: { className?: string }) {
    return (
        <div className={'flex items-end justify-center rounded-full bg-slate-100 overflow-hidden ' + className}>
            <svg className='h-3/4 w-3/4' fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 128"><circle cx="48" cy="32" r="32"/><path d="M64,74.67a48.05,48.05,0,0,0-48,48A5.33,5.33,0,0,0,21.33,128h85.34a5.33,5.33,0,0,0,5.33-5.33A48.05,48.05,0,0,0,64,74.67Z" transform="translate(-16)"/></svg>
        </div>
    )
}