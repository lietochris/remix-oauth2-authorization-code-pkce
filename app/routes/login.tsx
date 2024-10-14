import {LoaderFunctionArgs, redirect} from "@remix-run/node";
import {generateCodeChallenge, generateCodeVerifier} from '~/utils/pkce';
import {commitSession, getSession} from '~/utils/session.server';
import {checkAndRefreshAccessToken} from "~/utils/oauth.server";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const {valid} = await checkAndRefreshAccessToken(request);
    if (valid) {
        return redirect("/home");
    }

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const session = await getSession(request);
    session.set("code_verifier", codeVerifier);

    const params = new URLSearchParams({
        client_id: process.env.SERVER_CLIENT_ID ?? "",
        response_type: "code",
        redirect_uri: `${process.env.APP_URL}/callback`,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        prompt: "login"
    });

    return redirect(`${process.env.SERVER_URL}/oauth/authorize?${params.toString()}`, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
};