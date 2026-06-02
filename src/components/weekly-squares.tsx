

export function WeeklySquares(){
    return(
        <div className="flex items-center gap-1.5 justify-center">
            <Square />
            <Square isFilled />
            <Square />
            <Square />
            <Square  isFilled/>
            <Square />
            <Square />
        </div>
    )
}
interface SquareProps{
    isFilled?: boolean
}
function Square(props: SquareProps){
    return(
        <div className={`size-3 border ${!props.isFilled ? "border-main-text" : "bg-accent border-accent" }`}/>
    )
}