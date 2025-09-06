import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
    tittle:{
        type: String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    company:{
        type: String,
        required: true,
        default: "IBM"
    }
}, { timestamps: true });

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        default: 0
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['undergraduate', 'postgraduate', 'diploma', 'certificate', 'beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'
    },
    skills: {
        type: [String],
        default: []
    },
    prerequisites: {
        type: [String],
        default: []
    },
    students: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    syllabus: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    }
}, { timestamps: true });

const enrollmentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled', 'active', 'completed', 'dropped'],
        default: 'confirmed'
    },
    paymentStatus: {
        type: String,
        enum: ['completed', 'pending', 'failed', 'refunded'],
        default: 'pending'
    },
    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    certificateIssued: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// IBM Jobs Schema
const ibmJobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true,
        default: "IBM"
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "Full-time"
    },
    posted: {
        type: String,
        default: () => new Date().toLocaleDateString()
    },
    description: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default: ["Quantum Computing"]
    },
    salary: {
        type: String,
        default: "Competitive"
    },
    experience: {
        type: String,
        default: "Not specified"
    },
    url: {
        type: String,
        required: true
    },
    jobId: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

// Quantum Jobs Schema
const quantumJobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "Full-time"
    },
    posted: {
        type: String,
        default: () => new Date().toLocaleDateString()
    },
    description: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    salary: {
        type: String,
        default: "Competitive"
    },
    experience: {
        type: String,
        default: "Not specified"
    },
    url: {
        type: String,
        required: true
    },
    portal: {
        type: String,
        default: "Unknown"
    },
    jobId: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const Job = mongoose.model("Jobs", jobSchema);
const Course = mongoose.model("Course", courseSchema);
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
const IBMJob = mongoose.model("IBMJob", ibmJobSchema);
const QuantumJob = mongoose.model("QuantumJob", quantumJobSchema);

export { Course, Enrollment, IBMJob, QuantumJob };
export default Job;
