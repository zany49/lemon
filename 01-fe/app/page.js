import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/register'); 

  return null; 
}