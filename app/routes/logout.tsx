import {LoaderFunctionArgs, redirect} from "@remix-run/node";
import {destroySession, getSession} from "~/utils/session.server";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const session = await getSession(request);
    return redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
};