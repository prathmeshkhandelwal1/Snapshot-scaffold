const fs = require("fs");
const path = require("path");

const showrunnersPath = path.join(__dirname, "/showrunners");
// fs.mkdirSync(showrunnersPath);

const createChannelFolder = async (channelName) => {
  try {
    const showrunnersPath = path.join(__dirname, "/showrunners");
    const channelPath = path.join(showrunnersPath, `/${channelName}`);
    fs.mkdirSync(channelPath);
  } catch (e) {
    console.log(e);
  }
};

const createJobsFile = async (channelName) => {
  try {
    const channelPath = path.join(showrunnersPath, `/${channelName}`);
    fs.writeFile(
      channelPath + `/${channelName}Jobs.ts`,
      `
    import logger from '../../loaders/logger';
    
    import { Container } from 'typedi';
    import schedule from 'node-schedule';
    import ${channelName}Channel from './${channelName}Channel';
    
    export default () => {
      const startTime = new Date(new Date().setHours(0, 0, 0, 0));
      const channel = Container.get(${channelName}Channel);
      const threeHourRule = new schedule.RecurrenceRule();
      threeHourRule.hour = new schedule.Range(0, 23, 3);
      threeHourRule.minute = 0;
    
      const dailyRule = new schedule.RecurrenceRule();
      dailyRule.hour = 0;
      dailyRule.minute = 0;
      dailyRule.second = 0;
      dailyRule.dayOfWeek = new schedule.Range(0, 6);
    
      schedule.scheduleJob({ start: startTime, rule: threeHourRule }, async function() {
       
        try {
          channel.snapShotProposalsTask(false);
         
        } catch (err) {
         
          logger.error(err);
        }
      });
      schedule.scheduleJob({ start: startTime, rule: threeHourRule }, async function() {
        try {
          channel.snapShotEndedProposalsTask(false);
        } catch (err) {
          logger.error(err);
        }
      });
      schedule.scheduleJob({ start: startTime, rule: threeHourRule }, async function() {
        try {
          channel.snapShotConcludingProposalsTask(false);
        } catch (err) {
          logger.error(err);
        }
      });
    };
    `,
      function (err) {
        if (err) throw err;
        console.log("Results Received");
      }
    );
  } catch (e) {
    console.log(e);
  }
};

const createModelFile = async (channelName) => {
  try {
    const channelPath = path.join(showrunnersPath, `/${channelName}`);
    fs.writeFile(
      channelPath + `/${channelName}Model.ts`,
      `
    import { model, Schema, Document } from 'mongoose';

    export interface I${channelName}Data {
      snapshotProposalLatestTimestamp?: number;
      snapshotProposalEndedTimestamp?: number;
    }
    
    const ${channelName}Schema = new Schema<I${channelName}Data>({
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
    
    export const ${channelName}Model = model<I${channelName}Data>('${channelName}Db', ${channelName}Schema);
    `,
      function (err) {
        if (err) throw err;
        console.log("Results Received");
      }
    );
  } catch (e) {
    console.log(e);
  }
};

const createRoutesFile = async (channelName) => {
  try {
    const channelPath = path.join(showrunnersPath, `/${channelName}`);
    fs.writeFile(
      channelPath + `/${channelName}Routes.ts`,
      `
    import { Router, Request, Response, NextFunction } from 'express';
    import { Container } from 'typedi';
    import middlewares from '../../api/middlewares';
    import { celebrate, Joi } from 'celebrate';
    import ${channelName}Channel from './${channelName}Channel';
    const route = Router();
export default (app: Router) => {
  app.use('/showrunners/${channelName}', route);
  route.post(
    '/snapshot_proposal',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/$${channelName} ticker endpoint with body: %o', req.body);
      try {
        const ${channelName} = Container.get(${channelName}Channel);
        await ${channelName}.snapShotProposalsTask(false);
        return res.status(201).json({ success: true });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
  route.post(
    '/snapshot_ended_proposal',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/${channelName} ticker endpoint with body: %o', req.body);
      try {
        const ${channelName} = Container.get(${channelName}Channel);
        await ${channelName}.snapShotEndedProposalsTask(false);
        return res.status(201).json({ success: true });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
  route.post(
    '/snapshot_concluding_proposal',
    celebrate({
      body: Joi.object({
        simulate: [Joi.bool(), Joi.object()],
      }),
    }),
    middlewares.onlyLocalhost,
    async (req: Request, res: Response, next: NextFunction) => {
      const Logger: any = Container.get('logger');
      Logger.debug('Calling /showrunners/${channelName} ticker endpoint with body: %o', req.body);
      try {
        const ${channelName} = Container.get(${channelName}Channel);
        await ${channelName}.snapShotConcludingProposalsTask(false);
        return res.status(201).json({ success: true });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};

    `,
      function (err) {
        if (err) throw err;
        console.log("Results Received");
      }
    );
  } catch (e) {
    console.log(e);
  }
};

const createKeysFile = async (PK) => {
  try {
    const channelPath = path.join(showrunnersPath, `/${channelName}`);
    fs.writeFile(
      channelPath + `/${channelName}Keys.json`,
      `{"PRIVATE_KEY":"0x${PK}"}`,
      function (err) {
        if (err) {
          throw err;
        }
        console.log("Result Recieved");
      }
    );
  } catch (e) {
    console.log(e);
  }
};

const createChannelFile = async (channelName) => {
  try {
    const channelPath = path.join(showrunnersPath, `/${channelName}`);
    fs.writeFile(
      channelPath + `/${channelName}Channel.ts`,
      `
    import { Inject, Service } from 'typedi';
    import config, { defaultSdkSettings } from '../../config';
    import { request, gql } from 'graphql-request';
    import { Logger } from 'winston';
    import { EPNSChannel, ISendNotificationParams } from '../../helpers/epnschannel';
    import { cryptoMangaModel, IcryptoMangaData } from './cryptoMangaModel';
    
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
    export default class CryptoMangaChannel extends EPNSChannel {
      constructor(@Inject('logger') public logger: Logger, @Inject('cached') public cached) {
        super(logger, {
          sdkSettings: {
            epnsCoreSettings: defaultSdkSettings.epnsCoreSettings,
            epnsCommunicatorSettings: defaultSdkSettings.epnsCommunicatorSettings,
            networkSettings: defaultSdkSettings.networkSettings,
          },
          networkToMonitor: config.web3MainnetNetwork,
          dirname: __dirname,
          name: 'CryptoManga',
          url: 'https://cryptomanga.club/',
          useOffChain: true,
        });
      }
      URL_SPACE_PROPOSAL = 'https://hub.snapshot.org/graphql';
    
      //
      // Showrunners
      //
    
      async snapShotProposalsTask(simulate) {
        try {
          const cryptoMangaData = await this.getcryptoMangaDataFromDB();
          if (!cryptoMangaData?.snapshotProposalLatestTimestamp)
            this.logInfo('snapshotProposalLatestTimestamp from DB does not exist');
          const res: { proposals: ISnapshotProposal[] } = await this.fetchSnapshotProposals(
            cryptoMangaData?.snapshotProposalLatestTimestamp ?? this.timestamp,
          );
          const lengthMsg = 'No of proposals : ' + res.proposals.length
          this.logInfo(lengthMsg);
          for (const proposal of res.proposals) {
            try {
              this.log('-------------------------');
              const logMsg = 'title: ' + proposal.title + 'id : ' + proposal.id + 'msg : ' + proposal.body
              this.log(logMsg);
              
              const payloadMsg = 'A Proposal has been created on cryptoManga [b: '+ proposal.title + ']' + '[timestamp:'+ Date.now() / 1000 + ']';
              const message = 'A Proposal ' + proposal.title +'has been created on cryptoManga';
              const title = 'New Proposal';
              const cta = 'https://snapshot.org/#/mangabank.eth/proposal/' + proposal.id;
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
          await this.setcryptoMangaDataInDB({ snapshotProposalLatestTimestamp: this.timestamp });
        } catch (error) {
          this.logError(error);
        }
      }
    
    
    async fetchSnapshotProposals(createdGte): Promise<any> {
      this.logInfo('Fetching Snapshot Proposals');
      const snapshotQuery = gql\`
      {
        proposals(orderBy: "start", orderDirection: desc, where: {space_in: ["mangabank.eth"],created_gte:createdGte}) {
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
      \`;
  
      const resp = await request(this.URL_SPACE_PROPOSAL, snapshotQuery);
  
      return resp;
    }

    public async snapShotEndedProposalsTask(simulate) {
      try {
        const cryptoMangaData = await this.getcryptoMangaDataFromDB();
        if (!cryptoMangaData?.snapshotProposalEndedTimestamp)
          this.logInfo('snapshotProposalEndedTimestamp from DB does not exist');
        const res: { proposals: ISnapshotProposal[] } = await this.fetchEndedSnapshotProposals(
          cryptoMangaData?.snapshotProposalEndedTimestamp ?? this.timestamp,
        );
        const lengthMsg = 'No of proposals : ' + res.proposals.length
        this.logInfo(lengthMsg);
        for (const proposal of res.proposals) {
          this.log(proposal.title);
          this.log(proposal.choices);
          this.log(proposal.scores);
  
          let maxScore = Math.max(...(proposal?.scores ?? []));
          let maxScoreIndex = proposal.scores.indexOf(maxScore);
          const maxPercentage = Math.floor((proposal.scores[maxScoreIndex] * 100) / proposal.scores_total);
          this.logInfo(\`MaxScore: maxScore MaxScoreIndex: maxScoreIndex\`);
          const resultChoice = proposal.choices[maxScoreIndex];
          const resultMsgLog = 'Result Choice :' + resultChoice
          this.logInfo(resultMsgLog);
  
          try {
            if (maxPercentage && resultChoice) {
              this.log('-------------------------');
              const titleLog = 'title: ' + proposal.title + 'id: ' + proposal.id + 'msgs :' + proposal.msgs
              this.log(titleLog);
              const payloadMsg = '[t:Title] : ' + proposal.title + 'Choice "[d:' + resultChoice + ']" got majority vote of [b:'+maxPercentage+ ']%';
              const message = 'A Proposal "' +proposal.title +  'has been concluded on cryptoManga';
              const title = 'Proposal Ended';
              const cta = 'https://snapshot.org/#/mangabank.eth/proposal/' + proposal.id;
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
        await this.setcryptoMangaDataInDB({ snapshotProposalEndedTimestamp: this.timestamp });
      } catch (error) {
        this.logError(error);
      }
    }

    async fetchEndedSnapshotProposals(endedGte): Promise<any> {
      this.logInfo('Fetching Ended Snapshot Proposals');
      const snapshotQuery = gql\`
      {
        proposals(orderBy: "end", orderDirection: desc, where: {space_in: ["mangabank.eth"],end_gte:\${endedGte}\,state:"closed"}) {
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
      \`;
  
      const respend = await request(this.URL_SPACE_PROPOSAL, snapshotQuery);
  
      return respend;
    }

    async fetchActiveSnapshotProposals(): Promise<any> {
      this.logInfo('Fetching Active Snapshot Proposals');
      const snapshotQuery = gql\`
        {
          proposals(orderBy: "start", orderDirection: desc, where: { space_in: ["mangabank.eth"], state: "active" }) {
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
      \`;
  
      const respactive = await request(this.URL_SPACE_PROPOSAL, snapshotQuery);
  
      return respactive;
    }

    async snapShotConcludingProposalsTask(simulate) {
      // need to change the logic!!
      const res: { proposals: ISnapshotProposal[] } = await this.fetchActiveSnapshotProposals();
      const lengthMsg = 'No of proposals : ' + res.proposals.length
      this.logInfo(lengthMsg);
  
      for (const proposal of res.proposals) {
        const diff = proposal.end - this.timestamp;
        this.log(diff / (60 * 60 * 24));
        if (diff <= 86400 && diff > 0) {
          try {
            this.log('-------------------------');
            const titleLog = 'title: ' + proposal.title + 'id: ' + proposal.id + 'msgs :' + proposal.msgs
            this.log(titleLog);
  
            const payloadMsg = 'A Proposal is concluding soon on cryptoManga[b:' + proposal.title + ']';
            const message = 'A Proposal "' + proposal.title + '" is concluding soon on cryptoManga ' + proposal.end;
            const title = 'Proposal Ending Soon';
            const cta = 'https://snapshot.org/#/mangabank.eth/proposal/' + proposal.id;
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

    // Get cryptoManga Data From DB
  async getcryptoMangaDataFromDB() {
    this.logInfo('Getting cryptoManga Data from DB..');
    const doc = await cryptoMangaModel.findOne({ _id: 'cryptoManga_DATA' });
    this.logInfo('cryptoManga Data obtained');
    this.log(doc);
    return doc;
  }

  // Set cryptoManga Data in DB
  async setcryptoMangaDataInDB(cryptoMangaData: IcryptoMangaData) {
    this.logInfo('Setting cryptoManga Data In DB');
    this.log(cryptoMangaData);
    await cryptoMangaModel.findOneAndUpdate({ _id: 'cryptoManga_DATA' }, cryptoMangaData, { upsert: true });
  }

  }
    `,
      function (err) {
        if (err) throw err;
        console.log("Results Recieved");
      }
    );
  } catch (e) {
    console.log(e);
  }
};

const channelName = "channelsWith";
createChannelFolder(channelName);
createJobsFile(channelName);
createModelFile(channelName);
createRoutesFile(channelName);
createKeysFile("dchaskcjnas");
createChannelFile(channelName);
