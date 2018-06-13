import { ListStore } from './list-store';
import { ISendTransactionResult } from '../api/types';

export class HistoryListStore extends ListStore<ISendTransactionResult> {}
