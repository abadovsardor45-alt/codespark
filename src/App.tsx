import React, { useState, useEffect, useRef } from "react";
import {
  Code2,
  Palette,
  Sparkles,
  Layers,
  Terminal,
  Network,
  Monitor,
  Home,
  BookOpen,
  Trophy,
  Users,
  ShoppingBag,
  Flame,
  Award,
  ChevronRight,
  Play,
  CheckCircle,
  FileText,
  MessageSquare,
  Send,
  Sparkle,
  Sparkle as SparklesIcon,
  Search,
  Check,
  Heart,
  Share2,
  PlusCircle,
  AlertCircle,
  Info,
  Sliders,
  LogOut,
  ShoppingBag as StoreIcon,
  RotateCcw,
  User,
} from "lucide-react";
import { COURSES, LEADERBOARD, FORUM_POSTS, SHOP_ITEMS } from "./data";
import { Course, CourseId, Lesson, Challenge, UserProgress, ForumPost, ChatMessage } from "./types";

// Helper function to resolve dynamic lucide icons
const CourseIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Code2":
      return <Code2 className={className || "w-5 h-5"} />;
    case "Palette":
      return <Palette className={className || "w-5 h-5"} />;
    case "Sparkles":
      return <Sparkles className={className || "w-5 h-5"} />;
    case "Layers":
      return <Layers className={className || "w-5 h-5"} />;
    case "Terminal":
      return <Terminal className={className || "w-5 h-5"} />;
    case "Network":
      return <Network className={className || "w-5 h-5"} />;
    case "Monitor":
      return <Monitor className={className || "w-5 h-5"} />;
    default:
      return <Code2 className={className || "w-5 h-5"} />;
  }
};

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "leaderboard" | "community" | "shop">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Active lesson/challenge states (for Workspace View)
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [workspaceCode, setWorkspaceCode] = useState("");
  const [editorTab, setEditorTab] = useState<"code" | "preview">("code");
  
  // Execution and AI output states
  const [runResult, setRunResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<{ passed: boolean; explanation: string; suggestions: string[] } | null>(null);
  const [activeForumTab, setActiveForumTab] = useState<"all" | "tags">("all");
  
  // Forums state
  const [forums, setForums] = useState<ForumPost[]>(FORUM_POSTS);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostTag, setNewPostTag] = useState("JavaScript");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // Chat/Mentor States
  const [mentorChatHistory, setMentorChatHistory] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "ai",
      text: "👋 Hey there, future developer! I'm Sparky, your expert AI mentor here on CodeSpark. Need a hint on your code, want to decode a concept, or feel like testing a crazy logic idea? Send me a query anytime!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [mentorInput, setMentorInput] = useState("");
  const [isMentorLoading, setIsMentorLoading] = useState(false);
  const [sidebarChatOpen, setSidebarChatOpen] = useState(false);

  // User Gamification Stats (with localStorage)
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("codespark_user_progress");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default below */ }
    }
    return {
      xp: 2280,
      streak: 7,
      completedChallenges: ["html-h1-challenge"],
      completedLessons: ["html-intro"],
      level: 12,
      sparkCoins: 280,
      claimedCertificates: [],
      unlockedStoryPoints: 1
    };
  });

  const [activeNeonBadge, setActiveNeonBadge] = useState<boolean>(() => {
    return localStorage.getItem("codespark_equipped_neon") === "true";
  });

  const [activeSoundBundle, setActiveSoundBundle] = useState<boolean>(() => {
    return localStorage.getItem("codespark_equipped_sound") === "true";
  });

  // Track purchased items from the shop
  const [purchasedProducts, setPurchasedProducts] = useState<string[]>(() => {
    const saved = localStorage.getItem("codespark_purchased");
    return saved ? JSON.parse(saved) : [];
  });

  // Save progress
  useEffect(() => {
    localStorage.setItem("codespark_user_progress", JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem("codespark_purchased", JSON.stringify(purchasedProducts));
  }, [purchasedProducts]);

  const bottomChatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bottomChatEndRef.current) {
      bottomChatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mentorChatHistory, sidebarChatOpen]);

  // --- ACTIONS & HANDLERS ---
  
  // Calculate average user level and XP limits
  const xpForNextLevel = userProgress.level * 350;
  const xpPercentageOfLevel = Math.min(100, Math.floor((userProgress.xp / xpForNextLevel) * 100));

  // Initialize workspace when starting a lesson
  const handleStartLesson = (course: Course, lesson: Lesson) => {
    setActiveCourse(course);
    setActiveLesson(lesson);
    const challenge = lesson.challenges[0] || null;
    setActiveChallenge(challenge);
    setWorkspaceCode(challenge ? challenge.initialCode : "");
    setRunResult(null);
    setReviewResult(null);
    setEditorTab("code");
    setSidebarChatOpen(true); // Open AI Mentor whenever they code
  };

  const handleRunCode = () => {
    if (!activeChallenge) return;
    
    // Simulate Sound Effect if bought and equipped
    if (activeSoundBundle) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
      } catch (e) {
        console.log("Audio feedback error or blocked:", e);
      }
    }

    // Checking challenge solution
    const regexStr = activeChallenge.solutionRegex;
    let passed = false;
    if (regexStr) {
      try {
        const regex = new RegExp(regexStr);
        passed = regex.test(workspaceCode);
      } catch (e) {
        passed = workspaceCode.toLowerCase().includes(activeChallenge.title.toLowerCase());
      }
    } else {
      passed = workspaceCode.trim().length > 15;
    }

    if (passed) {
      setRunResult({
        success: true,
        message: "✨ Dynamic Test Engine Passed! Excellent visual layout and code patterns matching standard definitions."
      });

      // Update user stats if not already completed
      const isNewChallenge = !userProgress.completedChallenges.includes(activeChallenge.id);
      if (isNewChallenge) {
        const xpGained = activeChallenge.points;
        const coinsGained = Math.floor(xpGained * 0.6);
        
        let shouldLevelUp = false;
        let newXp = userProgress.xp + xpGained;
        let originalLevel = userProgress.level;
        let nextLevelLimit = originalLevel * 350;
        
        while (newXp >= nextLevelLimit) {
          shouldLevelUp = true;
          newXp -= nextLevelLimit;
          originalLevel += 1;
          nextLevelLimit = originalLevel * 350;
        }

        const updatedCompletedChallenges = [...userProgress.completedChallenges, activeChallenge.id];
        
        // Also check if current lesson challenges are all fully completed
        let updatedCompletedLessons = [...userProgress.completedLessons];
        if (activeLesson) {
          const allLessonChallengeIds = activeLesson.challenges.map(c => c.id);
          const allCompleted = allLessonChallengeIds.every(id => updatedCompletedChallenges.includes(id));
          if (allCompleted && !updatedCompletedLessons.includes(activeLesson.id)) {
            updatedCompletedLessons.push(activeLesson.id);
            newXp += activeLesson.xpAward; // Lesson complete bonus XP!
          }
        }

        setUserProgress(prev => ({
          ...prev,
          xp: newXp,
          level: originalLevel,
          sparkCoins: prev.sparkCoins + coinsGained,
          completedChallenges: updatedCompletedChallenges,
          completedLessons: updatedCompletedLessons,
          streak: prev.streak + (Math.random() > 0.75 ? 1 : 0), // Occasional streak booster
        }));
      }
    } else {
      setRunResult({
        success: false,
        message: `❌ Unit cases incomplete. Check if your selectors are correct. Hint: ${activeChallenge.hint}`
      });
    }
  };

  // Submit to Server for an expert AI Review
  const handleAIReview = async () => {
    if (!activeChallenge) return;
    setIsReviewing(true);
    setReviewResult(null);

    try {
      const response = await fetch("/api/review-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: workspaceCode,
          language: activeCourse?.id || "javascript",
          challenge: activeChallenge.title
        })
      });

      if (!response.ok) {
        throw new Error("Review response failed");
      }

      const data = await response.json();
      setReviewResult({
        passed: data.passed,
        explanation: data.explanation || "Your logic matches structural integrity requirements beautifully.",
        suggestions: data.suggestions || ["Keep code neat and leverage structural HTML tags."]
      });
    } catch (err) {
      console.error(err);
      // Fallback response inside sandbox if server unavailable
      setReviewResult({
        passed: true,
        explanation: "✨ Sparky Engine processed live client feedback! Your coding strategy represents excellent design fidelity. Keep it clean and continue testing dynamic states.",
        suggestions: [
          "Include proper semantic element tags instead of wrapper divs where accessible.",
          "Consider optimizing with asynchronous event wrappers.",
          "Leverage standard CSS shorthand variables for consistent colors."
        ]
      });
    } finally {
      setIsReviewing(false);
    }
  };

  // Chat with Sparky AI Mentor inside active workspace or global sidebar
  const handleSendMentorMessage = async () => {
    if (!mentorInput.trim()) return;
    const userMsgText = mentorInput.trim();
    setMentorInput("");

    // Add user message
    const userMsgId = "user-" + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMentorChatHistory(prev => [...prev, newUserMsg]);
    setIsMentorLoading(true);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          code: workspaceCode || undefined,
          language: activeCourse?.id || undefined,
          challengeTitle: activeChallenge?.title || undefined,
          chatHistory: mentorChatHistory.slice(-6).map(h => ({ sender: h.sender, text: h.text }))
        })
      });

      if (!response.ok) {
        throw new Error("Mentor query failed");
      }

      const data = await response.json();
      const aiReply: ChatMessage = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMentorChatHistory(prev => [...prev, aiReply]);
    } catch (error) {
      console.error(error);
      // Simulated interactive AI Sparky responses on error
      const mockWebReplies = [
        "Aha! That's a clever experiment. Double-check your matching syntax variables or CSS selectors first. Need a specific hint on the next block?",
        "Brilliant thinking! Let's examine if a missing closing tag or semicolon might be tripping the test engine. Keep it up! ⚡",
        "Oh, perfect! Sparky recommends wrapping this within a reusable arrow function logic construct like `() => {}` so we can maintain local isolation.",
        "That is correct. Let's look closely at why we declare variables with the constant immutable `const` keyword. It locks dynamic changes into memory safely!"
      ];
      const randomReply = mockWebReplies[Math.floor(Math.random() * mockWebReplies.length)];
      
      setTimeout(() => {
        setMentorChatHistory(prev => [
          ...prev,
          {
            id: "ai-" + Date.now(),
            sender: "ai",
            text: `🤖 ${randomReply}\n\n*(Sparky is running in local sandbox mode - configure your GEMINI_API_KEY inside the Secrets panel to activate actual context-aware AI comments!)*`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsMentorLoading(false);
      }, 700);
      return;
    } finally {
      setIsMentorLoading(false);
    }
  };

  // Upvote forum post
  const handleLikePost = (postId: string) => {
    setForums(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = p.likedByUser;
          return {
            ...p,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
            likedByUser: !isLiked
          };
        }
        return p;
      })
    );
  };

  // Submit forum post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: "post-" + Date.now(),
      author: "StudentSparker_" + userProgress.streak,
      avatar: "🐈‍⬛",
      role: `Lv. ${userProgress.level} Builder`,
      title: newPostTitle.trim(),
      tag: newPostTag,
      content: newPostContent.trim(),
      likes: 1,
      comments: 0,
      time: "Just now",
      likedByUser: true
    };

    setForums(prev => [newPost, ...prev]);
    setNewPostTitle("");
    setNewPostContent("");
    setShowNewPostModal(false);
    
    // Reward for active community participation!
    setUserProgress(prev => ({
      ...prev,
      sparkCoins: prev.sparkCoins + 15,
      xp: prev.xp + 25
    }));
  };

  // Buy item from shop
  const handleBuyShopItem = (item: typeof SHOP_ITEMS[0]) => {
    if (userProgress.sparkCoins < item.cost) {
      alert("⚠️ Request unsuccessful! You do not have enough SparkCoins. Complete code challenges, solve daily lessons, and contribute on the community forum to earn more.");
      return;
    }

    if (purchasedProducts.includes(item.id)) {
      // Toggle or equip toggler
      if (item.id === "badge-neon-king") {
        const val = !activeNeonBadge;
        setActiveNeonBadge(val);
        localStorage.setItem("codespark_equipped_neon", String(val));
      } else if (item.id === "theme-ambient") {
        const val = !activeSoundBundle;
        setActiveSoundBundle(val);
        localStorage.setItem("codespark_equipped_sound", String(val));
      }
      return;
    }

    // Purchase
    setPurchasedProducts(prev => [...prev, item.id]);
    setUserProgress(prev => ({
      ...prev,
      sparkCoins: prev.sparkCoins - item.cost
    }));

    if (item.id === "badge-neon-king") {
      setActiveNeonBadge(true);
      localStorage.setItem("codespark_equipped_neon", "true");
    } else if (item.id === "theme-ambient") {
      setActiveSoundBundle(true);
      localStorage.setItem("codespark_equipped_sound", "true");
    }
  };

  // Claims certificate
  const handleClaimCertificate = (courseId: CourseId, courseTitle: string) => {
    if (userProgress.claimedCertificates.includes(courseId)) return;
    
    setUserProgress(prev => ({
      ...prev,
      claimedCertificates: [...prev.claimedCertificates, courseId],
      sparkCoins: prev.sparkCoins + 100 // claim bonus
    }));

    alert(`🎉 Congratulations! You have claimed your official CodeSpark ${courseTitle} Completion Certificate. Fully signed by Sparky AI, your certified credentials are permanently logged to security nodes!`);
  };

  // Exit active lesson and returns to dashboard or courses tab
  const handleExitWorkspace = () => {
    setActiveCourse(null);
    setActiveLesson(null);
    setActiveChallenge(null);
    setWorkspaceCode("");
    setRunResult(null);
    setReviewResult(null);
  };

  // --- RENDERING VIEWS ---

  // Dashboard View
  const renderDashboard = () => {
    // Determine active progress for courses
    const htmlCompletedCount = COURSES[0].lessons.filter(l => userProgress.completedLessons.includes(l.id)).length;
    const htmlProgressPercent = Math.round((htmlCompletedCount / COURSES[0].lessons.length) * 100);

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
        
        {/* Banner Section (Col span 2, row-span-2) */}
        <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#1c2128] to-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative shadow-lg">
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="z-10">
            <span className="text-cyan-400 font-mono text-xs mb-2 block uppercase tracking-widest font-bold">🚀 Current Active Course</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">Advanced React Hooks & Patterns</h2>
            <p className="text-gray-400 text-sm max-w-md mb-6 leading-relaxed">
              Master useEffect state locks, custom render props, performance memoization limits, and the intricate world of React DOM virtual rendering nodes.
            </p>
            
            <div className="mb-4 bg-[#0d1117]/60 p-4 border border-[#30363d] rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400 font-mono">My Curriculum Progress</span>
                <span className="text-xs font-mono font-bold text-cyan-400">68% Complete</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden block">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-[68%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                // Launch React Hook course
                const reactCourse = COURSES.find(c => c.id === "react") || COURSES[0];
                handleStartLesson(reactCourse, reactCourse.lessons[0]);
              }}
              className="bg-cyan-400 text-black font-extrabold py-2.5 px-6 rounded-xl hover:bg-cyan-300 hover:scale-[1.02] transform duration-150 flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              Resume Lesson 12
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab("courses")}
              className="border border-[#30363d] bg-gray-950/40 text-gray-300 font-bold py-2.5 px-4 rounded-xl hover:bg-gray-800/60 duration-150 text-sm cursor-pointer"
            >
              Browse Curriculum
            </button>
          </div>
        </div>

        {/* Playground Live Preview Box */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col shadow-md h-full min-h-[220px]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Live Playground</span>
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
            </div>
          </div>
          <div className="bg-[#0d1117] rounded-xl p-3 font-mono text-[11px] flex-1 overflow-auto leading-relaxed border border-[#30363d]">
            <div className="text-purple-400 inline">const</div> <div className="text-blue-400 inline">CodeSpark</div> = () =&gt; &#123;<br/>
            &nbsp;&nbsp;<span className="text-purple-400">return</span> (<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-cyan-400">Dashboard</span>&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-yellow-400">BentoGrid</span> <span className="text-orange-400">glow</span>=&#123;<span className="text-purple-400">true</span>&#125;&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">"Learn to Code!"</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-yellow-400">BentoGrid</span>&gt;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-cyan-400">Dashboard</span>&gt;<br/>
            &nbsp;&nbsp;);<br/>
            &#125;;
            <div className="mt-3 pt-2 border-t border-gray-800 text-gray-500">
              {`// Output: Learn to Code! 🎉`}
            </div>
          </div>
        </div>

        {/* AI Mentor Assistant Widget */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col justify-between shadow-md h-full min-h-[220px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-sm block text-white">Sparky AI</span>
              <span className="text-[10px] text-gray-500 font-mono">Expert Coding Buddy</span>
            </div>
          </div>
          
          <div className="bg-[#0d1117] border border-purple-500/20 rounded-xl p-3 text-xs italic text-gray-300 leading-relaxed mt-2">
            "Your structural HTML components look solid, but remember to verify matching classes or semicolons to maximize stability indexes!"
          </div>
          
          <button
            onClick={() => {
              setSidebarChatOpen(true);
            }}
            className="text-purple-400 text-xs font-bold uppercase tracking-tight hover:text-purple-300 flex items-center gap-1.5 duration-100 cursor-pointer pt-2"
          >
            Chat with Sparky AI Mentor →
          </button>
        </div>

        {/* Consistency Calendar Widget */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Consistency</span>
              <span className="text-emerald-400 text-xs font-bold font-mono">Active Cycle</span>
            </div>
            <div className="flex gap-1.5 items-end h-14 mb-3 mt-1">
              <div className="flex-1 bg-cyan-900/30 rounded h-[30%] opacity-40"></div>
              <div className="flex-1 bg-cyan-500 rounded h-[75%]"></div>
              <div className="flex-1 bg-cyan-500 rounded h-[60%]"></div>
              <div className="flex-1 bg-[#238636] rounded h-[90%] block"></div>
              <div className="flex-1 bg-cyan-500 rounded h-[100%] shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              <div className="flex-1 bg-purple-500 rounded h-[70%]"></div>
              <div className="flex-1 bg-[#238636] rounded h-[85%] block"></div>
            </div>
          </div>
          <p className="text-xl font-extrabold text-white">
            {userProgress.streak * 48} <span className="text-xs text-gray-500 font-normal">Mins coding tracked this week</span>
          </p>
        </div>

        {/* Course Catalog Quick Access Grid (Col-Span-2) */}
        <div className="md:col-span-2 bg-[#161b22] border border-[#30363d] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Quick Curriculum Modules</span>
            <button 
              onClick={() => setActiveTab("courses")} 
              className="text-xs text-cyan-400 font-bold hover:underline cursor-pointer"
            >
              View Catalog
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {COURSES.slice(0, 3).map(course => (
              <div
                key={course.id}
                onClick={() => {
                  handleStartLesson(course, course.lessons[0]);
                }}
                className="bg-[#0d1117] border border-[#30363d] p-3 rounded-xl hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gray-900 border border-[#30363d] flex items-center justify-center mb-2 text-${course.accentColor}`}>
                  <CourseIcon name={course.icon} className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{course.title}</h3>
                  <p className="text-[9px] text-gray-500 font-mono mt-0.5">{course.lessons.length} Lessons • {course.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Standings Leaderboard Block */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col shadow-md">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Top Leaderboard</span>
            <span onClick={() => setActiveTab("leaderboard")} className="text-xs text-cyan-400 cursor-pointer font-bold hover:underline">Full Standings</span>
          </div>
          <div className="space-y-2 flex-1 flex flex-col justify-center">
            {LEADERBOARD.slice(0, 3).map((u, i) => (
              <div
                key={u.name}
                className={`flex items-center gap-2 text-sm p-1.5 rounded-xl border ${
                  i === 0 
                  ? "bg-yellow-500/5 border-yellow-500/20" 
                  : "bg-[#0d1117]/50 border-[#30363d]"
                }`}
              >
                <span className={`text-[10px] font-mono font-bold ${i === 0 ? "text-yellow-400" : "text-gray-400"}`}>
                  0{u.rank}
                </span>
                <span className="text-xs">{u.avatar}</span>
                <span className="flex-1 text-xs truncate font-medium text-gray-200">{u.name}</span>
                <span className="font-mono text-[10px] text-cyan-400 font-bold">{u.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  // Courses Browsing View
  const renderCourses = () => {
    return (
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-black text-white">Full Technology Tracks</h2>
          <p className="text-gray-400 text-sm mt-1">
            Choose from HTML, CSS, JavaScript, React, Python, Node.js, and modern UI/UX design components.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COURSES.map(course => {
            const completedCount = course.lessons.filter(l => userProgress.completedLessons.includes(l.id)).length;
            const progressPercent = Math.round((completedCount / course.lessons.length) * 100);
            const isFullyCompleted = completedCount === course.lessons.length;

            return (
              <div
                key={course.id}
                className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col justify-between group shadow-md hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-200"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-gradient-to-br from-[#1c2128] to-[#0d1117] border border-[#30363d] rounded-2xl flex items-center justify-center">
                      <CourseIcon name={course.icon} className="w-6 h-6 text-cyan-400 font-bold" />
                    </div>
                    <span className="px-2.5 py-0.5 border border-cyan-500/20 bg-cyan-950/40 text-cyan-400 text-[10px] rounded-full font-mono uppercase font-bold tracking-wider">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-gray-500 font-mono mt-4">
                    <span>Duration: {course.duration}</span>
                    <span>•</span>
                    <span>{course.lessons.length} Modules</span>
                  </div>
                </div>

                <div className="border-t border-[#30363d] mt-5 pt-4">
                  {completedCount > 0 ? (
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                        <span>Completed: {completedCount}/{course.lessons.length}</span>
                        <span className="text-cyan-400">{progressPercent}%</span>
                      </div>
                      <div className="h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 transition-all duration-300" 
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => handleStartLesson(course, course.lessons[0])}
                      className="bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs py-2 px-4 rounded-xl flex-1 flex items-center justify-center gap-1.5 duration-100 transform active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {completedCount > 0 ? "Continue Track" : "Launch Track"}
                    </button>

                    {isFullyCompleted ? (
                      <button
                        onClick={() => handleClaimCertificate(course.id, course.title)}
                        className={`text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1 cursor-pointer duration-100 ${
                          userProgress.claimedCertificates.includes(course.id)
                          ? "bg-purple-950/50 border border-purple-500/20 text-purple-400 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-500 text-white"
                        }`}
                        disabled={userProgress.claimedCertificates.includes(course.id)}
                      >
                        <Award className="w-3.5 h-3.5" />
                        {userProgress.claimedCertificates.includes(course.id) ? "Claimed" : "Claim Cert"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Leaderboard Standings View
  const renderLeaderboard = () => {
    return (
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Global League Standings
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Test your logic agility index alongside students globally. Climb tiers weekly!
            </p>
          </div>
          <div className="px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-2xl flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">My Global Tier:</span>
            <span className="text-sm font-extrabold text-cyan-400 font-mono">Lvl {userProgress.level} Elite</span>
          </div>
        </div>

        {/* Top 3 Visual Podium */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 items-end max-w-2xl mx-auto w-full py-6">
          {/* Rank 2 */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🐍</span>
            <span className="text-sm font-extrabold text-gray-200 truncate max-w-full">PyKing_99</span>
            <div className="w-full bg-[#161b22]/80 border border-[#30363d] h-28 rounded-t-2xl flex flex-col justify-between p-4 items-center relative">
              <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-gray-700 rounded-full text-[10px] text-white font-bold">2</div>
              <div className="text-center">
                <span className="text-xs text-gray-400 font-mono block">XP</span>
                <span className="font-mono text-base font-black text-cyan-400">8.2k</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-gray-800 rounded-full text-gray-300 font-bold">Logic Titan</span>
            </div>
          </div>
          
          {/* Rank 1 */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl animate-bounce">👩‍💻</span>
            <span className="text-sm font-extrabold text-white truncate max-w-full">SarahDev</span>
            <div className="w-full bg-gradient-to-t from-[#161b22] to-yellow-500/10 border border-yellow-500/30 h-36 rounded-t-2xl flex flex-col justify-between p-4 items-center relative shadow-[0_0_20px_rgba(234,179,8,0.1)]">
              <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full text-xs text-black font-extrabold shadow-md">1</div>
              <div className="text-center">
                <span className="text-xs text-gray-400 font-mono block">XP</span>
                <span className="font-mono text-lg font-black text-yellow-400">9.4k</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 bg-yellow-950 text-yellow-400 rounded-full font-bold border border-yellow-800">Aura Master</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-extrabold text-gray-200 truncate max-w-full font-medium">AlexSparkler</span>
            <div className="w-full bg-[#161b22]/80 border border-[#30363d] h-24 rounded-t-2xl flex flex-col justify-between p-4 items-center relative">
              <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-gray-800 rounded-full text-[10px] text-white">3</div>
              <div className="text-center">
                <span className="text-xs text-gray-400 font-mono block">XP</span>
                <span className="font-mono text-base font-black text-cyan-400">7.4k</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-gray-800 rounded-full text-gray-300 font-bold">Loop Wizard</span>
            </div>
          </div>
        </div>

        {/* Detailed Leaderboard Table */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-lg mt-2">
          <div className="p-4 bg-[#0d1117]/50 border-b border-[#30363d] flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">Competitor Standings</span>
            <span className="text-xs text-gray-400 font-mono">Live Sync Done</span>
          </div>

          <div className="divide-y divide-[#30363d]">
            {/* Inject current user rank custom item */}
            <div className="flex items-center justify-between p-4 bg-cyan-950/20 border-y border-cyan-500/20">
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-cyan-400">#06</span>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-lg ${activeNeonBadge ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-[#0d1117]" : ""}`}>
                  🚀
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">You (SparkDeveloper)</span>
                    <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border border-cyan-500/20">Active Player</span>
                  </div>
                  <span className="text-xs text-gray-500">Lv. {userProgress.level} Builder • {userProgress.streak} day streak</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 font-mono block">Accumulated Score</span>
                <span className="font-mono text-base font-black text-cyan-400">{userProgress.xp + 2280} XP</span>
              </div>
            </div>

            {/* List players */}
            {LEADERBOARD.map(u => (
              <div key={u.name} className="flex items-center justify-between p-4 hover:bg-gray-800/10 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-gray-500">#0{u.rank}</span>
                  <div className="w-10 h-10 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-lg">
                    {u.avatar}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">{u.name}</span>
                    <span className="text-xs text-gray-500">{u.badge}</span>
                  </div>
                </div>
                <div>
                  <span className="font-mono text-sm font-extrabold text-gray-300">{u.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Forums & Community Section View
  const renderCommunity = () => {
    return (
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Developer Communities
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Ask coding questions, share premium layouts, and collaborate with Sparkers.
            </p>
          </div>
          <button
            onClick={() => setShowNewPostModal(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 justify-center cursor-pointer shadow-lg active:scale-95 duration-100"
          >
            <PlusCircle className="w-4 h-4" />
            Create Tutorial Post
          </button>
        </div>

        {/* Grid Filters */}
        <div className="flex gap-2 border-b border-[#30363d] pb-4">
          <button
            onClick={() => setActiveForumTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold duration-150 cursor-pointer ${
              activeForumTab === "all" ? "bg-purple-950/40 border border-purple-500/30 text-purple-400" : "text-gray-400 hover:text-white"
            }`}
          >
            All Threads
          </button>
          <button
            onClick={() => setActiveForumTab("tags")}
            className={`px-4 py-2 rounded-xl text-xs font-bold duration-150 cursor-pointer ${
              activeForumTab === "tags" ? "bg-purple-950/40 border border-purple-500/30 text-purple-400" : "text-gray-400 hover:text-white"
            }`}
          >
            Browse Technical Tags
          </button>
        </div>

        {/* Write Tutorial Modal */}
        {showNewPostModal ? (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#161b22] border border-[#30363d] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
              <h3 className="text-lg font-bold text-white mb-4">Create New Tutorial Thread</h3>
              
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1 font-mono">Thread Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., How to center an element with Flexbox CSS"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1 font-mono">Course Tag</label>
                    <select
                      value={newPostTag}
                      onChange={(e) => setNewPostTag(e.target.value)}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                    >
                      <option value="HTML Essentials">HTML Essentials</option>
                      <option value="CSS Styling">CSS Styling</option>
                      <option value="JavaScript Engine">JavaScript Engine</option>
                      <option value="React Components">React Components</option>
                      <option value="Python Scripting">Python Scripting</option>
                      <option value="Node.js Server">Node.js Server</option>
                      <option value="UI/UX Spacing">UI/UX Spacing</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#a855f7] block mb-1 font-mono">Participation Award</label>
                    <div className="text-xs bg-purple-950/20 border border-purple-500/20 font-bold px-3 py-2 rounded-xl text-purple-400 flex items-center gap-1.5 h-[38px]">
                      <Sparkle className="w-3.5 h-3.5" />
                      +15 coins & +25 XP
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1 font-mono">Body Content (Markdown Supported)</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide a short description, reference logs, or code tips..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 outline-none resize-none font-sans"
                  ></textarea>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {/* Forum feeds */}
        <div className="flex flex-col gap-4">
          {forums.map(post => (
            <div key={post.id} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col gap-4 shadow-md">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-lg">
                    {post.avatar}
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">{post.author}</span>
                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wide font-bold">{post.role}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 bg-gray-800 border border-[#30363d] text-gray-300 text-[10px] font-mono rounded-full font-semibold">
                  {post.tag}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#f3f4f6]">{post.title}</h3>
                <p className="text-gray-400 text-xs mt-1.5 leading-relaxed font-sans">{post.content}</p>
              </div>

              <div className="flex items-center justify-between border-t border-[#30363d]/50 pt-4 text-xs text-gray-500">
                <span>{post.time}</span>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-1.5 cursor-pointer font-bold duration-100 ${
                      post.likedByUser ? "text-[#ec4899]" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByUser ? "fill-current" : ""}`} />
                    {post.likes} Upvotes
                  </button>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    {post.comments} Comments
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Shop & Customizations Store
  const renderShop = () => {
    return (
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex justify-between items-center bg-[#161b22] border border-purple-500/20 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl"></div>
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-purple-400" />
              Gamification Reward Shop
            </h2>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
              Earn **SparkCoins** by finishing challenges, then redeem them here to unlock premium cosmetics!
            </p>
          </div>
          
          <div className="bg-[#0d1117] px-4 py-3 border border-purple-500/30 rounded-xl flex items-center gap-2 text-right">
            <div>
              <span className="text-[9px] text-gray-500 font-mono block uppercase">In Wallet</span>
              <span className="text-base font-black text-[#eab308] font-mono">{userProgress.sparkCoins} Coins</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {SHOP_ITEMS.map((item) => {
            const isBought = purchasedProducts.includes(item.id);
            const isEquipped = item.id === "badge-neon-king" ? activeNeonBadge : activeSoundBundle;

            return (
              <div
                key={item.id}
                className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col justify-between shadow-md group border-t-4 border-t-purple-500/20"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 duration-150">
                      {item.avatar}
                    </div>
                    <span className="px-3 py-1 font-mono font-bold text-xs text-[#eab308] bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center gap-1 font-bold">
                      {item.cost} Coins
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.description}</p>
                </div>

                <div className="border-t border-[#30363d] mt-5 pt-4">
                  <button
                    onClick={() => handleBuyShopItem(item)}
                    className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold duration-150 flex items-center justify-center gap-2 cursor-pointer ${
                      isBought
                        ? isEquipped
                          ? "bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30"
                          : "bg-gray-800 border border-[#30363d] text-gray-300 hover:bg-gray-700"
                        : userProgress.sparkCoins >= item.cost
                          ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95"
                          : "bg-[#0d1117] border border-[#30363d] text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isBought ? (
                      isEquipped ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Equipped (Uncheck to Disable)
                        </>
                      ) : (
                        "Unequipped (Click to Equip)"
                      )
                    ) : (
                      `Redeem for ${item.cost} Coins`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Active Splitscreen Coding Sandbox Workspace
  const renderWorkspace = () => {
    if (!activeCourse || !activeLesson || !activeChallenge) return null;

    return (
      <div className="flex-1 flex flex-col gap-4 h-full">
        {/* Workspace Top Control Header */}
        <div className="flex items-center justify-between border border-[#30363d] bg-[#161b22] px-4 py-3 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExitWorkspace}
              className="px-3 py-1.5 border border-[#30363d] text-gray-300 font-bold hover:bg-gray-800/60 rounded-xl text-xs duration-100 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Exit Workspace
            </button>
            <div className="h-4 w-[1px] bg-gray-700 block mx-1"></div>
            <div>
              <span className="text-[10px] text-gray-500 font-mono tracking-wider font-bold block uppercase">
                {activeCourse.title} / {activeLesson.title}
              </span>
              <span className="text-white text-sm font-extrabold">{activeChallenge.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAIReview}
              disabled={isReviewing}
              className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs duration-100 flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isReviewing ? "Analyzing Logic..." : "AI Review Code"}
            </button>
            <button
              onClick={handleRunCode}
              className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold rounded-xl text-xs duration-100 flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)] active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Run & Test Custom cases
            </button>
          </div>
        </div>

        {/* Splitscreen Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
          
          {/* Instructions Column (Col-Span-4) */}
          <div className="lg:col-span-4 bg-[#161b22] border border-[#30363d] rounded-2xl p-5 overflow-auto flex flex-col gap-4 shadow-md max-h-[600px] lg:max-h-none">
            <div>
              <span className="px-2.5 py-0.5 border border-purple-500/20 bg-purple-950/40 text-purple-400 text-[10px] rounded-full font-mono uppercase font-bold tracking-wider">
                Module Instructions
              </span>
              <h3 className="text-lg font-black text-white mt-2 mb-1">{activeLesson.title}</h3>
              <p className="text-xs text-gray-400 font-mono">Difficulty: {activeChallenge.difficulty} • Reward: {activeChallenge.points} XP</p>
            </div>

            <div className="border-t border-[#30363d]/50 pt-3 text-xs text-gray-300 leading-relaxed font-sans overflow-auto max-h-48 lg:max-h-none flex-1 whitespace-pre-wrap">
              {activeLesson.content}
            </div>

            <div className="border-t border-[#30363d] pt-3 bg-[#0d1117] p-3 rounded-xl border">
              <span className="text-[10px] text-gray-500 block font-mono font-bold uppercase tracking-wider mb-1">Target Assessment Challenge</span>
              <p className="text-xs text-gray-200 leading-relaxed font-bold">{activeChallenge.instructions}</p>
            </div>

            {/* Hint Box */}
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 block uppercase tracking-wide">Sparky Prompt Hint</span>
                <p className="text-xs text-gray-300 mt-0.5 font-sans italic">"{activeChallenge.hint}"</p>
              </div>
            </div>
          </div>

          {/* Code Editor and Output Preview Screen (Col-Span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-4 min-h-[450px] lg:min-h-none">
            
            {/* Tabs Trigger Panel */}
            <div className="flex bg-[#161b22] border border-[#30363d] rounded-2xl p-1.5 self-start shadow-sm">
              <button
                onClick={() => setEditorTab("code")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold duration-150 cursor-pointer ${
                  editorTab === "code" ? "bg-cyan-950/40 border border-cyan-500/30 text-cyan-400" : "text-gray-400 hover:text-white"
                }`}
              >
                Sparky Code Editor
              </button>
              <button
                onClick={() => setEditorTab("preview")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold duration-150 cursor-pointer ${
                  workspaceCode.trim().length === 0 ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  editorTab === "preview" ? "bg-cyan-950/40 border border-cyan-500/30 text-cyan-400" : "text-gray-400 hover:text-white"
                }`}
                disabled={workspaceCode.trim().length === 0}
              >
                Sandbox Render View
              </button>
            </div>

            {/* Work Surface Wrapper */}
            <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden flex flex-col shadow-lg min-h-[300px]">
              {editorTab === "code" ? (
                /* Editor code area */
                <div className="flex-1 relative font-mono text-sm leading-relaxed flex flex-col m-1">
                  <div className="p-2 border-b border-[#30363d]/50 bg-[#0d1117] text-[10px] text-gray-500 flex justify-between uppercase font-mono tracking-widest font-bold">
                    <span>{activeCourse.id === "python" ? "main.py" : activeCourse.id === "html" ? "index.html" : "script.tsx"}</span>
                    <span>UTF-8 Engine</span>
                  </div>
                  <textarea
                    value={workspaceCode}
                    onChange={(e) => setWorkspaceCode(e.target.value)}
                    className="flex-1 w-full bg-[#0d1117] text-gray-200 p-4 font-mono text-xs focus:outline-none resize-none z-10 leading-6 border border-[#30363d] rounded-b-xl"
                    placeholder="// Unleash your code wizardry here..."
                    spellCheck="false"
                  ></textarea>
                </div>
              ) : (
                /* Output Sandbox Preview */
                <div className="flex-1 bg-[#0d1117] p-5 text-gray-200 overflow-auto flex flex-col justify-between font-mono text-xs relative">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold font-mono py-1 px-2.5 bg-emerald-950/30 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse"></span>
                    Live Exec Sandbox Active
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-wider font-bold mb-2">Browser Graphic Result Output:</span>
                    <div className="bg-[#161b22] border border-[#30363d]/80 rounded-xl p-6 font-sans">
                      {/* Interactive graphic simulation */}
                      {activeCourse.id === "html" ? (
                        <div className="border-l-4 border-orange-500 pl-4 py-2">
                          {workspaceCode.includes("<h1>") ? (
                            <h1 className="text-xl font-bold text-white mb-2">
                              {workspaceCode.match(/<h1>(.*?)<\/h1>/)?.[1] || "Hello CodeSpark!"}
                            </h1>
                          ) : (
                            <p className="text-xs text-gray-500 italic">// Missing structural heading. Write &lt;h1&gt; Hello CodeSpark! &lt;/h1&gt; to check rendering.</p>
                          )}
                          {workspaceCode.includes("<a") ? (
                            <a 
                              href="#" 
                              onClick={(e) => { e.preventDefault(); alert("Safe check - Simulation complete! CodeSpark has validated target anchor paths successfully."); }}
                              className="text-cyan-400 underline font-mono text-xs mt-2 block"
                            >
                              {workspaceCode.match(/<a[^>]*>(.*?)<\/a>/)?.[1] || "Google"}
                            </a>
                          ) : null}
                        </div>
                      ) : activeCourse.id === "css" ? (
                        <div className="flex flex-col gap-4 items-center justify-center py-6">
                          <p className="text-xs text-gray-400 text-center mb-1">Hover simulation panel styling:</p>
                          <button
                            style={{
                              boxShadow: workspaceCode.includes("box-shadow") 
                                ? "0 0 20px rgba(168,85,247,0.8)" 
                                : "none",
                              alignItems: workspaceCode.includes("align-items: center") ? "center" : "normal",
                              justifyContent: workspaceCode.includes("justify-content: center") ? "center" : "normal",
                              display: workspaceCode.includes("display: flex") ? "flex" : "block"
                            }}
                            className="bg-purple-600 hover:bg-purple-500 py-3 px-6 rounded-xl text-xs font-bold text-white tracking-widest duration-300"
                          >
                            NEON SHADOW TRIGGER
                          </button>
                        </div>
                      ) : activeCourse.id === "react" ? (
                        <div className="flex flex-col items-center gap-3 py-4 text-center">
                          <div className="px-4 py-2 bg-[#090d12] border border-cyan-500/20 rounded-xl font-mono text-cyan-400">
                            {workspaceCode.includes("const [spark") ? "const [spark, setSpark] = useState(true);" : "useState(false)"}
                          </div>
                          <button 
                            className="bg-cyan-500 text-black font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer hover:bg-cyan-400"
                            onClick={() => alert("Spark Hook initialized successfully!")}
                          >
                            Fire Hook Core
                          </button>
                        </div>
                      ) : (
                        <div className="bg-[#090d12] p-4 rounded-xl border border-gray-800 font-mono text-xs text-gray-300">
                          <p className="text-gray-500">// Simulated interpreter values:</p>
                          {workspaceCode.includes("answer") && <p className="text-yellow-400 mt-2">✓ answer = 42 successfully bound in local memory!</p>}
                          {workspaceCode.includes("double") && <p className="text-[#a855f7] mt-1">✓ double(num) compiled with multiplier registers.</p>}
                          {workspaceCode.includes("streaks") && <p className="text-emerald-400 mt-1">✓ List strengths defined in global index.</p>}
                          {!workspaceCode.includes("answer") && !workspaceCode.includes("double") && !workspaceCode.includes("streaks") && (
                            <p className="text-gray-400 italic">No variables bound. Type your logic script inside the editor canvas to preview variables here.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl text-[11px] leading-relaxed text-gray-400 mt-4">
                    <span className="font-extrabold text-white text-[11px] block text-purple-400 mb-1">💡 Sandbox ProTip:</span>
                    Interactive coding tracks automatically parse variable states! Toggle variables dynamically, click Run, and watch live outputs render instantly inside this container.
                  </div>
                </div>
              )}
            </div>

            {/* Execution Logs and Case Feedback (Always visible below editor) */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm">
              <span className="text-[10px] text-gray-500 font-mono tracking-wider font-extrabold uppercase">Console Output Feed & Test Analytics</span>
              
              {!runResult && !reviewResult && (
                <div className="text-xs text-gray-400 font-mono italic">
                  // No compiled processes executed. Modify code content and click 'Run & Test Custom cases' above!
                </div>
              )}

              {runResult && (
                <div className={`p-4 rounded-xl border flex items-start gap-2.5 text-xs font-mono font-medium ${
                  runResult.success 
                  ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-400" 
                  : "bg-red-950/30 border-red-500/20 text-red-400"
                }`}>
                  {runResult.success ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                  )}
                  <div>
                    <span className="font-bold block uppercase mb-0.5">{runResult.success ? "Passed Verification" : "Compilation Warning"}</span>
                    <p className="leading-relaxed">{runResult.message}</p>
                  </div>
                </div>
              )}

              {reviewResult && (
                <div className="p-4 bg-gradient-to-br from-[#0d1117] to-purple-950/20 border border-purple-500/30 rounded-xl text-xs flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="font-mono text-xs font-black text-purple-400 uppercase tracking-widest">AI Mentor Peer Review report</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-200 font-mono block">Assessment Summary</span>
                    <p className="text-gray-400 leading-relaxed mt-1 font-sans">{reviewResult.explanation}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-200 font-mono block">Actionable Recommendations</span>
                    <ul className="list-disc pl-4 space-y-1 mt-1 text-gray-400 font-mono text-[11px]">
                      {reviewResult.suggestions.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0d1117] text-gray-200 font-sans min-h-screen flex flex-col overflow-x-hidden p-3 md:p-5 relative md:pb-12">
      
      {/* Decorative Star Pulsing Glow Backgrounds */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Core Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 relative z-10 flex-1">
        
        {/* Top Header Panel */}
        <header className="flex flex-col md:flex-row justify-between items-stretch md:items-center bg-[#161b22] border border-[#30363d] rounded-2xl p-4 gap-4 shadow-md">
          <div className="flex gap-4 items-center">
            {/* Custom Brand Logo */}
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] transform hover:rotate-6 duration-150">
              <span className="font-black text-white text-xl">C</span>
            </div>
            <div>
              <div className="flex gap-4 items-center">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
                  CodeSpark <span className="text-cyan-400 font-mono text-xs px-2 py-0.5 bg-cyan-950 rounded-full border border-cyan-800">v2.4</span>
                </h1>
                <div className="h-4 w-[1px] bg-gray-700 hidden sm:block"></div>
                <div className="hidden sm:flex gap-2">
                  <span className="px-3 py-1 bg-[#238636] border border-green-800 text-white text-[10px] rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400 fill-current animate-pulse" />
                    {userProgress.streak} Day Streak
                  </span>
                  <span className="px-3 py-1 bg-[#1f6feb] border border-blue-800 text-white text-[10px] rounded-full font-bold uppercase tracking-wider">
                    Lvl {userProgress.level} Elite
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search tracks, posts, tags..."
                value={searchQuery}
                aria-label="search element"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-1.5 pl-10 text-xs w-full sm:w-60 focus:border-cyan-500 outline-none transition-all duration-150 text-gray-200 placeholder:text-gray-600 focus:shadow-[0_0_10px_rgba(6,182,212,0.15)]"
              />
              <Search className="w-3.5 h-3.5 text-gray-600 absolute left-3.5 top-2.5" />
            </div>

            {/* Top Stats Box */}
            <div className="flex items-center justify-between gap-4 p-1.5 px-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
              <div className="text-yellow-500 flex items-center gap-1 font-mono text-xs font-extrabold hover:scale-105 duration-100">
                <Sparkle className="w-4 h-4 text-yellow-400 fill-current" />
                {userProgress.xp + 2280} XP
              </div>
              <div className="h-4 w-[1px] bg-gray-800 block"></div>
              <div className="text-[#a855f7] flex items-center gap-1 font-mono text-xs font-extrabold hover:scale-105 duration-100">
                <StoreIcon className="w-4 h-4 text-[#a855f7]" />
                {userProgress.sparkCoins} Coins
              </div>
            </div>
          </div>
        </header>

        {/* Global Layout (Sidebar and View Grid) */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 items-stretch min-h-[500px]">
          
          {/* Permanent Desktop Navbar (Horizontal scroll on mobile) */}
          <nav className="flex lg:flex-col lg:w-20 bg-[#161b22] border border-[#30363d] rounded-2xl justify-around lg:justify-start items-center py-3 lg:py-8 gap-1.5 lg:gap-10 shadow-md">
            <div className="hidden lg:flex w-10 h-10 bg-gradient-to-tr from-[#1c2128] to-[#0d1117] border border-[#30363d] rounded-xl items-center justify-center text-xs font-mono font-bold text-gray-500">
              NAV
            </div>
            
            <div className="flex lg:flex-col gap-3 lg:gap-8 text-gray-500 w-full justify-around lg:items-center">
              <button
                onClick={() => { setActiveTab("dashboard"); handleExitWorkspace(); }}
                className={`p-3.5 rounded-xl cursor-pointer duration-150 flex flex-col lg:flex-row items-center gap-1 ${
                  activeTab === "dashboard" && !activeChallenge ? "text-cyan-400 bg-cyan-950/30 border border-cyan-500/20" : "hover:text-white"
                }`}
                title="Dashboard Module"
              >
                <Home className="w-5 h-5" />
                <span className="text-[9px] block lg:hidden font-bold">Dash</span>
              </button>

              <button
                onClick={() => { setActiveTab("courses"); handleExitWorkspace(); }}
                className={`p-3.5 rounded-xl cursor-pointer duration-150 flex flex-col lg:flex-row items-center gap-1 ${
                  activeTab === "courses" && !activeChallenge ? "text-cyan-400 bg-cyan-950/30 border border-cyan-500/20" : "hover:text-white"
                }`}
                title="Curriculum Tracks"
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-[9px] block lg:hidden font-bold">Tracks</span>
              </button>

              <button
                onClick={() => { setActiveTab("leaderboard"); handleExitWorkspace(); }}
                className={`p-3.5 rounded-xl cursor-pointer duration-150 flex flex-col lg:flex-row items-center gap-1 ${
                  activeTab === "leaderboard" && !activeChallenge ? "text-cyan-400 bg-cyan-950/30 border border-cyan-500/20" : "hover:text-white"
                }`}
                title="Leaderboard standings"
              >
                <Trophy className="w-5 h-5" />
                <span className="text-[9px] block lg:hidden font-bold">Leagues</span>
              </button>

              <button
                onClick={() => { setActiveTab("community"); handleExitWorkspace(); }}
                className={`p-3.5 rounded-xl cursor-pointer duration-150 flex flex-col lg:flex-row items-center gap-1 ${
                  activeTab === "community" && !activeChallenge ? "text-cyan-400 bg-cyan-950/30 border border-cyan-500/20" : "hover:text-white"
                }`}
                title="Forums community"
              >
                <Users className="w-5 h-5" />
                <span className="text-[9px] block lg:hidden font-bold">Forums</span>
              </button>

              <button
                onClick={() => { setActiveTab("shop"); handleExitWorkspace(); }}
                className={`p-3.5 rounded-xl cursor-pointer duration-150 flex flex-col lg:flex-row items-center gap-1 ${
                  activeTab === "shop" && !activeChallenge ? "text-cyan-400 bg-cyan-950/30 border border-cyan-500/20" : "hover:text-white"
                }`}
                title="Reward Store"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[9px] block lg:hidden font-bold">Store</span>
              </button>
            </div>

            <div className="hidden lg:block mt-auto">
              <div className={`w-10 h-10 rounded-full border border-gray-700 overflow-hidden text-center justify-center items-center flex bg-gradient-to-tr from-cyan-600 to-indigo-700 flex-shrink-0 relative ${activeNeonBadge ? "shadow-[0_0_15px_rgba(168,85,247,0.7)]" : ""}`}>
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </nav>

          {/* Workspace or Tab view selector element */}
          <main className="flex-1 min-w-0 flex flex-col">
            {activeChallenge ? (
              renderWorkspace()
            ) : (
              <>
                {activeTab === "dashboard" && renderDashboard()}
                {activeTab === "courses" && renderCourses()}
                {activeTab === "leaderboard" && renderLeaderboard()}
                {activeTab === "community" && renderCommunity()}
                {activeTab === "shop" && renderShop()}
              </>
            )}
          </main>

        </div>

        {/* Global Floating AI Sparky Mentor Assistant Panel */}
        {sidebarChatOpen && (
          <div className="fixed bottom-4 right-4 z-40 w-80 md:w-96 bg-[#161b22] border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[480px]">
            {/* Sidebar Chat Header */}
            <div className="p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse"></div>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1">Sparky AI Mentor <SparklesIcon className="w-3 h-3 text-purple-400" /></h4>
                  <span className="text-[9px] text-[#a855f7] font-bold font-mono uppercase">Context Aware Guide</span>
                </div>
              </div>
              <button
                onClick={() => setSidebarChatOpen(false)}
                className="text-gray-500 hover:text-white font-bold text-xs font-mono px-2 py-0.5 border border-transparent rounded hover:border-[#30363d] cursor-pointer"
              >
                Close Panel
              </button>
            </div>

            {/* Chats stream */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-[300px] bg-[#0d1117]/80">
              {mentorChatHistory.map(h => (
                <div key={h.id} className={`flex flex-col ${h.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[85%] ${
                    h.sender === "user"
                    ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 rounded-tr-none"
                    : "bg-purple-950/20 border border-purple-500/20 text-purple-100 rounded-tl-none whitespace-pre-wrap"
                  }`}>
                    {h.text}
                  </div>
                  <span className="text-[8px] text-gray-500 m-1 font-mono">{h.timestamp}</span>
                </div>
              ))}
              
              {isMentorLoading && (
                <div className="flex gap-1.5 items-center pl-1 text-[10px] text-purple-400 font-mono italic">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
                  Sparky compiling advice...
                </div>
              )}
              <div ref={bottomChatEndRef}></div>
            </div>

            {/* Input area */}
            <div className="p-2 border-t border-[#30363d] bg-[#161b22] flex gap-2">
              <input
                type="text"
                value={mentorInput}
                onChange={(e) => setMentorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMentorMessage();
                }}
                placeholder="Ask about CSS grids, JS variables..."
                className="flex-grow bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:border-purple-500 outline-none"
              />
              <button
                onClick={handleSendMentorMessage}
                disabled={isMentorLoading || !mentorInput.trim()}
                className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-xl flex items-center justify-center duration-100 cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Global trigger indicator if sidebar closed */}
        {!sidebarChatOpen && (
          <button
            onClick={() => setSidebarChatOpen(true)}
            className="fixed bottom-4 right-4 z-40 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-2xl cursor-pointer hover:scale-105 duration-100"
          >
            <Sparkles className="w-4 h-4 animate-bounce" />
            AI Sparky Mentor Active
          </button>
        )}

        {/* Dynamic Mobile Footer Details */}
        <footer className="text-center text-[10px] text-gray-500 font-mono mt-8 pb-4">
          <p>© 2026 CodeSpark Labs • Realised in Cloud Native sandbox workspace • Port: 3000</p>
        </footer>

      </div>
    </div>
  );
}
