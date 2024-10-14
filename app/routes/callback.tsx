import {LoaderFunctionArgs, redirect} from '@remix-run/node';
import {commitSession, getSession} from '~/utils/session.server';
import AuthRepository from "~/repositories/auth.repository";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const authorizationCode = url.searchParams.get("code");

    const session = await getSession(request);
    const codeVerifier = session.get("code_verifier");

    if (!authorizationCode || !codeVerifier) {
        throw new Error("Authorization code or code verifier missing");
    }

    try {
        const response = await AuthRepository().createToken(authorizationCode, codeVerifier)

        const {access_token, refresh_token, expires_in} = response.data;
        const expirationTime = Date.now() + expires_in * 1000;

        session.set("access_token", access_token);
        session.set("refresh_token", refresh_token);
        session.set("token_expiration", expirationTime);

        return redirect("/home", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } catch (error) {
        console.error("Error exchanging authorization code:", error);
        throw new Error("Failed to exchange authorization code for tokens");
    }
};
