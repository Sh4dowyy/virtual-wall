import React from 'react';

interface Employee {
  id: number;
  name: string;
  photo_url: string;
  gratitude: string[];
  achievements: string[];
  warm_words: string[];
}

interface EmployeeCardProps {
  employee: Employee;
  onClick: (employee: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  return (
    <div className="employee-card" onClick={() => onClick(employee)}>
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
  );
};

export default EmployeeCard;