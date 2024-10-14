import axios from "axios";
import User from "~/types/user.type";

export default function UserRepository() {
    const serverUrl = process.env.SERVER_URL;

    const me = (accessToken: string) => {
        return axios.get<User>(`${serverUrl}/api/user`, {headers: {Authorization: `Bearer ${accessToken}`}})
    }

    return {me}
}