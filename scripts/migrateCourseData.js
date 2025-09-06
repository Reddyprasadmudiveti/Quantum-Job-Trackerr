import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from '../database/jobsSchema.js';

dotenv.config();

const MONGOURI = process.env.MONGOURI;

// Hardcoded course data from frontend
const coursesData = [
  {
    title: 'Quantum Computing Fundamentals',
    category: 'quantum',
    level: 'postgraduate',
    duration: '6 months',
    credits: 6,
    description: 'Explore the fascinating world of quantum computing, quantum algorithms, and quantum information theory.',
    instructor: 'Dr. Rajesh Kumar',
    students: 45,
    rating: 4.9,
    price: '₹25,000',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    skills: ['Quantum Algorithms', 'Qiskit', 'Quantum Mechanics', 'Linear Algebra'],
    prerequisites: ['Linear Algebra', 'Basic Physics', 'Programming'],
    syllabus: [
      { week: 1, topic: 'Introduction to Quantum Computing', content: 'Basic concepts, history, and potential applications' },
      { week: 2, topic: 'Quantum Bits and Quantum Gates', content: 'Understanding qubits, superposition, and basic quantum operations' },
      { week: 3, topic: 'Quantum Circuits', content: 'Building and analyzing quantum circuits' },
      { week: 4, topic: 'Quantum Algorithms I', content: 'Deutsch-Jozsa and Grover\'s algorithm' },
      { week: 5, topic: 'Quantum Algorithms II', content: 'Shor\'s algorithm and quantum Fourier transform' },
      { week: 6, topic: 'Quantum Error Correction', content: 'Dealing with decoherence and quantum errors' }
    ]
  },
  {
    title: 'Artificial Intelligence & Machine Learning',
    category: 'computer-science',
    level: 'undergraduate',
    duration: '8 months',
    credits: 8,
    description: 'Master AI and ML concepts with hands-on projects using Python, TensorFlow, and real-world datasets.',
    instructor: 'Prof. Priya Sharma',
    students: 120,
    rating: 4.8,
    price: '₹30,000',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    skills: ['Python', 'TensorFlow', 'Deep Learning', 'Neural Networks'],
    prerequisites: ['Programming Basics', 'Mathematics', 'Statistics'],
    syllabus: [
      { week: 1, topic: 'Introduction to AI & ML', content: 'History, applications, and fundamental concepts' },
      { week: 2, topic: 'Python for Data Science', content: 'Essential libraries: NumPy, Pandas, Matplotlib' },
      { week: 3, topic: 'Data Preprocessing', content: 'Cleaning, transformation, and feature engineering' },
      { week: 4, topic: 'Supervised Learning', content: 'Regression and classification algorithms' },
      { week: 5, topic: 'Unsupervised Learning', content: 'Clustering and dimensionality reduction' },
      { week: 6, topic: 'Neural Networks', content: 'Fundamentals of neural networks' },
      { week: 7, topic: 'Deep Learning', content: 'CNN, RNN, and advanced architectures' },
      { week: 8, topic: 'Project Implementation', content: 'End-to-end ML project development' }
    ]
  },
  {
    title: 'Full Stack Web Development',
    category: 'computer-science',
    level: 'undergraduate',
    duration: '10 months',
    credits: 10,
    description: 'Learn modern web development with React, Node.js, databases, and cloud deployment.',
    instructor: 'Dr. Arjun Reddy',
    students: 200,
    rating: 4.7,
    price: '₹35,000',
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'JavaScript'],
    prerequisites: ['HTML/CSS', 'JavaScript Basics'],
    syllabus: [
      { week: 1, topic: 'HTML5 & CSS3 Fundamentals', content: 'Modern markup and styling techniques' },
      { week: 2, topic: 'JavaScript Essentials', content: 'Core concepts, ES6+, and DOM manipulation' },
      { week: 3, topic: 'Frontend Development with React', content: 'Components, state, props, and hooks' },
      { week: 4, topic: 'State Management', content: 'Context API, Redux, and global state patterns' },
      { week: 5, topic: 'Backend Development with Node.js', content: 'Express.js, RESTful APIs, and middleware' },
      { week: 6, topic: 'Database Integration', content: 'MongoDB, Mongoose, and data modeling' },
      { week: 7, topic: 'Authentication & Authorization', content: 'JWT, OAuth, and security best practices' },
      { week: 8, topic: 'Testing & Deployment', content: 'Unit testing, CI/CD, and cloud deployment' },
      { week: 9, topic: 'Performance Optimization', content: 'Lazy loading, code splitting, and caching strategies' },
      { week: 10, topic: 'Final Project', content: 'Building a complete full-stack application' }
    ]
  },
  {
    title: 'Data Science & Analytics',
    category: 'computer-science',
    level: 'postgraduate',
    duration: '12 months',
    credits: 12,
    description: 'Comprehensive data science program covering statistics, machine learning, and big data technologies.',
    instructor: 'Dr. Meera Patel',
    students: 85,
    rating: 4.9,
    price: '₹40,000',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    skills: ['Python', 'R', 'SQL', 'Tableau', 'Big Data', 'Statistics'],
    prerequisites: ['Mathematics', 'Programming', 'Statistics'],
    syllabus: [
      { week: 1, topic: 'Introduction to Data Science', content: 'Overview, applications, and career paths' },
      { week: 2, topic: 'Statistical Foundations', content: 'Probability, distributions, and hypothesis testing' },
      { week: 3, topic: 'Data Collection & Wrangling', content: 'Sources, APIs, and data cleaning techniques' },
      { week: 4, topic: 'Exploratory Data Analysis', content: 'Visualization, patterns, and insights discovery' },
      { week: 5, topic: 'Machine Learning for Data Science', content: 'Supervised and unsupervised learning algorithms' },
      { week: 6, topic: 'Time Series Analysis', content: 'Forecasting, seasonality, and trend analysis' },
      { week: 7, topic: 'Big Data Technologies', content: 'Hadoop, Spark, and distributed computing' },
      { week: 8, topic: 'Data Visualization & Storytelling', content: 'Tableau, PowerBI, and narrative techniques' },
      { week: 9, topic: 'Natural Language Processing', content: 'Text mining, sentiment analysis, and topic modeling' },
      { week: 10, topic: 'Deep Learning for Data Science', content: 'Neural networks for structured and unstructured data' },
      { week: 11, topic: 'Capstone Project I', content: 'Problem definition and data collection' },
      { week: 12, topic: 'Capstone Project II', content: 'Implementation, evaluation, and presentation' }
    ]
  },
  {
    title: 'Mechanical Engineering Design',
    category: 'engineering',
    level: 'undergraduate',
    duration: '4 years',
    credits: 160,
    description: 'Complete mechanical engineering program with focus on design, manufacturing, and automation.',
    instructor: 'Prof. Suresh Kumar',
    students: 150,
    rating: 4.6,
    price: '₹2,50,000',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    skills: ['CAD Design', 'Manufacturing', 'Thermodynamics', 'Materials Science'],
    prerequisites: ['Physics', 'Mathematics', 'Chemistry'],
    syllabus: [
      { semester: 1, courses: ['Engineering Mathematics I', 'Engineering Physics', 'Engineering Chemistry', 'Engineering Graphics'] },
      { semester: 2, courses: ['Engineering Mathematics II', 'Materials Science', 'Basic Electrical Engineering', 'Programming Fundamentals'] },
      { semester: 3, courses: ['Mechanics of Materials', 'Thermodynamics', 'Manufacturing Processes I', 'Machine Drawing'] },
      { semester: 4, courses: ['Fluid Mechanics', 'Heat Transfer', 'Manufacturing Processes II', 'Kinematics of Machinery'] },
      { semester: 5, courses: ['Design of Machine Elements', 'Dynamics of Machinery', 'Metrology and Measurements', 'Control Systems'] },
      { semester: 6, courses: ['Computer Aided Design', 'Finite Element Analysis', 'Robotics and Automation', 'Industrial Engineering'] },
      { semester: 7, courses: ['Advanced Manufacturing', 'Refrigeration and Air Conditioning', 'Power Plant Engineering', 'Project Phase I'] },
      { semester: 8, courses: ['Automobile Engineering', 'Renewable Energy Systems', 'Professional Ethics', 'Project Phase II'] }
    ]
  },
  {
    title: 'Digital Marketing & E-Commerce',
    category: 'business',
    level: 'diploma',
    duration: '6 months',
    credits: 6,
    description: 'Learn digital marketing strategies, SEO, social media marketing, and e-commerce management.',
    instructor: 'Ms. Kavya Nair',
    students: 180,
    rating: 4.5,
    price: '₹20,000',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    skills: ['SEO', 'Social Media', 'Google Ads', 'Analytics', 'Content Marketing'],
    prerequisites: ['Basic Computer Skills'],
    syllabus: [
      { week: 1, topic: 'Digital Marketing Fundamentals', content: 'Overview, channels, and strategy development' },
      { week: 2, topic: 'Search Engine Optimization', content: 'On-page, off-page, and technical SEO' },
      { week: 3, topic: 'Social Media Marketing', content: 'Platform strategies, content creation, and community management' },
      { week: 4, topic: 'Paid Advertising', content: 'Google Ads, Facebook Ads, and campaign optimization' },
      { week: 5, topic: 'E-commerce Management', content: 'Platforms, product listings, and conversion optimization' },
      { week: 6, topic: 'Analytics & Reporting', content: 'Google Analytics, KPIs, and performance measurement' }
    ]
  },
  {
    title: 'Creative Writing & Literature',
    category: 'arts',
    level: 'undergraduate',
    duration: '3 years',
    credits: 120,
    description: 'Explore creative writing, literary analysis, and develop your unique voice as a writer.',
    instructor: 'Dr. Lakshmi Devi',
    students: 60,
    rating: 4.8,
    price: '₹1,80,000',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
    skills: ['Creative Writing', 'Literary Analysis', 'Poetry', 'Storytelling'],
    prerequisites: ['Language Proficiency'],
    syllabus: [
      { semester: 1, courses: ['Introduction to Literature', 'Elements of Fiction', 'Creative Writing Basics', 'World Literature I'] },
      { semester: 2, courses: ['Poetry Fundamentals', 'Literary Criticism', 'Narrative Techniques', 'World Literature II'] },
      { semester: 3, courses: ['Short Story Writing', 'Classical Literature', 'Literary Theory', 'Drama Studies'] },
      { semester: 4, courses: ['Novel Writing', 'Modern Literature', 'Comparative Literature', 'Film and Literature'] },
      { semester: 5, courses: ['Advanced Poetry', 'Postcolonial Literature', 'Publishing Workshop', 'Literary Journalism'] },
      { semester: 6, courses: ['Thesis Project', 'Contemporary Literature', 'Experimental Writing', 'Professional Writing'] }
    ]
  },
  {
    title: 'Biotechnology & Genetics',
    category: 'science',
    level: 'postgraduate',
    duration: '2 years',
    credits: 80,
    description: 'Advanced biotechnology program covering genetic engineering, molecular biology, and bioprocessing.',
    instructor: 'Dr. Ramesh Babu',
    students: 40,
    rating: 4.7,
    price: '₹3,00,000',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    skills: ['Genetic Engineering', 'Molecular Biology', 'Bioprocessing', 'Research'],
    prerequisites: ['Biology', 'Chemistry', 'Biochemistry'],
    syllabus: [
      { semester: 1, courses: ['Advanced Molecular Biology', 'Genetic Engineering', 'Biostatistics', 'Research Methodology'] },
      { semester: 2, courses: ['Genomics and Proteomics', 'Immunotechnology', 'Bioinformatics', 'Bioprocess Engineering'] },
      { semester: 3, courses: ['Pharmaceutical Biotechnology', 'Agricultural Biotechnology', 'Environmental Biotechnology', 'Research Project I'] },
      { semester: 4, courses: ['Industrial Biotechnology', 'Nanobiotechnology', 'Bioethics and IPR', 'Research Project II'] }
    ]
  }
];

async function migrateCourseData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGOURI);
    console.log('Connected to MongoDB');

    // Clear existing courses (optional - remove this line if you want to keep existing data)
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert new courses
    const insertedCourses = await Course.insertMany(coursesData);
    console.log(`Successfully migrated ${insertedCourses.length} courses to the database`);

    // Display the inserted courses
    insertedCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} (ID: ${course._id})`);
    });

    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
migrateCourseData();