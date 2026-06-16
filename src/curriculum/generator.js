// Procedural question generator for MathLand Quests
// Supports all game types: visual-counting, comparison, equation, pattern-completion

const COUNTING_ITEMS = [
  { icon: '🦁', name: 'happy lion', plural: 'happy lions' },
  { icon: '🐸', name: 'friendly frog', plural: 'friendly frogs' },
  { icon: '🍓', name: 'sweet strawberry', plural: 'sweet strawberries' },
  { icon: '⭐', name: 'shiny star', plural: 'shiny stars' },
  { icon: '🐼', name: 'happy panda', plural: 'happy pandas' },
  { icon: '🐯', name: 'cool tiger', plural: 'cool tigers' },
  { icon: '🦊', name: 'smarty fox', plural: 'smarty foxes' },
  { icon: '🐰', name: 'fluffy bunny', plural: 'fluffy bunnies' },
  { icon: '🐵', name: 'playful monkey', plural: 'playful monkeys' },
  { icon: '🐔', name: 'little chicken', plural: 'little chickens' },
  { icon: '🎈', name: 'colorful balloon', plural: 'colorful balloons' },
  { icon: '🍎', name: 'red apple', plural: 'red apples' }
];

const OCEAN_ITEMS = [
  { icon: '🐙', name: 'friendly octopus', plural: 'friendly octopuses' },
  { icon: '🐬', name: 'playful dolphin', plural: 'playful dolphins' },
  { icon: '🐠', name: 'colorful fish', plural: 'colorful fish' },
  { icon: '🦈', name: 'little baby shark', plural: 'little baby sharks' },
  { icon: '🐳', name: 'friendly whale', plural: 'friendly whales' },
  { icon: '🦀', name: 'happy crab', plural: 'happy crabs' }
];

const BAKERY_ITEMS = ['🍩', '🧁', '🍪', '🍰', '🥐'];

const CLOCK_HOURLY = [
  { icon: '🕐', time: '1:00', hour: 1 },
  { icon: '🕑', time: '2:00', hour: 2 },
  { icon: '🕒', time: '3:00', hour: 3 },
  { icon: '🕓', time: '4:00', hour: 4 },
  { icon: '🕔', time: '5:00', hour: 5 },
  { icon: '🕕', time: '6:00', hour: 6 },
  { icon: '🕖', time: '7:00', hour: 7 },
  { icon: '🕗', time: '8:00', hour: 8 },
  { icon: '🕘', time: '9:00', hour: 9 },
  { icon: '🕙', time: '10:00', hour: 10 },
  { icon: '‏‏🕚', time: '11:00', hour: 11 },
  { icon: '🕛', time: '12:00', hour: 12 }
];

const CLOCK_HALF_HOUR = [
  { icon: '🕜', time: '1:30', hour: 1.5 },
  { icon: '🕝', time: '2:30', hour: 2.5 },
  { icon: '🕞', time: '3:30', hour: 3.5 },
  { icon: '🕟', time: '4:30', hour: 4.5 },
  { icon: '🕠', time: '5:30', hour: 5.5 },
  { icon: '🕡', time: '6:30', hour: 6.5 },
  { icon: '🕢', time: '7:30', hour: 7.5 },
  { icon: '🕣', time: '8:30', hour: 8.5 },
  { icon: '‏‏🕤', time: '9:30', hour: 9.5 },
  { icon: '🕥', time: '10:30', hour: 10.5 },
  { icon: '🕦', time: '11:30', hour: 11.5 },
  { icon: '🕧', time: '12:30', hour: 12.5 }
];

const SHAPES = [
  { icon: '🔴', name: 'CIRCLE', group: 'circle' },
  { icon: '🔵', name: 'CIRCLE', group: 'circle' },
  { icon: '🟡', name: 'CIRCLE', group: 'circle' },
  { icon: '🔺', name: 'TRIANGLE', group: 'triangle' },
  { icon: '🟩', name: 'SQUARE', group: 'square' },
  { icon: '🟧', name: 'SQUARE', group: 'square' },
  { icon: '🟦', name: 'SQUARE', group: 'square' }
];

const SHAPE_OBJECTS = {
  circle: [
    { icon: '🍩', name: 'Donut' },
    { icon: '🍪', name: 'Cookie' },
    { icon: '🪙', name: 'Coin' },
    { icon: '💿', name: 'Disc' }
  ],
  non_circle: [
    { icon: '🎁', name: 'Gift Box' },
    { icon: '🚪', name: 'Door' },
    { icon: '📖', name: 'Book' },
    { icon: '📦', name: 'Package' }
  ]
};

// Helper: Shuffle array in-place
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helper: Generate 4 unique options
function generateOptions(answer, count = 4, min = 1, range = 3) {
  const opts = new Set([answer]);
  while (opts.size < count) {
    const offset = Math.floor(Math.random() * (range * 2 + 1)) - range;
    const val = answer + offset;
    if (val >= min) {
      opts.add(val);
    }
  }
  return Array.from(opts).sort((a, b) => a - b);
}

export function generateDynamicQuestion(questId, currentQuestion) {
  const { type, id } = currentQuestion;

  switch (type) {
    case 'visual-counting': {
      const isOcean = questId.includes('ocean') || id.includes('ocean');
      const pool = isOcean ? OCEAN_ITEMS : COUNTING_ITEMS;
      
      // Filter out current icon if possible
      const currentIcon = currentQuestion.data?.icon;
      let available = pool.filter(item => item.icon !== currentIcon);
      if (available.length === 0) available = pool;
      
      const selected = available[Math.floor(Math.random() * available.length)];
      const minCount = isOcean ? 4 : 3;
      const maxCount = isOcean ? 12 : 10;
      const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

      return {
        id: `${id}_gen`,
        type,
        prompt: `How many ${selected.plural} can you count?`,
        data: {
          icon: selected.icon,
          count
        },
        options: generateOptions(count, 4, 1, 2),
        answer: count,
        mascotHint: `Tap each ${selected.name} to count them! 1... 2... 3!`
      };
    }

    case 'comparison': {
      // 1. Greatest or Smallest number (Grade 1)
      if (id.includes('comp_1') || id.includes('comp_2')) {
        const nums = [];
        while (nums.length < 3) {
          const n = Math.floor(Math.random() * 90) + 10; // 10-99
          if (!nums.includes(n)) nums.push(n);
        }
        
        const isGreatest = Math.random() > 0.5;
        const answerVal = isGreatest ? Math.max(...nums) : Math.min(...nums);
        
        return {
          id: `${id}_gen`,
          type,
          prompt: `Which number is the ${isGreatest ? 'GREATEST' : 'SMALLEST'}?`,
          data: {
            items: nums.map(n => ({
              id: String(n),
              icon: String(n),
              size: 100,
              name: String(n)
            }))
          },
          options: shuffle(nums.map(String)),
          answer: String(answerVal),
          mascotHint: isGreatest 
            ? `Compare the tens place first! The greatest number here is ${answerVal}.`
            : `Look at the numbers carefully. The smallest one is ${answerVal}.`
        };
      }

      // 2. Alligator mouth comparison (Grade 1)
      if (id.includes('comp_3') || id.includes('comp_4')) {
        const num1 = Math.floor(Math.random() * 50) + 10;
        let num2 = Math.floor(Math.random() * 50) + 10;
        
        // 10% chance of equal
        if (Math.random() < 0.1) {
          num2 = num1;
        }

        let answer = '＝';
        if (num1 > num2) answer = '＞';
        else if (num1 < num2) answer = '＜';

        return {
          id: `${id}_gen`,
          type,
          prompt: `Which alligator mouth makes this math sentence true?  ${num1} [?] ${num2}`,
          data: {
            items: [
              { id: '＞', icon: '＞', size: 110, name: 'Greater Than' },
              { id: '＜', icon: '＜', size: 110, name: 'Less Than' },
              { id: '＝', icon: '＝', size: 110, name: 'Equal To' }
            ]
          },
          options: ['＞', '＜', '＝'],
          answer,
          mascotHint: `The hungry alligator always opens its mouth toward the BIGGER number! ${Math.max(num1, num2)} is bigger than ${Math.min(num1, num2)}.`
        };
      }

      // 3. Size comparison (Biggest/Smallest Animal or Fruit in Kindergarten Safari)
      if (id.includes('size_1') || id.includes('size_2')) {
        const isFruit = Math.random() > 0.5;
        let items;
        
        if (isFruit) {
          const smalls = [{ id: 'cherry', icon: '🍒', name: 'Tiny Cherry', size: 50 }, { id: 'grape', icon: '🍇', name: 'Grape Bunch', size: 75 }];
          const meds = [{ id: 'apple', icon: '🍎', name: 'Sweet Apple', size: 100 }, { id: 'orange', icon: '🍊', name: 'Juicy Orange', size: 95 }];
          const bigs = [{ id: 'watermelon', icon: '🍉', name: 'Huge Watermelon', size: 160 }, { id: 'pineapple', icon: '🍍', name: 'Big Pineapple', size: 140 }];
          items = [
            smalls[Math.floor(Math.random() * smalls.length)],
            meds[Math.floor(Math.random() * meds.length)],
            bigs[Math.floor(Math.random() * bigs.length)]
          ];
        } else {
          const smalls = [{ id: 'mouse', icon: '🐭', name: 'Little Mouse', size: 60 }, { id: 'ladybug', icon: '🐞', name: 'Tiny Ladybug', size: 40 }];
          const meds = [{ id: 'bunny', icon: '🐰', name: 'Fluffy Bunny', size: 90 }, { id: 'cat', icon: '🐈', name: 'Cute Cat', size: 85 }];
          const bigs = [{ id: 'elephant', icon: '🐘', name: 'Big Elephant', size: 150 }, { id: 'whale', icon: '🐳', name: 'Giant Whale', size: 170 }];
          items = [
            smalls[Math.floor(Math.random() * smalls.length)],
            meds[Math.floor(Math.random() * meds.length)],
            bigs[Math.floor(Math.random() * bigs.length)]
          ];
        }

        const isBiggest = Math.random() > 0.5;
        const answerItem = isBiggest ? items[2] : items[0];

        return {
          id: `${id}_gen`,
          type,
          prompt: `Which one is the ${isBiggest ? 'BIGGEST' : 'SMALLEST'}?`,
          data: {
            criterion: isBiggest ? 'biggest' : 'smallest',
            items: shuffle(items)
          },
          options: items.map(item => item.icon), // will be overridden by items layout, but good fallback
          answer: answerItem.icon,
          mascotHint: isBiggest 
            ? `Look at the giant ${items[2].name}! It is much bigger than the others.`
            : `The tiny ${items[0].name} is the smallest one here.`
        };
      }

      // 4. More treats comparison (Kindergarten Safari)
      if (id.includes('size_3')) {
        const treats = ['🍪', '🍩', '🧁', '🍬'];
        const emoji = treats[Math.floor(Math.random() * treats.length)];
        const n1 = Math.floor(Math.random() * 4) + 1; // 1-4
        const n2 = Math.floor(Math.random() * 5) + 5; // 5-9
        
        const leftIsMore = Math.random() > 0.5;
        const leftCount = leftIsMore ? n2 : n1;
        const rightCount = leftIsMore ? n1 : n2;

        const leftIcon = emoji.repeat(leftCount);
        const rightIcon = emoji.repeat(rightCount);

        const items = [
          { id: 'left', icon: leftIcon, size: leftIsMore ? 110 : 80, name: `${leftCount} Treats` },
          { id: 'right', icon: rightIcon, size: leftIsMore ? 80 : 110, name: `${rightCount} Treats` }
        ];

        return {
          id: `${id}_gen`,
          type,
          prompt: 'Who has MORE yummy treats?',
          data: {
            criterion: 'more',
            items
          },
          options: [leftIcon, rightIcon],
          answer: leftIsMore ? leftIcon : rightIcon,
          mascotHint: `Let's count! ${n2} is a bigger number than ${n1}.`
        };
      }

      // 5. Shape identifying comparison (Kindergarten Shape Island)
      if (id.includes('shape_1') || id.includes('shape_2')) {
        const targetType = SHAPES[Math.floor(Math.random() * SHAPES.length)].group;
        
        const targetItem = SHAPES.find(s => s.group === targetType);
        const distractors = SHAPES.filter(s => s.group !== targetType);
        
        // Pick one target, two distinct distractors
        const chosenDistractors = [];
        const seenGroups = new Set();
        for (const dist of shuffle(distractors)) {
          if (!seenGroups.has(dist.group) && chosenDistractors.length < 2) {
            chosenDistractors.push(dist);
            seenGroups.add(dist.group);
          }
        }

        const items = shuffle([targetItem, ...chosenDistractors]);

        return {
          id: `${id}_gen`,
          type,
          prompt: `Find the shape that is a ${targetItem.name}!`,
          data: {
            criterion: targetItem.group,
            items
          },
          options: items.map(i => i.icon),
          answer: targetItem.icon,
          mascotHint: targetItem.group === 'circle' 
            ? 'Circles are round with no corners!'
            : targetItem.group === 'triangle'
            ? 'Triangles have exactly three pointy corners!'
            : 'Squares have four equal sides and look like blocks!'
        };
      }

      // 6. Shape objects (Kindergarten Shape Island)
      if (id.includes('shape_3')) {
        const correct = SHAPE_OBJECTS.circle[Math.floor(Math.random() * SHAPE_OBJECTS.circle.length)];
        const dists = shuffle(SHAPE_OBJECTS.non_circle).slice(0, 2);
        
        const items = shuffle([
          { id: 'correct', icon: correct.icon, size: 100, name: correct.name },
          { id: 'dist1', icon: dists[0].icon, size: 100, name: dists[0].name },
          { id: 'dist2', icon: dists[1].icon, size: 100, name: dists[1].name }
        ]);

        return {
          id: `${id}_gen`,
          type,
          prompt: 'Which item is round like a Circle?',
          data: {
            criterion: 'circle_object',
            items
          },
          options: items.map(i => i.icon),
          answer: correct.icon,
          mascotHint: `A delicious ${correct.name.toLowerCase()} is round, just like a circle!`
        };
      }

      // 7. Clock tower (Grade 1)
      if (id.includes('clock_1') || id.includes('clock_3')) {
        // "Which clock shows exactly X:XX?"
        const isHalfHour = Math.random() > 0.5;
        const pool = isHalfHour ? CLOCK_HALF_HOUR : CLOCK_HOURLY;
        const idxs = shuffle(Array.from({ length: 12 }, (_, i) => i)).slice(0, 3);
        const correct = pool[idxs[0]];
        const d1 = pool[idxs[1]];
        const d2 = pool[idxs[2]];

        const items = shuffle([
          { id: correct.time, icon: correct.icon, size: 120, name: `Clock A` },
          { id: d1.time, icon: d1.icon, size: 120, name: `Clock B` },
          { id: d2.time, icon: d2.icon, size: 120, name: `Clock C` }
        ]);

        return {
          id: `${id}_gen`,
          type,
          prompt: `Which clock shows exactly ${correct.time}?`,
          data: {
            items
          },
          options: items.map(i => i.icon),
          answer: correct.icon,
          mascotHint: `Look for the short hour hand pointing to ${correct.time.split(':')[0]}!`
        };
      }

      if (id.includes('clock_2')) {
        // "What time does this clock show?"
        const isHalfHour = Math.random() > 0.5;
        const pool = isHalfHour ? CLOCK_HALF_HOUR : CLOCK_HOURLY;
        const correct = pool[Math.floor(Math.random() * pool.length)];
        
        let distTime;
        do {
          const d = pool[Math.floor(Math.random() * pool.length)];
          distTime = d.time;
        } while (distTime === correct.time);

        const items = shuffle([
          { id: correct.time, icon: correct.time, size: 100, name: correct.time },
          { id: distTime, icon: distTime, size: 100, name: distTime }
        ]);

        return {
          id: `${id}_gen`,
          type,
          prompt: `What time does this clock show: ${correct.icon}?`,
          data: {
            items
          },
          options: items.map(i => i.id),
          answer: correct.time,
          mascotHint: `The short hand is the hour hand. It points at ${correct.time.split(':')[0]}!`
        };
      }

      // Fallback comparison
      return currentQuestion;
    }

    case 'equation': {
      const isWord = id.includes('word') || questId.includes('word');
      
      // Kindergarten Bakery sums
      if (questId.includes('bakery') || id.includes('bake')) {
        const num1 = Math.floor(Math.random() * 4) + 1;
        const num2 = Math.floor(Math.random() * 4) + 1;
        const icon = BAKERY_ITEMS[Math.floor(Math.random() * BAKERY_ITEMS.length)];
        const answer = num1 + num2;

        return {
          id: `${id}_gen`,
          type,
          prompt: `How many sweet donuts/treats do we have in total?`,
          data: {
            num1,
            num2,
            operator: '+',
            icon
          },
          options: generateOptions(answer, 4, 1, 2),
          answer,
          mascotHint: `${num1} treats on the left and ${num2} on the right. Add them together!`
        };
      }

      // Grade 1 word problems
      if (isWord) {
        const isAdd = Math.random() > 0.5;
        const name = ['Leo', 'Mia', 'Sam', 'Lily', 'Toby', 'Zoey'][Math.floor(Math.random() * 6)];
        
        if (isAdd) {
          const items = [
            { icon: '🚗', name: 'toy car', plural: 'toy cars' },
            { icon: '🎈', name: 'balloon', plural: 'balloons' },
            { icon: '🍎', name: 'apple', plural: 'apples' },
            { icon: '⚽', name: 'ball', plural: 'balls' }
          ];
          const item = items[Math.floor(Math.random() * items.length)];
          const num1 = Math.floor(Math.random() * 6) + 3; // 3-8
          const num2 = Math.floor(Math.random() * 5) + 2; // 2-6
          const answer = num1 + num2;

          const templates = [
            `${name} has ${num1} ${item.plural} ${item.icon}. He gets ${num2} more. How many does he have now?`,
            `There are ${num1} ${item.plural} sitting ${item.icon}. ${num2} more join them. How many are there in total?`
          ];

          return {
            id: `${id}_gen`,
            type,
            prompt: templates[Math.floor(Math.random() * templates.length)],
            data: {
              num1,
              num2,
              operator: '+',
              icon: item.icon
            },
            options: generateOptions(answer, 4, 2, 3),
            answer,
            mascotHint: `Let's solve the story! We need to add: ${num1} + ${num2}.`
          };
        } else {
          const items = [
            { icon: '🧁', name: 'cupcake', plural: 'cupcakes' },
            { icon: '🍪', name: 'cookie', plural: 'cookies' },
            { icon: '⭐', name: 'gold star', plural: 'gold stars' }
          ];
          const item = items[Math.floor(Math.random() * items.length)];
          const num1 = Math.floor(Math.random() * 7) + 6; // 6-12
          const num2 = Math.floor(Math.random() * 4) + 2; // 2-5
          const answer = num1 - num2;

          const templates = [
            `${name} baked ${num1} ${item.plural} ${item.icon}. Her friends ate ${num2}. How many are left?`,
            `You have ${num1} ${item.plural} ${item.icon}. You give ${num2} away. How many do you keep?`
          ];

          return {
            id: `${id}_gen`,
            type,
            prompt: templates[Math.floor(Math.random() * templates.length)],
            data: {
              num1,
              num2,
              operator: '-',
              icon: item.icon
            },
            options: generateOptions(answer, 4, 1, 3),
            answer,
            mascotHint: `This is subtraction! Start with ${num1} and take away ${num2}: ${num1} - ${num2}.`
          };
        }
      }

      // Regular Grade 1 addition
      if (id.includes('add')) {
        const num1 = Math.floor(Math.random() * 9) + 2; // 2-10
        const num2 = Math.floor(Math.random() * 9) + 2; // 2-10
        const answer = num1 + num2;
        const icon = COUNTING_ITEMS[Math.floor(Math.random() * COUNTING_ITEMS.length)].icon;

        return {
          id: `${id}_gen`,
          type,
          prompt: `What is ${num1} + ${num2}?`,
          data: {
            num1,
            num2,
            operator: '+',
            icon
          },
          options: generateOptions(answer, 4, 2, 3),
          answer,
          mascotHint: `Combine them! Count ${num1} on the left and ${num2} on the right.`
        };
      }

      // Regular Grade 1 subtraction
      if (id.includes('sub')) {
        const num1 = Math.floor(Math.random() * 10) + 6; // 6-15
        const num2 = Math.floor(Math.random() * (num1 - 2)) + 2; // 2 to num1-1
        const answer = num1 - num2;
        const icon = COUNTING_ITEMS[Math.floor(Math.random() * COUNTING_ITEMS.length)].icon;

        return {
          id: `${id}_gen`,
          type,
          prompt: `What is ${num1} - ${num2}?`,
          data: {
            num1,
            num2,
            operator: '-',
            icon
          },
          options: generateOptions(answer, 4, 1, 3),
          answer,
          mascotHint: `Tap to pop ${num2} of the ${num1} items. Then count what remains!`
        };
      }

      // Fallback equation
      return currentQuestion;
    }

    case 'pattern-completion': {
      // 1. Kindergarten garden pattern
      if (questId.includes('garden') || id.includes('gard') || id.includes('pat_gard')) {
        const flowerPairs = [
          ['🌸', '🌻'],
          ['🍎', '🍌'],
          ['🦋', '🐝'],
          ['🔴', '🟡'],
          ['🌸', '🌷'],
          ['❤️', '💙']
        ];
        const pair = flowerPairs[Math.floor(Math.random() * flowerPairs.length)];
        const A = pair[0];
        const B = pair[1];

        const patternType = Math.floor(Math.random() * 3); // 0: ABABA, 1: AABAAB, 2: ABCABC
        let sequence;
        let answer;
        let options;
        let mascotHint;

        if (patternType === 0) {
          sequence = [A, B, A, B, null];
          answer = A;
          options = shuffle([A, B]);
          mascotHint = `It goes: ${A}, ${B}, ${A}, ${B}... what comes next?`;
        } else if (patternType === 1) {
          sequence = [A, A, B, A, A, null];
          answer = B;
          options = shuffle([A, B]);
          mascotHint = `Look: two ${A}s are always followed by one ${B}.`;
        } else {
          const C = ['🟢', '🍇', '🐞', '💚', '💛', '🦄'][Math.floor(Math.random() * 6)];
          sequence = [A, B, C, A, B, null];
          answer = C;
          options = shuffle([A, B, C]);
          mascotHint = `Three items cycle: ${A}, ${B}, ${C}... then ${A}, ${B}...`;
        }

        return {
          id: `${id}_gen`,
          type,
          prompt: `What completes the pattern path?`,
          data: {
            sequence,
            step: 1,
            tip: `Look at the pattern! what comes next?`
          },
          options,
          answer,
          mascotHint
        };
      }

      // 2. Grade 1 patterns (number patterns)
      if (questId.includes('patterns') || id.includes('pat')) {
        const stepChoices = [1, 2, 5, 10];
        const step = stepChoices[Math.floor(Math.random() * stepChoices.length)];
        
        let start = 0;
        if (step === 1) start = Math.floor(Math.random() * 15) + 1;
        else if (step === 2) start = (Math.floor(Math.random() * 8) + 1) * 2; // evens
        else if (step === 5) start = Math.floor(Math.random() * 6) * 5 + 5;
        else if (step === 10) start = Math.floor(Math.random() * 6) * 10 + 10;

        const originalSeq = [start, start + step, start + 2 * step, start + 3 * step];
        
        // Random blank index in [1, 2, 3]
        const blankIdx = Math.floor(Math.random() * 3) + 1;
        const answer = originalSeq[blankIdx];
        
        const sequence = [...originalSeq];
        sequence[blankIdx] = null;

        const options = generateOptions(answer, 4, 1, step * 2);

        return {
          id: `${id}_gen`,
          type,
          prompt: `What number comes next in this pattern?`,
          data: {
            sequence,
            step
          },
          options,
          answer,
          mascotHint: `We are skip counting by ${step}! Let's say it out loud: ${originalSeq.map((n, i) => i === blankIdx ? '__' : n).join(', ')}.`
        };
      }

      return currentQuestion;
    }

    default:
      return currentQuestion;
  }
}
