// Registry for loading math curriculums
import kindergarten from './kindergarten.json';
import grade1 from './grade1.json';

const CURRICULUM_DATA = {
  kindergarten,
  grade1
};

export const grades = [
  { id: 'kindergarten', title: 'Kindergarten (Age 4-5)', desc: 'Counting, Sizes, Shapes', color: '#ff7675' },
  { id: 'grade1', title: '1st Grade (Age 6-7)', desc: 'Addition, Subtraction, Patterns', color: '#74b9ff' }
];

export function getCurriculum(gradeId) {
  return CURRICULUM_DATA[gradeId] || null;
}

export function getQuest(gradeId, questId) {
  const curr = getCurriculum(gradeId);
  if (!curr) return null;
  return curr.quests.find(q => q.id === questId) || null;
}

/**
 * Checks if a quest is unlocked based on completed quest IDs.
 */
export function isQuestUnlocked(quest, completedQuests) {
  if (!quest.unlockedBy) return true;
  return completedQuests.includes(quest.unlockedBy);
}
