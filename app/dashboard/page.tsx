// import { getServerSession } from 'next-auth';
// import { authOptions } from '../api/auth/[...nextauth]/route';
// import { redirect } from 'next/navigation';

export default async function Dashboard() {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect('/api/auth/signin');
  // }

  return (
    <div>
      {/* <h1>Welcome, {session?.user?.email}</h1> */}
      <p>This is your financial dashboard.</p>
    </div>
  );
}
