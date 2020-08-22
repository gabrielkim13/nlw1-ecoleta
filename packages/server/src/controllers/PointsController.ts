import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, whatsapp, city, uf, latitude, longitude, items } = req.body;

    const trx = await knex.transaction();

    const point = {
      name,
      image: req.file.filename,
      email,
      whatsapp,
      city,
      uf,
      latitude,
      longitude,
    };

    const ids = await trx('points').insert(point);

    const point_id = ids[0];
    const pointsItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => ({
        point_id,
        item_id,
      }));

    await trx('points_items').insert(pointsItems);

    await trx.commit();

    return res.json({
      id: point_id,
      ...point,
    });
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first();

    if (!point) return res.status(400).json({ message: 'Point not found.' });

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.15.27:3333/${point.image}`,
    };

    const items = await knex('items')
      .join('points_items', 'items.id', '=', 'points_items.item_id')
      .where('points_items.point_id', id)
      .select('items.title');

    return res.json({
      point: serializedPoint,
      items,
    });
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await knex('points')
      .join('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('points_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map((point) => ({
      ...point,
      image_url: `http://192.168.15.27:3333/${point.image}`,
    }));

    return res.json(serializedPoints);
  }
}

export default PointsController;
