import { SortingState } from '@tanstack/react-table';
import { createParser, parseAsBoolean, parseAsInteger, useQueryState, useQueryStates } from 'nuqs';

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
    
    const parts = value.split('_');
    if (parts.length !== 2) {
      console.warn(`Invalid sort format: ${value}. Expected format: "columnId_asc|desc"`);
      return [];
    }
    
    const [id, desc] = parts;
    if (!id || !id.trim()) {
      console.warn(`Invalid column ID in sort: ${value}`);
      return [];
    }
    
    if (desc !== 'asc' && desc !== 'desc') {
      console.warn(`Invalid sort direction: ${desc}. Expected "asc" or "desc"`);
      return [];
    }
    
    return [{ id: id.trim(), desc: desc === 'desc' }];
  },
  serialize: (value: SortingState) => {
    if (value.length === 0) return '';
    const sort = value[0];
    return `${sort.id}_${sort.desc ? 'desc' : 'asc'}`;
  },
  eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
});

const isValidFilterValue = (value: unknown): value is FilterValue => {
  return (
    value === undefined ||
    typeof value === 'string' ||
    (Array.isArray(value) && value.every(item => typeof item === 'string'))
  );
};

const filtersParser = createParser({
  parse: (value: string | null): FiltersObj => {
    if (!value) return {};
    try {
      const parsed = JSON.parse(decodeURIComponent(value));
      
      if (typeof parsed !== 'object' || parsed === null) {
        console.warn('Invalid filters format: expected object');
        return {};
      }
      
      return Object.entries(parsed).reduce((acc, [key, value]) => {
        if (!isValidFilterValue(value)) {
          console.warn(`Invalid filter value for key "${key}":`, value);
          return acc;
        }
        acc[key] = value as FilterValue;
        return acc;
      }, {} as FiltersObj);
    } catch (error) {
      console.warn('Failed to parse filters from URL:', error);
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
    return encodeURIComponent(value);
  },
  eq: (a: string, b: string) => a === b,
});

export const baseParsers = {
  pageIndex: pageIndexParser.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
  sort: sortParser.withDefault([]),
  filters: filtersParser.withDefault({}),
  search: searchParser.withOptions({ throttleMs: 1000 }).withDefault(''),
};

const baseQueryUrlKeys = {
  pageIndex: 'page',
  pageSize: 'perPage',
  sort: 'sort',
  filters: 'filters',
  search: 'search',
};

const useQueryParams = () => {
  return useQueryStates(baseParsers, { urlKeys: baseQueryUrlKeys });
};

const createNamespacedUrlKeys = (prefix: string, urlKeys: Record<string, string>) => {
  return Object.entries(urlKeys).reduce(
    (acc, [key, value]) => {
      acc[key] = `${prefix}_${value}`;
      return acc;
    },
    {} as Record<string, string>,
  );
};

const useNamespacedQueryParams = (namespace: string) => {
  const namespacedUrlKeys = createNamespacedUrlKeys(namespace, baseQueryUrlKeys);
  return useQueryStates(baseParsers, { urlKeys: namespacedUrlKeys });
};

const useModalParam = (key: string) => {
  return useQueryState(key, parseAsBoolean.withDefault(false));
};

const sortToString = (value: SortingState) => {
  if (value.length === 0) return undefined;
  const sort = value[0];
  return `${sort.id}_${sort.desc ? 'desc' : 'asc'}`;
};

export { sortToString, useModalParam, useNamespacedQueryParams, useQueryParams };
