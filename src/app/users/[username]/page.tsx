'use client';

import {useRouter, useParams} from "next/navigation";
import { Octokit } from "@octokit/core";
import {useState, useEffect} from "react";
import Link from "next/link";

const UserPage = () => {

    const router = useRouter();

    const { username } = useParams();

    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<any>({});

    const fetchUser = async () => {
        const octokit = new Octokit();

        try {
            const response = await octokit.request('GET /users/{username}', {
                username: username as string,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            })
            setUser(response.data);
            console.log(response.data);

        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser()
    }, []);

    return (
        <div className={"max-w-2xl mx-auto p-6"}>

            <Link className={"inline-flex mb-6"} href={"/users"}>Go Back</Link>

            {loading ? (
                    <p>Data is loading...</p>
                ) : (
                    <div className={"p-4 border border-gray-300 rounded-lg"}>
                        <h2>Name: {user.name || "Name is missing"}</h2>
                        {user.bio && <p>Bio: {user.bio}</p>}
                        {user.location && <p>Location: {user.location}</p>}
                        <p>Followers: {user.followers}</p>
                        <p>Following: {user.following}</p>
                    </div>
            )}
        </div>
    )
}

export default UserPage;



