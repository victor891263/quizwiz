export default function Spinner({className}: {className: string}) {
    return (
        <div className={"animate-spin inline-block border-current border-t-transparent rounded-full " + (className || '')}></div>
    )
}