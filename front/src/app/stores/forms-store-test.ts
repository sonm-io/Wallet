import { FormsStore } from './forms-store';

interface ITestInput {
    name: string;
    price: string;
    useBlacklist: boolean;
}

interface IValidation extends ITestInput {
    kyc: string;
}

export class FormsStoreTest extends FormsStore<ITestInput, IValidation> {}
