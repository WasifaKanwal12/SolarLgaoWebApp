import { NextResponse } from "next/server";
import { adminAuth ,adminDb} from "@/lib/firebase-admin"; // Import from your Admin SDK config
import { doc, getDoc } from "firebase/firestore";

export async function POST(request) {
  try {
    const { idToken } = await request.json();
    let decodedToken;
try {
  decodedToken = await adminAuth.verifyIdToken(idToken);
 
} catch (verifyError) {

  return NextResponse.json({ message: "Invalid ID token" }, { status: 401 });
}
    
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    // Check user in Firestore
    const userRef = adminDb.collection("Users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { message: "Please sign up first. Google sign-in is only for existing users." },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    // Handle role-based routing
    if (userData.role === "provider" && userData.status !== "approved") {
      console.log("Provider account is pending approval redirecting there");
      return NextResponse.json({
        requiresRedirect: true,
        redirectUrl: "/pending-approval"
      });
    }

    let dashboardUrl = "/customer"; // Default
    if (userData.role === "admin") {
      console.log("Admin account redirecting to admin dashboard");
      return NextResponse.json(
        { message: "Admin must sign in with email and password" },
        { status: 403 }
      );
    } else if (userData.role === "provider") {
      dashboardUrl = "/provider";
    }
 
    return NextResponse.json({
      success: true,
      redirectUrl: dashboardUrl
    });

  } catch (error) {
    console.error("Google signin error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to verify token" },
      { status: 400 }
    );
  }
}
