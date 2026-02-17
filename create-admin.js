/**
 * Script to create an admin user in Firebase
 * 
 * Instructions:
 * 1. Go to Firebase Console (https://console.firebase.google.com)
 * 2. Select your project (wiz-homes)
 * 3. Go to Project Settings > Service Accounts
 * 4. Click "Generate new private key" and save the file as "service-account-key.json" in this folder
 * 5. Update the ADMIN_EMAIL and ADMIN_PASSWORD below
 * 6. Run: node create-admin.js
 */

const admin = require('firebase-admin');

// Load service account - you need to download this from Firebase Console
// Project Settings > Service Accounts > Generate new private key
let serviceAccount;
try {
  serviceAccount = require('./service-account-key.json');
} catch (e) {
  console.error('ERROR: service-account-key.json not found!');
  console.log('Please download it from Firebase Console > Project Settings > Service Accounts');
  console.log('Click "Generate new private key" and save as service-account-key.json');
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// CONFIGURATION - Change these values
const ADMIN_EMAIL = 'admin@wizhomes.com';
const ADMIN_PASSWORD = 'Admin123!';
const ADMIN_NAME = 'Administrator';

async function createAdminUser() {
  try {
    console.log(`Creating admin user: ${ADMIN_EMAIL}`);
    
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      displayName: ADMIN_NAME,
      emailVerified: true
    });
    
    console.log('✓ User created successfully:', userRecord.uid);
    
    // Set custom claims for admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'Operator'
    });
    
    console.log('✓ Custom claims set (Operator role)');
    
    // Also save to Firestore users collection
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: ADMIN_EMAIL,
      displayName: ADMIN_NAME,
      role: 'Operator',
      joinedAt: new Date().toISOString()
    });
    
    console.log('✓ User data saved to Firestore');
    
    console.log('\n✅ Admin user created successfully!');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('\nYou can now login at /login with these credentials.');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('User already exists! Updating existing user...');
      
      // Get existing user
      const userRecord = await admin.auth().getUserByEmail(ADMIN_EMAIL);
      
      // Set custom claims
      await admin.auth().setCustomUserClaims(userRecord.uid, {
        role: 'Operator'
      });
      
      // Update Firestore
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: ADMIN_EMAIL,
        displayName: ADMIN_NAME,
        role: 'Operator',
        joinedAt: new Date().toISOString()
      }, { merge: true });
      
      console.log('✓ Existing user updated with admin role');
      console.log('\n✅ Admin access granted!');
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Password: (your existing password)`);
      
      process.exit(0);
    }
    
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
