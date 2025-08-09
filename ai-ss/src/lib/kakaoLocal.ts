// src/lib/kakaoLocal.ts
export type KakaoAddr = {
    roadAddressName: string; // 도로명 주소(없으면 지번 주소 fallback)
    latitude: number;
    longitude: number;      // 스펙 맞춰 이름 유지
};

export async function searchAddressKakao(query: string): Promise<KakaoAddr[]> {
    if (!query.trim()) return [];
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
        headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
    });
    if (!res.ok) throw new Error("주소 검색 실패");
    const json = await res.json();
    const docs = json?.documents ?? [];

    return docs.map((d: any) => {
        // d.road_address?.address_name 이 있으면 도로명, 없으면 d.address?.address_name 사용
        const road = d.road_address?.address_name || d.address?.address_name || "";
        const x = Number(d.x ?? d.road_address?.x ?? d.address?.x); // 경도
        const y = Number(d.y ?? d.road_address?.y ?? d.address?.y); // 위도
        return {
            roadAddressName: road,
            longitude: x, // 스펙 key 유지
            latitude: y,
        } as KakaoAddr;
    });
}
