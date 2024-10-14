import axios from "axios";
import Token from "~/types/token.type";

export default function AuthRepository() {
    const serverUrl = process.env.SERVER_URL;
    const appUrl = process.env.APP_URL;
    const clientId = process.env.SERVER_CLIENT_ID;

    const createToken = (code: string, codeVerifier: string) => {
        return axios.post<Token>(`${serverUrl}/oauth/token`, {
            client_id: clientId,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: `${appUrl}/callback`,
            code_verifier: codeVerifier,
        })
    }

    const refreshToken = (refreshToken: string) => {
        return axios.post<Token>(`${serverUrl}/oauth/token`, {
            client_id: clientId,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        })
    }

    return {createToken, refreshToken}
}