// Shared data (doctors, team, tests, herbal products)
// Later we can load these from a database
// days: 1 = Monday ... 6 = Saturday, 0 = Sunday
// photo: to use a real photo, put it in images/doctors/ and change the path here

var doctors = [
    {
        id: 1, name: "Dr. Arben Hoxha", specialty: "Cardiologist", experience: 15,
        days: [1, 3, 5], hours: ["09:00", "10:00", "11:00", "12:00"],
        photo: "images/doctors/d1.svg",
        bio: "Dr. Arben treats heart and blood pressure problems. He focuses on prevention, regular check-ups and helping patients build a healthy lifestyle.",
        education: "University of Medicine, Tirana. Cardiology residency in Vienna.",
        languages: "Albanian, English, German",
        room: "Room 12, 2nd floor",
        phone: "+355 69 111 0001"
    },
    {
        id: 2, name: "Dr. Elira Kola", specialty: "Pediatrician", experience: 8,
        days: [1, 2, 3, 4, 5], hours: ["13:00", "14:00", "15:00", "16:00"],
        photo: "images/doctors/d2.svg",
        bio: "Dr. Elira takes care of babies, children and teenagers. She is known for her calm and friendly way with young patients and their parents.",
        education: "University of Medicine, Tirana. Pediatrics specialization in Rome.",
        languages: "Albanian, English, Italian",
        room: "Room 4, 1st floor",
        phone: "+355 69 111 0002"
    },
    {
        id: 3, name: "Dr. Besnik Leka", specialty: "Orthopedist", experience: 20,
        days: [2, 4], hours: ["09:00", "10:00", "11:00"],
        photo: "images/doctors/d3.svg",
        bio: "Dr. Besnik has 20 years of experience with bones, joints and sports injuries. He helps patients recover movement and live without pain.",
        education: "University of Medicine, Tirana. Orthopedic surgery training in Graz.",
        languages: "Albanian, English",
        room: "Room 21, 3rd floor",
        phone: "+355 69 111 0003"
    },
    {
        id: 4, name: "Dr. Marsela Dervishi", specialty: "Dermatologist", experience: 6,
        days: [3, 5, 6], hours: ["10:00", "11:00", "12:00", "13:00"],
        photo: "images/doctors/d4.svg",
        bio: "Dr. Marsela treats skin, hair and nail conditions, from acne and allergies to skin checks. She explains every treatment step by step.",
        education: "University of Medicine, Tirana. Dermatology course in Athens.",
        languages: "Albanian, English, Greek",
        room: "Room 7, 1st floor",
        phone: "+355 69 111 0004"
    },
    {
        id: 5, name: "Dr. Genti Shehu", specialty: "Cardiologist", experience: 11,
        days: [2, 4, 6], hours: ["14:00", "15:00", "16:00", "17:00"],
        photo: "images/doctors/d5.svg",
        bio: "Dr. Genti works with heart rhythm problems and runs ECG and stress tests. He mostly sees patients in the afternoon.",
        education: "University of Medicine, Tirana. Cardiology fellowship in Bologna.",
        languages: "Albanian, English, Italian",
        room: "Room 13, 2nd floor",
        phone: "+355 69 111 0005"
    },
    {
        id: 6, name: "Dr. Silvana Brahimi", specialty: "Gynecologist", experience: 17,
        days: [1, 4], hours: ["09:00", "10:00", "11:00", "12:00"],
        photo: "images/doctors/d6.svg",
        bio: "Dr. Silvana offers women's health care, pregnancy follow-up and regular check-ups in a comfortable and private environment.",
        education: "University of Medicine, Tirana. Gynecology specialization in Munich.",
        languages: "Albanian, English, German",
        room: "Room 9, 1st floor",
        phone: "+355 69 111 0006"
    },
    {
        id: 7, name: "Dr. Alban Muça", specialty: "Neurologist", experience: 13,
        days: [1, 2, 3], hours: ["15:00", "16:00", "17:00", "18:00"],
        photo: "images/doctors/d7.svg",
        bio: "Dr. Alban treats headaches, dizziness, sleep problems and nerve conditions. He takes time to listen before suggesting any tests.",
        education: "University of Medicine, Tirana. Neurology training in Thessaloniki.",
        languages: "Albanian, English, Greek",
        room: "Room 18, 3rd floor",
        phone: "+355 69 111 0007"
    },
    {
        id: 8, name: "Dr. Jonida Zeka", specialty: "Pediatrician", experience: 4,
        days: [3, 4, 5, 6], hours: ["09:00", "10:00", "11:00"],
        photo: "images/doctors/d8.svg",
        bio: "Dr. Jonida is our youngest pediatrician. She handles vaccinations, growth check-ups and common childhood illnesses.",
        education: "University of Medicine, Tirana. Pediatric residency in Tirana.",
        languages: "Albanian, English",
        room: "Room 5, 1st floor",
        phone: "+355 69 111 0008"
    }
];

// People shown in the "Meet our team" section on the home page
var team = [
    { name: "Dr. Arben Hoxha", role: "Cardiologist", photo: "images/doctors/d1.svg" },
    { name: "Dr. Elira Kola", role: "Pediatrician", photo: "images/doctors/d2.svg" },
    { name: "Dr. Marsela Dervishi", role: "Dermatologist", photo: "images/doctors/d4.svg" },
    { name: "Dr. Alban Muça", role: "Neurologist", photo: "images/doctors/d7.svg" },
    { name: "Anila Hysa", role: "Head nurse", photo: "images/doctors/n1.svg" },
    { name: "Ermal Dedja", role: "Emergency nurse", photo: "images/doctors/n2.svg" }
];

// resultDays = how many days after the test the results are ready (0 = same day)
var tests = [
    { id: 1, name: "Complete blood count", price: 800, resultDays: 1 },
    { id: 2, name: "Blood glucose", price: 300, resultDays: 0 },
    { id: 3, name: "Total cholesterol", price: 500, resultDays: 1 },
    { id: 4, name: "Urine analysis", price: 400, resultDays: 0 },
    { id: 5, name: "Thyroid hormones (TSH)", price: 1200, resultDays: 3 },
    { id: 6, name: "Vitamin D", price: 1500, resultDays: 3 },
    { id: 7, name: "Iron (Fe)", price: 600, resultDays: 2 },
    { id: 8, name: "Liver function", price: 1100, resultDays: 2 }
];

// Herbal products made by our hospital staff
var products = [
    {
        id: 1, name: "Calm Tea", price: 450, size: "50 g",
        photo: "images/products/tea.svg",
        usedFor: "Helps you relax and sleep better after a stressful day.",
        ingredients: "Chamomile, lavender, lemon balm",
        how: "1 teaspoon in a cup of hot water, 10 minutes, in the evening."
    },
    {
        id: 2, name: "Sage & Thyme Throat Syrup", price: 700, size: "200 ml",
        photo: "images/products/syrup.svg",
        usedFor: "Soothes a sore throat and light cough during cold season.",
        ingredients: "Sage, thyme, honey, lemon",
        how: "1 tablespoon, 2 to 3 times a day. Not for children under 3."
    },
    {
        id: 3, name: "Mint & Fennel Drops", price: 550, size: "30 ml",
        photo: "images/products/drops.svg",
        usedFor: "Supports digestion and helps with bloating after heavy meals.",
        ingredients: "Peppermint, fennel seed, caraway",
        how: "15 drops in a glass of water after meals."
    },
    {
        id: 4, name: "Calendula & Aloe Cream", price: 900, size: "50 ml",
        photo: "images/products/cream.svg",
        usedFor: "Soothes dry or irritated skin and small everyday skin irritations.",
        ingredients: "Calendula, aloe vera, shea butter, beeswax",
        how: "Apply a thin layer to clean skin 1 to 2 times a day."
    }
];
