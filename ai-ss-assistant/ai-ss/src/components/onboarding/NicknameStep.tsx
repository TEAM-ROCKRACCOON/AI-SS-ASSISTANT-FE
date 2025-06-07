// src/components/onboarding/NicknameStep.tsx
import { useState } from 'react'

const NicknameStep = ({ onNext }: { onNext: () => void }) => {
    const [nickname, setNickname] = useState('')

    const handleSubmit = () => {
        // TODO: 상태 저장 (Zustand 등)
        onNext()
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">닉네임을 입력해주세요</h2>
            <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <button onClick={handleSubmit} className="mt-4 btn btn-primary w-full">
                다음
            </button>
        </div>
    )
}
export default NicknameStep
