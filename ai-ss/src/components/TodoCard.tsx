// components/TodoCard.tsx

import { Routine } from "@/hooks/useDashboardData";

interface Props {
    routine: Routine;
    onToggle?: (id: string) => void;
}

export const TodoCard: React.FC<Props> = ({ routine, onToggle }) => {
    return (
        <div
            className={`p-4 rounded-lg border shadow cursor-pointer ${
                routine.completed ? "bg-green-50 border-green-300" : "bg-white"
            }`}
            onClick={() => onToggle && onToggle(routine.id)}
        >
            <h2 className="text-lg font-medium flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={routine.completed}
                    readOnly
                    className="w-4 h-4"
                />
                {routine.title}
            </h2>
            <p>{routine.completed ? "완료됨 ✅" : "미완료 ❌"}</p>
        </div>
    );
};
