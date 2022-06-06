
    import { Router, Request, Response, NextFunction } from 'express';
    import { Container } from 'typedi';
    import middlewares from '../../api/middlewares';
    import { celebrate, Joi } from 'celebrate';
    import withKeysChannel from './withKeysChannel';
    const route = Router();
export default (app: Router) => {
  app.use('/showrunners/withKeys', route);
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
      Logger.debug('Calling /showrunners/$withKeys ticker endpoint with body: %o', req.body);
      try {
        const withKeys = Container.get(withKeysChannel);
        await withKeys.snapShotProposalsTask(false);
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
      Logger.debug('Calling /showrunners/withKeys ticker endpoint with body: %o', req.body);
      try {
        const withKeys = Container.get(withKeysChannel);
        await withKeys.snapShotEndedProposalsTask(false);
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
      Logger.debug('Calling /showrunners/withKeys ticker endpoint with body: %o', req.body);
      try {
        const withKeys = Container.get(withKeysChannel);
        await withKeys.snapShotConcludingProposalsTask(false);
        return res.status(201).json({ success: true });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};

    