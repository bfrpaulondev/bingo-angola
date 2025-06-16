import { createBrowserRouter } from 'react-router-dom';
import Layout      from '@/components/Layout';
import Login       from '@/pages/Login';
import Tracking    from '@/pages/Tracking';
import Contact     from '@/pages/Contact';
import Policy      from '@/pages/Policy';

export const router = createBrowserRouter([
  { element: <Layout />, children: [
      { path: '/',           element: <Login    /> },
      { path: '/tracking',   element: <Tracking /> },
      { path: '/contact',    element: <Contact  /> },
      { path: '/policy',     element: <Policy   /> },
    ]
  }
]);
