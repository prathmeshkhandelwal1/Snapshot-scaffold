
    import { model, Schema, Document } from 'mongoose';

    export interface IFinalData {
      snapshotProposalLatestTimestamp?: number;
      snapshotProposalEndedTimestamp?: number;
    }
    
    const FinalSchema = new Schema<IFinalData>({
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
    
    export const FinalModel = model<IFinalData>('FinalDb', FinalSchema);
    