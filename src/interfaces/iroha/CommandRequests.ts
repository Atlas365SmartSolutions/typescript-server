import { IROHA_ACCOUNT_SUFFIX } from "../../common/Constants";

// REQUEST INTERFACE
export class AdjustAssetQuantityRequest {
    assetId!: string;
    amount!: number;

    constructor(){}

    AdjustAssetQuantityRequest(assetId: string, amount: number) {
        this.assetId = assetId;
        this.amount = amount;
    }
}

// REQUEST INTERFACE
export class OnboardLicenseeRequest {
    accountId!: string;

    constructor(){}

    OnboardLicenseeRequest(accountId: string) {
        this.accountId = accountId;
    }
}

export class AddPeerRequest {
    address!: string;
    peerKey!: string;

    constructor(){}

    AddPeerRequest(address: string, peerKey: string) {
        this.address = address;
        this.peerKey = peerKey;
    }
}

export class AddSignatoryRequest {
    accountId!: string;
    publicKey!: string;

    constructor(){}

    AddSignatoryRequest(accountId: string, publicKey: string) {
        this.accountId = accountId;
        this.publicKey = publicKey;
    }
}

export class AppendRoleRequest {
    accountId!: string;
    roleName!: string;

    constructor(accountId: string, roleName: string) {
        this.accountId = accountId+IROHA_ACCOUNT_SUFFIX;
        this.roleName = roleName;
    }
}

export class CompareAndSetAccountDetailRequest {
    accountId!: string;
    key!: string;
    value!: string;
    oldValue!: string;
    emptyCheck: boolean | undefined = false; //if true, empty oldValue in command must match absent value in WSV; 
                                             //if false, any oldValue in command matches absent in WSV (legacy)

    constructor(){}

    CompareAndSetAccountDetailRequest(accountId: string, key: string, value: string, oldValue: string, emptyCheck: boolean) {
        this.accountId = accountId;
        this.key = key;
        this.value = value;
        this.oldValue = oldValue;
        this.emptyCheck = emptyCheck;
    }
}

export class CreateAccountRequest {
    accountName!: string;
    domainId!: string;
    publicKey!: string;
   
    constructor(accountName: string, domainId: string, publicKey: string){
        this.accountName = accountName;
        this.domainId = domainId;
        this.publicKey = publicKey;
    }
}

export class CreateAssetRequest {
    assetName!: string;
    domainId!: string;
    precision!: number;
   
    //constructor(){}

    constructor(assetName: string, domainId: string, precision: number) {
        this.assetName = assetName;
        this.domainId = domainId;
        this.precision = precision;
    }
}

export class CreateDomainRequest {
    domainId!: string;
    defaultRole!: string;
   
    //constructor(){}

    constructor(domainId: string, defaultRole: string) {
        this.domainId = domainId;
        this.defaultRole = defaultRole;
    }
}

export class CreateRoleRequest {
    roleName!: string;
    permissionsList!: Array<string>;
   
    constructor(){}

    CreateRoleRequest(roleName: string, permissionsList: Array<string>) {
        this.roleName = roleName;
        this.permissionsList = permissionsList;
    }
}

export class DetachRoleRequest {
    accountId!: string;
    roleName!: string;
   
    constructor(){}

    DetachRoleRequest(accountId: string, roleName: string) {
        this.accountId = accountId;
        this.roleName = roleName;
    }
}

export class GrantablePermissionRequest {
    accountId!: string;
    permission!: string;
   
    constructor(){}

    GrantablePermissionRequest(accountId: string, permission: string) {
        this.accountId = accountId;
        this.permission = permission;
    }
}

export class RemovePeerRequest {
    publicKey!: string;

    constructor(){}

    RemovePeerRequest(publicKey: string) {
        this.publicKey = publicKey;
    }
}

export class RemoveSignatoryRequest {
    accountId!: string;
    publicKey!: string;

    constructor(){}

    RemoveSignatoryRequest(accountId: string, publicKey: string) {
        this.accountId = accountId;
        this.publicKey = publicKey;
    }
}

export class RevokePermissionRequest {
    accountId!: string;
    permission!: string;

    constructor(){}

    RevokePermissionRequest(accountId: string, permission: string) {
        this.accountId = accountId;
        this.permission = permission;
    }
}

export class SetAccountDetailRequest {
    accountId!: string;
    key!: string;
    value!: string;

    constructor(){}

    SetAccountDetailRequest(accountId: string, value: string, key: string) {
        this.accountId = accountId;
        this.key = key;
        this.value = value;
    }
}

export class SetAccountQuorumRequest {
    accountId!: string;
    quorum!: number;

    constructor(){}

    SetAccountQuorumRequest(accountId: string, quorum: number) {
        this.accountId = accountId;
        this.quorum = quorum;
    }
}

export class TransferAssetRequest {
    srcAccountId!: string;
    destAccountId!: string;
    assetId!: string;
    description!: string;
    amount!: number;

    constructor(){}

    TransferAssetRequest(srcAccountId: string, destAccountId: string, assetId: string, description: string, amount: number) {
        this.srcAccountId = srcAccountId;
        this.destAccountId = destAccountId;
        this.assetId = assetId;
        this.description = description;        
        this.amount = amount;
    }
}