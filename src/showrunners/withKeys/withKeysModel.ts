
    import { model, Schema, Document } from 'mongoose';

    export interface IwithKeysData {
      snapshotProposalLatestTimestamp?: number;
      snapshotProposalEndedTimestamp?: number;
    }
    
    const withKeysSchema = new Schema<IwithKeysData>({
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
    
    export const withKeysModel = model<IwithKeysData>('withKeysDb', withKeysSchema);
    