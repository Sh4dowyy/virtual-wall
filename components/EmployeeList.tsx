"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Confetti from 'react-confetti';

// Use environment variables for Supabase URL and Anon Key
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
        setEmployees(data);
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
          <div className="employee-card" key={employee.id} onClick={() => handleCardClick(employee)}>
            {employee.photo_url && (
              <img src={employee.photo_url} alt={`${employee.name}'s photo`} className="employee-photo" />
            )}
            <h3 className="employee-name"><strong>{employee.name}</strong></h3>
            <div className="employee-stats">
              <span>💬 {employee.gratitude.length}</span>
              <span>🏆 {employee.achievements.length}</span>
              <span>❤️ {employee.warm_words.length}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedEmployee && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            {selectedEmployee.photo_url && (
              <img src={selectedEmployee.photo_url} alt={`${selectedEmployee.name}'s photo`} className="modal-photo" />
            )}
            <h3><strong>{selectedEmployee.name}</strong></h3>
            <div className="tabs">
              <button 
                className={activeTab === 'gratitude' ? 'active' : ''} 
                onClick={() => setActiveTab('gratitude')}
              >
                💬 Tänulikkus
              </button>
              <button 
                className={activeTab === 'achievements' ? 'active' : ''} 
                onClick={() => setActiveTab('achievements')}
              >
                🏆 Saavutused
              </button>
              <button 
                className={activeTab === 'warm_words' ? 'active' : ''} 
                onClick={() => setActiveTab('warm_words')}
              >
                ❤️ Soojad sõnad
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {activeTab === 'gratitude' && (
                <div>
                  <input
                    type="text"
                    value={newGratitude}
                    onChange={(e) => setNewGratitude(e.target.value)}
                    placeholder="Lisa tänulikkus"
                  />
                </div>
              )}
              {activeTab === 'achievements' && (
                <div>
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Lisa saavutused"
                  />
                </div>
              )}
              {activeTab === 'warm_words' && (
                <div>
                  <input
                    type="text"
                    value={newWarmWord}
                    onChange={(e) => setNewWarmWord(e.target.value)}
                    placeholder="Lisa soojad sõnad"
                  />
                </div>
              )}
              <button type="submit">Saada</button>
            </form>
            {activeTab === 'gratitude' && (
              <>
                <div className={isFlashing ? 'flashing-heart' : ''}>
                  {selectedEmployee.gratitude.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div>
              </>
            )}
            {activeTab === 'achievements' && (
              <>
                {selectedEmployee.achievements.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </>
            )}
            {activeTab === 'warm_words' && (
              <>
                {selectedEmployee.warm_words.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </>
            )}
          </div>
        </div>
      )}
      {showConfetti && <Confetti />}
    </div>
  );
} 