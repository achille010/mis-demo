// server.js - FIXED VERSION
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ========== MONGODB CONNECTION FIX ==========
const MONGODB_URI = 'mongodb://127.0.0.1:27017/school-mis'; // Changed to 127.0.0.1

console.log('🔌 Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4, skip IPv6
})
.then(() => {
    console.log('✅ MongoDB CONNECTED to: school-mis');
    console.log('📍 Connection string:', MONGODB_URI);
    
    // Test the connection
    const db = mongoose.connection.db;
    db.admin().ping()
        .then(() => console.log('✅ MongoDB ping successful'))
        .catch(err => console.log('❌ MongoDB ping failed:', err.message));
})
.catch(err => {
    console.log('❌ MongoDB CONNECTION FAILED!');
    console.log('❌ Error:', err.message);
    console.log('⚠️  Using in-memory storage instead');
    console.log('💡 Solution: Make sure MongoDB is running on port 27017');
});

// Track MongoDB connection state
mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  Mongoose disconnected from MongoDB');
});

// ========== IN-MEMORY STORAGE (FALLBACK) ==========
const memoryDB = {
    students: [],
    schools: [],
    teachers: [],
    users: [{ username: 'admin', password: 'admin123', role: 'admin' }]
};

// Track memory counts for debugging
let memoryStudentCount = 0;

// ========== AUTHENTICATION MIDDLEWARE ==========
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Accept both tokens
    if (token === 'demo-jwt-token' || token === 'real-jwt-token-from-db') {
        next();
    } else {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// ========== MONGOOSE MODELS ==========
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    admissionNumber: String,
    createdAt: { type: Date, default: Date.now }
});

const schoolSchema = new mongoose.Schema({
    name: String,
    address: String,
    email: String,
    principalName: String,
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    email: String,
    createdAt: { type: Date, default: Date.now }
});

// Create models only once
let Student, School, User;

if (mongoose.connection.readyState === 1) {
    Student = mongoose.model('Student', studentSchema);
    School = mongoose.model('School', schoolSchema);
    User = mongoose.model('User', userSchema);
}

// ========== ROUTES ==========

// 1. AUTH ROUTES
app.post('/api/v1/auth/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('🔐 Login attempt:', username);
    
    try {
        // Try MongoDB first if connected
        if (mongoose.connection.readyState === 1 && User) {
            const user = await User.findOne({ username, password });
            
            if (user) {
                console.log('✅ Login via MongoDB');
                return res.json({
                    success: true,
                    token: 'real-jwt-token-from-db',
                    user: { username: user.username, role: user.role },
                    source: 'mongodb'
                });
            }
        }
        
        // Fallback to in-memory
        const user = memoryDB.users.find(u => u.username === username && u.password === password);
        if (user) {
            console.log('✅ Login via in-memory');
            return res.json({
                success: true,
                token: 'demo-jwt-token',
                user: { username: user.username, role: user.role },
                source: 'memory'
            });
        }
        
        console.log('❌ Login failed for user:', username);
        res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/v1/auth/logout', (req, res) => {
    console.log('👋 User logged out');
    res.json({ 
        success: true, 
        message: 'Successfully logged out'
    });
});

// 2. STUDENT ROUTES - FIXED COUNTING
app.get('/api/v1/students', authenticate, async (req, res) => {
    console.log('📋 GET students request');
    
    try {
        if (mongoose.connection.readyState === 1 && Student) {
            const students = await Student.find().sort({ createdAt: -1 });
            console.log(`✅ Returning ${students.length} students from MongoDB`);
            res.json(students);
        } else {
            console.log(`✅ Returning ${memoryDB.students.length} students from memory`);
            res.json(memoryDB.students);
        }
    } catch (error) {
        console.error('Error getting students:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/v1/students', authenticate, async (req, res) => {
    const studentData = req.body;
    console.log('➕ POST student:', studentData);
    
    try {
        if (mongoose.connection.readyState === 1 && Student) {
            const student = new Student(studentData);
            await student.save();
            console.log('✅ Student saved to MongoDB, ID:', student._id);
            res.json(student);
        } else {
            memoryStudentCount++;
            const student = {
                _id: `mem-${Date.now()}-${memoryStudentCount}`,
                ...studentData,
                createdAt: new Date()
            };
            memoryDB.students.push(student);
            console.log(`✅ Student saved to memory, ID: ${student._id}`);
            console.log(`📊 Total students in memory: ${memoryDB.students.length}`);
            res.json(student);
        }
    } catch (error) {
        console.error('Error saving student:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. SCHOOL ROUTES
app.get('/api/v1/schools', authenticate, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1 && School) {
            const schools = await School.find().sort({ createdAt: -1 });
            res.json(schools);
        } else {
            res.json(memoryDB.schools);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/v1/schools', authenticate, async (req, res) => {
    try {
        const schoolData = req.body;
        
        if (mongoose.connection.readyState === 1 && School) {
            const school = new School(schoolData);
            await school.save();
            res.json(school);
        } else {
            const school = {
                _id: `mem-${Date.now()}`,
                ...schoolData,
                createdAt: new Date()
            };
            memoryDB.schools.push(school);
            res.json(school);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. STATS ENDPOINT - FIXED COUNTING
app.get('/api/v1/stats', authenticate, async (req, res) => {
    console.log('📊 Stats request received');
    
    try {
        let studentCount, schoolCount;
        
        if (mongoose.connection.readyState === 1 && Student && School) {
            [studentCount, schoolCount] = await Promise.all([
                Student.countDocuments(),
                School.countDocuments()
            ]);
            console.log(`📊 MongoDB stats: ${studentCount} students, ${schoolCount} schools`);
        } else {
            studentCount = memoryDB.students.length;
            schoolCount = memoryDB.schools.length;
            console.log(`📊 Memory stats: ${studentCount} students, ${schoolCount} schools`);
        }
        
        res.json({ 
            students: studentCount, 
            schools: schoolCount,
            source: mongoose.connection.readyState === 1 ? 'mongodb' : 'memory',
            mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.json({ 
            students: memoryDB.students.length, 
            schools: memoryDB.schools.length,
            source: 'memory-fallback',
            error: error.message
        });
    }
});

// 5. DIAGNOSTIC ENDPOINTS
app.get('/health', (req, res) => {
    const mongoState = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        mongodb: {
            state: states[mongoState] || 'unknown',
            readyState: mongoState,
            connected: mongoState === 1
        },
        memory: {
            students: memoryDB.students.length,
            schools: memoryDB.schools.length,
            users: memoryDB.users.length
        }
    });
});

app.get('/debug', (req, res) => {
    res.json({
        mongooseState: mongoose.connection.readyState,
        mongooseStates: {
            0: 'disconnected',
            1: 'connected', 
            2: 'connecting',
            3: 'disconnecting'
        },
        memoryCounts: {
            students: memoryDB.students.length,
            schools: memoryDB.schools.length
        },
        connectionInfo: mongoose.connection
    });
});

// 6. ROOT ENDPOINT
app.get('/', (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? '✅ CONNECTED' : '❌ DISCONNECTED';
    
    res.json({
        message: '🏫 School MIS API',
        version: '1.0.0',
        status: 'running',
        mongodb: mongoStatus,
        endpoints: {
            login: 'POST /api/v1/auth/login',
            logout: 'POST /api/v1/auth/logout',
            students: 'GET/POST /api/v1/students',
            schools: 'GET/POST /api/v1/schools',
            stats: 'GET /api/v1/stats',
            health: 'GET /health',
            debug: 'GET /debug'
        },
        demo: {
            username: 'admin',
            password: 'admin123'
        }
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║         SCHOOL MIS BACKEND              ║
╠══════════════════════════════════════════╣
║ 🚀 PORT: ${PORT}                          ║
║ 🔗 URL: http://localhost:${PORT}         ║
║ 🗄️  MONGO: ${mongoose.connection.readyState === 1 ? 'CONNECTED ✅' : 'DISCONNECTED ❌'} ║
║ 👤 LOGIN: admin / admin123               ║
╚══════════════════════════════════════════╝
`);
    
    // Show connection test
    console.log('\n🔍 Testing endpoints:');
    console.log(`   Health:    curl http://localhost:${PORT}/health`);
    console.log(`   Debug:     curl http://localhost:${PORT}/debug`);
    console.log(`   Root:      curl http://localhost:${PORT}/`);
});