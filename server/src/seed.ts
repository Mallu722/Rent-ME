import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../../database/models/User.model';
import Companion from '../../database/models/Companion.model';
import Booking from '../../database/models/Booking.model';
import Review from '../../database/models/Review.model';
import Payment from '../../database/models/Payment.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentme';

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Companion.deleteMany({}),
            Booking.deleteMany({}),
            Review.deleteMany({}),
            Payment.deleteMany({}),
        ]);

        // Create password
        const hashedPassword = await bcrypt.hash('password123', 10);

        // 1. Create Regular Users
        console.log('👥 Creating users...');
        const users = await User.create([
            {
                name: 'Rahul Sharma',
                email: 'user1@example.com',
                password: hashedPassword,
                role: 'user',
                location: { city: 'Mumbai', country: 'India' },
                profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
                wallet: { balance: 5000, currency: 'INR' }
            },
            {
                name: 'Priya Singh',
                email: 'user2@example.com',
                password: hashedPassword,
                role: 'user',
                location: { city: 'Pune', country: 'India' },
                profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
                wallet: { balance: 3000, currency: 'INR' }
            },
        ]);

        // 2. Create Companions
        console.log('🌟 Creating 15 companions...');
        const companions_ids = [];

        const indianNames = [
            'Arjun Verma', 'Ananya Sharma', 'Rohan Patel', 'Priya Singh', 'Vikram Malhotra',
            'Zara Khan', 'Kabir Das', 'Mira Reddy', 'Aditya Joshi', 'Sana Mir',
            'Rahul Kapoor', 'Ishita Gupta', 'Dev Kumar', 'Neha Agarwal', 'Karan Mehta'
        ];

        const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad'];
        const activitiesList = ['Movie Partner', 'City Guide', 'Gaming', 'Coffee Chat', 'shopping', 'Study Buddy', 'Morning Walk', 'Event Plus-One'];

        for (let i = 0; i < 15; i++) {
            const name = indianNames[i] || `Companion ${i + 1}`;
            const isArjun = name === 'Arjun Verma';

            // Create User entry
            const user = await User.create({
                email: `companion${i + 1}@example.com`,
                password: hashedPassword,
                name: name,
                role: 'companion',
                phone: `98765432${i.toString().padStart(2, '0')}`,
                age: 20 + (i % 15), // Ages 20-35
                gender: i % 2 === 0 ? 'male' : 'female',
                bio: isArjun
                    ? "I'm a great listener and love to have deep conversations over a call. Let's talk about everything and nothing!"
                    : `Friendly and outgoing ${i % 2 === 0 ? 'guy' : 'girl'} who loves meeting new people and exploring the city.`,
                location: {
                    city: isArjun ? 'Pune' : cities[i % cities.length],
                    state: 'Maharashtra',
                    country: 'India'
                },
                profilePhoto: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&size=200`,
                isVerified: true
            });

            // Create Companion Profile
            const companionActivities = isArjun ? ['Call', 'Virtual Chat'] : [
                activitiesList[i % activitiesList.length],
                activitiesList[(i + 3) % activitiesList.length],
                'Friend'
            ];

            const companion = await Companion.create({
                userId: user._id,
                pricing: {
                    hourly: isArjun ? 500 : 200 + (i * 50),
                    currency: 'INR',
                    activityBased: {
                        walking: 40 + i * 5,
                        dining: 60 + i * 10,
                    },
                },
                bio: isArjun
                    ? "Specialist in Virtual Companionship. I offer non-judgmental listening and engaging conversations."
                    : `I am a ${companionActivities[0]} enthusiast! I know the best spots in town and love to make new friends.`,
                skills: isArjun ? ['Listening', 'Advice', 'Storytelling'] : ['Photography', 'Driving', 'Local History'],
                languages: ['English', 'Hindi', isArjun ? 'Marathi' : (i % 2 === 0 ? 'Kannada' : 'Gujarati')],
                activityCategories: companionActivities,
                availability: {
                    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                    timeSlots: [{ start: '10:00', end: '22:00' }],
                },
                rating: {
                    average: isArjun ? 4.8 : 3.5 + (Math.random() * 1.5),
                    count: 10 + Math.floor(Math.random() * 50)
                },
                completedBookings: 0,
                isAvailable: true
            });

            companions_ids.push(companion._id);
            console.log(`✅ Created Companion: ${name} (${user.email}) - Activities: ${companionActivities.join(', ')}`);
        }

        // 4. Create more Pune Companions (Local Area request)
        console.log('🏘️ Creating 5 more companions specifically for Pune...');
        const puneNames = ['Soham Deshmukh', 'Radhika Apte', 'Chinmayi Joshi', 'Omkar Patil', 'Tanvi Kulkarni'];

        for (let i = 0; i < 5; i++) {
            const name = puneNames[i];
            const companionActivities = [activitiesList[i % activitiesList.length], 'City Guide', 'Friend'];

            const user = await User.create({
                email: `pune.companion${i + 1}@example.com`,
                password: hashedPassword,
                name: name,
                role: 'companion',
                phone: `9922${Math.floor(Math.random() * 1000000)}`,
                age: 22 + i,
                gender: i % 2 === 0 ? 'male' : 'female',
                bio: `I am a true Punekar! I know all the best Vada Pav spots and hidden gems in the city. Let's explore Pune together!`,
                location: {
                    city: 'Pune',
                    state: 'Maharashtra',
                    country: 'India'
                },
                profilePhoto: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&size=200`,
                isVerified: true
            });

            const companion = await Companion.create({
                userId: user._id,
                pricing: {
                    hourly: 300 + (i * 50),
                    currency: 'INR',
                    activityBased: {
                        walking: 50,
                        dining: 100,
                    },
                },
                bio: `Pune local guide. I love showcasing the culture and food of my city.`,
                skills: ['Marathi', 'Food Guide', 'History'],
                languages: ['English', 'Hindi', 'Marathi'],
                activityCategories: companionActivities,
                availability: {
                    days: ['saturday', 'sunday'],
                    timeSlots: [{ start: '09:00', end: '20:00' }],
                },
                rating: {
                    average: 4.0 + (Math.random() * 1.0),
                    count: 5 + Math.floor(Math.random() * 20)
                },
                completedBookings: 0,
                isAvailable: true
            });
            companions_ids.push(companion._id);
            console.log(`✅ Created Pune Companion: ${name}`);
        }

        // 3. Create Bookings
        console.log('📅 Creating bookings...');
        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

        const bookingData = [
            // Booking 1: Completed & Paid (Rahul -> 1st Comp)
            {
                user: users[0]._id,
                companion: companions_ids[0],
                date: yesterday,
                startTime: '14:00',
                endTime: '16:00',
                duration: 2,
                activity: 'walking',
                status: 'completed',
                pricing: { rate: 40, total: 80, currency: 'INR' },
                paymentStatus: 'completed'
            },
            // Booking 2: Confirmed & Paid (Rahul -> 2nd Comp)
            {
                user: users[0]._id,
                companion: companions_ids[1],
                date: tomorrow,
                startTime: '18:00',
                endTime: '21:00',
                duration: 3,
                activity: 'dining',
                status: 'confirmed',
                pricing: { rate: 70, total: 210, currency: 'INR' },
                paymentStatus: 'completed'
            },
            // Booking 3: Pending (Priya -> 1st Comp)
            {
                user: users[1]._id,
                companion: companions_ids[0],
                date: tomorrow,
                startTime: '10:00',
                endTime: '11:00',
                duration: 1,
                activity: 'talk',
                status: 'pending',
                pricing: { rate: 50, total: 50, currency: 'INR' },
                paymentStatus: 'pending'
            },
            // Booking 4: Cancelled (Priya -> 3rd Comp)
            {
                user: users[1]._id,
                companion: companions_ids[2],
                date: today,
                startTime: '12:00',
                endTime: '14:00',
                duration: 2,
                activity: 'shopping',
                status: 'cancelled',
                pricing: { rate: 70, total: 140, currency: 'INR' },
                paymentStatus: 'failed'
            }
        ];

        const bookings = await Promise.all(bookingData.map(async (b) => {
            const booking = await Booking.create({
                ...b,
                payment: {
                    status: b.paymentStatus,
                    transactionId: b.paymentStatus === 'completed' ? `txn_${Math.random().toString(36).substr(2, 9)}` : undefined,
                    paidAt: b.paymentStatus === 'completed' ? new Date() : undefined
                }
            });

            // 4. Create Payments
            if (b.paymentStatus === 'completed') {
                await Payment.create({
                    user: b.user,
                    booking: booking._id,
                    type: 'booking',
                    amount: b.pricing.total,
                    currency: b.pricing.currency,
                    method: 'card',
                    status: 'completed',
                    transactionId: booking.payment.transactionId
                });
            }

            return booking;
        }));

        // 5. Create Reviews for completed booking
        console.log('⭐ Creating reviews...');
        const completedBooking = bookings[0];
        await Review.create({
            booking: completedBooking._id,
            user: completedBooking.user,
            companion: completedBooking.companion,
            rating: 5,
            comment: 'Amazing experience! Had a great time.',
            tags: ['friendly', 'polite']
        });

        // Update Companion Stats
        const companion1 = await Companion.findById(companions_ids[0]);
        if (companion1) {
            companion1.completedBookings += 1;
            companion1.rating.count += 1;
            // Simple average Recalculation (previous sum + new rating) / new count
            const prevSum = (companion1.rating.average * (companion1.rating.count - 1));
            companion1.rating.average = (prevSum + 5) / companion1.rating.count;
            await companion1.save();
        }

        console.log('\n=============================================');
        console.log('🚀 DATABASE SEEDED SUCCESSFULLY');
        console.log('=============================================');

        console.log('\n🔑 LOGIN CREDENTIALS:');
        console.log('---------------------------------------------');
        console.log('👤 USER 1: user1@example.com / password123');
        console.log('🌟 COMP 1: companion1@example.com / password123');
        console.log('🌟 COMP 2: companion2@example.com / password123');
        console.log('---------------------------------------------');

        console.log('\n📊 BOOKING SUMMARY:');
        console.log('---------------------------------------------');

        // Fetch bookings with populated fields for display
        const detailedBookings = await Booking.find()
            .populate('user', 'name')
            .populate({
                path: 'companion',
                populate: { path: 'userId', select: 'name' }
            });

        detailedBookings.forEach((b: any) => {
            const userName = b.user.name;
            const compName = b.companion?.userId?.name || 'Unknown';
            const date = new Date(b.date).toDateString();
            console.log(`📝 ${b.status.toUpperCase()} | ${userName} booked ${compName} for ${b.activity}`);
            console.log(`   📅 ${date} | 💰 $${b.pricing.total} | 💳 ${b.payment.status}`);
            if (b.status === 'completed') console.log(`   ⭐ Reviewed: 5/5`);
            console.log('   - - - - - - - - - - - - - - - - - - - - -');
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', JSON.stringify(error, null, 2));
        process.exit(1);
    }
};

seedDB();
