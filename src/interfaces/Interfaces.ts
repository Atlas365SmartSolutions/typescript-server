// EXTRACTION INTERFACE
export type BatchInformation = {
    quantity?: Number;
    unit?: String;
};

export type BatchRequest = {
    batchId?: String;
    facilityName?: String;
    facilityAddress?: String;
    bioMass?: BatchInformation;
    signoffOfficers?: Array<String>;
    batchAuthorizedDate?: String;
  };

export enum BatchStatus {
    PENDING = 0,
    MILLING = 1,
    EXTRACTION = 2,
    FILTRATION_1 = 3,
    ENRICHMENT = 4,
    FILTRATION_2 = 5,
    COMPLETE = 6
  };

export type ExtractionBatch = {
    bioMass?: BatchInformation;
    crudeExtract?: BatchInformation;
    unboundFiltrate?: BatchInformation;
    finalElution?: BatchInformation;
    unaccounted?: BatchInformation;
    notes?: Array<String>;
    batchStatus?: BatchStatus;
    batchRequest?: BatchRequest;
};

// QUERIES INTERFACE
export enum Field {
  kCreatedTime = 0,
  kPosition = 1
};
export enum Direction {
  kAscending = 0,
  kDescending = 1,
};
export type FieldOrdering = {
  field?: Field;
  direction?: Direction;
};
export type Ordering = {
  sequence?: Array<FieldOrdering>;
};
export type TxPaginationMeta = {
  page_size?: Number;
  first_tx_hash?: String
  ordering?: Ordering;
};
export type EngineReceipt = {
  command_index?: Number;
  caller?: String;
  call_result?: CallResult;
  contract_address?: String;
  logs: Array<EngineLog>;
};
export type CallResult = {
  callee?: String;
  result_data?: String;
};
export type EngineLog = {
  address?: String;         // hex string
  data?: String;            // hex string
  topics?: Array<String>; // hex string
};
export type Account = {
  account_id?: String;
  domain_id?: String;
  quorum?: Number;
  json_data?: String;
};
export type Transactions = {
  transactions?: Array<String>;
};
export type BatchInfo = {
  first_tx_hash?: String;
  batch_size?: Number;
};
export type AssetPaginationMeta = {
  page_size?: Number;
  first_asset_id?: String;
};
export type AccountAsset = {
  asset_id?: String;
  account_id?: String;
  balance?: Number;
};
export type AccountDetailRecordId = {
  writer?: String;
  key?: String;
};
export type AccountDetailPaginationMeta = {
  page_size?: Number;
  first_record_id?: AccountDetailRecordId;
};
export type Asset = {
  asset_id?: String;
  domain_id?: String;
  precision?: Number;
};

// QUERIE RESPONSE INTERFACE
export type EngineReceiptsResponse = {
  engine_receipt?: Array<EngineReceipt>;
};
export type AccountResponse = {
  account?: Account;
  account_roles?: Array<String>;
};
export type BlockResponse = {
  block?: String;
};
export type SignatoriesResponse = {
  keys?: Array<String>;
};
export type TransactionsResponse = {
  transactions?: Array<String>;
};
export type PendingTransactionsPageResponse = {
  transactions?: Transactions;
  all_transactions_size?: Number;
  next_batch_info?: BatchInfo;
};
export type TransactionsPageResponse = {
  transactions?: Transactions;
  all_transactions_size?: Number;
  next_tx_hash?: String;
};
export type AccountAssetResponse = {
  account_assets?: Array<AccountAsset>;
  total_number?: Number;
  next_asset_id?: String;
};
export type AccountDetailResponse = {
  detail?: String;
  total_number?: Number;
  next_record_id?: AccountDetailRecordId;
};
export type PeersResponse = {
  peers?: Array<Peer>;
};
export type BlockQueryResponse = {
    block_response?: BlockResponse;
    block_error_response?: BlockErrorResponse;
};
export type BlockErrorResponse ={
  message?: String;
};
export type RolesResponse = {
  roles?: Array<String>;
};
export type RolePermissionsResponse = {
  permissions?: Array<String>;
};

// QUERIE REQUEST INTERFACE
export type GetEngineReceipts = {
  tx_hash: String;     // hex string
};
export type GetAccount = {
  account_id?: String;
};
export type  GetBlock = {
  height?: Number;
};
export type GetSignatories = {
  account_id?: String;
};
export type GetTransactions = {
  tx_hashes?: Transactions;
};
export type GetPendingTransactions = {
  pagination_meta?: TxPaginationMeta;
};
export type GetAccountTransactions = {
  account_id?: String;
  pagination_meta?: TxPaginationMeta;
};
export type GetAccountAssetTransactions = {
  account_id?: String;
  asset_id?: String;
  pagination_meta?: TxPaginationMeta;
};
export type GetAccountAssets = {
  account_id?: String;
  pagination_meta?: AssetPaginationMeta;
};
export type GetAccountDetail = {
  account_id?: String;
  key?: String;
  writer?: String;
  pagination_meta?: AccountDetailPaginationMeta;
};
export type GetAssetInfo = {
  asset_id?: String;
};
export type GetRolePermissions = {
  role_id?: String;
};

// COMMAND INTERFACE

export type Peer = {
  address?: String;
  peer_key?:  String; // hex string
};

// COMMAND ADD - TRANSFER - SUBTRACT REQUEST INTERFACE 

export type AddAssetQuantity = {
    asset_id?: String;
    amount?: Number;
};
export type AddPeer = {
  peer?: Peer;
};
export type  AddSignatory = {
  account_id?: String;
  public_key?: String;
};
export type AppendRole = {
  account_id?: String;
  role_name?: String;
};
export type SubtractAssetQuantity = {
  asset_id?: String;
  amount?: Number;
};
export type TransferAsset = {
  src_account_id?: String;
  dest_account_id?: String;
  asset_id?: String;
  description?: String;
  amount?: Number;
};

// COMMAND CREATE REQUEST INTERFACE 

export type CreateAccount = {
  account_name?: String;
  domain_id?: String;
  public_key?: String;
};
export type CreateAsset = {
  asset_name?: String;
  domain_id?: String;
  precision?: Number;
};
export type CreateDomain = {
  domain_id?: String;
  default_role?: String
};
export type CreateRole = {
  role_name?: String;
  permissions?: Array<String>;
};
export type DetachRole = {
  account_id?: String;
  role_name?: String;
};
// COMMAND PERMISSION REQUEST INTERFACE 

export type GrantPermission = {
  account_id?: String;
  permission?: String;
};
export type RemovePeer = {
  public_key?: String; // hex string
};
export type RemoveSignatory = {
  account_id?: String;
  public_key?: String;
};
export type RevokePermission = {
  account_id?: String;
  permission?: String;
};
// COMMAND SET REQUEST INTERFACE 

export type SetAccountDetail = {
  account_id?: String;
  key?: String;
  value?: String;
};
export type SetAccountQuorum = {
  account_id?: String;
  quorum?: Number;
};
export type CompareAndSetAccountDetail = {
  account_id?: String;
  key?: String;
  value?: String;
  old_value?: String;
  check_empty?: Boolean;
};
