import { redirect } from 'next/navigation';

export default function Home() {
  // Automatically route users to the demonstration login portal
  redirect('/login');
}
