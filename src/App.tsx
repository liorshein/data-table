import { FaGithub } from "react-icons/fa";
import Docs from "./docs";
import { EmployeesTableDemo } from "./demo";
import { NavLink, Route, Routes } from "react-router";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="px-10 py-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">Data Table</h1>
        <div className="flex items-center gap-4">
          <NavLink to={'/'}>Demo</NavLink>
          <NavLink to={'/docs'}>Docs</NavLink>
          <NavLink to={"https://github.com/yourusername/datatable-project"}><FaGithub className="w-5 h-5" /></NavLink>
        </div>
      </nav>

      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<EmployeesTableDemo />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;