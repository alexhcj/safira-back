export interface ICompanyData {
  displayName: string; // Name for display (e.g., "ConAgra Foods, Inc.")
  normalizedName: string; // Cleaned name for searching (e.g., "conagra foods")
  slug: string; // URL-friendly version (e.g., "conagra-foods")
}
