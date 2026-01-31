export const dummyBookings = [
    {
        _id: "bk_001",
        status: "confirmed",
        date: "2024-02-15T10:00:00.000Z",
        startTime: "10:00",
        endTime: "14:00",
        activity: "City Tour",
        pricing: { total: 200 },
        companion: {
            userId: {
                name: "Ananya Sharma",
                profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop"
            }
        },
        user: { name: "Test User" }
    },
    {
        _id: "bk_002",
        status: "pending",
        date: "2024-02-20T18:00:00.000Z",
        startTime: "18:00",
        endTime: "21:00",
        activity: "Dinner Date",
        pricing: { total: 150 },
        companion: {
            userId: {
                name: "Arjun Reddy",
                profilePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
            }
        },
        user: { name: "Test User" }
    },
    {
        _id: "bk_003",
        status: "completed",
        date: "2024-01-10T09:00:00.000Z",
        startTime: "09:00",
        endTime: "11:00",
        activity: "Morning Job",
        pricing: { total: 80 },
        companion: {
            userId: {
                name: "Meera Nair",
                profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
            }
        },
        user: { name: "Test User" }
    },
    {
        _id: "bk_004",
        status: "cancelled",
        date: "2024-01-25T14:00:00.000Z",
        startTime: "14:00",
        endTime: "16:00",
        activity: "Coffee Meetup",
        pricing: { total: 60 },
        companion: {
            userId: {
                name: "Kabir Singh",
                profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
            }
        },
        user: { name: "Test User" }
    }
];
