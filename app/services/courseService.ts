import courseCatalogData from '../../assets/data/courses-catalog.json';
import prereqGraphData from '../../assets/data/prereqs.json';

export const CourseService = {
  getTerms() {
    return courseCatalogData.terms || [];
  },

  getFlatIndex() {
    return courseCatalogData.flatIndex || [];
  },

  getPrereqGraph() {
    return prereqGraphData || {};
  },

  getCoursesForTerm(termCode: string) {
    const term = courseCatalogData.terms.find((t: any) => t.termCode === termCode);
    return term ? term.courses : [];
  }
};
