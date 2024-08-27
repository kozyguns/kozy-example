// import { redirect } from 'next/navigation';
// import { getDefaultSignInView } from '@/utils/auth-helpers/settings';
// import { cookies } from 'next/headers';

// export default function SignIn() {
//   const preferredSignInView =
//     cookies().get('preferredSignInView')?.value || null;
//   const defaultView = getDefaultSignInView(preferredSignInView);

//   return redirect(`/signin/${defaultView}`);
// }

import SignIn from "@/components/supaauth/signin";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
}
