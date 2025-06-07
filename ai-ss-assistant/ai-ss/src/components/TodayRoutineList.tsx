// components/TodayRoutineList.tsx
import React, { useState } from "react";

type Task = {
    name: string;
    description: string;
    done: boolean;
};

export const TodayRoutineList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const [checked, setChecked] = useState(tasks.map((t) => t.done));

    const toggle = (index: number) => {
        const newChecked = [...checked];
        newChecked[index] = !newChecked[index];
        setChecked(newChecked);
    };

    return (
        <div className="space-y-2 w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">🧹 오늘의 청소 루틴</h2>
            {tasks.map((task, idx) => (
                <label
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white shadow border"
                >
                    <div>
                        <p className="font-medium">{task.name}</p>
                        <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={checked[idx]}
                        onChange={() => toggle(idx)}
                        className="w-5 h-5"
                    />
                </label>
            ))}
        </div>
    );
};
