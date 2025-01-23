import React from 'react';
import Confetti from 'react-confetti';

interface Employee {
  id: number;
  name: string;
  photo_url: string;
  gratitude: string[];
  achievements: string[];
  warm_words: string[];
}

interface EmployeeModalProps {
  selectedEmployee: Employee | null;
  closeModal: () => void;
  handleSubmit: (event: React.FormEvent) => void;
  newGratitude: string;
  setNewGratitude: (value: string) => void;
  newAchievement: string;
  setNewAchievement: (value: string) => void;
  newWarmWord: string;
  setNewWarmWord: (value: string) => void;
  activeTab: 'gratitude' | 'achievements' | 'warm_words';
  setActiveTab: (tab: 'gratitude' | 'achievements' | 'warm_words') => void;
  isFlashing: boolean;
  showConfetti: boolean;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  selectedEmployee,
  closeModal,
  handleSubmit,
  newGratitude,
  setNewGratitude,
  newAchievement,
  setNewAchievement,
  newWarmWord,
  setNewWarmWord,
  activeTab,
  setActiveTab,
  isFlashing,
  showConfetti,
}) => {
  if (!selectedEmployee) return null;

  return (
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
      {showConfetti && <Confetti />}
    </div>
  );
};

export default EmployeeModal;