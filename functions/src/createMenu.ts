const constants = require('./constants'); 

const createTrainingMenu = (
  trainingList: Array<Training>,
  minute: Number,
  categories: Array<string>
) => {
  let totalMinute = 0;
  const trainings = [];

  for (let i = 1; i <= 20; i++) {
    const selectedCategory = categories[getRandomValue(categories.length) - 1];
      
    const filteredList = trainingList.filter((training: Training) => {
      return training.category === selectedCategory 
        && Number(training.minute) <= Number(minute) - totalMinute;
    });

    if (filteredList.length === 0) break;

    const selectedTraining = filteredList[getRandomValue(filteredList.length) - 1];
    
    totalMinute += Number(selectedTraining.minute);
    trainings.push(selectedTraining);

    if (totalMinute >= minute) break;
  }

  return {totalMinute: totalMinute, trainings: trainings};
}

const getFilterdCategories = (categories: Object, filterCondition: Array<string>) => {
  return filterCondition.map((key: string) => {
    const index = Object.keys(categories).indexOf(key);
    return Object.values(categories)[index];
  });
};

const getRandomValue = (max: number) => {
  return Math.ceil(Math.random() * max);
};

module.exports = {
  createTrainingMenu,
  getFilterdCategories,
};
