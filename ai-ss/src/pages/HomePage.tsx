// pages/HomePage.tsx

import React from "react";

export default function HomePage() {

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* 상단 캐릭터 + 안내 */}
            <main className="flex-grow flex flex-col items-center justify-center p-6">
                <img
                    src="/character.png"
                    alt="메인 캐릭터"
                    className="w-48 h-48 mb-6"
                />
                <h1 className="text-2xl font-bold mb-2">안녕하세요, AI쓱싹비서입니다!</h1>
                <p className="text-center text-gray-600 max-w-sm">
                    오늘도 청소 루틴을 꾸준히 실천하며
                    <br/>
                    깨끗한 하루를 만들어봐요.
                    <br/>
                    하단 메뉴를 눌러 다양한 기능을 이용해보세요.
                </p>
            </main>
        </div>
    );
}
