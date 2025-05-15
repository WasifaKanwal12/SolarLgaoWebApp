import { NextResponse } from "next/server";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/config";
import { doc, getDoc } from "firebase/firestore";
import { sendEmailVerification } from 'firebase/auth';
// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
  role: "admin",
};

export async function POST(request) {
  try {

    const { email, password } = await request.json();
    
   

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (authError) {
        console.log("Admin not found in Firebase");
      }

      return NextResponse.json({
        success: true,
        redirectUrl: "/admin"
      });
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, "Users", user.uid));
if (!user.emailVerified) {
  
  return NextResponse.json(
    { 
      error: "Please verify your email first. A new verification email has been sent.",
      requiresVerification: true,
      redirectUrl: "/pendingVerification"
    },
    { status: 403 }
  );
}
    if (!userDoc.exists()) {
      return NextResponse.json(
        { message: "User not found in database" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    if (userData.role === "provider" && userData.status !== "approved") {
      return NextResponse.json({
        requiresRedirect: true,
        redirectUrl: "/pending-approval"
      });
    }

    let dashboardUrl;
    switch (userData.role) {
      case "admin":
        dashboardUrl = "/admin";
        break;
      case "provider":
        dashboardUrl = "/provider";
        break;
      default:
        dashboardUrl = "/customer";
    }

    return NextResponse.json({
      success: true,
      redirectUrl: dashboardUrl
    });

  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to sign in" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Method not allowed" },
    { status: 405 }
  );
}