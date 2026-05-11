export const CATEGORIES = [
  { id: 'dsa', label: 'DSA', icon: '🧠', color: '#1565c0' },
  { id: 'webdev', label: 'Web Dev', icon: '🌐', color: '#2e7d32' },
  { id: 'ai', label: 'AI / ML', icon: '🤖', color: '#6a1b9a' },
  { id: 'cloud', label: 'Cloud', icon: '☁️', color: '#00695c' },
  { id: 'devops', label: 'DevOps', icon: '⚙️', color: '#e65100' },
  { id: 'mobile', label: 'Mobile', icon: '📱', color: '#c62828' },
  { id: 'language', label: 'Language', icon: '💻', color: '#f57f17' },
  { id: 'placement', label: 'Placement', icon: '🎯', color: '#4a148c' },
  { id: 'exam', label: 'Exam', icon: '📚', color: '#37474f' },
]

export const DEFAULT_ROADMAPS = [
  {
    id: 'dsa-cp',
    title: 'DSA & Competitive Programming',
    category: 'dsa',
    icon: '🧠',
    difficulty: 'intermediate',
    duration_weeks: 16,
    description: 'Master Data Structures and Algorithms from scratch to advanced. Crack FAANG interviews.',
    tags: ['dsa', 'algorithms', 'leetcode', 'faang', 'competitive'],
    is_default: true,
    phases: [
      {
        phase_number: 1,
        name: 'Foundation',
        duration_weeks: 2,
        color: '#1565c0',
        description: 'Basic programming concepts and complexity analysis',
        topics: [
          { topic: 'Time & Space Complexity', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Arrays & Strings Basics', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Recursion & Backtracking', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Hashing & HashMaps', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Two Pointers & Sliding Window', youtube_url: 'https://youtube.com/@takeUforward' },
        ]
      },
      {
        phase_number: 2,
        name: 'Linear Data Structures',
        duration_weeks: 3,
        color: '#1976d2',
        description: 'Linked List, Stack, Queue and their problems',
        topics: [
          { topic: 'Linked List — Single & Double', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Stack — Implementation & Problems', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Queue & Deque', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Monotonic Stack/Queue', youtube_url: 'https://youtube.com/@takeUforward' },
        ]
      },
      {
        phase_number: 3,
        name: 'Trees & Heaps',
        duration_weeks: 3,
        color: '#2e7d32',
        description: 'Binary Trees, BST, Heaps and their patterns',
        topics: [
          { topic: 'Binary Trees — All Traversals', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Binary Search Tree', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Heaps & Priority Queue', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Tries', youtube_url: 'https://youtube.com/@takeUforward' },
        ]
      },
      {
        phase_number: 4,
        name: 'Graphs',
        duration_weeks: 3,
        color: '#6a1b9a',
        description: 'BFS, DFS, Shortest Path, Topological Sort',
        topics: [
          { topic: 'BFS & DFS', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Cycle Detection', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Topological Sort', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Dijkstra & Bellman-Ford', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Minimum Spanning Tree', youtube_url: 'https://youtube.com/@takeUforward' },
        ]
      },
      {
        phase_number: 5,
        name: 'Dynamic Programming',
        duration_weeks: 3,
        color: '#e65100',
        description: 'DP patterns — from easy to hard',
        topics: [
          { topic: 'DP on Arrays — Kadane, Stock', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'DP on Strings — LCS, Edit Distance', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'DP on Grids', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Knapsack Variants', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'DP on Trees & Graphs', youtube_url: 'https://youtube.com/@takeUforward' },
        ]
      },
      {
        phase_number: 6,
        name: 'Contest & Mock Interviews',
        duration_weeks: 2,
        color: '#b71c1c',
        description: 'Competitive contests and timed mock interviews',
        topics: [
          { topic: 'Codeforces Div 3 Contests', youtube_url: 'https://codeforces.com' },
          { topic: 'LeetCode Weekly Contest', youtube_url: 'https://leetcode.com/contest' },
          { topic: 'Mock Interview 1 — Arrays+DP', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Mock Interview 2 — Graphs+Trees', youtube_url: 'https://youtube.com/@takeUforward' },
        ]
      },
    ]
  },

  {
    id: 'webdev-frontend',
    title: 'Web Dev — Frontend',
    category: 'webdev',
    icon: '🎨',
    difficulty: 'beginner',
    duration_weeks: 12,
    description: 'Learn HTML, CSS, JavaScript and React from scratch. Build beautiful UIs.',
    tags: ['html', 'css', 'javascript', 'react', 'frontend'],
    is_default: true,
    phases: [
      {
        phase_number: 1, name: 'HTML & CSS', duration_weeks: 2, color: '#e65100',
        description: 'Web fundamentals',
        topics: [
          { topic: 'HTML5 Semantic Tags', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'CSS Flexbox & Grid', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Responsive Design', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'CSS Animations', youtube_url: 'https://youtube.com/@CodeWithHarry' },
        ]
      },
      {
        phase_number: 2, name: 'JavaScript Core', duration_weeks: 3, color: '#f57f17',
        description: 'JS fundamentals to advanced',
        topics: [
          { topic: 'JS Basics — Variables, Functions, Loops', youtube_url: 'https://youtube.com/@akshaymarch7' },
          { topic: 'DOM Manipulation', youtube_url: 'https://youtube.com/@akshaymarch7' },
          { topic: 'ES6+ — Arrow, Destructuring, Spread', youtube_url: 'https://youtube.com/@akshaymarch7' },
          { topic: 'Async JS — Promises, Async/Await', youtube_url: 'https://youtube.com/@akshaymarch7' },
          { topic: 'Fetch API & REST calls', youtube_url: 'https://youtube.com/@akshaymarch7' },
        ]
      },
      {
        phase_number: 3, name: 'React Basics', duration_weeks: 3, color: '#1565c0',
        description: 'React core concepts',
        topics: [
          { topic: 'JSX & Components', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Props & State', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'useEffect & useState', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'React Router', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Context API', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
        ]
      },
      {
        phase_number: 4, name: 'React Advanced', duration_weeks: 2, color: '#4a148c',
        description: 'Advanced React + state management',
        topics: [
          { topic: 'Custom Hooks', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'React Query / TanStack', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Performance Optimization', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Tailwind CSS with React', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
        ]
      },
      {
        phase_number: 5, name: 'Projects & Deploy', duration_weeks: 2, color: '#2e7d32',
        description: 'Build and ship real projects',
        topics: [
          { topic: 'Portfolio Website', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Weather App with API', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Deploy on Vercel/Netlify', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'GitHub Portfolio Setup', youtube_url: 'https://github.com' },
        ]
      },
    ]
  },

  {
    id: 'fullstack-mern',
    title: 'Full Stack — MERN',
    category: 'webdev',
    icon: '🔥',
    difficulty: 'intermediate',
    duration_weeks: 20,
    description: 'MongoDB, Express, React, Node.js — build complete full-stack applications.',
    tags: ['mern', 'mongodb', 'express', 'react', 'nodejs', 'fullstack'],
    is_default: true,
    phases: [
      {
        phase_number: 1, name: 'Frontend — React', duration_weeks: 4, color: '#1565c0',
        description: 'Complete React frontend',
        topics: [
          { topic: 'React Components & Hooks', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'React Router v6', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'State Management', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Tailwind CSS', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Axios & API Integration', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
        ]
      },
      {
        phase_number: 2, name: 'Backend — Node + Express', duration_weeks: 4, color: '#2e7d32',
        description: 'REST API with Node.js',
        topics: [
          { topic: 'Node.js Basics', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Express.js REST API', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Middleware & Error Handling', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'JWT Authentication', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'File Uploads — Multer', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
        ]
      },
      {
        phase_number: 3, name: 'Database — MongoDB', duration_weeks: 3, color: '#e65100',
        description: 'MongoDB with Mongoose',
        topics: [
          { topic: 'MongoDB CRUD', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Mongoose Schema & Models', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Aggregation Pipeline', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Indexing & Performance', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
        ]
      },
      {
        phase_number: 4, name: 'Full Stack Integration', duration_weeks: 4, color: '#6a1b9a',
        description: 'Connect frontend + backend',
        topics: [
          { topic: 'CORS & Proxy Setup', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Auth Flow — Login/Signup', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Protected Routes', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Real-time with Socket.io', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
        ]
      },
      {
        phase_number: 5, name: 'Projects & Deploy', duration_weeks: 3, color: '#b71c1c',
        description: 'Build real projects and deploy',
        topics: [
          { topic: 'E-commerce App', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Chat App with Socket.io', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'Deploy — Railway + Vercel', youtube_url: 'https://railway.app' },
          { topic: 'Environment Variables & Security', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
        ]
      },
    ]
  },

  {
    id: 'ai-ml',
    title: 'AI / ML Engineering',
    category: 'ai',
    icon: '🤖',
    difficulty: 'intermediate',
    duration_weeks: 20,
    description: 'From Python basics to building real ML models. Scikit-learn, TensorFlow, deployment.',
    tags: ['python', 'ml', 'tensorflow', 'sklearn', 'ai', 'deeplearning'],
    is_default: true,
    phases: [
      {
        phase_number: 1, name: 'Python for ML', duration_weeks: 3, color: '#1565c0',
        description: 'Python, NumPy, Pandas, Matplotlib',
        topics: [
          { topic: 'Python OOP', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'NumPy Arrays & Operations', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'Pandas DataFrames', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'Matplotlib & Seaborn', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'EDA — Exploratory Data Analysis', youtube_url: 'https://youtube.com/@campusx-official' },
        ]
      },
      {
        phase_number: 2, name: 'ML Fundamentals', duration_weeks: 4, color: '#6a1b9a',
        description: 'Supervised & Unsupervised Learning',
        topics: [
          { topic: 'Linear & Logistic Regression', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'Decision Tree & Random Forest', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'SVM & KNN', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'K-Means Clustering', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'Model Evaluation — Cross Validation', youtube_url: 'https://youtube.com/@campusx-official' },
        ]
      },
      {
        phase_number: 3, name: 'Deep Learning', duration_weeks: 4, color: '#e65100',
        description: 'Neural Networks, CNN, RNN',
        topics: [
          { topic: 'Neural Network Basics', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'TensorFlow & Keras', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'CNN — Image Classification', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'RNN & LSTM', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'Transfer Learning', youtube_url: 'https://youtube.com/@campusx-official' },
        ]
      },
      {
        phase_number: 4, name: 'NLP & Gen AI', duration_weeks: 4, color: '#2e7d32',
        description: 'NLP, Transformers, LLMs',
        topics: [
          { topic: 'Text Preprocessing — NLTK', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'Transformers & BERT', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'Hugging Face', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'LangChain Basics', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'RAG Application', youtube_url: 'https://youtube.com/@campusx-official' },
        ]
      },
      {
        phase_number: 5, name: 'Projects & Deploy', duration_weeks: 3, color: '#b71c1c',
        description: 'Real ML projects with deployment',
        topics: [
          { topic: 'House Price Predictor', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'Spam Classifier', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'Flask API for ML Model', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'Deploy on Hugging Face Spaces', youtube_url: 'https://huggingface.co/spaces' },
          { topic: 'Kaggle Competitions', youtube_url: 'https://kaggle.com' },
        ]
      },
    ]
  },

  {
    id: 'cloud-azure',
    title: 'Cloud — Microsoft Azure',
    category: 'cloud',
    icon: '☁️',
    difficulty: 'intermediate',
    duration_weeks: 12,
    description: 'Azure fundamentals to AZ-900 certification. Free exam voucher available.',
    tags: ['azure', 'cloud', 'az900', 'microsoft', 'certification'],
    is_default: true,
    phases: [
      {
        phase_number: 1, name: 'Cloud Fundamentals', duration_weeks: 2, color: '#0078d4',
        description: 'What is cloud, IaaS, PaaS, SaaS',
        topics: [
          { topic: 'Cloud Concepts & Models', youtube_url: 'https://youtube.com/@AdamMarczakYT' },
          { topic: 'IaaS vs PaaS vs SaaS', youtube_url: 'https://youtube.com/@AdamMarczakYT' },
          { topic: 'Azure Global Infrastructure', youtube_url: 'https://youtube.com/@AdamMarczakYT' },
        ]
      },
      {
        phase_number: 2, name: 'Azure Core Services', duration_weeks: 3, color: '#0078d4',
        description: 'VMs, Storage, Networking',
        topics: [
          { topic: 'Azure Virtual Machines', youtube_url: 'https://youtube.com/@AdamMarczakYT' },
          { topic: 'Azure Storage (Blob, Files)', youtube_url: 'https://youtube.com/@AdamMarczakYT' },
          { topic: 'Azure Networking — VNet, DNS', youtube_url: 'https://youtube.com/@AdamMarczakYT' },
          { topic: 'Azure App Service', youtube_url: 'https://youtube.com/@AdamMarczakYT' },
        ]
      },
      {
        phase_number: 3, name: 'Security & Governance', duration_weeks: 2, color: '#2e7d32',
        description: 'IAM, Security Center, Compliance',
        topics: [
          { topic: 'Azure Active Directory', youtube_url: 'https://youtube.com/@AdamMarczakYT' },
          { topic: 'Azure Security Center', youtube_url: 'https://youtube.com/@AdamMarczakYT' },
          { topic: 'RBAC & Policies', youtube_url: 'https://youtube.com/@AdamMarczakYT' },
        ]
      },
      {
        phase_number: 4, name: 'AZ-900 Exam Prep', duration_weeks: 3, color: '#b71c1c',
        description: 'Mock tests and exam preparation',
        topics: [
          { topic: 'AZ-900 Practice Tests', resource_url: 'https://learn.microsoft.com', youtube_url: 'https://youtube.com/@AdamMarczakYT' },
          { topic: 'Microsoft Learn Path', resource_url: 'https://learn.microsoft.com/azure', youtube_url: 'https://learn.microsoft.com' },
          { topic: 'Free Voucher — MS Training Days', resource_url: 'https://microsoft.com/trainingdays', youtube_url: 'https://microsoft.com/trainingdays' },
          { topic: 'AZ-900 Exam 🎯', resource_url: 'https://learn.microsoft.com/certifications/azure-fundamentals' },
        ]
      },
    ]
  },

  {
    id: 'python-lang',
    title: 'Python Programming',
    category: 'language',
    icon: '🐍',
    difficulty: 'beginner',
    duration_weeks: 8,
    description: 'Python from scratch to intermediate. OOP, file handling, libraries.',
    tags: ['python', 'beginner', 'programming', 'oop'],
    is_default: true,
    phases: [
      {
        phase_number: 1, name: 'Python Basics', duration_weeks: 2, color: '#f57f17',
        description: 'Variables, loops, functions',
        topics: [
          { topic: 'Variables, Data Types', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Loops & Conditions', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Functions & Scope', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Lists, Tuples, Dicts, Sets', youtube_url: 'https://youtube.com/@CodeWithHarry' },
        ]
      },
      {
        phase_number: 2, name: 'OOP & Modules', duration_weeks: 2, color: '#1565c0',
        description: 'Classes, inheritance, modules',
        topics: [
          { topic: 'Classes & Objects', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Inheritance & Polymorphism', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'File Handling', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Exception Handling', youtube_url: 'https://youtube.com/@CodeWithHarry' },
        ]
      },
      {
        phase_number: 3, name: 'Libraries & Tools', duration_weeks: 2, color: '#2e7d32',
        description: 'Popular Python libraries',
        topics: [
          { topic: 'pip & Virtual Environments', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'requests Library', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'JSON Handling', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Regular Expressions', youtube_url: 'https://youtube.com/@CodeWithHarry' },
        ]
      },
      {
        phase_number: 4, name: 'Projects & Cert', duration_weeks: 2, color: '#6a1b9a',
        description: 'Build projects and get certified',
        topics: [
          { topic: 'CLI Todo App', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Web Scraper with BeautifulSoup', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'HackerRank Python Cert', resource_url: 'https://hackerrank.com/skills-verification/python_basic', cert_url: 'https://hackerrank.com/skills-verification/python_basic' },
        ]
      },
    ]
  },

  {
    id: 'placement-product',
    title: 'Placement Prep — Product Based',
    category: 'placement',
    icon: '🎯',
    difficulty: 'advanced',
    duration_weeks: 24,
    description: 'Target FAANG/product companies. DSA + System Design + Projects + HR.',
    tags: ['placement', 'faang', 'product', 'interview', 'system-design'],
    is_default: true,
    phases: [
      {
        phase_number: 1, name: 'DSA Foundation', duration_weeks: 6, color: '#1565c0',
        description: 'Arrays to Graphs — 150 problems',
        topics: [
          { topic: 'Arrays, Strings, Hashing', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Recursion & Backtracking', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Linked List, Stack, Queue', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Trees & Graphs', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Dynamic Programming', youtube_url: 'https://youtube.com/@takeUforward' },
        ]
      },
      {
        phase_number: 2, name: 'Core CS Subjects', duration_weeks: 4, color: '#6a1b9a',
        description: 'OS, DBMS, CN, OOP',
        topics: [
          { topic: 'Operating Systems — Key Concepts', youtube_url: 'https://youtube.com/@GateSmashers' },
          { topic: 'DBMS — SQL + Normalization', youtube_url: 'https://youtube.com/@GateSmashers' },
          { topic: 'Computer Networks', youtube_url: 'https://youtube.com/@GateSmashers' },
          { topic: 'OOP Concepts', youtube_url: 'https://youtube.com/@GateSmashers' },
        ]
      },
      {
        phase_number: 3, name: 'Projects + GitHub', duration_weeks: 4, color: '#2e7d32',
        description: '2-3 solid projects for resume',
        topics: [
          { topic: 'Full Stack Project 1', youtube_url: 'https://youtube.com/@hiteshchoudharydotcom' },
          { topic: 'ML/AI Project', youtube_url: 'https://youtube.com/@campusx-official' },
          { topic: 'GitHub Portfolio Polish', resource_url: 'https://github.com' },
          { topic: 'Resume ATS Optimization', resource_url: 'https://resumeworded.com' },
        ]
      },
      {
        phase_number: 4, name: 'System Design', duration_weeks: 4, color: '#e65100',
        description: 'Low & High Level System Design',
        topics: [
          { topic: 'System Design Basics', youtube_url: 'https://youtube.com/@gauravsen' },
          { topic: 'Design URL Shortener', youtube_url: 'https://youtube.com/@gauravsen' },
          { topic: 'Design Twitter/Instagram', youtube_url: 'https://youtube.com/@gauravsen' },
          { topic: 'Design WhatsApp Chat', youtube_url: 'https://youtube.com/@gauravsen' },
        ]
      },
      {
        phase_number: 5, name: 'Mock Interviews', duration_weeks: 4, color: '#b71c1c',
        description: 'Timed mocks + behavioral prep',
        topics: [
          { topic: 'LeetCode Mock Interview Mode', resource_url: 'https://leetcode.com/interview' },
          { topic: 'Pramp Mock Interviews', resource_url: 'https://pramp.com' },
          { topic: 'HR Questions — STAR Method', youtube_url: 'https://youtube.com/@CareerVidz' },
          { topic: 'Offer Negotiation Tips', youtube_url: 'https://youtube.com/@CareerVidz' },
        ]
      },
    ]
  },

  {
    id: 'java-lang',
    title: 'Java Programming',
    category: 'language',
    icon: '☕',
    difficulty: 'beginner',
    duration_weeks: 10,
    description: 'Java from scratch — OOP, Collections, Multithreading, Spring Boot basics.',
    tags: ['java', 'oop', 'spring', 'backend', 'programming'],
    is_default: true,
    phases: [
      {
        phase_number: 1, name: 'Java Basics', duration_weeks: 2, color: '#e65100',
        description: 'Syntax, data types, control flow',
        topics: [
          { topic: 'JDK Setup & Hello World', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Variables, Data Types, Operators', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Arrays & Strings', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Methods & Recursion', youtube_url: 'https://youtube.com/@CodeWithHarry' },
        ]
      },
      {
        phase_number: 2, name: 'OOP in Java', duration_weeks: 3, color: '#1565c0',
        description: 'Classes, Inheritance, Polymorphism',
        topics: [
          { topic: 'Classes & Objects', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Inheritance & Interfaces', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Abstract Classes & Polymorphism', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Exception Handling', youtube_url: 'https://youtube.com/@CodeWithHarry' },
        ]
      },
      {
        phase_number: 3, name: 'Advanced Java', duration_weeks: 3, color: '#2e7d32',
        description: 'Collections, Generics, Threads',
        topics: [
          { topic: 'Collections Framework', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Generics', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Multithreading Basics', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'File I/O & Streams', youtube_url: 'https://youtube.com/@CodeWithHarry' },
        ]
      },
      {
        phase_number: 4, name: 'Spring Boot Intro', duration_weeks: 2, color: '#6a1b9a',
        description: 'REST API with Spring Boot',
        topics: [
          { topic: 'Spring Boot Setup', youtube_url: 'https://youtube.com/@DailyCodeBuffer' },
          { topic: 'REST API with Spring', youtube_url: 'https://youtube.com/@DailyCodeBuffer' },
          { topic: 'JPA & MySQL', youtube_url: 'https://youtube.com/@DailyCodeBuffer' },
          { topic: 'HackerRank Java Cert', cert_url: 'https://hackerrank.com/skills-verification/java_basic' },
        ]
      },
    ]
  },

  {
    id: 'devops',
    title: 'DevOps & CI/CD',
    category: 'devops',
    icon: '⚙️',
    difficulty: 'advanced',
    duration_weeks: 16,
    description: 'Docker, Kubernetes, GitHub Actions, Jenkins, AWS DevOps. Industry standard tools.',
    tags: ['devops', 'docker', 'kubernetes', 'cicd', 'aws', 'jenkins'],
    is_default: true,
    phases: [
      {
        phase_number: 1, name: 'Linux & Scripting', duration_weeks: 2, color: '#37474f',
        description: 'Linux basics and shell scripting',
        topics: [
          { topic: 'Linux Commands', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'Shell Scripting Basics', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'Cron Jobs', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
        ]
      },
      {
        phase_number: 2, name: 'Docker', duration_weeks: 3, color: '#0078d4',
        description: 'Containers and Docker',
        topics: [
          { topic: 'Docker Basics — Images & Containers', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'Dockerfile & Docker Compose', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'Docker Hub & Registry', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
        ]
      },
      {
        phase_number: 3, name: 'Kubernetes', duration_weeks: 4, color: '#1565c0',
        description: 'Container orchestration',
        topics: [
          { topic: 'K8s Architecture', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'Pods, Services, Deployments', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'Helm Charts', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'Minikube Practice', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
        ]
      },
      {
        phase_number: 4, name: 'CI/CD Pipelines', duration_weeks: 4, color: '#2e7d32',
        description: 'GitHub Actions + Jenkins',
        topics: [
          { topic: 'GitHub Actions Workflows', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'Jenkins Pipeline', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'SonarQube Code Quality', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'ArgoCD — GitOps', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
        ]
      },
      {
        phase_number: 5, name: 'Cloud + Deploy', duration_weeks: 3, color: '#e65100',
        description: 'AWS + full pipeline project',
        topics: [
          { topic: 'AWS EC2 + S3 Basics', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'Deploy App on K8s + AWS', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
          { topic: 'Monitoring — Prometheus + Grafana', youtube_url: 'https://youtube.com/@TechWorldwithNana' },
        ]
      },
    ]
  },

  {
    id: 'placement-service',
    title: 'Placement Prep — Service Based',
    category: 'placement',
    icon: '💼',
    difficulty: 'beginner',
    duration_weeks: 16,
    description: 'Target TCS, Infosys, Wipro, Cognizant. Aptitude + Basic DSA + HR.',
    tags: ['placement', 'tcs', 'infosys', 'wipro', 'service', 'aptitude'],
    is_default: true,
    phases: [
      {
        phase_number: 1, name: 'Aptitude', duration_weeks: 3, color: '#1565c0',
        description: 'Quant, Verbal, Logical',
        topics: [
          { topic: 'Quantitative Aptitude', youtube_url: 'https://youtube.com/@CareerRide' },
          { topic: 'Verbal Ability', youtube_url: 'https://youtube.com/@CareerRide' },
          { topic: 'Logical Reasoning', youtube_url: 'https://youtube.com/@CareerRide' },
          { topic: 'IndiaBix Practice', resource_url: 'https://indiabix.com' },
        ]
      },
      {
        phase_number: 2, name: 'Basic Coding', duration_weeks: 3, color: '#2e7d32',
        description: 'Basic DSA for service companies',
        topics: [
          { topic: 'Arrays & Strings — Easy', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: 'Pattern Programs', youtube_url: 'https://youtube.com/@CodeWithHarry' },
          { topic: 'Basic Math Problems', youtube_url: 'https://youtube.com/@takeUforward' },
          { topic: '30 Easy LeetCode Problems', resource_url: 'https://leetcode.com' },
        ]
      },
      {
        phase_number: 3, name: 'CS Fundamentals', duration_weeks: 3, color: '#6a1b9a',
        description: 'OS, DBMS, CN basics',
        topics: [
          { topic: 'OS Interview Questions', youtube_url: 'https://youtube.com/@GateSmashers' },
          { topic: 'DBMS SQL Basics', youtube_url: 'https://youtube.com/@GateSmashers' },
          { topic: 'Networking Basics', youtube_url: 'https://youtube.com/@GateSmashers' },
        ]
      },
      {
        phase_number: 4, name: 'HR & Communication', duration_weeks: 3, color: '#e65100',
        description: 'HR round preparation',
        topics: [
          { topic: 'Tell me about yourself', youtube_url: 'https://youtube.com/@CareerVidz' },
          { topic: 'Strengths & Weaknesses', youtube_url: 'https://youtube.com/@CareerVidz' },
          { topic: 'STAR Method Answers', youtube_url: 'https://youtube.com/@CareerVidz' },
          { topic: 'Group Discussion Tips', youtube_url: 'https://youtube.com/@CareerVidz' },
        ]
      },
    ]
  },
]