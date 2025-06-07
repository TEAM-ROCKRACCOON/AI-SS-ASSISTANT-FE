import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";

type Routine = {
    id: number;
    task: string;
    day: string;
    time: string;
};

export default function SchedulePreviewPage() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // 예시 데이터, 실제로는 API 등에서 받아올 수 있음
        const exampleRoutines: Routine[] = [
            { id: 1, task: "화장실 청소", day: "월요일", time: "오전 9시" },
            { id: 2, task: "거실 청소", day: "수요일", time: "오후 2시" },
            { id: 3, task: "침실 정리", day: "금요일", time: "오전 10시" },
        ];
        setRoutines(exampleRoutines);
    }, []);

    const handleConfirm = () => {
        // 루틴 저장 후 대시보드 등으로 이동
        navigate("/dashboard");
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">청소 루틴 미리보기</h1>
            <div className="space-y-4">
                {routines.map((routine) => (
                    <Card key={routine.id}>
                        <CardContent>
                            <p className="font-medium">{routine.task}</p>
                            <p className="text-gray-500">
                                {routine.day}, {routine.time}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <button
                onClick={handleConfirm}
                className="mt-6 w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600"
            >
                루틴 확정하기
            </button>
        </div>
    );
}
