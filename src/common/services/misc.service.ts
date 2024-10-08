import { Injectable } from '@nestjs/common';
import moment from 'moment';
import fs from 'fs';

@Injectable()
export class MiscClass {
  async referenceGenerator() {
    const time = moment().format('YYYY-MM-DD hh:mm:ss');
    const rand = Math.floor(Math.random() * Date.now());

    return `BAM|${time.replace(/[\-]|[\s]|[\:]/g, '')}|${rand}`;
  }

  async paginate({ page, pageSize }) {
    const offset = (parseInt(page) - 1) * pageSize;
    const limit = parseInt(pageSize);

    return {
      offset,
      limit,
    };
  }

  async pageCount({ count, page, pageSize }) {
    const pageTotal = Math.ceil(count / pageSize);
    let prevPage = null;
    let nextPage = null;

    if (page == pageTotal && page > 1) {
      prevPage = parseInt(page) - 1;
      nextPage = null;
    } else if (page > 1) {
      prevPage = parseInt(page) - 1;
      nextPage = parseInt(page) + 1;
    } else if (page == 1 && pageTotal > 1) {
      nextPage = 2;
    }

    return {
      prevPage,
      currentPage: parseInt(page),
      nextPage,
      pageTotal,
      pageSize: pageSize > count ? parseInt(count) : parseInt(pageSize),
    };
  }

  //   async getStates() {
  //     const stateObj = [];
  //     const states = JSON.parse(
  //       fs.readFileSync(`${__dirname}/assets/states.txt`, 'utf-8'),
  //     );

  //     for (const state of states) {
  //       stateObj.push(state.state);
  //     }
  //     return {
  //       status: 'success',
  //       message: 'states fetched',
  //       data: stateObj,
  //     };
  //   }

  async search(params: any) {
    const query = {};
    for (const value in params) {
      if (params[value] && params[value] != 'null' && params[value] != null) {
        if (value.match(/date|Date|createdAt/g)) {
          const date = new Date(params[value]);
          const endDate = moment(date).add(1, 'day').format();
          query['createdAt'] = { $gte: date, $lte: new Date(endDate) };
        } else if (value.match(/start|Start|end|End/g)) {
          const date = new Date(params[value]);
          if (value.toLowerCase() === 'start' && !params['end']) {
            // If 'from' is set and 'to' is not set, use current day for 'to'
            const today = new Date();
            today.setHours(23, 59, 59, 999); // Set to end of the day
            query['createdAt'] = { $gte: date, $lte: today };
          } else {
            const queryDate: any = {};
            if (value.toLowerCase() === 'to') {
              const to = new Date(params[value]);
              to.setHours(23, 59, 59, 999);
              queryDate.$lte = to;
            } else {
              const endDate = new Date(date);
              endDate.setDate(endDate.getDate() + 1);
              queryDate.$lt = endDate;
            }
            // Only modify the upper limit if 'to' is set
            const existingFrom = query['createdAt'] && query['createdAt'].$gte;
            query['createdAt'] = {
              ...(existingFrom ? { $gte: existingFrom } : {}),
              ...queryDate,
            };
          }
        } else if (params[value] == 'true') {
          query[value] = true;
        } else if (params[value] == 'false') {
          query[value] = false;
        } else if (value == 'category' || value == 'categories') {
          query[value] = { $in: params[value] };
        } else {
          const $regex = new RegExp(params[value]);
          const $options = 'i';
          query[value] = { $regex, $options };
        }
      }
    }
    return query;
  }
}
