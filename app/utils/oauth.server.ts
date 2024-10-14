import {commitSession, getSession} from './session.server';
import AuthRepository from "~/repositories/auth.repository";

export const checkAndRefreshAccessToken = async (request: Request) => {
    const session = await getSession(request);
    const accessToken = session.get("access_token");
    const refreshToken = session.get("refresh_token");
    const tokenExpiration = session.get("token_expiration");
    const TOKEN_REFRESH_THRESHOLD = 60; // 1 minute

    if (!accessToken || !tokenExpiration) {
        return {valid: false};
    }

    const currentTime = Date.now();
    const timeUntilExpiration = tokenExpiration - currentTime;

    if (timeUntilExpiration > TOKEN_REFRESH_THRESHOLD) {
        return {valid: true, accessToken};
    }

    if (!refreshToken) {
        return {valid: false};
    }

    try {
        const response = await AuthRepository().refreshToken(refreshToken)

        const newAccessToken = response.data.access_token;
        const newExpirationTime = Date.now() + response.data.expires_in * 1000;

        session.set("access_token", newAccessToken);
        session.set("token_expiration", newExpirationTime);

        return {
            valid: true,
            accessToken: newAccessToken,
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        };
    } catch (error) {
        console.error("Error refreshing token:", error);
        return {valid: false};
    }

};