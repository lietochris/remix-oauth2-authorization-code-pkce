import {json, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {Link, useLoaderData} from "@remix-run/react";
import UserRepository from "~/repositories/user.repository";
import {checkAndRefreshAccessToken} from "~/utils/oauth.server";
import User from "~/types/user.type";


export const loader = async ({request}: LoaderFunctionArgs) => {
    const {valid, accessToken} = await checkAndRefreshAccessToken(request);
    if (!valid) {
        return redirect("/login");
    }

    const {data: user} = await UserRepository().me(accessToken);

    return json({user});
};

export default function Home() {
    const {user} = useLoaderData<{ user: User }>()

    return (
        <main>
            <div>Home</div>
            <div className="">{JSON.stringify(user)}</div>
            <Link to={"/logout"}>Cerrar sesión</Link>
        </main>

    )
}