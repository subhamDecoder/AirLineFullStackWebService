import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Components/Dashbord';

export default function App() {
  return (
    <Router>
      <Dashboard />
    </Router>
  );
}
