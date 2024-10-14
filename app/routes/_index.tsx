import {MetaFunction} from "@remix-run/node";
import {Link} from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        {title: "Oauth Authorization code (PKCE) + Remix (Sessions)"},
        {name: "description", content: "Example project"},
    ];
};

export default function Index() {


    return (
        <main className={"flex flex-col justify-center items-center"}>

            <div>Inicio</div>
            <Link to={"/login"}>Iniciar sesión</Link>
            <Link className={"px-4 bg-indigo-600"} to={"/home"}>Home</Link>
        </main>
    );
}
