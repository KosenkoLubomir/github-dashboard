"use client"

import {useEffect, useState} from "react";
import { Octokit } from "@octokit/core";
import Link from "next/link";

type User = {
    id: string;
    name: string;
    avatar_url: string;
    link: string;
}

const UsersPage = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        const octokit = new Octokit();

        try {
            const response = await octokit.request('GET /users', {
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            console.log(response.data);
            if (response.data.length > 0) {
                setUsers(response.data.map((user: any) => ({
                    id: user.id,
                    name: user.login,
                    avatar_url: user.avatar_url,
                    link: user.html_url
                })));
            }

        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=> {
        fetchUsers();
    }, []);

    return (
        <div className={"max-w-6xl mx-auto p-4 rounded-lg shadow-md"}>
            <h1 className={"text-4xl mb-6"}>Users Page</h1>

            {loading ? (
                <p>Data is loading...</p>
            ) : (
                <>
                    <p className={"mb-8"}>List of GitHub users:</p>
                    <ul className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
                        {users.map(user => (
                            <li className={"mb-4"} key={user.id}>
                                <Link className={"flex items-center gap-2 mb-4"} href={"/users/"+user.name} target="_blank" rel="noopener noreferrer">
                                    <img className={"rounded-lg"} src={user.avatar_url} alt={user.name} width="50" height="50" />
                                    <span className={"font-semibold text-md"}>{user.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default UsersPage;