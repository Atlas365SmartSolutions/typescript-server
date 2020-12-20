export type BatchInformation = {
    "quantity": Number,
    "unit": String
};

export type BatchRequest = {
    "batchId" : String,
    "facilityName": String,
    "facilityAddress": String,
    "bioMass": BatchInformation,
    "signoffOfficers": Array<String>,
    "batchAuthorizedDate": String
  };

export  type BatchStatus = {
    PENDING: 0,
    MILLING: 1,
    EXTRACTION: 2,
    FILTRATION_1: 3,
    ENRICHMENT: 4,
    FILTRATION_2: 5,
    COMPLETE: 6
  };

export  type ExtractionBatch = {
    "crudeExtract"?: BatchInformation,
    "unboundFiltrate"?: BatchInformation,
    "finalElution"?: BatchInformation,
    "unaccounted"?: BatchInformation,
    "notes"?: Array<String>,
    "batchStatus"?: BatchStatus,
    "batchRequest"?: BatchRequest
  }
  