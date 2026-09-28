export interface PrereqNode {
  code: string;
  children: PrereqNode[];
  isCycle?: boolean;
}

export function buildPrerequisiteTree(
  courseCode: string,
  prereqGraph: Record<string, string[]>,
  visited: Set<string> = new Set()
): PrereqNode {
  if (visited.has(courseCode)) {
    return { code: courseCode, children: [], isCycle: true };
  }

  const directPrereqs = prereqGraph[courseCode] || [];
  
  const nextVisited = new Set(visited);
  nextVisited.add(courseCode);

  const children: PrereqNode[] = directPrereqs.map((prereqCode) =>
    buildPrerequisiteTree(prereqCode, prereqGraph, nextVisited)
  );

  return {
    code: courseCode,
    children,
  };
}
