import { Service } from "./service";
export declare class SystemProperties extends Service {
    constructor(host: string, port?: number);
    setString: (options: any) => Promise<any>;
    setStringX: (options: any) => Promise<any>;
    getString: (options: any) => Promise<any>;
    getStringX: (options: any) => Promise<any>;
    remove: (options: any) => Promise<any>;
    removeX: (options: any) => Promise<any>;
    getWebCode: (options: any) => Promise<any>;
    provisionTrialAccount: (options: any) => Promise<any>;
    provisionCredentialedTrialAccountX: (options: any) => Promise<any>;
    migrateTrialAccountX: (options: any) => Promise<any>;
    addAccountX: (options: any) => Promise<any>;
    addAccountWithCredentialsX: (options: any) => Promise<any>;
    removeAccount: (options: any) => Promise<any>;
    editAccountPasswordX: (options: any) => Promise<any>;
    editAccountMd: (options: any) => Promise<any>;
    doPostUpdateTasks: (options: any) => Promise<any>;
    resetThirdPartyCredentials: (options: any) => Promise<any>;
}
