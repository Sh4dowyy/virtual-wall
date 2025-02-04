"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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

export default function AdminPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeName, setNewEmployeeName] = useState<string>('');
  const [newEmployeePhoto, setNewEmployeePhoto] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newAchievement, setNewAchievement] = useState<string>('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('employees').select('*');
      if (error) {
        console.error('Error fetching employees:', error);
      } else {
        setEmployees(data);
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) {
        console.error('Error deleting employee:', error);
      } else {
        setEmployees(employees.filter(employee => employee.id !== id));
      }
    }
  };

  const handleAddEmployee = async (event: React.FormEvent) => {
    event.preventDefault();
    const { error } = await supabase.from('employees').insert([{ name: newEmployeeName, photo_url: newEmployeePhoto, gratitude: [], achievements: [], warm_words: [] }]);
    if (error) {
      console.error('Error adding employee:', error);
    } else {
      setEmployees([...employees, { id: Date.now(), name: newEmployeeName, photo_url: newEmployeePhoto, gratitude: [], achievements: [], warm_words: [] }]);
      setNewEmployeeName('');
      setNewEmployeePhoto('');
    }
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setNewAchievement('');
  };

  const handleAddAchievement = async () => {
    if (selectedEmployee) {
      const updatedAchievements = [...selectedEmployee.achievements, newAchievement];
      const { error } = await supabase.from('employees').update({ achievements: updatedAchievements }).eq('id', selectedEmployee.id);
      if (error) {
        console.error('Error adding achievement:', error);
      } else {
        setSelectedEmployee({ ...selectedEmployee, achievements: updatedAchievements });
        setNewAchievement('');
      }
    }
  };

  const handleDeleteMessage = async (type: 'gratitude' | 'achievements' | 'warm_words', index: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      if (selectedEmployee) {
        const updatedMessages = selectedEmployee[type].filter((_, i) => i !== index);
        const { error } = await supabase.from('employees').update({ [type]: updatedMessages }).eq('id', selectedEmployee.id);
        if (error) {
          console.error(`Error deleting ${type}:`, error);
        } else {
          setSelectedEmployee({ ...selectedEmployee, [type]: updatedMessages });
        }
      }
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <h2>Add New Employee</h2>
      <form onSubmit={handleAddEmployee}>
        <input
          type="text"
          placeholder="Employee Name"
          value={newEmployeeName}
          onChange={(e) => setNewEmployeeName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Photo URL"
          value={newEmployeePhoto}
          onChange={(e) => setNewEmployeePhoto(e.target.value)}
          required
        />
        <button type="submit">Add Employee</button>
      </form>

      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            <span onClick={() => handleEmployeeClick(employee)} style={{ cursor: 'pointer', color: '#0070f3' }}>
              {employee.name}
            </span>
            <span 
              onClick={() => handleDelete(employee.id)} 
              style={{ color: 'red', cursor: 'pointer', marginLeft: '10px' }}
            >
              ❌
            </span>
          </li>
        ))}
      </ul>

      {selectedEmployee && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h3 style={{ fontWeight: 'bold' }}>{selectedEmployee.name}</h3>
            <h4 style={{ fontWeight: 'bold' }}>Gratitudes</h4>
            <ul>
              {selectedEmployee.gratitude.map((item, index) => (
                <li key={index}>
                  {item} <span onClick={() => handleDeleteMessage('gratitude', index)} style={{ color: 'red', cursor: 'pointer' }}>❌</span>
                </li>
              ))}
            </ul>
            <h4 style={{ fontWeight: 'bold' }}>Achievements</h4>
            <ul>
              {selectedEmployee.achievements.map((item, index) => (
                <li key={index}>
                  {item} <span onClick={() => handleDeleteMessage('achievements', index)} style={{ color: 'red', cursor: 'pointer' }}>❌</span>
                </li>
              ))}
            </ul>
            <h4 style={{ fontWeight: 'bold' }}>Warm Words</h4>
            <ul>
              {selectedEmployee.warm_words.map((item, index) => (
                <li key={index}>
                  {item} <span onClick={() => handleDeleteMessage('warm_words', index)} style={{ color: 'red', cursor: 'pointer' }}>❌</span>
                </li>
              ))}
            </ul>
            <h4 style={{ fontWeight: 'bold' }}>Add Achievement</h4>
            <input
              type="text"
              placeholder="New Achievement"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
            />
            <button onClick={handleAddAchievement}>Add Achievement</button>
          </div>
        </div>
      )}
    </div>
  );
} 