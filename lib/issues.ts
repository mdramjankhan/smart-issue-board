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
    type DocumentData,
    type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { IssueInput, IssuePriority, IssueRecord, IssueStatus } from "@/types/issue";
import { buildIssueCorpus, similarityScore } from "./similarity";

const ISSUES_COLLECTION = "issues";

const allowedTransitions: Record<IssueStatus, IssueStatus[]> = {
    Open: ["In Progress"],
    "In Progress": ["Open", "Done"],
    Done: [],
};

const issuesCollection = collection(db, ISSUES_COLLECTION);

function toIssueRecord(docSnap: DocumentSnapshot<DocumentData>): IssueRecord {
    const data = docSnap.data();
    if (!data) throw new Error("Issue document is empty or unreadable.");
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

export async function listIssues(options: {
    status?: IssueStatus;
    priority?: IssuePriority;
    limitTo?: number;
} = {}): Promise<IssueRecord[]> {
    // Avoid Firestore composite index requirements by fetching ordered data then filtering client-side.
    const constraints = [orderBy("createdAt", "desc")];
    if (options.limitTo) constraints.push(fsLimit(options.limitTo));

    const snap = await getDocs(query(issuesCollection, ...constraints));
    const allIssues = snap.docs.map(toIssueRecord);

    return allIssues.filter((issue) => {
        const statusOk = options.status ? issue.status === options.status : true;
        const priorityOk = options.priority ? issue.priority === options.priority : true;
        return statusOk && priorityOk;
    });
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

export async function updateIssueStatus(issueId: string, nextStatus: IssueStatus): Promise<IssueStatus> {
    const issueRef = doc(db, ISSUES_COLLECTION, issueId);
    const snap = await getDoc(issueRef);
    if (!snap.exists()) throw new Error("Issue not found.");

    const currentStatus = snap.data().status as IssueStatus;
    const allowedNext = allowedTransitions[currentStatus] ?? [];

    if (!allowedNext.includes(nextStatus)) {
        throw new Error(
            currentStatus === "Open" && nextStatus === "Done"
                ? "You can only move Open issues to In Progress first."
                : "This status change is not allowed by the board rules.",
        );
    }

    await updateDoc(issueRef, { status: nextStatus });
    return nextStatus;
}

export interface SimilarIssue {
    issue: IssueRecord;
    score: number; // 0 to 1; higher means more overlap in meaningful words
}

export async function findSimilarIssues(candidate: { title: string; description: string }): Promise<SimilarIssue[]> {
    const recentIssues = await listIssues({ limitTo: 200 });
    const candidateText = `${candidate.title} ${candidate.description}`;

    return recentIssues
        .map((issue) => ({ issue, score: similarityScore(candidateText, buildIssueCorpus(issue)) }))
        .filter((entry) => entry.score >= 0.25)
        .sort((a, b) => b.score - a.score);
}
