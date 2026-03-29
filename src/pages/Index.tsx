import { useAuth } from '@/lib/auth-context';
import LoginPage from './LoginPage';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Redirect handled by router, but show login if somehow here
    window.location.href = '/dashboard';
    return null;
  }

  return <LoginPage />;
};

export default Index;
