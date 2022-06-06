
    import { Router, Request, Response, NextFunction } from 'express';
    import { Container } from 'typedi';
    import middlewares from '../../api/middlewares';
    import { celebrate, Joi } from 'celebrate';
    import channelsWithChannel from './channelsWithChannel';
    const route = Router();
export default (app: Router) => {
  app.use('/showrunners/channelsWith', route);
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
      Logger.debug('Calling /showrunners/$channelsWith ticker endpoint with body: %o', req.body);
      try {
        const channelsWith = Container.get(channelsWithChannel);
        await channelsWith.snapShotProposalsTask(false);
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
      Logger.debug('Calling /showrunners/channelsWith ticker endpoint with body: %o', req.body);
      try {
        const channelsWith = Container.get(channelsWithChannel);
        await channelsWith.snapShotEndedProposalsTask(false);
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
      Logger.debug('Calling /showrunners/channelsWith ticker endpoint with body: %o', req.body);
      try {
        const channelsWith = Container.get(channelsWithChannel);
        await channelsWith.snapShotConcludingProposalsTask(false);
        return res.status(201).json({ success: true });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};

    