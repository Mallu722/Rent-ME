import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../../database/models/User.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const verifyLogin = async () => {
    try {
        if (!MONGODB_URI) {
            console.error('MONGODB_URI is not defined');
            return;
        }

        await mongoose.connect(MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        const email = 'user1@example.com';
        const password = 'password123';

        console.log(`🔍 Checking user: ${email}`);

        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User NOT found in database.');
            process.exit(1);
        }

        console.log('✅ User found:', user.email, user._id);
        console.log('🔑 Stored Password Hash:', user.password);

        console.log('🔐 Verifying password...');
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log('✅ PASS: Password matches!');
        } else {
            console.log('❌ FAIL: Password does NOT match.');
            // Test hash compatibility
            const newHash = await bcrypt.hash(password, 10);
            console.log('   New Hash for same password would be:', newHash);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyLogin();
