import { Service } from "./service";

export class SystemProperties extends Service {
    constructor (host: string, port = 1400) {
        super("SystemProperties", host, port, 
                "/SystemProperties/Control",
                "/SystemProperties/Event",
                "/xml/SystemProperties1.xml");
    }

    public setString = (options): Promise<any> => { return this.request('SetString', options); }
    public setStringX = (options): Promise<any> => { return this.request('SetStringX', options); }
    public getString = (options): Promise<any> => { return this.request('GetString', options); }
    public getStringX = (options): Promise<any> => { return this.request('GetStringX', options); }
    public remove = (options): Promise<any> => { return this.request('Remove', options); }
    public removeX = (options): Promise<any> => { return this.request('RemoveX', options); }
    public getWebCode = (options): Promise<any> => { return this.request('GetWebCode', options); }
    public provisionTrialAccount = (options): Promise<any> => { return this.request('ProvisionTrialAccount', options); }
    public provisionCredentialedTrialAccountX = (options): Promise<any> => { return this.request('ProvisionCredentialedTrialAccountX', options); }
    public migrateTrialAccountX = (options): Promise<any> => { return this.request('MigrateTrialAccountX', options); }
    public addAccountX = (options): Promise<any> => { return this.request('AddAccountX', options); }
    public addAccountWithCredentialsX = (options): Promise<any> => { return this.request('AddAccountWithCredentialsX', options); }
    public removeAccount = (options): Promise<any> => { return this.request('RemoveAccount', options); }
    public editAccountPasswordX = (options): Promise<any> => { return this.request('EditAccountPasswordX', options); }
    public editAccountMd = (options): Promise<any> => { return this.request('EditAccountMd', options); }
    public doPostUpdateTasks = (options): Promise<any> => { return this.request('DoPostUpdateTasks', options); }
    public resetThirdPartyCredentials = (options): Promise<any> => { return this.request('ResetThirdPartyCredentials', options); }
}