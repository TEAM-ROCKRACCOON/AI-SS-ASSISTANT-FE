// src/pages/onboarding/AddressPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerAddress } from "@/entities/user/api";
import { searchAddressKakao, type KakaoAddr } from "@/lib/kakaoLocal";

export default function AddressPage() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<KakaoAddr[]>([]);
    const [roadAddressName, setRoadAddressName] = useState("");
    const [placeDetailAddress, setPlaceDetailAddress] = useState("");
    const [latitude, setLatitude] = useState<string>("");    // 입력은 문자열, 보낼 때 number 변환
    const [longitude, setLongitude] = useState<string>(""); // 스펙 표기 유지

    const m = useMutation({
        mutationFn: registerAddress,
        onSuccess: () => {
            alert("주소가 등록되었습니다.");
            navigate("/survey");
        },
        onError: (err: unknown) => {
            const msg = err instanceof Error ? err.message : "주소 등록에 실패했습니다.";
            alert(msg);
        },
    });

    const handleSearch = async () => {
        try {
            const list = await searchAddressKakao(query);
            setResults(list);
            if (list.length === 0) alert("검색 결과가 없습니다.");
        } catch (e) {
            alert("주소 검색에 실패했습니다.");
            console.error(e);
        }
    };

    const pick = (item: KakaoAddr) => {
        setRoadAddressName(item.roadAddressName);
        setLatitude(String(item.latitude));
        setLongitude(String(item.longitude));
        setResults([]); // 목록 접기
        // 상세주소는 사용자가 입력
    };

    const submit = () => {
        if (!roadAddressName.trim() || !placeDetailAddress.trim()) {
            alert("도로명 주소와 상세주소를 입력해주세요.");
            return;
        }
        const lat = Number(latitude);
        const lon = Number(longitude);
        if (Number.isNaN(lat) || Number.isNaN(lon)) {
            alert("위도/경도가 올바르지 않습니다.");
            return;
        }
        m.mutate({
            roadAddressName: roadAddressName.trim(),
            placeDetailAddress: placeDetailAddress.trim(),
            latitude: lat,
            longitude: lon, // 스펙 유지
        });
    };

    return (
        <div className="min-h-screen flex flex-col gap-6 px-6 py-10 bg-white">
            <div>
                <h2 className="text-2xl font-semibold mb-2">어디에 사시나요?</h2>
                <p className="text-gray-500 mb-4">날씨/추천 시간대에 활용돼요</p>

                {/* 주소 검색 */}
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        placeholder="예: 서울 마포구 상암동 000"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 p-3 border rounded-xl"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 bg-gray-800 text-white rounded-xl"
                        disabled={m.isPending}
                    >
                        검색
                    </button>
                </div>

                {results.length > 0 && (
                    <ul className="border rounded-xl divide-y max-h-56 overflow-auto mb-4">
                        {results.map((r, i) => (
                            <li
                                key={`${r.roadAddressName}-${i}`}
                                className="p-3 cursor-pointer hover:bg-gray-50"
                                onClick={() => pick(r)}
                            >
                                <div className="font-medium">{r.roadAddressName}</div>
                                <div className="text-xs text-gray-500">
                                    위도 {r.latitude} / 경도 {r.longitude}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* 확정 입력 폼 */}
                <div className="space-y-3">
                    <div>
                        <label className="block mb-1 font-medium">도로명 주소</label>
                        <input
                            type="text"
                            value={roadAddressName}
                            onChange={(e) => setRoadAddressName(e.target.value)}
                            className="w-full p-3 border rounded-xl"
                            placeholder="도로명 주소"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">상세 주소</label>
                        <input
                            type="text"
                            value={placeDetailAddress}
                            onChange={(e) => setPlaceDetailAddress(e.target.value)}
                            className="w-full p-3 border rounded-xl"
                            placeholder="동/호수 등"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block mb-1 font-medium">위도(latitude)</label>
                            <input
                                type="text"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                className="w-full p-3 border rounded-xl"
                                placeholder="예: 37.5665"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">경도(longitude)</label>
                            <input
                                type="text"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                className="w-full p-3 border rounded-xl"
                                placeholder="예: 126.9780"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={submit}
                disabled={m.isPending}
                className="mt-auto bg-blue-500 text-white text-lg font-medium py-4 rounded-xl hover:bg-blue-600 transition disabled:opacity-50"
            >
                {m.isPending ? "등록 중..." : "다음으로"}
            </button>
        </div>
    );
}
