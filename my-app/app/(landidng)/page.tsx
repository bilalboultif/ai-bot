import { Button } from "@/components/ui/button";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link"

export default function LandingPage() {
    return ( 
        <div>
  <p className="text-6xl text-green-500">Landing (Unprotected) </p>
   <Link href="sign-in">
     <Button>
       Login
     </Button>
  </Link>
  <Link href="sign-up">
     <Button>
       Register
     </Button>
  </Link>
  </div>
     );
}
 
