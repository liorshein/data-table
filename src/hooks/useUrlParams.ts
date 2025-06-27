import { SortingState } from '@tanstack/react-table';
import {
  createParser,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs';

import { FiltersObj, FilterValue } from '@/components';

const pageIndexParser = createParser({
  parse: (query) => {
    const page = parseAsInteger.parse(query);
    return page === null ? null : page - 1;
  },
  serialize: (value) => {
    return parseAsInteger.serialize(value + 1);
  },
});

const sortParser = createParser({
  parse: (value: string | null) => {
    if (!value) return [];
    const [id, desc] = value.split('_');
    return [{ id, desc: desc === 'desc' }];
  },
  serialize: (value: SortingState) => {
    if (value.length === 0) return '';
    const sort = value[0];
    return `${sort.id}_${sort.desc ? 'desc' : 'asc'}`;
  },
  eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
});


const filtersParser = createParser({
  parse: (value: string | null): FiltersObj => {
    if (!value) return {};
    try {
      const parsed = JSON.parse(decodeURIComponent(value));
      return Object.entries(parsed).reduce((acc, [key, value]) => {
        acc[key] = value as FilterValue;
        return acc;
      }, {} as FiltersObj);
    } catch {
      return {};
    }
  },
  serialize: (value: FiltersObj): string => {
    if (Object.keys(value).length === 0) return '';
    return encodeURIComponent(JSON.stringify(value));
  },
  eq: (a: FiltersObj, b: FiltersObj) => JSON.stringify(a) === JSON.stringify(b),
});

const searchParser = createParser({
  parse: (value: string | null): string => {
    if (!value) return '';
    try {
      return decodeURIComponent(value);
    } catch {
      return '';
    }
  },
  serialize: (value: string): string => {
    if (!value) return '';
    return value;
  },
  eq: (a: string, b: string) => a === b,
});

export const baseParsers = {
  pageIndex: pageIndexParser.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
  sort: sortParser.withDefault([]),
  filters: filtersParser.withDefault({}),
  search: searchParser.withOptions({ throttleMs: 1000 }).withDefault(''),
  exposureId: parseAsString.withDefault(''),
};

const baseQueryUrlKeys = {
  pageIndex: 'page',
  pageSize: 'perPage',
  sort: 'sort',
  filters: 'filters',
  search: 'search',
  exposureId: 'exposureId',
};

const useQueryParams = () => {
  return useQueryStates(baseParsers, { urlKeys: baseQueryUrlKeys });
};

export { useQueryParams };
