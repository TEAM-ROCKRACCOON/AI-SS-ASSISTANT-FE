// src/lib/kakaoLocal.ts
export type KakaoAddr = {
    roadAddressName: string; // 도로명 주소(없으면 지번 주소 fallback)
    latitude: number;
    longitude: number; // 스펙 맞춰 이름 유지
};

export async function searchAddressKakao(query: string): Promise<KakaoAddr[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const USE_MSW =
        import.meta.env.VITE_USE_MSW === "true" || import.meta.env.DEV;
    const KAKAO_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

    // ✅ 목서버/개발 환경에서 실제 키가 없을 때 더미 데이터 반환
    if (USE_MSW && (!KAKAO_KEY || KAKAO_KEY === "여기에_실제_카카오_REST_API_KEY")) {
        console.warn(
            "[Mock] Kakao 주소 검색 대신 더미 주소를 반환합니다 (searchAddressKakao)"
        );
        return [
            {
                roadAddressName: "서울특별시 마포구 성암로 000",
                latitude: 37.579,
                longitude: 126.894,
            },
            {
                roadAddressName: "서울특별시 강남구 테헤란로 000",
                latitude: 37.498,
                longitude: 127.027,
            },
            {
                roadAddressName: "서울특별시 송파구 올림픽로 000",
                latitude: 37.514,
                longitude: 127.105,
            },
        ];
    }

    // ✅ 실제 Kakao API 호출
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        trimmed
    )}`;
    const res = await fetch(url, {
        headers: { Authorization: `KakaoAK ${KAKAO_KEY}` },
    });
    if (!res.ok) throw new Error("주소 검색 실패");

    const json = await res.json();
    const docs = json?.documents ?? [];

    return docs.map((d: any) => {
        // d.road_address?.address_name 이 있으면 도로명, 없으면 d.address?.address_name 사용
        const road =
            d.road_address?.address_name || d.address?.address_name || "";
        const x = Number(d.x ?? d.road_address?.x ?? d.address?.x); // 경도
        const y = Number(d.y ?? d.road_address?.y ?? d.address?.y); // 위도
        return {
            roadAddressName: road,
            longitude: x,
            latitude: y,
        } as KakaoAddr;
    });
}
