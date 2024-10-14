import {createCookieSessionStorage, Session, SessionData} from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "session",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 3600, // Expira en 1 hora
        secrets: [process.env.SESSION_SECRET!],
    },
});

export const getSession = (request: Request) => {
    return sessionStorage.getSession(request.headers.get("Cookie"));
};

export const destroySession = (session: Session<SessionData, SessionData>) => {
    return sessionStorage.destroySession(session);
};

export const commitSession = (session: Session<SessionData, SessionData>) => {
    return sessionStorage.commitSession(session);
};
