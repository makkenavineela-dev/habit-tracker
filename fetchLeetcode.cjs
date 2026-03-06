const fs = require('fs');

fetch('https://leetcode.com/api/problems/algorithms/')
    .then(res => res.json())
    .then(data => {
        const problems = {};
        data.stat_status_pairs.forEach(p => {
            problems[p.stat.frontend_question_id] = {
                title: p.stat.question__title,
                difficulty: p.difficulty.level === 1 ? 'Easy' : p.difficulty.level === 2 ? 'Medium' : 'Hard'
            };
        });
        fs.writeFileSync('src/utils/leetcode.json', JSON.stringify(problems, null, 2));
        console.log('Successfully saved to src/utils/leetcode.json');
    })
    .catch(err => console.error(err));
