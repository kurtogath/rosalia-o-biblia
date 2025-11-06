export type Quote = {
    id: number;
    frase: string;
    origen: string;
};

export type CheckResponse = {
    correct: boolean;
    correctSource: "rosalia" | "biblia";
    origen: string;
    error:string
};

export type GuessType = "rosalia" | "biblia";