import { NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { auth, db } from '@/lib/config';
import { doc, setDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';
import { hashPassword } from '@/lib/authUtils';

export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Validate the form data
    const validationError = validateFormData(formData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
   
       // Send verification email
      await sendEmailVerification(userCredential.user);
    // Prepare user data for Firestore
    const hashedPassword = await hashPassword(formData.password);
    const role = formData.userType === "provider" ? "provider" : "customer";
    const status = formData.userType === "provider" ? "pending" : "approved";

    const dataToSave = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: hashedPassword,
      role,
      status,
      created_at: new Date().toISOString(),
      ...(formData.userType === "provider" && {
        company_name: formData.companyName,
        registration_number: formData.registrationNumber,
        contact_number: formData.contactNumber,
        company_address: formData.companyAddress,
        certificate_url: formData.certificate_url,
        approved: false,
      }),
    };

    // Save to Firestore
    await setDoc(doc(db, "Users", userCredential.user.uid), dataToSave);
  

   // Update the success response
const responseData = formData.userType === "provider" 
  ? { 
      message: "Your account has been created. Please verify your email and wait for admin approval.",
      redirectUrl: "/pendingVerification"
    }
  : {
      message: "Account created successfully! Please check your email for verification.",
      redirectUrl: "/pendingVerification"
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("Signup error:", error);
    
    // Delete user if created but Firestore failed
    if (error.userCredential?.user) {
      try {
        await deleteUser(error.userCredential.user);
      } catch (deleteError) {
        console.error("Error deleting user:", deleteError);
      }
    }

    return NextResponse.json(
      { error: error.message || "Failed to create account." },
      { status: 500 }
    );
  }
}


function validateFormData(formData) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    const personalDomains = ["gmail.com", "yahoo.com", "outlook.com"];
    const knownDomainPrefixes = ["gmail", "yahoo", "outlook"];
    const allowedTLDs = ["com", "net", "org", "pk", "edu", "gov"];
  
    const email = formData.email.toLowerCase();
    const [localPart, domain] = email.split("@");
  
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return "All fields are required.";
    }
  
    if (!emailRegex.test(email)) {
      return "Please enter a valid email format.";
    }
  
    // Check TLD (top-level domain) is valid
    const domainParts = domain.split(".");
    const tld = domainParts[domainParts.length - 1];
    const domainPrefix = domainParts[0];
  
    if (!allowedTLDs.includes(tld)) {
      return `Invalid domain extension ".${tld}". Did you mean ".com" or ".pk"?`;
    }
  
    // If the domain prefix is trying to mimic a known free email provider but isn't exact — reject it
    if (!knownDomainPrefixes.includes(domainPrefix) ) {
      return `The email domain "${domain}" is incorrect. Did you mean "gmail.com" ,"yahoo.com" ,"outlook.com"?`;
    }
  
    // Customers must use known personal email providers
    else if (formData.userType === "customer" && !personalDomains.includes(domain)) {
      return "Customers must use a personal email like Gmail, Yahoo, or Outlook.";
    }
  
    // Providers can use any valid email, but business info is required
    if (formData.userType === "provider") {
      if (
        !formData.companyName ||
        !formData.registrationNumber ||
        !formData.contactNumber ||
        !formData.companyAddress ||
        !formData.certificate_url
      ) {
        return "All company details are required for providers.";
      }
    }
  
    // Check password strength
    if (!passwordRegex.test(formData.password)) {
      return "Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
    }
  
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
  
    return null;
  }
  