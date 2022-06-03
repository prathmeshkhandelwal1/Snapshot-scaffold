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

const channelName = "prathmeshChannel";
createChannelFolder(channelName);
createJobsFile(channelName);
