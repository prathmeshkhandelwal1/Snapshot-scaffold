
    import { model, Schema, Document } from 'mongoose';

    export interface Itesting123Data {
      snapshotProposalLatestTimestamp?: number;
      snapshotProposalEndedTimestamp?: number;
    }
    
    const testing123Schema = new Schema<Itesting123Data>({
      _id: {
        type: String,
      },
      snapshotProposalLatestTimestamp: {
        type: Number,
      },
      snapshotProposalEndedTimestamp: {
        type: Number,
      },
    });
    
    export const testing123Model = model<Itesting123Data>('testing123Db', testing123Schema);
    