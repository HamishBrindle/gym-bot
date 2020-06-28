import * as d3 from 'd3';

/**
 * Utility class for shared logic between report views.
 */
class ReportUtil {
  /**
   * Checks if value is zero or negative
   * @param int value
   * @return true/false
   */
  isZeroOrNegative(int: string) {
    const parsedInt = parseInt(int, 10);
    return !Number.isNaN(parsedInt) && parsedInt <= 0;
  }

  /**
   * Gets the minimum sku priority value for a category tree.
   * @param category nested category data
   * @return minimum sku priority
   */
  getCategoryMinSkuPriority(category: CategoryData) {
    return d3.min(
      category.values,
      (subCategory) => subCategory.value.minSkuPriority,
    );
  }

  /**
   * Calculates the total number of units
   * @param containers number of containers
   * @param [unitByContainer] unit per container
   * @return total number of units
   */
  calculateTotalUnits(containers: number, unitByContainer?: string) {
    if (unitByContainer) {
      const parsedUnitByContainer = parseInt(unitByContainer, 10);
      if (!Number.isNaN(parsedUnitByContainer) && parsedUnitByContainer > 0) {
        return parseInt((containers * parsedUnitByContainer).toString(), 10);
      }
    }
    // if unit_by_container is unavailable, assume 1 unit/container
    return parseInt(containers.toString(), 10);
  }
}

type CategoryData = {
  key: string;
  values: SubCategoryData[];
}

type SubCategoryData = {
  key: string;
  value: SubCategoryValue;
}

type SubCategoryValue = {
  minSkuPriority: number;
}

export { ReportUtil };
export default new ReportUtil();
