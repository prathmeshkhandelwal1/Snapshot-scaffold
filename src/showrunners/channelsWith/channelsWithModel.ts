
    import { model, Schema, Document } from 'mongoose';

    export interface IchannelsWithData {
      snapshotProposalLatestTimestamp?: number;
      snapshotProposalEndedTimestamp?: number;
    }
    
    const channelsWithSchema = new Schema<IchannelsWithData>({
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
    
    export const channelsWithModel = model<IchannelsWithData>('channelsWithDb', channelsWithSchema);
    