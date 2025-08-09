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

export const useProfile = () =>
    useQuery<ProfileData>({
        queryKey: KEY,
        queryFn: getProfile,
    });

export const useUpdateProfile = () => {
    const qc = useQueryClient();
    return useMutation<SimpleRes, unknown, { nickname: string; email: string }>({
        mutationFn: updateProfile,
        onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    });
};

export const useLogout = () =>
    useMutation<SimpleRes>({
        mutationFn: logout,
    });

export const useWithdraw = () =>
    useMutation<SimpleRes>({
        mutationFn: withdraw,
    });
