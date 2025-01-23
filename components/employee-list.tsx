// EmployeeList.tsx
"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import EmployeeCard from './employee-card';
import EmployeeModal from './employee-modal';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Employee {
  id: number;
  name: string;
  photo_url: string;
  gratitude: string[];
  achievements: string[];
  warm_words: string[];
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newGratitude, setNewGratitude] = useState<string>('');
  const [newAchievement, setNewAchievement] = useState<string>('');
  const [newWarmWord, setNewWarmWord] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'gratitude' | 'achievements' | 'warm_words'>('gratitude');
  const [isFlashing, setIsFlashing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, photo_url, gratitude, achievements, warm_words');
      if (error) {
        console.error('Error fetching employees:', error);
      } else {
        console.log('Fetched employees:', data);
        // Sort employees by ID in descending order
        const sortedEmployees = data.sort((a: Employee, b: Employee) => b.id - a.id);
        setEmployees(sortedEmployees);
      }
    };
    fetchEmployees();
  }, []);

  const handleCardClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setNewGratitude('');
    setNewAchievement('');
    setNewWarmWord('');
    setActiveTab('gratitude'); // Reset to default tab
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedEmployee) {
      const updates: any = {};
      if (newGratitude) {
        updates.gratitude = [...selectedEmployee.gratitude, newGratitude];
      }
      if (newAchievement) {
        updates.achievements = [...selectedEmployee.achievements, newAchievement];
      }
      if (newWarmWord) {
        updates.warm_words = [...selectedEmployee.warm_words, newWarmWord];
      }
      const { error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', selectedEmployee.id);
      if (error) {
        console.error('Error updating employee:', error);
      } else {
        // Update local state to reflect the new values
        setEmployees((prev) =>
          prev.map((employee) =>
            employee.id === selectedEmployee.id
              ? {
                  ...employee,
                  gratitude: newGratitude ? [...employee.gratitude, newGratitude] : employee.gratitude,
                  achievements: newAchievement ? [...employee.achievements, newAchievement] : employee.achievements,
                  warm_words: newWarmWord ? [...employee.warm_words, newWarmWord] : employee.warm_words,
                }
              : employee
          )
        );
        closeModal();
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 1000); // Reset after 1 second
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000); // Show confetti for 2 seconds
      }
    }
  };

  return (
    <div className="employee-list">
      <h1>Meie töötajad</h1>
      <h2>Lisa tänulikkus, saavutused, soojad sõnad:</h2>
      <div className="employee-cards">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} onClick={handleCardClick} />
        ))}
      </div>
      <EmployeeModal
        selectedEmployee={selectedEmployee}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        newGratitude={newGratitude}
        setNewGratitude={setNewGratitude}
        newAchievement={newAchievement}
        setNewAchievement={setNewAchievement}
        newWarmWord={newWarmWord}
        setNewWarmWord={setNewWarmWord}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isFlashing={isFlashing}
        showConfetti={showConfetti}
      />
    </div>
  );
}