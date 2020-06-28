// import { prepareData } from '@/models/shared/tools';

export class VuexOrmPlugin {
  /**
   * Install custom behaviors for VuexORM
   *
   * @param components.Query
   */
  static install(/*{ Query }: any*/) {
    // const superPersist = Query.prototype.persist;

    // /**
    //  * Implicitly call the mapping of a payload's data object before
    //  * persisting it to the ORM
    //  *
    //  * @override
    //  *
    //  * @param method
    //  * @param data
    //  * @param options
    //  */
    // Query.prototype.persist = function persist(method: any, data: any, options: any) {
    //   const preparedData = (this.model.mapData)
    //     ? prepareData(data, this.model.mapData)
    //     : data;
    //   return superPersist.bind(this)(method, preparedData, options);
    // };
  }
}

export default VuexOrmPlugin;
