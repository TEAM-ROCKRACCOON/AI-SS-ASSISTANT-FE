// src/hooks/useProfile.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getProfile,
    updateProfile,
    logout,
    withdraw,
    type ProfileData,
    type SimpleRes,
} from "@/entities/user/api";

const KEY = ["user", "profile"] as const;

/** 프로필 조회 */
export const useProfile = () =>
    useQuery<ProfileData>({
        queryKey: KEY,
        queryFn: getProfile, // ✅ 래퍼 해제된 ProfileData를 그대로 반환
        staleTime: 60_000,
    });

/** 프로필 수정 */
export const useUpdateProfile = () => {
    const qc = useQueryClient();
    return useMutation<SimpleRes, unknown, { nickname: string; email: string }>({
        mutationFn: updateProfile,
        onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    });
};

/** 로그아웃 */
export const useLogout = () =>
    useMutation<SimpleRes>({
        mutationFn: logout,
    });

/** 회원 탈퇴 */
export const useWithdraw = () =>
    useMutation<SimpleRes>({
        mutationFn: withdraw,
    });
