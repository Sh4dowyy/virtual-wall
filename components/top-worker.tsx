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

const TopWorker = () => {
  const [topWorker, setTopWorker] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data: employees, error } = await supabase
        .from('employees')
        .select('*');

      if (error) {
        console.error('Error fetching employees:', error);
        return;
      }

      if (employees && employees.length > 0) {
        // Calculate total interactions for each employee
        const withInteractions = employees.map(emp => ({
          ...emp,
          totalInteractions: emp.gratitude.length + emp.warm_words.length
        }));

        // Sort by total interactions in descending order
        const sorted = withInteractions.sort((a, b) => b.totalInteractions - a.totalInteractions);
        setTopWorker(sorted[0]);
      }
    };

    fetchEmployees();
  }, []);

  if (!topWorker) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
        🏆 Meie parim töötaja
      </h2>
      <div className="flex flex-col items-center space-y-4">
        {topWorker.photo_url && (
          <img
            src={topWorker.photo_url}
            alt={`${topWorker.name}'s photo`}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div className="text-center">
          <h3 className="text-xl font-semibold">{topWorker.name}</h3>
          <p className="text-gray-600">
            {topWorker.gratitude.length + topWorker.warm_words.length} kokku interaktsiooni
          </p>
          <div className="text-sm text-gray-500">
            {topWorker.achievements.length} saavutused • {topWorker.gratitude.length} tänuslikkud • {topWorker.warm_words.length} soojad sõnad
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopWorker; 