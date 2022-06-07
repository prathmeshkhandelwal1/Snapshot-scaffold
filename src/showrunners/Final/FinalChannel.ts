import { Inject, Service } from "typedi";
import config, { defaultSdkSettings } from "../../config";
import { request, gql } from "graphql-request";
import { Logger } from "winston";
import {
  EPNSChannel,
  ISendNotificationParams,
} from "../../helpers/epnschannel";
import { FinalModel, IFinalData } from "./FinalModel";

export interface ISnapshotProposal {
  percent: any;
  result: any;
  scores_total: number;
  scores: any;
  id: string;
  title: string;
  body: string;
  created: number;
  choices: string[];
  start: number;
  state: string;
  end: number;
}

@Service()
export default class FinalChannel extends EPNSChannel {
  constructor(
    @Inject("logger") public logger: Logger,
    @Inject("cached") public cached
  ) {
    super(logger, {
      sdkSettings: {
        epnsCoreSettings: defaultSdkSettings.epnsCoreSettings,
        epnsCommunicatorSettings: defaultSdkSettings.epnsCommunicatorSettings,
        networkSettings: defaultSdkSettings.networkSettings,
      },
      networkToMonitor: config.web3MainnetNetwork,
      dirname: __dirname,
      name: "Final",
      url: "undefined",
      useOffChain: true,
    });
  }
  URL_SPACE_PROPOSAL = "https://hub.snapshot.org/graphql";

  //
  // Showrunners
  //

  async snapShotProposalsTask(simulate) {
    try {
      const FinalData = await this.getFinalDataFromDB();
      if (!FinalData?.snapshotProposalLatestTimestamp)
        this.logInfo("snapshotProposalLatestTimestamp from DB does not exist");
      const res: { proposals: ISnapshotProposal[] } =
        await this.fetchSnapshotProposals(
          FinalData?.snapshotProposalLatestTimestamp ?? this.timestamp
        );
      const lengthMsg = "No of proposals : " + res.proposals.length;
      this.logInfo(lengthMsg);
      for (const proposal of res.proposals) {
        try {
          this.log("-------------------------");
          const logMsg =
            "title: " +
            proposal.title +
            "id : " +
            proposal.id +
            "msg : " +
            proposal.body;
          this.log(logMsg);

          const payloadMsg =
            "A Proposal has been created on Final [b: " +
            proposal.title +
            "]" +
            "[timestamp:" +
            Date.now() / 1000 +
            "]";
          const message =
            "A Proposal " + proposal.title + "has been created on Final";
          const title = "New Proposal";
          const cta =
            "https://snapshot.org/#/undefined/proposal/" + proposal.id;
          await this.sendNotification({
            recipient: this.channelAddress,
            message: message,
            payloadMsg: payloadMsg,
            payloadTitle: title,
            title: title,
            image: null,
            notificationType: 1,
            simulate: simulate,
            cta: cta,
          });
        } catch (error) {
          this.logError(error);
        }
      }
      await this.setFinalDataInDB({
        snapshotProposalLatestTimestamp: this.timestamp,
      });
    } catch (error) {
      this.logError(error);
    }
  }

  async fetchSnapshotProposals(createdGte): Promise<any> {
    this.logInfo("Fetching Snapshot Proposals");
    const snapshotQuery = gql`
      {
        proposals(
          orderBy: "start"
          orderDirection: desc
          where: { space_in: ["undefined"], created_gte: createdGte }
        ) {
          id
          title
          body
          created
          state
          choices
          start
          end
        }
      }
    `;

    const resp = await request(this.URL_SPACE_PROPOSAL, snapshotQuery);

    return resp;
  }

  public async snapShotEndedProposalsTask(simulate) {
    try {
      const FinalData = await this.getFinalDataFromDB();
      if (!FinalData?.snapshotProposalEndedTimestamp)
        this.logInfo("snapshotProposalEndedTimestamp from DB does not exist");
      const res: { proposals: ISnapshotProposal[] } =
        await this.fetchEndedSnapshotProposals(
          FinalData?.snapshotProposalEndedTimestamp ?? this.timestamp
        );
      const lengthMsg = "No of proposals : " + res.proposals.length;
      this.logInfo(lengthMsg);
      for (const proposal of res.proposals) {
        this.log(proposal.title);
        this.log(proposal.choices);
        this.log(proposal.scores);

        let maxScore = Math.max(...(proposal?.scores ?? []));
        let maxScoreIndex = proposal.scores.indexOf(maxScore);
        const maxPercentage = Math.floor(
          (proposal.scores[maxScoreIndex] * 100) / proposal.scores_total
        );
        this.logInfo(`MaxScore: maxScore MaxScoreIndex: maxScoreIndex`);
        const resultChoice = proposal.choices[maxScoreIndex];
        const resultMsgLog = "Result Choice :" + resultChoice;
        this.logInfo(resultMsgLog);

        try {
          if (maxPercentage && resultChoice) {
            this.log("-------------------------");
            const titleLog =
              "title: " +
              proposal.title +
              "id: " +
              proposal.id +
              "msgs :" +
              proposal.msgs;
            this.log(titleLog);
            const payloadMsg =
              "[t:Title] : " +
              proposal.title +
              'Choice "[d:' +
              resultChoice +
              ']" got majority vote of [b:' +
              maxPercentage +
              "]%";
            const message =
              'A Proposal "' + proposal.title + "has been concluded on Final";
            const title = "Proposal Ended";
            const cta =
              "https://snapshot.org/#/undefined/proposal/" + proposal.id;
            await this.sendNotification({
              recipient: this.channelAddress,
              message: message,
              payloadMsg: payloadMsg,
              payloadTitle: title,
              title: title,
              image: null,
              notificationType: 1,
              simulate: simulate,
              cta: cta,
            });
          }
        } catch (error) {
          this.logError(error);
        }
      }
      await this.setFinalDataInDB({
        snapshotProposalEndedTimestamp: this.timestamp,
      });
    } catch (error) {
      this.logError(error);
    }
  }

  async fetchEndedSnapshotProposals(endedGte): Promise<any> {
    this.logInfo("Fetching Ended Snapshot Proposals");
    const snapshotQuery = gql`
      {
        proposals(orderBy: "end", orderDirection: desc, where: {space_in: ["undefined"],end_gte:${endedGte},state:"closed"}) {
          id
          title
          body
          created
          state
          choices
          start
          end
          scores
          scores_total
        }
      }
      `;

    const respend = await request(this.URL_SPACE_PROPOSAL, snapshotQuery);

    return respend;
  }

  async fetchActiveSnapshotProposals(): Promise<any> {
    this.logInfo("Fetching Active Snapshot Proposals");
    const snapshotQuery = gql`
      {
        proposals(
          orderBy: "start"
          orderDirection: desc
          where: { space_in: ["mangabank.eth"], state: "active" }
        ) {
          id
          title
          body
          created
          state
          choices
          start
          end
        }
      }
    `;

    const respactive = await request(this.URL_SPACE_PROPOSAL, snapshotQuery);

    return respactive;
  }

  async snapShotConcludingProposalsTask(simulate) {
    // need to change the logic!!
    const res: { proposals: ISnapshotProposal[] } =
      await this.fetchActiveSnapshotProposals();
    const lengthMsg = "No of proposals : " + res.proposals.length;
    this.logInfo(lengthMsg);

    for (const proposal of res.proposals) {
      const diff = proposal.end - this.timestamp;
      this.log(diff / (60 * 60 * 24));
      if (diff <= 86400 && diff > 0) {
        try {
          this.log("-------------------------");
          const titleLog =
            "title: " +
            proposal.title +
            "id: " +
            proposal.id +
            "msgs :" +
            proposal.msgs;
          this.log(titleLog);

          const payloadMsg =
            "A Proposal is concluding soon on Final[b:" + proposal.title + "]";
          const message =
            'A Proposal "' +
            proposal.title +
            '" is concluding soon on Final ' +
            proposal.end;
          const title = "Proposal Ending Soon";
          const cta =
            "https://snapshot.org/#/undefined/proposal/" + proposal.id;
          await this.sendNotification({
            recipient: this.channelAddress,
            message: message,
            payloadMsg: payloadMsg,
            payloadTitle: title,
            title: title,
            image: null,
            notificationType: 1,
            simulate: simulate,
            cta: cta,
          });
        } catch (error) {
          this.logError(error);
        }
      }
    }
  }

  // Get Final Data From DB
  async getFinalDataFromDB() {
    this.logInfo("Getting Final Data from DB..");
    const doc = await FinalModel.findOne({ _id: "Final_DATA" });
    this.logInfo("Final Data obtained");
    this.log(doc);
    return doc;
  }

  // Set Final Data in DB
  async setFinalDataInDB(FinalData: IFinalData) {
    this.logInfo("Setting Final Data In DB");
    this.log(FinalData);
    await FinalModel.findOneAndUpdate({ _id: "Final_DATA" }, FinalData, {
      upsert: true,
    });
  }
}
