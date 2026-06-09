import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from "react";

dayjs.extend(duration);

interface ActiveCounterProps {
    last_time: string;
}

export function ActiveCounter({ last_time }: ActiveCounterProps) {
    const [elapsed, setElapsed] = useState("");

    useEffect(() => {
        function update() {
            const diff = dayjs().diff(dayjs(last_time));
            const dur = dayjs.duration(diff);
            setElapsed(
                `${String(Math.floor(dur.asHours())).padStart(2, "0")}:${String(dur.minutes()).padStart(2, "0")}:${String(dur.seconds()).padStart(2, "0")}`
            );
        }

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [last_time]);

    return <p className="text-main-text">Ativo Por: <span className="text-accent">{elapsed}</span></p>;
}