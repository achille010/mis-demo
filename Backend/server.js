require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const connectDB = require('./config/database');
const Student = require('./models/Student');
const School = require('./models/School');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const memoryDB = {
    students: [],
    schools: [],
    teachers: [],
    users: [{ username: 'admin', password: 'admin123', role: 'admin' }]
};

let memoryStudentCount = 0;

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (token === 'demo-jwt-token' || token === 'real-jwt-token-from-db') {
        next();
    } else {
        res.status(401).json({ error: 'Invalid token' });
    }
}


app.post('/api/v1/auth/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', username);

    try {
        if (mongoose.connection.readyState === 1 && User) {
            const user = await User.findOne({ username, password });

            if (user) {
                console.log('Login via MongoDB');
                return res.json({
                    success: true,
                    token: 'real-jwt-token-from-db',
                    user: { username: user.username, role: user.role },
                    source: 'mongodb'
                });
            }
        }

        const user = memoryDB.users.find(u => u.username === username && u.password === password);
        if (user) {
            console.log('Login via in-memory');
            return res.json({
                success: true,
                token: 'demo-jwt-token',
                user: { username: user.username, role: user.role },
                source: 'memory'
            });
        }

        console.log('Login failed for user:', username);
        res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/v1/auth/logout', (req, res) => {
    console.log('User logged out');
    res.json({
        success: true,
        message: 'Successfully logged out'
    });
});

app.get('/api/v1/students', authenticate, async (req, res) => {
    const { schoolId } = req.query;
    console.log(`GET students request ${schoolId ? 'for school: ' + schoolId : ''}`);

    try {
        if (mongoose.connection.readyState === 1 && Student) {
            let query = {};
            if (schoolId) {
                if (mongoose.Types.ObjectId.isValid(schoolId)) {
                    query.school = new mongoose.Types.ObjectId(schoolId);
                } else {
                    query.school = schoolId; // Fallback for memory IDs or legacy data
                }
            }

            const students = await Student.find(query).sort({ createdAt: -1 });
            console.log(`[GET /students] Found ${students.length} students for query:`, JSON.stringify(query));
            res.json(students);
        } else {
            let students = memoryDB.students;
            if (schoolId) {
                students = students.filter(s => s.school === schoolId);
            }
            console.log(`Returning ${students.length} students from memory`);
            res.json(students);
        }
    } catch (error) {
        console.error('Error getting students:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/v1/students', authenticate, async (req, res) => {
    const studentData = req.body;
    console.log('POST student:', studentData);

    try {
        if (mongoose.connection.readyState === 1 && Student) {
            const data = { ...studentData };
            if (data.school && mongoose.Types.ObjectId.isValid(data.school)) {
                data.school = new mongoose.Types.ObjectId(data.school);
            }

            const student = new Student(data);
            await student.save();
            console.log(`[POST /students] Saved student to MongoDB: ${student.name} for school: ${data.school}`);
            res.json(student);
        } else {
            memoryStudentCount++;
            const student = {
                _id: `mem-${Date.now()}-${memoryStudentCount}`,
                ...studentData,
                createdAt: new Date()
            };
            memoryDB.students.push(student);
            console.log(`Student saved to memory, ID: ${student._id}`);
            console.log(`Total students in memory: ${memoryDB.students.length}`);
            res.json(student);
        }
    } catch (error) {
        console.error('Error saving student:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/v1/students/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const studentData = req.body;

        if (mongoose.connection.readyState === 1 && Student) {
            const student = await Student.findByIdAndUpdate(id, studentData, { new: true });
            if (!student) return res.status(404).json({ error: 'Student not found' });
            res.json(student);
        } else {
            const index = memoryDB.students.findIndex(s => s._id === id);
            if (index === -1) return res.status(404).json({ error: 'Student not found' });
            memoryDB.students[index] = { ...memoryDB.students[index], ...studentData };
            res.json(memoryDB.students[index]);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

app.put('/api/v1/schools/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const schoolData = req.body;

        if (mongoose.connection.readyState === 1 && School) {
            const school = await School.findByIdAndUpdate(id, schoolData, { new: true });
            if (!school) return res.status(404).json({ error: 'School not found' });
            res.json(school);
        } else {
            const index = memoryDB.schools.findIndex(s => s._id === id);
            if (index === -1) return res.status(404).json({ error: 'School not found' });
            memoryDB.schools[index] = { ...memoryDB.schools[index], ...schoolData };
            res.json(memoryDB.schools[index]);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/v1/stats', authenticate, async (req, res) => {
    console.log('Stats request received');

    try {
        let studentCount, schoolCount;

        [studentCount, schoolCount] = await Promise.all([
            Student.countDocuments(),
            School.countDocuments()
        ]).catch(() => [memoryDB.students.length, memoryDB.schools.length]);

        res.json({
            students: studentCount || 0,
            schools: schoolCount || 0,
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

app.get('/', (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';

    res.json({
        message: 'School MIS API',
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
SCHOOL MIS BACKEND
PORT: ${PORT}
URL: http://localhost:${PORT}
MONGO: ${mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'}
LOGIN: admin / admin123
`);

    console.log('\nTesting endpoints:');
    console.log(`   Health:    curl http://localhost:${PORT}/health`);
    console.log(`   Debug:     curl http://localhost:${PORT}/debug`);
    console.log(`   Root:      curl http://localhost:${PORT}/`);
});