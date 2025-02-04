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
        <span>🏆 {employee.achievements.length > 0 ? employee.achievements.length : '0'}</span>
        <span>💬 {employee.gratitude.length > 0 ? employee.gratitude.length : '0'}</span>
        <span>❤️ {employee.warm_words.length > 0 ? employee.warm_words.length : '0'}</span>
      </div>
    </div>
  );
};

export default EmployeeCard;