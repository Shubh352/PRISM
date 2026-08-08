export type UserRole = "Admin" | "HOD";

type TokenPayload = {
    sub?: string;
    role?: UserRole;
    exp?: number;
};


export function getToken(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem(
        "prism_access_token"
    );
}


export function getCurrentRole(): UserRole | null {

    const token = getToken();

    if (!token) {
        return null;
    }

    try {

        const payload = token.split(".")[1];

        const decodedPayload = JSON.parse(
            atob(payload)
        ) as TokenPayload;

        if (
            decodedPayload.role === "Admin" ||
            decodedPayload.role === "HOD"
        ) {
            return decodedPayload.role;
        }

        return null;

    } catch {

        return null;
    }
}


export function isAdmin(): boolean {
    return getCurrentRole() === "Admin";
}


export function isHOD(): boolean {
    return getCurrentRole() === "HOD";
}