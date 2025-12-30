import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    limit as fsLimit,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    type DocumentData,
    type DocumentSnapshot,
    type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import {
    IssueInput,
    IssuePriority,
    IssueRecord,
    IssueStatus,
} from "@/types/issue";

const ISSUES_COLLECTION = "issues";

const allowedTransitions: Record<IssueStatus, IssueStatus[]> = {
    Open: ["In Progress"],
    "In Progress": ["Open", "Done"],
    Done: [],
};

const issuesCollection = collection(db, ISSUES_COLLECTION);

function toIssueRecord(docSnap: DocumentSnapshot<DocumentData>): IssueRecord {
    const data = docSnap.data();
    if (!data) {
        throw new Error("Issue document is empty or unreadable.");
    }
    return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        assignedTo: data.assignedTo,
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(0),
    };
}

export async function listIssues(
    options: {
        status?: IssueStatus;
        priority?: IssuePriority;
        limitTo?: number;
    } = {}
): Promise<IssueRecord[]> {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

    if (options.status) constraints.push(where("status", "==", options.status));
    if (options.priority)
        constraints.push(where("priority", "==", options.priority));
    if (options.limitTo) constraints.push(fsLimit(options.limitTo));

    const snap = await getDocs(query(issuesCollection, ...constraints));
    return snap.docs.map(toIssueRecord);
}

export async function createIssue(input: IssueInput): Promise<string> {
    const payload = {
        ...input,
        status: "Open" as IssueStatus,
        createdAt: serverTimestamp(),
    };

    const result = await addDoc(issuesCollection, payload);
    return result.id;
}

export async function updateIssueStatus(
    issueId: string,
    nextStatus: IssueStatus
): Promise<IssueStatus> {
    const issueRef = doc(db, ISSUES_COLLECTION, issueId);
    const snap = await getDoc(issueRef);
    if (!snap.exists()) throw new Error("Issue not found.");

    const currentStatus = snap.data().status as IssueStatus;
    const allowedNext = allowedTransitions[currentStatus] ?? [];

    if (!allowedNext.includes(nextStatus)) {
        throw new Error(
            currentStatus === "Open" && nextStatus === "Done"
                ? "You can only move Open issues to In Progress first."
                : "This status change is not allowed by the board rules."
        );
    }

    await updateDoc(issueRef, { status: nextStatus });
    return nextStatus;
}

export interface SimilarIssue {
    issue: IssueRecord;
    score: number; 
}

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

export async function findSimilarIssues(candidate: {
    title: string;
    description: string;
}): Promise<SimilarIssue[]> {
    const recentIssues = await listIssues({ limitTo: 50 });
    const candidateTokens = tokenize(
        `${candidate.title} ${candidate.description}`
    );

    const matches = recentIssues
        .map((issue) => {
            const issueTokens = tokenize(`${issue.title} ${issue.description}`);
            const score = jaccard(candidateTokens, issueTokens);
            return { issue, score } as SimilarIssue;
        })
        .filter((entry) => entry.score >= 0.25)
        .sort((a, b) => b.score - a.score);

    return matches;
}
