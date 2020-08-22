import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(req: Request, res: Response): Promise<Response> {
    const items = await knex('items').select('*');

    const serializedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      image_url: `http://192.168.15.27:3333/${item.image}`,
    }));

    return res.json(serializedItems);
  }
}

export default PointsController;
