"use client";
import { createContext, useContext, type ReactNode } from "react";

export type RestaurantCtx = { restaurant: any; menu: any[] };

const RestaurantContext = createContext<RestaurantCtx | null>(null);

export function useRestaurant() {
    const ctx = useContext(RestaurantContext);
    if (!ctx) throw new Error("useRestaurant must be used within <RestaurantProvider>");
    return ctx;
}

export function RestaurantProvider({
    value,
    children,
}: { value: RestaurantCtx; children: ReactNode }) {
    return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>;
}
