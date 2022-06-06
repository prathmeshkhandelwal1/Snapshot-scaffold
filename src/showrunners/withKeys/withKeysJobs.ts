
    import logger from '../../loaders/logger';
    
    import { Container } from 'typedi';
    import schedule from 'node-schedule';
    import withKeysChannel from './withKeysChannel';
    
    export default () => {
      const startTime = new Date(new Date().setHours(0, 0, 0, 0));
      const channel = Container.get(withKeysChannel);
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
    