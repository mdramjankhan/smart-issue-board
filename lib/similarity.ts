import { IssueRecord } from "@/types/issue";

const tokenize = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 3);

const jaccard = (a: string[], b: string[]) => {
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = [...setA].filter((word) => setB.has(word)).length;
    const union = new Set([...setA, ...setB]).size || 1;
    return intersection / union;
};

export function similarityScore(textA: string, textB: string) {
    const tokensA = tokenize(textA);
    const tokensB = tokenize(textB);
    return jaccard(tokensA, tokensB);
}

export function buildIssueCorpus(issue: IssueRecord) {
    return `${issue.title} ${issue.description}`;
}
