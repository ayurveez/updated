import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Courses } from './components/Courses';
import { AyurveezChat } from './components/AyurveezChat';
import { StudyScheduler } from './components/StudyScheduler';
import { Wellness } from './components/Wellness';
import { AccessLogin } from './components/AccessLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ViewState, StudentPermissions } from './types';

function App() {
  const [currentView, setView] = useState<ViewState>(ViewState.HOME);
  const [isAdmin, setIsAdmin] = useState(false);
  const [studentPermissions, setStudentPermissions] = useState<StudentPermissions>({
    allowedProffs: [],
    allowedSubjects: []
  });

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <Home setView={setView} />;
      case ViewState.COURSES:
        return <Courses />;
      case ViewState.AI_CHAT:
        return <AyurveezChat />;
      case ViewState.SCHEDULER:
        return <StudyScheduler />;
      case ViewState.WELLNESS:
        return <Wellness />;
      case ViewState.LOGIN:
        return (
          <AccessLogin 
            setView={setView} 
            setIsAdmin={setIsAdmin} 
            setPermissions={setStudentPermissions} 
          />
        );
      case ViewState.STUDENT_DASHBOARD:
        return <StudentDashboard permissions={studentPermissions} />;
      case ViewState.ADMIN_DASHBOARD:
        return isAdmin 
          ? <AdminDashboard /> 
          : <AccessLogin setView={setView} setIsAdmin={setIsAdmin} setPermissions={setStudentPermissions} />;
      default:
        return <Home setView={setView} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setView}
      isAdmin={isAdmin}
      setIsAdmin={setIsAdmin}
    >
      {renderView()}
    </Layout>
  );
}

export default App;
