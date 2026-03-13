import { serialize } from "cookie";

export function createDevSession(devId: string) {
    return serialize("developer_session", devId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
    });
}

export function clearDevSession() {
    return serialize("developer_session", "", {
        path: "/",
        maxAge: 0,
    });
}

export function createClientSession(clientId: string) {
    return serialize("client_session", clientId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
    });
}

export function clearClientSession() {
    return serialize("client_session", "", {
        path: "/",
        maxAge: 0,
    });
}

export function createAdminSession() {
    return serialize("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
    });
}

export function clearAdminSession() {
    return serialize("admin_session", "", {
        path: "/",
        maxAge: 0,
    });
}
