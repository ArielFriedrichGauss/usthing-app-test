const fs = require('fs');
const path = require('path');

const RAW_DATA_PATH = path.join(__dirname, '../assets/data/courses.json');
const CATALOG_OUTPUT_PATH = path.join(__dirname, '../assets/data/courses-catalog.json');
const PREREQ_OUTPUT_PATH = path.join(__dirname, '../assets/data/prereqs.json');

console.log('Loading courses.json (~28 MB).');
const rawData = JSON.parse(fs.readFileSync(RAW_DATA_PATH, 'utf-8'));

let coursesList = [];
if (rawData.catalog && rawData.catalog.train) {
  coursesList = rawData.catalog.train;
} else if (rawData.schedule && rawData.schedule.courses_unified) {
  coursesList = rawData.schedule.courses_unified;
} else if (Array.isArray(rawData)) {
  coursesList = rawData;
} else {
  const fallbackKey = Object.keys(rawData).find((k) => Array.isArray(rawData[k]));
  coursesList = fallbackKey ? rawData[fallbackKey] : [];
}

console.log(`Processing ${coursesList.length} raw course records...`);

const catalogByTerm = {};
const prereqGraph = {};

coursesList.forEach((course) => {
  const prefix = course.prefix || '';
  const number = course.number || '';
  const code = course.code || `${prefix} ${number}`.trim();
  const campusCode = course.campus_code || 'MAIN';
  const status = course.status || 'ACTIVE';
  const termCode = course.term_code || '';
  const termName = course.term_name || '';

  if (code && course.prerequisite) {
    const matches = String(course.prerequisite).match(/[A-Z]{4}\s?\d{4}[A-Z]?/g) || [];
    prereqGraph[code] = [...new Set(matches)];
  } else if (code && !prereqGraph[code]) {
    prereqGraph[code] = [];
  }

  if (campusCode === 'MAIN' && status === 'ACTIVE') {
    const courseRecord = {
      id: course.id || code,
      code,
      prefix,
      number,
      title: course.title || '',
      termCode,
      termName,
      careerType: course.career_type || 'UG',
      campusCode,
      minCredits: course.min_credits ?? 0,
      maxCredits: course.max_credits ?? 0,
      description: course.description || '',
      prerequisite: course.prerequisite || '',
      corequisite: course.corequisite || '',
      exclusion: course.exclusion || '',
      cilos: course.cilos || [],
      status,
    };

    if (!catalogByTerm[termCode]) {
      catalogByTerm[termCode] = {
        termCode,
        termName,
        courses: [],
      };
    }
    catalogByTerm[termCode].courses.push(courseRecord);
  }
});

const sortedTerms = Object.values(catalogByTerm).sort((a, b) => {
  return parseInt(b.termCode, 10) - parseInt(a.termCode, 10);
});

const flatIndex = [];
sortedTerms.forEach((term) => {
  term.courses.forEach((c) => {
    flatIndex.push({
      id: c.id,
      code: c.code,
      title: c.title,
      termCode: c.termCode,
      termName: c.termName,
      careerType: c.careerType,
      minCredits: c.minCredits,
      maxCredits: c.maxCredits,
    });
  });
});

fs.writeFileSync(CATALOG_OUTPUT_PATH, JSON.stringify({ terms: sortedTerms, flatIndex }));
fs.writeFileSync(PREREQ_OUTPUT_PATH, JSON.stringify(prereqGraph));

console.log(`Successfully generated optimized assets:
 - Catalog Index: ${(fs.statSync(CATALOG_OUTPUT_PATH).size / 1024 / 1024).toFixed(2)} MB
 - Prereq Graph: ${(fs.statSync(PREREQ_OUTPUT_PATH).size / 1024 / 1024).toFixed(2)} MB`);
