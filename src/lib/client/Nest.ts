import AdminAPI from '../AdminAPI';

import Egg from './Egg';

import NestModel, { NestOptionsRaw } from '../models/Nest';
import Pagination, { PaginationOptionsRaw } from '../models/Pagination';

class Nest extends NestModel {
    private api: AdminAPI;
    public pagination?: Pagination;

    constructor(api: AdminAPI, data: NestOptionsRaw, paginationOptions?: PaginationOptionsRaw) {
        super(data);
        this.api = api;
        if (paginationOptions) this.pagination = new Pagination(paginationOptions);
    }

    public static getAll(api: AdminAPI, amount: number = 100000): Promise<Nest[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/nests?per_page=${amount}`);
                resolve(res.data.map((value: any) => new Nest(api, value.attributes, res.pagination)));
            } catch (error) {
                reject(error);
            }
        });
    }

    public static getById(api: AdminAPI, id: number): Promise<Nest> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/nests/${id}`);
                resolve(new Nest(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    public getEggs(): Promise<Egg[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await Egg.getAll(this.api, this.id);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    public getEgg(eggId: number): Promise<Egg> {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await Egg.getById(this.api, this.id, eggId);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default Nest;