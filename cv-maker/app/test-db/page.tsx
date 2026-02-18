import db from "@/lib/db";
import { addUser } from "./actions";

export default async function TestDBPage() {
    const users = db.prepare('SELECT * FROM users').all();

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map((user: any) => (
                    <li key={user.id}>{user.firstName} {user.lastName} - {user.email}</li>
                ))}
            </ul>
            <h2>Add User</h2>
            <form action={addUser}>
                <input type="text" name="firstName" placeholder="First Name" required />
                <input type="text" name="lastName" placeholder="Last Name" required />
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Add User</button>
            </form>
        </div>
    );
}