export const LLM_TYPE = {
  OPENAI: "OPENAI",
  GEMINI: "GEMINI",
};

export const VECTOR_STORE = {
  CHROMA: "CHROMA",
  SUPABASE: "SUPABASE",
};

export const EMBEDDING_MODEL = {
  OPENAI: {
    model: "text-embedding-3-small",
    functionDefinition: "OpenAIEmbeddings",
    key: "model",
  },
  GEMINI: {
    model: "gemini-embedding-exp-03-07",
    functionDefinition: "GoogleGenerativeAIEmbeddings",
    key: "modelName",
  },
};
