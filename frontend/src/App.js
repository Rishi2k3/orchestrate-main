import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import EventFeed from "./components/Feed/EventFeed";
import EventForm from "./components/Feed/EventForm";
import Navbar from "./components/Feed/Navbar";
import RazorpayButton from "./components/Feed/RazorpayButton";
import ReportsPage from "./components/Reports/ReportsPage"; 

// 🛠️ Event Creator Tasks
import Dashboard from "./components/Event Creator Tasks/Dashboard";
import EventTasks from "./components/Event Creator Tasks/EventTasks";  
import TaskDetails from "./components/Event Creator Tasks/TaskDetails";

// 🛠️ Assignee Tasks
import DashboardAssignee from "./components/Assignee Tasks/Dashboard_Assignee";
import TaskDetailsAssignee from "./components/Assignee Tasks/TaskDetails_Assignee";
import { TaskProvider } from "./components/Assignee Tasks/TaskContext_Assignee";
import { TaskContextProvider } from "./components/Event Creator Tasks/TaskContext";

import "./styles/App.css";

function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoggedInUser(null);
    };

    return (
        <TaskContextProvider>
            <TaskProvider>
                <Router>
                    {loggedInUser && <Navbar handleLogout={handleLogout} userRole={loggedInUser?.role} />}
                    <Routes>

                        {/* ✅ Login & Redirect */}
                        <Route
                            path="/"
                            element={loggedInUser ? <Navigate to="/feed" replace /> : <Login setLoggedInUser={setLoggedInUser} />}
                        />

                        {/* ✅ Event Feed */}
                        <Route
                            path="/feed"
                            element={loggedInUser ? (
                                <div>
                                    <EventFeed loggedInUser={loggedInUser} />
                                    <RazorpayButton amount={100} />
                                </div>
                            ) : <Navigate to="/" replace />}
                        />

                        {/* ✅ Event Creation */}
                        <Route
                            path="/create-event"
                            element={loggedInUser ? <EventForm /> : <Navigate to="/" replace />}
                        />

                        {/* ✅ Reports */}
                        <Route
                            path="/reports/*"
                            element={loggedInUser ? <ReportsPage /> : <Navigate to="/" replace />}
                        />

                        {/* ✅ Event Management */}
                        <Route
                            path="/manage-events"
                            element={loggedInUser ? <Dashboard /> : <Navigate to="/" replace />}
                        />

                        {/* ✅ Event Tasks */}
                        <Route
                            path="/tasks/:eventId"    
                            element={loggedInUser ? <EventTasks /> : <Navigate to="/" replace />}
                        />

                        {/* 🔥 Fixed Task Details Route */}
                        <Route
                            path="/task/:taskId"     // ✅ Proper route for Task Details
                            element={loggedInUser ? <TaskDetails /> : <Navigate to="/" replace />}
                        />

                        {/* ✅ Assignee Section */}
                        <Route
                            path="/pending-tasks"
                            element={loggedInUser ? <DashboardAssignee /> : <Navigate to="/" replace />}
                        />

                        {/* 🔥 Fixed Assignee Task Details */}
                        <Route
                            path="/assignee-task/:taskId"   // ✅ Separate route for assignee task
                            element={loggedInUser ? <TaskDetailsAssignee /> : <Navigate to="/" replace />}
                        />

                    </Routes>
                </Router>
            </TaskProvider>
        </TaskContextProvider>
    );
}

export default App;

