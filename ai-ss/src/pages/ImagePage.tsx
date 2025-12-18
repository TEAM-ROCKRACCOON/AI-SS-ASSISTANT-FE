// src/pages/FeedbackPage.tsx
import React, { useCallback, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

// import roomAfter from "../assets/room_after.jpg";

const FeedbackPage: React.FC = () => {
    const MIN_WIDTH = 1;
    const MIN_HEIGHT = 1;
    const MAX_WIDTH = 1;
    const MAX_HEIGHT = 1;

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [resolutionError, setResolutionError] = useState<string | null>(null);

    const handleFile = useCallback(
        (f: File) => {
            // 새 파일 업로드 시 결과/에러 리셋
            setResultUrl(null);
            setResolutionError(null);

            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                if (typeof result !== "string") return;

                const img = new Image();
                img.onload = () => {
                    const { width, height } = img;

                    if (width < MIN_WIDTH || height < MIN_HEIGHT || width > MAX_WIDTH || height > MAX_HEIGHT) {
                        setFile(null);
                        setPreviewUrl(null);
                        setResolutionError(
                            `이미지 해상도가 맞지 않습니다. 512-2048px 범위로 조절해서 다시 업로드해주세요.`
                        );
                        return;
                    }

                    setFile(f);
                    setPreviewUrl(result);
                };

                img.src = result;
            };

            reader.readAsDataURL(f);
        },
        [MIN_WIDTH, MIN_HEIGHT, MAX_WIDTH, MAX_HEIGHT]
    );

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        handleFile(f);

        // 같은 파일을 다시 올려도 change가 발생하도록 초기화(선택사항이지만 편함)
        e.currentTarget.value = "";
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const f = e.dataTransfer.files?.[0];
        if (!f) return;
        handleFile(f);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onClickUpload = () => {
        document.getElementById("room-image-input")?.click();
    };

    // 데모용: 결과 생성 로직은 비워둠
    const onClickTransform = async () => {
        if (!file) return;
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            // setResultUrl(roomAfter);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-6">
                {/* 상단 타이틀 */}
                <header className="mb-6">
                    <h1 className="text-lg font-semibold text-slate-900">
                        Image <span className="text-slate-400">&gt;</span>
                    </h1>
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                        지금 방 사진을 올려보세요. AI가 청소 후 모습을 예측해드려요!
                    </p>
                </header>

                {/* 메인 레이아웃 */}
                <div className="grid gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-start">
                    {/* 업로드 영역 */}
                    <Card className="border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 p-6 md:p-7">
                            <div>
                                <p className="mt-1 text-xs md:text-sm text-slate-500">
                                    실내 전경이 잘 나오도록 찍어주면 AI가 더 잘 예측할 수 있어요.
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    업로드 후 아래 버튼을 눌러 예측 결과를 확인해보세요.
                                </p>
                            </div>

                            <div
                                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-xs text-slate-500 transition hover:bg-slate-100"
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                onClick={onClickUpload}
                            >
                                <input
                                    id="room-image-input"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    className="hidden"
                                    onChange={onFileInputChange}
                                />

                                <div className="mb-2 text-sm font-medium text-slate-700">
                                    Click to upload or drag and drop
                                </div>
                                <div className="text-[11px] text-slate-500">
                                    JPG, JPEG, PNG / 1MB 이하 권장
                                </div>

                                {file && (
                                    <div className="mt-3 text-[11px] text-slate-600">
                                        선택된 파일:{" "}
                                        <span className="font-medium break-all">{file.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* 해상도 에러 메시지 */}
                            {resolutionError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                                    {resolutionError}
                                </div>
                            )}

                            <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <Button
                                    type="button"
                                    disabled={!file || isLoading}
                                    className="mt-1 w-full rounded-full px-4 py-2 text-sm font-medium sm:mt-0 sm:w-auto"
                                    onClick={onClickTransform}
                                >
                                    {isLoading ? "변환 중..." : "AI로 변환하기"}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* 결과 영역 */}
                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-semibold text-slate-900">
                                Result <span className="text-slate-400">&gt;</span>
                            </h1>
                            {resultUrl && (
                                <span className="text-[11px] text-slate-500">
                                    실제 청소 결과와는 차이가 있을 수 있어요.
                                </span>
                            )}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {/* Before 카드 */}
                            <Card className="border border-slate-200 bg-white shadow-sm">
                                <div className="flex flex-col p-3 md:p-4">
                                    <p className="mb-2 text-xs font-semibold text-slate-800 md:text-sm">
                                        Before
                                    </p>
                                    <div className="aspect-[4/3] overflow-hidden rounded-md bg-slate-50">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Before room"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[11px] leading-4 text-slate-400">
                                                방 사진을 업로드하면
                                                <br />
                                                여기에 원본이 보여요
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* After 카드 */}
                            <Card className="border border-slate-200 bg-white shadow-sm">
                                <div className="flex flex-col p-3 md:p-4">
                                    <p className="mb-2 text-xs font-semibold text-slate-800 md:text-sm">
                                        AI Predicted After
                                    </p>
                                    <div className="aspect-[4/3] overflow-hidden rounded-md bg-slate-50">
                                        {resultUrl ? (
                                            <img
                                                src={resultUrl}
                                                alt="AI predicted cleaned room"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[11px] leading-4 text-slate-400">
                                                AI 예측 결과가
                                                <br />
                                                여기에 표시돼요
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
