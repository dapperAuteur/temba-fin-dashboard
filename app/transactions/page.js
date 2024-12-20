// import { getSession } from 'next-auth/client';

// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   if (!session) {
//     return { redirect: { destination: '/api/auth/signin', permanent: false } };
//   }
//   return { props: { session } };
// }