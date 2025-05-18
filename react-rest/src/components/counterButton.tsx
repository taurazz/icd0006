"use client";

import { useState } from "react";

interface ICounterProps {
    label: string
    count: number
}

export default function CounterButton(props: ICounterProps) {
    const [count, setCount] = useState(props.count);
    return (
        <button 
        className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition"
        onClick={() => {setCount(count + 1)}}
        >
            { props.label }: { count }
        </button>
    )
}