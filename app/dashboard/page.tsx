import { redirect } from 'next/navigation';

export default function DashboardIndex() {
    // Rely on the layout.tsx to handle role-based redirection,
    // but provide a default redirect here so Next.js doesn't 404.
    redirect('/dashboard/overview');
}
